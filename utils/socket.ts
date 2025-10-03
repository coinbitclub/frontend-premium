/**
 * Smart Socket.IO Connection Utility
 * Automatically determines the correct WebSocket URL based on environment
 */

import { io, Socket } from 'socket.io-client';

/**
 * Get API URL based on environment
 */
export function getApiUrl(): string {
  // 1. Check environment variable (set in .env.production or .env.local)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. If in browser, try to infer from current location
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    // Development environment
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3333';
    }

    // Production with IP (Hostinger VPS)
    if (hostname === '31.97.72.77') {
      return 'http://31.97.72.77:3333';
    }

    // Production with domain
    // If frontend is on app.coinbitclub.com, backend should be on api.coinbitclub.com
    if (hostname.includes('coinbitclub')) {
      const apiDomain = hostname.replace('app.', 'api.');
      return `${protocol}//${apiDomain}`;
    }

    // Fallback: use same host with port 3333
    return `${protocol}//${hostname}:3333`;
  }

  // 3. Server-side fallback
  return 'http://localhost:3333';
}

/**
 * Create optimized Socket.IO connection
 */
export function createSocketConnection(options: {
  autoConnect?: boolean;
  reconnectionAttempts?: number;
  timeout?: number;
} = {}): Socket {
  const apiUrl = getApiUrl();

  console.log('🔌 Connecting to WebSocket:', apiUrl);

  const socket = io(apiUrl, {
    // Connection options
    transports: ['websocket', 'polling'],
    autoConnect: options.autoConnect !== false,

    // Reconnection strategy
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: options.reconnectionAttempts || 10,

    // Timeouts
    timeout: options.timeout || 20000,

    // Performance
    forceNew: false,
    upgrade: true,

    // CORS and auth
    withCredentials: true,
  });

  // Global error handler
  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected to:', apiUrl);
  });

  socket.on('disconnect', (reason) => {
    console.warn('⚠️ Socket disconnected:', reason);
  });

  return socket;
}

/**
 * Create authenticated socket connection with JWT token
 */
export function createAuthenticatedSocket(token: string): Socket {
  const socket = createSocketConnection();

  socket.on('connect', () => {
    // Authenticate on connection
    socket.emit('authenticate', { token });
  });

  return socket;
}

/**
 * Disconnect and cleanup socket
 */
export function disconnectSocket(socket: Socket | null): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    console.log('🔌 Socket disconnected and cleaned up');
  }
}
