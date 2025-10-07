/**
 * Socket Connection Status Component
 * Shows real-time WebSocket connection status and handles reconnection UI
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../src/contexts/SocketContext';
import { useAuth } from '../src/contexts/AuthContext';

const SocketConnectionStatus: React.FC = () => {
  const { isConnected, connectionError, reconnectAttempts } = useSocket();
  const { isAuthenticated } = useAuth();

  // Don't show anything if connected
  if (isConnected && !connectionError) {
    return null;
  }

  // Don't show connection status on login/registration pages
  // Socket only connects after authentication
  if (!isAuthenticated) {
    return null;
  }

  return (
    <AnimatePresence>
      {(!isConnected || connectionError) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
        >
          <div className={`
            max-w-md w-full rounded-lg shadow-lg p-4
            ${connectionError ? 'bg-red-500/90' : 'bg-yellow-500/90'}
            backdrop-blur-sm
          `}>
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {connectionError ? (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
              </div>

              {/* Message */}
              <div className="flex-grow">
                <p className="text-white font-semibold">
                  {connectionError ? (
                    'Connection Error'
                  ) : reconnectAttempts > 0 ? (
                    `Reconnecting... (Attempt ${reconnectAttempts})`
                  ) : (
                    'Connecting to server...'
                  )}
                </p>
                {connectionError && (
                  <p className="text-white/90 text-sm mt-1">
                    {connectionError}
                  </p>
                )}
              </div>

              {/* Refresh button if error */}
              {connectionError && (
                <button
                  onClick={() => window.location.reload()}
                  className="flex-shrink-0 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Refresh
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocketConnectionStatus;
