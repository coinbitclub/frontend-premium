/**
 * 🔌 USE WEBSOCKET HOOK - T3 Implementation
 * Hook para gerenciar conexão WebSocket realtime
 */

import { useState, useEffect, useRef, useCallback } from 'react';

type WebSocketMessage = {
  type: string;
  [key: string]: any;
};

type WebSocketHookOptions = {
  url?: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
};

type WebSocketHookReturn = {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  send: (message: WebSocketMessage) => boolean;
  subscribe: (channel: string) => void;
  unsubscribe: (channel: string) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  reconnect: () => void;
  disconnect: () => void;
  stats: {
    reconnectAttempts: number;
    messagesReceived: number;
    messagesSent: number;
  };
};

/**
 * 🔧 Hook para gerenciar conexão WebSocket
 */
export const useWebSocket = (options: WebSocketHookOptions = {}): WebSocketHookReturn => {
  const {
    url = process.env.NEXT_PUBLIC_SOCKET_URL ? `${process.env.NEXT_PUBLIC_SOCKET_URL.replace('http', 'ws')}/realtime` : 'ws://localhost:3333/realtime',
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onConnect,
    onDisconnect,
    onMessage,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    reconnectAttempts: 0,
    messagesReceived: 0,
    messagesSent: 0
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const subscriptionsRef = useRef<Set<string>>(new Set());
  const roomsRef = useRef<Set<string>>(new Set());

  /**
   * 🔗 Conectar ao WebSocket
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🔗 WebSocket conectado');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        // Reinscrever em canais e salas
        subscriptionsRef.current.forEach(channel => {
          ws.send(JSON.stringify({ type: 'subscribe', channel }));
        });
        
        roomsRef.current.forEach(room => {
          ws.send(JSON.stringify({ type: 'join_room', room }));
        });
        
        onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          
          setStats(prev => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1
          }));
          
          // Log de desenvolvimento
          if (process.env.NODE_ENV === 'development') {
            console.log('📨 WebSocket message:', message.type, message);
          }
          
          onMessage?.(message);
        } catch (err) {
          console.error('❌ Erro ao processar mensagem WebSocket:', err);
        }
      };

      ws.onclose = (event) => {
        console.log('🚪 WebSocket desconectado:', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        wsRef.current = null;
        
        onDisconnect?.();
        
        // Tentar reconectar se não foi fechamento manual
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      ws.onerror = (event) => {
        console.error('❌ Erro WebSocket:', event);
        const errorMessage = 'Erro de conexão WebSocket';
        setError(errorMessage);
        setIsConnecting(false);
        
        onError?.(event);
      };

    } catch (err) {
      console.error('❌ Erro ao criar WebSocket:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setIsConnecting(false);
    }
  }, [url, maxReconnectAttempts, onConnect, onDisconnect, onMessage, onError]);

  /**
   * 🔄 Agendar reconexão
   */
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    reconnectAttemptsRef.current++;
    setStats(prev => ({
      ...prev,
      reconnectAttempts: reconnectAttemptsRef.current
    }));

    console.log(`🔄 Tentativa de reconexão ${reconnectAttemptsRef.current}/${maxReconnectAttempts} em ${reconnectInterval}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connect();
    }, reconnectInterval);
  }, [connect, reconnectInterval, maxReconnectAttempts]);

  /**
   * 📤 Enviar mensagem
   */
  const send = useCallback((message: WebSocketMessage): boolean => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket não conectado - mensagem não enviada');
      return false;
    }

    try {
      wsRef.current.send(JSON.stringify(message));
      setStats(prev => ({
        ...prev,
        messagesSent: prev.messagesSent + 1
      }));
      return true;
    } catch (err) {
      console.error('❌ Erro ao enviar mensagem:', err);
      return false;
    }
  }, []);

  /**
   * 📡 Gerenciar subscrições
   */
  const subscribe = useCallback((channel: string) => {
    subscriptionsRef.current.add(channel);
    send({ type: 'subscribe', channel });
  }, [send]);

  const unsubscribe = useCallback((channel: string) => {
    subscriptionsRef.current.delete(channel);
    send({ type: 'unsubscribe', channel });
  }, [send]);

  /**
   * 🏠 Gerenciar salas
   */
  const joinRoom = useCallback((room: string) => {
    roomsRef.current.add(room);
    send({ type: 'join_room', room });
  }, [send]);

  const leaveRoom = useCallback((room: string) => {
    roomsRef.current.delete(room);
    send({ type: 'leave_room', room });
  }, [send]);

  /**
   * 🔄 Reconectar manualmente
   */
  const reconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  /**
   * 🚪 Desconectar
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Desconexão manual');
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  /**
   * 🔧 Efeitos
   */
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    error,
    send,
    subscribe,
    unsubscribe,
    joinRoom,
    leaveRoom,
    reconnect,
    disconnect,
    stats
  };
};

export default useWebSocket;