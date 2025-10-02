import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../src/services/apiService';

export interface APIKeyStatus {
  has_key: boolean;
  masked_key?: string;
  verified: boolean;
  verified_at?: string;
  enabled: boolean;
  testnet: boolean;
  exchange: string;
}

export interface APIKeysState {
  bybit: APIKeyStatus | null;
  binance: APIKeyStatus | null;
  loading: boolean;
  error: string | null;
}

export function useAPIKeys() {
  const [state, setState] = useState<APIKeysState>({
    bybit: null,
    binance: null,
    loading: true,
    error: null
  });

  /**
   * Load API keys status from backend
   */
  const loadAPIKeys = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const response: any = await apiService.getAPIKeysStatus();

      if (response.success) {
        // Backend returns exchanges nested in 'exchanges' object
        const exchanges = response.exchanges || {};
        setState({
          bybit: exchanges.bybit || null,
          binance: exchanges.binance || null,
          loading: false,
          error: null
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Failed to load API keys'
        }));
      }
    } catch (error) {
      console.error('Error loading API keys:', error);

      // If 401 error, the token is invalid - set empty state but don't show error
      if (error instanceof Error && error.message.includes('401')) {
        console.warn('⚠️ Authentication required - user may need to re-login');
        setState({
          bybit: null,
          binance: null,
          loading: false,
          error: null // Don't show error, just return empty state
        });
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    }
  }, []);

  /**
   * Add a new API key for an exchange
   */
  const addAPIKey = useCallback(async (
    exchange: 'bybit' | 'binance',
    apiKey: string,
    apiSecret: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response: any = await apiService.addApiKey({
        exchange: exchange.toLowerCase(),
        api_key: apiKey,
        api_secret: apiSecret
      });

      if (response.success) {
        // Reload API keys after adding
        await loadAPIKeys();
        return {
          success: true,
          message: response.message || `${exchange} API key added successfully`
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to add API key'
        };
      }
    } catch (error) {
      console.error('Error adding API key:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [loadAPIKeys]);

  /**
   * Verify an existing API key
   */
  const verifyAPIKey = useCallback(async (
    exchange: 'bybit' | 'binance'
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response: any = await apiService.verifyAPIKey(exchange);

      if (response.success) {
        // Reload API keys after verification
        await loadAPIKeys();
        return {
          success: true,
          message: response.message || `${exchange} API key verified successfully`
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to verify API key'
        };
      }
    } catch (error) {
      console.error('Error verifying API key:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [loadAPIKeys]);

  /**
   * Delete an API key
   */
  const deleteAPIKey = useCallback(async (
    exchange: 'bybit' | 'binance'
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response: any = await apiService.deleteApiKey(exchange);

      if (response.success) {
        // Reload API keys after deletion
        await loadAPIKeys();
        return {
          success: true,
          message: response.message || `${exchange} API key deleted successfully`
        };
      } else {
        return {
          success: false,
          error: response.error || 'Failed to delete API key'
        };
      }
    } catch (error) {
      console.error('Error deleting API key:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }, [loadAPIKeys]);

  /**
   * Check if user has any API keys connected
   */
  const hasAnyKeys = useCallback((): boolean => {
    return (state.bybit?.has_key || false) || (state.binance?.has_key || false);
  }, [state]);

  /**
   * Check if user has any verified API keys
   */
  const hasVerifiedKeys = useCallback((): boolean => {
    return (
      (state.bybit?.has_key && state.bybit?.verified) ||
      (state.binance?.has_key && state.binance?.verified) ||
      false
    );
  }, [state]);

  // Load API keys on mount
  useEffect(() => {
    loadAPIKeys();
  }, [loadAPIKeys]);

  return {
    ...state,
    addAPIKey,
    verifyAPIKey,
    deleteAPIKey,
    refreshAPIKeys: loadAPIKeys,
    hasAnyKeys: hasAnyKeys(),
    hasVerifiedKeys: hasVerifiedKeys()
  };
}
