import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiTarget, 
  FiActivity,
  FiCheckCircle,
  FiXCircle,
  FiClock
} from 'react-icons/fi';

const IS_DEV = process.env.NODE_ENV === 'development';

interface RobotOperationTimelineProps {
  isActive?: boolean;
  speed?: 'slow' | 'normal' | 'fast';
  compact?: boolean;
}

interface Operation {
  id: string;
  type: 'buy' | 'sell';
  symbol: string;
  amount: number;
  price: number;
  profit: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

const RobotOperationTimeline: React.FC<RobotOperationTimelineProps> = ({ 
  isActive = true, 
  speed = 'normal',
  compact = false 
}) => {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);

  const speedMap = useMemo(() => ({
    slow: 5000,
    normal: 3000,
    fast: 1500
  }), []);

  const generateOperation = useCallback((): Operation => {
    const symbols = ['BTC/USDT', 'ETH/USDT', 'ADA/USDT', 'SOL/USDT', 'DOT/USDT'];
    const types: ('buy' | 'sell')[] = ['buy', 'sell'];
    const statuses: ('pending' | 'completed' | 'failed')[] = ['pending', 'completed', 'failed'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const amount = Math.random() * 1000 + 100;
    const price = Math.random() * 50000 + 1000;
    const profit = (Math.random() - 0.3) * 1000; // 70% chance of profit
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      symbol,
      amount,
      price,
      profit,
      timestamp: new Date(),
      status
    };
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const newOperation = generateOperation();
      setCurrentOperation(newOperation);
      
      setTimeout(() => {
        setOperations(prev => [newOperation, ...prev.slice(0, 9)]);
        setCurrentOperation(null);
      }, 1000);
    }, speedMap[speed]);

    return () => clearInterval(interval);
  }, [isActive, speed, speedMap, generateOperation]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <FiXCircle className="w-4 h-4 text-red-400" />;
      default:
        return <FiClock className="w-4 h-4 text-yellow-400" />;
    }
  }, []);

  const getTypeIcon = useCallback((type: string) => {
    return type === 'buy' 
      ? <FiTrendingUp className="w-4 h-4 text-green-400" />
      : <FiTrendingDown className="w-4 h-4 text-red-400" />;
  }, []);

  const formatProfit = useCallback((profit: number) => {
    const isPositive = profit >= 0;
    return (
      <span className={`font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}${profit.toFixed(2)}
      </span>
    );
  }, []);

  if (compact) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FiActivity className="w-4 h-4 text-orange-400" />
            Robot Activity
          </h3>
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
        </div>
        
        <div className="space-y-2">
          {operations.slice(0, 3).map((op) => (
            <div key={op.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                {getTypeIcon(op.type)}
                <span className="text-gray-300">{op.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(op.status)}
                {formatProfit(op.profit)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <FiActivity className="w-6 h-6 text-orange-400" />
          Robot Trading Timeline
        </h2>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          <span className="text-sm text-gray-400">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Current Operation */}
        <AnimatePresence>
          {currentOperation && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(currentOperation.type)}
                  <div>
                    <div className="font-semibold text-white">
                      {currentOperation.type.toUpperCase()} {currentOperation.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${currentOperation.amount.toFixed(2)} @ ${currentOperation.price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4 text-yellow-400 animate-spin" />
                  <span className="text-sm text-yellow-400">Processing...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Operations */}
        {operations.map((operation, index) => (
          <motion.div
            key={operation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getTypeIcon(operation.type)}
                <div>
                  <div className="font-semibold text-white">
                    {operation.type.toUpperCase()} {operation.symbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    ${operation.amount.toFixed(2)} @ ${operation.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {operation.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusIcon(operation.status)}
                <div className="text-right">
                  <div className="font-semibold">
                    {formatProfit(operation.profit)}
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {operation.status}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {operations.length === 0 && !currentOperation && (
          <div className="text-center py-8 text-gray-400">
            <FiActivity className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Waiting for robot activity...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RobotOperationTimeline;
