// 🎛️ FORM COMPONENTS ENTERPRISE
// Formulários premium para configurações, trading e dados do usuário

import React, { useState, useCallback, forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Info,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Copy,
  RefreshCw,
  Key,
  Settings,
  Save,
  Lock,
  Unlock
} from 'lucide-react';
import { formatCurrency, formatEmptyField } from '../../types/backend';

// 🎯 BASE TYPES
interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

// 📝 INPUT FIELD PREMIUM
interface InputFieldProps extends FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  maxLength?: number;
  pattern?: string;
  autoComplete?: string;
  mask?: string;
  currency?: 'USD' | 'BRL';
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  required = false,
  className = '',
  disabled = false,
  icon,
  maxLength,
  pattern,
  autoComplete,
  currency
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Formatação de moeda
    if (type === 'number' && currency) {
      // Remove caracteres não numéricos
      newValue = newValue.replace(/[^\d.,]/g, '');
    }
    
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          value={value || ''}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          pattern={pattern}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            w-full px-4 py-3 border rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : focused 
                ? 'border-blue-500 focus:ring-blue-500 focus:border-blue-500' 
                : 'border-gray-300 dark:border-gray-600'
            }
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
              : 'bg-white dark:bg-gray-700'
            }
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            placeholder-gray-400 dark:placeholder-gray-500
          `}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}
      
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Info size={12} />
          {hint}
        </p>
      )}
    </div>
  );
};

// 📋 SELECT FIELD PREMIUM
interface SelectFieldProps extends FormFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  error,
  hint,
  required = false,
  className = '',
  disabled = false
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border rounded-lg transition-all duration-200
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled 
            ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
            : 'bg-white dark:bg-gray-700'
          }
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-opacity-50
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}
      
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Info size={12} />
          {hint}
        </p>
      )}
    </div>
  );
};

// 🔑 API KEYS FIELD (Binance/Bybit)
interface ApiKeyFieldProps extends FormFieldProps {
  apiKey: string;
  secretKey: string;
  onApiKeyChange: (value: string) => void;
  onSecretKeyChange: (value: string) => void;
  exchange: 'BINANCE' | 'BYBIT';
  onTest?: () => Promise<boolean>;
  testing?: boolean;
  isValid?: boolean | null;
}

export const ApiKeyField: React.FC<ApiKeyFieldProps> = ({
  label,
  apiKey,
  secretKey,
  onApiKeyChange,
  onSecretKeyChange,
  exchange,
  onTest,
  testing = false,
  isValid = null,
  error,
  hint,
  className = '',
  disabled = false
}) => {
  const [showSecret, setShowSecret] = useState(false);

  const handleTest = async () => {
    if (onTest) {
      await onTest();
    }
  };

  const getValidationIcon = () => {
    if (testing) return <RefreshCw size={16} className="animate-spin text-blue-500" />;
    if (isValid === true) return <CheckCircle size={16} className="text-green-500" />;
    if (isValid === false) return <AlertCircle size={16} className="text-red-500" />;
    return null;
  };

  return (
    <div className={`space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label || `Chaves API ${exchange}`}
        </h3>
        
        <div className="flex items-center gap-2">
          {getValidationIcon()}
          {onTest && (
            <button
              type="button"
              onClick={handleTest}
              disabled={!apiKey || !secretKey || testing || disabled}
              className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? 'Testando...' : 'Testar'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            API Key
          </label>
          <div className="relative">
            <input
              type="text"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder={`${exchange} API Key`}
              disabled={disabled}
              className={`
                w-full px-3 py-2 pr-8 text-sm border rounded-md
                ${disabled 
                  ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
                  : 'bg-white dark:bg-gray-700'
                }
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                font-mono text-xs
              `}
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(apiKey)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title="Copiar"
            >
              <Copy size={14} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Secret Key
          </label>
          <div className="relative">
            <input
              type={showSecret ? 'text' : 'password'}
              value={secretKey}
              onChange={(e) => onSecretKeyChange(e.target.value)}
              placeholder={`${exchange} Secret Key`}
              disabled={disabled}
              className={`
                w-full px-3 py-2 pr-16 text-sm border rounded-md
                ${disabled 
                  ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
                  : 'bg-white dark:bg-gray-700'
                }
                border-gray-300 dark:border-gray-600
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                font-mono text-xs
              `}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(secretKey)}
                className="text-gray-400 hover:text-gray-600"
                title="Copiar"
              >
                <Copy size={14} />
              </button>
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}

      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Info size={12} />
          {hint}
        </p>
      )}

      {isValid === true && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-sm text-green-600"
        >
          <CheckCircle size={14} />
          Chaves válidas e funcionais
        </motion.div>
      )}
    </div>
  );
};

// 💰 BALANCE INPUT (4 tipos de saldo)
interface BalanceInputProps extends FormFieldProps {
  balanceType: 'real_balance' | 'admin_balance' | 'commission_balance' | 'prepaid_balance';
  currentBalance: number;
  newAmount: string;
  onAmountChange: (value: string) => void;
  operation: 'ADD' | 'SUBTRACT' | 'SET';
  onOperationChange: (operation: 'ADD' | 'SUBTRACT' | 'SET') => void;
  currency?: 'USD' | 'BRL';
  maxAmount?: number;
}

export const BalanceInput: React.FC<BalanceInputProps> = ({
  label,
  balanceType,
  currentBalance,
  newAmount,
  onAmountChange,
  operation,
  onOperationChange,
  currency = 'USD',
  maxAmount,
  error,
  hint,
  className = '',
  disabled = false
}) => {
  const balanceLabels = {
    real_balance: 'Saldo Real',
    admin_balance: 'Saldo Admin',
    commission_balance: 'Saldo Comissão',
    prepaid_balance: 'Saldo Pré-pago'
  };

  const balanceColors = {
    real_balance: 'blue',
    admin_balance: 'purple',
    commission_balance: 'green',
    prepaid_balance: 'orange'
  };

  const color = balanceColors[balanceType];

  const calculateFinalBalance = () => {
    const amount = parseFloat(newAmount) || 0;
    switch (operation) {
      case 'ADD':
        return currentBalance + amount;
      case 'SUBTRACT':
        return currentBalance - amount;
      case 'SET':
        return amount;
      default:
        return currentBalance;
    }
  };

  const finalBalance = calculateFinalBalance();

  return (
    <div className={`space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label || balanceLabels[balanceType]}
        </h3>
        <span className={`
          px-2 py-1 text-xs font-medium rounded-full
          bg-${color}-100 text-${color}-800
          dark:bg-${color}-900 dark:text-${color}-200
        `}>
          {balanceLabels[balanceType]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Saldo Atual
          </label>
          <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
            <span className="font-mono text-sm">
              {formatCurrency(currentBalance, currency)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Operação
          </label>
          <select
            value={operation}
            onChange={(e) => onOperationChange(e.target.value as 'ADD' | 'SUBTRACT' | 'SET')}
            disabled={disabled}
            className={`
              w-full px-3 py-2 text-sm border rounded-md
              ${disabled 
                ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
                : 'bg-white dark:bg-gray-700'
              }
              border-gray-300 dark:border-gray-600
              text-gray-900 dark:text-white
              focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
            `}
          >
            <option value="ADD">Adicionar (+)</option>
            <option value="SUBTRACT">Subtrair (-)</option>
            <option value="SET">Definir (=)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          Valor ({currency})
        </label>
        <input
          type="number"
          value={newAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
          min="0"
          max={maxAmount}
          step="0.01"
          disabled={disabled}
          className={`
            w-full px-3 py-2 text-sm border rounded-md
            ${error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' 
              : 'bg-white dark:bg-gray-700'
            }
            text-gray-900 dark:text-white
            focus:outline-none focus:ring-1 focus:ring-opacity-50
            font-mono
          `}
        />
      </div>

      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Saldo Final:</span>
          <span className={`font-mono font-semibold ${
            finalBalance >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatCurrency(finalBalance, currency)}
          </span>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 text-sm text-red-600"
        >
          <AlertCircle size={14} />
          {error}
        </motion.div>
      )}

      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Info size={12} />
          {hint}
        </p>
      )}
    </div>
  );
};

// 🎛️ FORM CONTAINER PREMIUM
interface FormContainerProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  variant?: 'default' | 'modal' | 'card' | 'inline';
}

export const FormContainer: React.FC<FormContainerProps> = ({
  title,
  subtitle,
  children,
  onSubmit,
  loading = false,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  onCancel,
  className = '',
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6',
    modal: 'bg-white dark:bg-gray-800 rounded-lg p-6',
    card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6',
    inline: 'space-y-6'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        {(onSubmit || onCancel) && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelLabel}
              </button>
            )}
            
            {onSubmit && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    {submitLabel}
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default {
  InputField,
  SelectField,
  ApiKeyField,
  BalanceInput,
  FormContainer
};
