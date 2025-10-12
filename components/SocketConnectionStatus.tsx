/**
 * 🔌 SOCKET CONNECTION STATUS - OPTIMIZED
 * Shows real-time WebSocket connection status
 */

import React, { memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../src/contexts/SocketContext';
import { useAuth } from '../src/contexts/AuthContext';

const SocketConnectionStatus: React.FC = () => {
  const { isConnected, connectionError, reconnectAttempts } = useSocket();
  const { isAuthenticated } = useAuth();

  // Memoize refresh handler
  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  // Don't show if connected and no error
  if (isConnected && !connectionError) {
    return null;
  }

  // Don't show on login/registration pages
  if (!isAuthenticated) {
    return null;
  }

  // Determine message and color
  const hasError = !!connectionError;
  const isReconnecting = reconnectAttempts > 0;
  const bgColor = hasError ? 'bg-red-500/90' : 'bg-yellow-500/90';
  const message = hasError 
    ? 'Connection Error'
    : isReconnecting
    ? `Reconnecting... (Attempt ${reconnectAttempts})`
    : 'Connecting to server...';

  return (
    <AnimatePresence>
      {(!isConnected || connectionError) && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4"
        >
          <div className={`max-w-md w-full rounded-lg shadow-lg p-4 ${bgColor} backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {hasError ? (
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="w-6 h-6 text-white animate-spin" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
              </div>

              {/* Message */}
              <div className="flex-grow">
                <p className="text-white font-semibold">
                  {message}
                </p>
                {connectionError && (
                  <p className="text-white/90 text-sm mt-1">
                    {connectionError}
                  </p>
                )}
              </div>

              {/* Refresh button if error */}
              {hasError && (
                <button
                  onClick={handleRefresh}
                  className="flex-shrink-0 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-md text-sm font-medium transition-colors"
                  aria-label="Refresh page"
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

// Memoize component to prevent unnecessary re-renders
export default memo(SocketConnectionStatus);
