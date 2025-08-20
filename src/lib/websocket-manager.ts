/**
 * Enterprise WebSocket Manager
 * Otimizado para 1000+ conexões simultâneas
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  messageQueueSize?: number;
  compression?: boolean;
}

interface WebSocketMessage {
  id: string;
  type: string;
  channel: string;
  data: any;
  timestamp: number;
}

interface WebSocketStats {
  connected: boolean;
  reconnectAttempts: number;
  messagesReceived: number;
  messagesSent: number;
  lastHeartbeat: number;
  latency: number;
  uptime: number;
}

type WebSocketEventHandler = (message: WebSocketMessage) => void;
type WebSocketStatusHandler = (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;

class EnterpriseWebSocket {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig>;
  private eventHandlers = new Map<string, Set<WebSocketEventHandler>>();
  private statusHandlers = new Set<WebSocketStatusHandler>();
  private messageQueue: WebSocketMessage[] = [];
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private stats: WebSocketStats;
  private connectionStartTime: number = 0;

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      messageQueueSize: 1000,
      compression: true,
      ...config
    };

    this.stats = {
      connected: false,
      reconnectAttempts: 0,
      messagesReceived: 0,
      messagesSent: 0,
      lastHeartbeat: 0,
      latency: 0,
      uptime: 0
    };

    this.connect();
  }

  /**
   * Connect to WebSocket server
   */
  private async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.notifyStatus('connecting');
      this.connectionStartTime = Date.now();
      
      this.ws = new WebSocket(this.config.url);
      
      // Configure WebSocket
      this.ws.binaryType = 'arraybuffer';

      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onerror = this.onError.bind(this);
      this.ws.onclose = this.onClose.bind(this);

    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  /**
   * Handle WebSocket open event
   */
  private onOpen(): void {
    console.log('WebSocket connected');
    this.stats.connected = true;
    this.stats.reconnectAttempts = 0;
    this.notifyStatus('connected');
    
    // Start heartbeat
    this.startHeartbeat();
    
    // Send queued messages
    this.flushMessageQueue();
  }

  /**
   * Handle incoming WebSocket messages
   */
  private onMessage(event: MessageEvent): void {
    try {
      let data: any;

      // Handle different message types
      if (typeof event.data === 'string') {
        data = JSON.parse(event.data);
      } else if (event.data instanceof ArrayBuffer) {
        // Handle binary messages (compressed data)
        data = this.decompressMessage(event.data);
      }

      const message: WebSocketMessage = {
        id: data.id || this.generateMessageId(),
        type: data.type || 'unknown',
        channel: data.channel || 'default',
        data: data.data || data,
        timestamp: Date.now()
      };

      this.stats.messagesReceived++;

      // Handle heartbeat responses
      if (message.type === 'heartbeat_response') {
        this.handleHeartbeatResponse(message);
        return;
      }

      // Notify channel subscribers
      this.notifyChannelSubscribers(message);

    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  }

  /**
   * Handle WebSocket error
   */
  private onError(error: Event): void {
    console.error('WebSocket error:', error);
    this.notifyStatus('error');
  }

  /**
   * Handle WebSocket close
   */
  private onClose(event: CloseEvent): void {
    console.log('WebSocket disconnected:', event.code, event.reason);
    this.stats.connected = false;
    this.notifyStatus('disconnected');
    
    this.stopHeartbeat();
    this.handleReconnect();
  }

  /**
   * Handle reconnection logic
   */
  private handleReconnect(): void {
    if (this.stats.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.stats.reconnectAttempts++;
    
    const delay = Math.min(
      this.config.reconnectInterval * Math.pow(2, this.stats.reconnectAttempts - 1),
      30000 // Max 30 seconds
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.stats.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Start heartbeat mechanism
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const heartbeatStart = Date.now();
        this.send({
          type: 'heartbeat',
          timestamp: heartbeatStart
        });
        this.stats.lastHeartbeat = heartbeatStart;
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat mechanism
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Handle heartbeat response
   */
  private handleHeartbeatResponse(message: WebSocketMessage): void {
    const now = Date.now();
    const sentTime = message.data.timestamp;
    this.stats.latency = now - sentTime;
    this.stats.uptime = now - this.connectionStartTime;
  }

  /**
   * Send message through WebSocket
   */
  send(data: any, channel: string = 'default'): void {
    const message: WebSocketMessage = {
      id: this.generateMessageId(),
      type: data.type || 'message',
      channel,
      data,
      timestamp: Date.now()
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        const payload = this.config.compression 
          ? this.compressMessage(message)
          : JSON.stringify(message);
        
        this.ws.send(payload);
        this.stats.messagesSent++;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        this.queueMessage(message);
      }
    } else {
      this.queueMessage(message);
    }
  }

  /**
   * Subscribe to channel events
   */
  subscribe(channel: string, handler: WebSocketEventHandler): () => void {
    if (!this.eventHandlers.has(channel)) {
      this.eventHandlers.set(channel, new Set());
    }
    
    this.eventHandlers.get(channel)!.add(handler);
    
    // Send subscription message
    this.send({ type: 'subscribe', channel }, 'system');

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(channel)?.delete(handler);
      if (this.eventHandlers.get(channel)?.size === 0) {
        this.eventHandlers.delete(channel);
        this.send({ type: 'unsubscribe', channel }, 'system');
      }
    };
  }

  /**
   * Subscribe to connection status changes
   */
  onStatusChange(handler: WebSocketStatusHandler): () => void {
    this.statusHandlers.add(handler);
    
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  /**
   * Get current statistics
   */
  getStats(): WebSocketStats {
    return { ...this.stats };
  }

  /**
   * Manually reconnect
   */
  reconnect(): void {
    this.disconnect();
    this.stats.reconnectAttempts = 0;
    setTimeout(() => this.connect(), 1000);
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    this.stopHeartbeat();
    
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    
    this.stats.connected = false;
  }

  /**
   * Private helper methods
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private queueMessage(message: WebSocketMessage): void {
    if (this.messageQueue.length >= this.config.messageQueueSize) {
      this.messageQueue.shift(); // Remove oldest message
    }
    this.messageQueue.push(message);
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()!;
      try {
        this.ws.send(JSON.stringify(message));
        this.stats.messagesSent++;
      } catch (error) {
        console.error('Error sending queued message:', error);
        break;
      }
    }
  }

  private notifyChannelSubscribers(message: WebSocketMessage): void {
    const handlers = this.eventHandlers.get(message.channel);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in WebSocket event handler:', error);
        }
      });
    }
  }

  private notifyStatus(status: 'connecting' | 'connected' | 'disconnected' | 'error'): void {
    this.statusHandlers.forEach(handler => {
      try {
        handler(status);
      } catch (error) {
        console.error('Error in WebSocket status handler:', error);
      }
    });
  }

  private compressMessage(message: WebSocketMessage): string {
    // Simple compression - in production, use proper compression
    return JSON.stringify(message);
  }

  private decompressMessage(data: ArrayBuffer): any {
    // Simple decompression - in production, use proper decompression
    return JSON.parse(new TextDecoder().decode(data));
  }
}

// WebSocket Manager for multiple connections
export class WebSocketManager {
  private static connections = new Map<string, EnterpriseWebSocket>();

  static createConnection(name: string, config: WebSocketConfig): EnterpriseWebSocket {
    if (this.connections.has(name)) {
      this.connections.get(name)!.disconnect();
    }

    const ws = new EnterpriseWebSocket(config);
    this.connections.set(name, ws);
    return ws;
  }

  static getConnection(name: string): EnterpriseWebSocket | null {
    return this.connections.get(name) || null;
  }

  static disconnectAll(): void {
    this.connections.forEach(ws => ws.disconnect());
    this.connections.clear();
  }

  static getStats(): Record<string, WebSocketStats> {
    const stats: Record<string, WebSocketStats> = {};
    this.connections.forEach((ws, name) => {
      stats[name] = ws.getStats();
    });
    return stats;
  }
}

// React Hook for WebSocket
export function useWebSocket(name: string, config?: WebSocketConfig) {
  const [connection, setConnection] = useState<EnterpriseWebSocket | null>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [stats, setStats] = useState<WebSocketStats | null>(null);

  useEffect(() => {
    if (!config) return;

    const ws = WebSocketManager.createConnection(name, config);
    setConnection(ws);

    const unsubscribeStatus = ws.onStatusChange(setStatus);
    
    // Update stats periodically
    const statsInterval = setInterval(() => {
      setStats(ws.getStats());
    }, 5000);

    return () => {
      unsubscribeStatus();
      clearInterval(statsInterval);
      ws.disconnect();
    };
  }, [name, config?.url]);

  const subscribe = useCallback((channel: string, handler: WebSocketEventHandler) => {
    return connection?.subscribe(channel, handler) || (() => {});
  }, [connection]);

  const send = useCallback((data: any, channel?: string) => {
    connection?.send(data, channel);
  }, [connection]);

  const reconnect = useCallback(() => {
    connection?.reconnect();
  }, [connection]);

  return {
    connection,
    status,
    stats,
    subscribe,
    send,
    reconnect,
    isConnected: status === 'connected'
  };
}

export default WebSocketManager;
