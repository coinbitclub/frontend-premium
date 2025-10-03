/**
 * Socket.IO Context
 * Provides global WebSocket connection management across the application
 */

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { createSocketConnection, disconnectSocket } from '../../utils/socket';
import { useAuth } from './AuthContext';
import authService from '../services/authService';

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
  const token = authService.getAccessToken();

  useEffect(() => {
    // Only create socket if user is authenticated
    if (!isAuthenticated || !user || !token) {
      // Disconnect socket if user logs out
      if (socket) {
        disconnectSocket(socket);
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log('🔌 Initializing socket connection for user:', user.email);

    // Create socket connection
    const newSocket = createSocketConnection({
      autoConnect: true,
      reconnectionAttempts: 10,
      timeout: 20000
    });

    // Connection success
    newSocket.on('connect', () => {
      console.log('✅ Socket connected successfully');
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);

      // Authenticate with real JWT token
      newSocket.emit('authenticate', {
        userId: user.id,
        token: token,
        userType: user.user_type
      });

      console.log('🔐 Authentication sent for user:', user.id);

      // Join user-specific room
      newSocket.emit('join_trading', user.id);
      console.log('🚪 Joined trading room:', user.id);
    });

    // Connection error
    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
      setConnectionError(error.message);
      setIsConnected(false);
    });

    // Connection timeout
    newSocket.on('connect_timeout', () => {
      console.error('⏱️ Socket connection timeout');
      setConnectionError('Connection timeout. Please check your internet connection.');
      setIsConnected(false);
    });

    // Reconnection attempt
    newSocket.on('reconnect_attempt', (attempt) => {
      console.log(`🔄 Reconnection attempt ${attempt}...`);
      setReconnectAttempts(attempt);
    });

    // Reconnection success
    newSocket.on('reconnect', (attempt) => {
      console.log(`✅ Reconnected successfully after ${attempt} attempts`);
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempts(0);
    });

    // Reconnection failed
    newSocket.on('reconnect_failed', () => {
      console.error('🔴 Reconnection failed after maximum attempts');
      setConnectionError('Unable to connect to server. Please refresh the page.');
      setIsConnected(false);
    });

    // Disconnection
    newSocket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected:', reason);
      setIsConnected(false);

      // Auto-reconnect unless explicitly disconnected
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    // Authentication response
    newSocket.on('authenticated', (data) => {
      console.log('✅ Authentication successful:', data);
    });

    newSocket.on('authentication_error', (error) => {
      console.error('❌ Authentication error:', error);
      setConnectionError('Authentication failed. Please login again.');
    });

    setSocket(newSocket);

    // Cleanup on unmount or auth change
    return () => {
      console.log('🔌 Cleaning up socket connection');
      disconnectSocket(newSocket);
    };
  }, [isAuthenticated, user?.id, token]); // Reconnect if auth changes

  // Emit event
  const emit = useCallback((event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    } else {
      console.warn(`⚠️ Cannot emit "${event}": Socket not connected`);
    }
  }, [socket, isConnected]);

  // Subscribe to event
  const on = useCallback((event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  }, [socket]);

  // Unsubscribe from event
  const off = useCallback((event: string, callback?: (data: any) => void) => {
    if (socket) {
      if (callback) {
        socket.off(event, callback);
      } else {
        socket.off(event);
      }
    }
  }, [socket]);

  const value: SocketContextType = {
    socket,
    isConnected,
    connectionError,
    reconnectAttempts,
    emit,
    on,
    off
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Custom hook for specific socket events
export const useSocketEvent = (event: string, callback: (data: any) => void) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, isConnected, event, callback]);
};
