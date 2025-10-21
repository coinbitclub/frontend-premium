import React from 'react';
import { motion } from 'framer-motion';
import { FiRadio, FiDatabase } from 'react-icons/fi';

interface RealTimeIndicatorProps {
  dataSource: 'exchange' | 'database';
  isLive?: boolean;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  dataSource,
  isLive = true,
  className = '',
  showText = true,
  size = 'md',
}) => {
  const isRealTime = dataSource === 'exchange';

  // Size configurations
  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      text: 'text-xs',
      dot: 'w-1.5 h-1.5',
      padding: 'px-2 py-1',
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      dot: 'w-2 h-2',
      padding: 'px-3 py-1.5',
    },
    lg: {
      icon: 'w-5 h-5',
      text: 'text-base',
      dot: 'w-2.5 h-2.5',
      padding: 'px-4 py-2',
    },
  };

  const config = sizeClasses[size];

  if (isRealTime) {
    return (
      <div
        className={`inline-flex items-center gap-2 ${config.padding} bg-green-500/10 border border-green-500/30 rounded-full ${className}`}
      >
        {/* Pulsing dot */}
        <motion.div
          className={`${config.dot} rounded-full bg-green-400`}
          animate={isLive ? {
            opacity: [1, 0.3, 1],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <FiRadio className={`${config.icon} text-green-400`} />

        {showText && (
          <span className={`${config.text} font-medium text-green-400`}>
            LIVE
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 ${config.padding} bg-blue-500/10 border border-blue-500/30 rounded-full ${className}`}
    >
      <FiDatabase className={`${config.icon} text-blue-400`} />

      {showText && (
        <span className={`${config.text} font-medium text-blue-400`}>
          Historical
        </span>
      )}
    </div>
  );
};

export default RealTimeIndicator;
