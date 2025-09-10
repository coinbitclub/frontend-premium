/**
 * 🪝 USE DATA TABLE - T9 Implementation
 * Hook personalizado para gerenciar estado de tabelas com paginação server-side
 * Integrado com adapters implementados em T6
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { PaginationInfo, SortInfo, FilterInfo, SearchInfo } from './DataTable';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface UseDataTableOptions {
  // Initial state
  initialPage?: number;
  initialLimit?: number;
  initialSort?: SortInfo;
  initialFilters?: FilterInfo;
  initialSearch?: SearchInfo;
  
  // Behavior
  autoFetch?: boolean;
  debounceMs?: number;
  
  // Server-side configuration
  serverSide?: boolean;
  
  // Callbacks
  onError?: (error: string) => void;
  onSuccess?: (data: any) => void;
}

export interface DataFetcher<T = any> {
  (params: {
    page: number;
    limit: number;
    sort?: SortInfo;
    filters?: FilterInfo;
    search?: SearchInfo;
  }): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}

export interface UseDataTableReturn<T = any> {
  // Data state
  data: T[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  pagination: PaginationInfo;
  
  // Sorting
  sort: SortInfo | undefined;
  
  // Filtering
  filters: FilterInfo;
  
  // Search
  search: SearchInfo;
  
  // Actions
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: SortInfo) => void;
  setFilters: (filters: FilterInfo) => void;
  setSearch: (search: SearchInfo) => void;
  clearFilters: () => void;
  clearSearch: () => void;
  reset: () => void;
  
  // Utilities
  isFirstPage: boolean;
  isLastPage: boolean;
  hasData: boolean;
  isEmpty: boolean;
  totalItems: number;
}

// ===============================================
// 🪝 USE DATA TABLE HOOK
// ===============================================

export function useDataTable<T = any>(
  fetcher: DataFetcher<T>,
  options: UseDataTableOptions = {}
): UseDataTableReturn<T> {
  const {
    initialPage = 1,
    initialLimit = 20,
    initialSort,
    initialFilters = {},
    initialSearch = { query: '' },
    autoFetch = true,
    debounceMs = 300,
    serverSide = true,
    onError,
    onSuccess
  } = options;
  
  // ===============================================
  // 🔄 STATE
  // ===============================================
  
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [page, setPageState] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Sorting state
  const [sort, setSortState] = useState<SortInfo | undefined>(initialSort);
  
  // Filtering state
  const [filters, setFiltersState] = useState<FilterInfo>(initialFilters);
  
  // Search state
  const [search, setSearchState] = useState<SearchInfo>(initialSearch);
  
  // Debounce state
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // ===============================================
  // 🔄 COMPUTED VALUES
  // ===============================================
  
  const pagination = useMemo((): PaginationInfo => ({
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  }), [page, limit, total, totalPages]);
  
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;
  const hasData = data.length > 0;
  const isEmpty = !loading && !error && data.length === 0;
  const totalItems = total;
  
  // ===============================================
  // 🔄 DATA FETCHING
  // ===============================================
  
  const fetchData = useCallback(async () => {
    if (!fetcher) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit,
        ...(sort && { sort }),
        ...(Object.keys(filters).length > 0 && { filters }),
        ...(search.query && { search })
      };
      
      console.log('🔄 Fetching data with params:', params);
      
      const result = await fetcher(params);
      
      setData(result.data);
      setTotal(result.total);
      setTotalPages(result.totalPages);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      console.log('✅ Data fetched successfully:', {
        items: result.data.length,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });
      
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar dados';
      setError(errorMessage);
      setData([]);
      setTotal(0);
      setTotalPages(0);
      
      if (onError) {
        onError(errorMessage);
      }
      
      console.error('❌ Data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fetcher, page, limit, sort, filters, search, onSuccess, onError]);
  
  const debouncedFetchData = useCallback(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchData();
    }, debounceMs);
    
    setDebounceTimeout(timeout);
  }, [fetchData, debounceMs, debounceTimeout]);
  
  // ===============================================
  // 🔄 ACTIONS
  // ===============================================
  
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  
  const setPage = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPageState(newPage);
  }, [totalPages]);
  
  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1); // Reset to first page when changing limit
  }, []);
  
  const setSort = useCallback((newSort: SortInfo) => {
    setSortState(newSort);
    setPageState(1); // Reset to first page when sorting
  }, []);
  
  const setFilters = useCallback((newFilters: FilterInfo) => {
    setFiltersState(newFilters);
    setPageState(1); // Reset to first page when filtering
  }, []);
  
  const setSearch = useCallback((newSearch: SearchInfo) => {
    setSearchState(newSearch);
    setPageState(1); // Reset to first page when searching
  }, []);
  
  const clearFilters = useCallback(() => {
    setFiltersState({});
    setPageState(1);
  }, []);
  
  const clearSearch = useCallback(() => {
    setSearchState({ query: '' });
    setPageState(1);
  }, []);
  
  const reset = useCallback(() => {
    setPageState(initialPage);
    setLimitState(initialLimit);
    setSortState(initialSort);
    setFiltersState(initialFilters);
    setSearchState(initialSearch);
    setError(null);
  }, [initialPage, initialLimit, initialSort, initialFilters, initialSearch]);
  
  // ===============================================
  // 🔄 EFFECTS
  // ===============================================
  
  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, []); // Only on mount
  
  // Fetch when dependencies change (with debounce for search)
  useEffect(() => {
    if (!autoFetch) return;
    
    // Use debounce for search, immediate for others
    if (search.query !== initialSearch.query) {
      debouncedFetchData();
    } else {
      fetchData();
    }
  }, [page, limit, sort, filters, search]); // Dependencies that trigger fetch
  
  // Cleanup debounce timeout
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);
  
  // ===============================================
  // 🔄 RETURN
  // ===============================================
  
  return {
    // Data state
    data,
    loading,
    error,
    
    // Pagination
    pagination,
    
    // Sorting
    sort,
    
    // Filtering
    filters,
    
    // Search
    search,
    
    // Actions
    fetchData,
    refetch,
    setPage,
    setLimit,
    setSort,
    setFilters,
    setSearch,
    clearFilters,
    clearSearch,
    reset,
    
    // Utilities
    isFirstPage,
    isLastPage,
    hasData,
    isEmpty,
    totalItems
  };
}

// ===============================================
// 🔧 UTILITY FUNCTIONS
// ===============================================

/**
 * Create a data fetcher function for use with useDataTable
 */
export function createDataFetcher<T = any>(
  fetchFunction: (params: any) => Promise<{ data: T[]; total?: number; [key: string]: any }>
): DataFetcher<T> {
  return async (params) => {
    const result = await fetchFunction(params);
    
    const total = result.total || result.data.length;
    const totalPages = Math.ceil(total / params.limit);
    
    return {
      data: result.data,
      total,
      page: params.page,
      limit: params.limit,
      totalPages
    };
  };
}

/**
 * Create a client-side data fetcher for local data
 */
export function createClientSideFetcher<T = any>(allData: T[]): DataFetcher<T> {
  return async (params) => {
    let filteredData = [...allData];
    
    // Apply search
    if (params.search?.query) {
      const query = params.search.query.toLowerCase();
      const searchFields = params.search.fields || [];
      
      filteredData = filteredData.filter(item => {
        if (searchFields.length > 0) {
          return searchFields.some(field => {
            const value = (item as any)[field];
            return value && value.toString().toLowerCase().includes(query);
          });
        } else {
          // Search in all string fields
          return Object.values(item as any).some(value => 
            value && value.toString().toLowerCase().includes(query)
          );
        }
      });
    }
    
    // Apply filters
    if (params.filters && Object.keys(params.filters).length > 0) {
      filteredData = filteredData.filter(item => {
        return Object.entries(params.filters!).every(([key, value]) => {
          if (!value) return true;
          const itemValue = (item as any)[key];
          return itemValue && itemValue.toString().toLowerCase().includes(value.toString().toLowerCase());
        });
      });
    }
    
    // Apply sorting
    if (params.sort) {
      filteredData.sort((a, b) => {
        const aValue = (a as any)[params.sort!.field];
        const bValue = (b as any)[params.sort!.field];
        
        if (aValue < bValue) {
          return params.sort!.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return params.sort!.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    // Apply pagination
    const total = filteredData.length;
    const totalPages = Math.ceil(total / params.limit);
    const startIndex = (params.page - 1) * params.limit;
    const endIndex = startIndex + params.limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total,
      page: params.page,
      limit: params.limit,
      totalPages
    };
  };
}

export default useDataTable;