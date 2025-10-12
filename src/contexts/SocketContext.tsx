/**
 * 🔌 SOCKET.IO CONTEXT - OPTIMIZED
 * High-performance WebSocket connection management
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { createSocketConnection, disconnectSocket } from '../../utils/socket';
import { useAuth } from './AuthContext';
import authService from '../services/authService';

// Environment flag for debug logging
const IS_DEV = process.env.NODE_ENV === 'development';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: string | null;
  reconnectAttempts: number;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
  off: (event: string, callback?: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType>({} as SocketContextType);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { user, isAuthenticated } = useAuth();

  // Socket connection effect - optimized with proper cleanup
  useEffect(() => {
    // Only create socket if user is authenticated
    if (!isAuthenticated || !user) {
      IS_DEV && console.log('🔌 SocketContext: User not authenticated, disconnecting socket');
      
      // Cleanup existing socket
      if (socket) {
        disconnectSocket(socket);
        setSocket(null);
        setIsConnected(false);
        setConnectionError(null);
        setReconnectAttempts(0);
      }
      return;
    }

    // Fetch token inside useEffect
    const token = authService.getAccessToken();
    if (!token) {
      IS_DEV && console.log('🔌 SocketContext: No token available, skipping connection');
      return;
    }

    IS_DEV && console.log('🔌 SocketContext: Initializing socket for user:', user.email);

    // Create socket connection
    const newSocket = createSocketConnection({
      autoConnect: true,
      reconnectionAttempts: 10,
      timeout: 20000
    });

    // Define event handlers
    const handleConnect = () => {
      IS_DEV && console.log('✅ Socket connected');
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);

      // Authenticate
      newSocket.emit('authenticate', {
        userId: user.id,
        token: token,
        userType: user.user_type
      });

      // Join trading room
      newSocket.emit('join_trading', user.id);
    };

    const handleConnectError = (error: Error) => {
      IS_DEV && console.error('❌ Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    };

    const handleConnectTimeout = () => {
      IS_DEV && console.error('⏱️ Socket connection timeout');
      setConnectionError('Connection timeout. Please check your internet connection.');
      setIsConnected(false);
    };

    const handleReconnectAttempt = (attempt: number) => {
      IS_DEV && console.log(`🔄 Reconnection attempt ${attempt}`);
      setReconnectAttempts(attempt);
    };

    const handleReconnect = (attempt: number) => {
      IS_DEV && console.log(`✅ Reconnected after ${attempt} attempts`);
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);
    };

    const handleReconnectFailed = () => {
      console.error('🔴 Reconnection failed after maximum attempts');
      setConnectionError('Unable to connect to server. Please refresh the page.');
      setIsConnected(false);
    };

    const handleDisconnect = (reason: string) => {
      IS_DEV && console.warn('⚠️ Socket disconnected:', reason);
      setIsConnected(false);

      // Auto-reconnect unless explicitly disconnected
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    };

    const handleAuthenticated = (data: any) => {
      IS_DEV && console.log('✅ Socket authenticated:', data);
    };

    const handleAuthenticationError = (error: any) => {
      console.error('❌ Socket authentication error:', error);
      setConnectionError('Authentication failed. Please login again.');
    };

    // Register event listeners
    newSocket.on('connect', handleConnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('connect_timeout', handleConnectTimeout);
    newSocket.on('reconnect_attempt', handleReconnectAttempt);
    newSocket.on('reconnect', handleReconnect);
    newSocket.on('reconnect_failed', handleReconnectFailed);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('authenticated', handleAuthenticated);
    newSocket.on('authentication_error', handleAuthenticationError);

    setSocket(newSocket);

    // Cleanup function - properly remove all event listeners
    return () => {
      IS_DEV && console.log('🔌 SocketContext: Cleaning up socket');
      
      // Remove all event listeners
      newSocket.off('connect', handleConnect);
      newSocket.off('connect_error', handleConnectError);
      newSocket.off('connect_timeout', handleConnectTimeout);
      newSocket.off('reconnect_attempt', handleReconnectAttempt);
      newSocket.off('reconnect', handleReconnect);
      newSocket.off('reconnect_failed', handleReconnectFailed);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('authenticated', handleAuthenticated);
      newSocket.off('authentication_error', handleAuthenticationError);
      
      // Disconnect socket
      disconnectSocket(newSocket);
    };
  }, [isAuthenticated, user?.id]); // Only reconnect if auth status or user ID changes

  // Emit event - memoized
  const emit = useCallback((event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      IS_DEV && console.warn(`⚠️ Cannot emit "${event}": Socket not connected`);
    }
  }, [socket, isConnected]);

  // Subscribe to event - memoized
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  // Unsubscribe from event - memoized
  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  }, [socket]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo<SocketContextType>(() => ({
    socket,
    isConnected,
    connectionError,
    reconnectAttempts,
    emit,
    on,
    off
  }), [socket, isConnected, connectionError, reconnectAttempts, emit, on, off]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Custom hook for specific socket events - optimized
export const useSocketEvent = (event: string, callback: (data: any) => void, enabled: boolean = true) => {
  const { socket, isConnected } = useSocket();

  // Memoize callback to prevent unnecessary effect re-runs
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    if (!socket || !isConnected || !enabled) return;

    socket.on(event, memoizedCallback);

    return () => {
      socket.off(event, memoizedCallback);
    };
  }, [socket, isConnected, event, memoizedCallback, enabled]);
};

export default SocketContext;
