/**
 * 📊 DATA TABLE - T9 Implementation
 * Componente de tabela reutilizável com paginação server-side, filtros e busca
 * Integrado com adapters e hooks implementados em T6-T7
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

// ===============================================
// 🔧 TYPES
// ===============================================

export interface Column<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SortInfo {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterInfo {
  [key: string]: any;
}

export interface SearchInfo {
  query: string;
  fields?: string[];
}

export interface DataTableProps<T = any> {
  // Data
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  
  // Pagination
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
  
  // Sorting
  sortable?: boolean;
  sort?: SortInfo;
  onSortChange?: (sort: SortInfo) => void;
  
  // Filtering
  filterable?: boolean;
  filters?: FilterInfo;
  onFiltersChange?: (filters: FilterInfo) => void;
  
  // Search
  searchable?: boolean;
  search?: SearchInfo;
  onSearchChange?: (search: SearchInfo) => void;
  searchPlaceholder?: string;
  
  // Actions
  actions?: {
    label: string;
    onClick: (row: T, index: number) => void;
    icon?: React.ReactNode;
    className?: string;
    show?: (row: T) => boolean;
  }[];
  
  // Styling
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  headerClassName?: string;
  
  // Behavior
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  rowKey?: string | ((row: T) => string | number);
  
  // Empty state
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

// ===============================================
// 📊 DATA TABLE COMPONENT
// ===============================================

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error = null,
  
  // Pagination
  pagination,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50, 100],
  
  // Sorting
  sortable = true,
  sort,
  onSortChange,
  
  // Filtering
  filterable = true,
  filters = {},
  onFiltersChange,
  
  // Search
  searchable = true,
  search = { query: '' },
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  
  // Actions
  actions = [],
  
  // Styling
  className = '',
  rowClassName = '',
  headerClassName = '',
  
  // Behavior
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  rowKey = 'id',
  
  // Empty state
  emptyMessage = 'Nenhum dado encontrado',
  emptyIcon
}: DataTableProps<T>) => {
  // ===============================================
  // 🔄 LOCAL STATE
  // ===============================================
  
  const [localSearch, setLocalSearch] = useState(search.query);
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  
  // ===============================================
  // 🔄 EFFECTS
  // ===============================================
  
  useEffect(() => {
    setLocalSearch(search.query);
  }, [search.query]);
  
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);
  
  // ===============================================
  // 🎬 HANDLERS
  // ===============================================
  
  const handleSort = useCallback((field: string) => {
    if (!sortable || !onSortChange) return;
    
    const newDirection = sort?.field === field && sort?.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction: newDirection });
  }, [sortable, sort, onSortChange]);
  
  const handleSearch = useCallback((query: string) => {
    if (!searchable || !onSearchChange) return;
    
    const searchableFields = columns
      .filter(col => col.searchable !== false)
      .map(col => col.key);
    
    onSearchChange({
      query,
      fields: searchableFields
    });
  }, [searchable, onSearchChange, columns]);
  
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(localSearch);
  }, [localSearch, handleSearch]);
  
  const handleFilterChange = useCallback((key: string, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    if (value === '' || value === null || value === undefined) {
      delete newFilters[key];
    }
    setLocalFilters(newFilters);
  }, [localFilters]);
  
  const handleApplyFilters = useCallback(() => {
    if (onFiltersChange) {
      onFiltersChange(localFilters);
    }
    setShowFilters(false);
  }, [localFilters, onFiltersChange]);
  
  const handleClearFilters = useCallback(() => {
    setLocalFilters({});
    if (onFiltersChange) {
      onFiltersChange({});
    }
  }, [onFiltersChange]);
  
  const handleRowSelection = useCallback((row: T, checked: boolean) => {
    if (!selectable || !onSelectionChange) return;
    
    const rowId = typeof rowKey === 'function' ? rowKey(row) : row[rowKey];
    
    let newSelection;
    if (checked) {
      newSelection = [...selectedRows, row];
    } else {
      newSelection = selectedRows.filter(r => {
        const id = typeof rowKey === 'function' ? rowKey(r) : r[rowKey];
        return id !== rowId;
      });
    }
    
    onSelectionChange(newSelection);
  }, [selectable, selectedRows, onSelectionChange, rowKey]);
  
  const handleSelectAll = useCallback((checked: boolean) => {
    if (!selectable || !onSelectionChange) return;
    
    onSelectionChange(checked ? [...data] : []);
  }, [selectable, data, onSelectionChange]);
  
  // ===============================================
  // 🎨 RENDER HELPERS
  // ===============================================
  
  const getRowKey = useCallback((row: T, index: number) => {
    if (typeof rowKey === 'function') {
      return rowKey(row);
    }
    return row[rowKey] || index;
  }, [rowKey]);
  
  const getRowClassName = useCallback((row: T, index: number) => {
    if (typeof rowClassName === 'function') {
      return rowClassName(row, index);
    }
    return rowClassName;
  }, [rowClassName]);
  
  const isRowSelected = useCallback((row: T) => {
    if (!selectable) return false;
    
    const rowId = typeof rowKey === 'function' ? rowKey(row) : row[rowKey];
    return selectedRows.some(r => {
      const id = typeof rowKey === 'function' ? rowKey(r) : r[rowKey];
      return id === rowId;
    });
  }, [selectable, selectedRows, rowKey]);
  
  const getSortIcon = useCallback((field: string) => {
    if (!sort || sort.field !== field) {
      return <span className="text-gray-400">↕️</span>;
    }
    return sort.direction === 'asc' ? 
      <span className="text-blue-600">↑</span> : 
      <span className="text-blue-600">↓</span>;
  }, [sort]);
  
  const filterableColumns = columns.filter(col => col.filterable !== false);
  const hasActiveFilters = Object.keys(filters).length > 0;
  const allSelected = selectable && data.length > 0 && selectedRows.length === data.length;
  const someSelected = selectable && selectedRows.length > 0 && selectedRows.length < data.length;
  
  // ===============================================
  // 🎨 RENDER
  // ===============================================
  
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {/* Header with Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search */}
          {searchable && (
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </form>
          )}
          
          {/* Filters Toggle */}
          {filterable && filterableColumns.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium ${
                  hasActiveFilters
                    ? 'text-blue-700 bg-blue-50 border-blue-300'
                    : 'text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Limpar
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Filters Panel */}
        {showFilters && filterable && filterableColumns.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterableColumns.map((column) => (
                <div key={column.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.label}
                  </label>
                  <input
                    type="text"
                    value={localFilters[column.key] || ''}
                    onChange={(e) => handleFilterChange(column.key, e.target.value)}
                    placeholder={`Filtrar por ${column.label.toLowerCase()}`}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowFilters(false)}
                className="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-3 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Header */}
          <thead className={`bg-gray-50 ${headerClassName}`}>
            <tr>
              {/* Selection Header */}
              {selectable && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              
              {/* Column Headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' :
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${column.className || ''}`}
                  style={{ width: column.width }}
                >
                  {column.sortable !== false && sortable ? (
                    <button
                      onClick={() => handleSort(column.key)}
                      className="group inline-flex items-center space-x-1 hover:text-gray-700"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.key)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
              
              {/* Actions Header */}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          
          {/* Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="text-red-600">
                    <span className="text-2xl mb-2 block">❌</span>
                    <p className="font-medium">Erro ao carregar dados</p>
                    <p className="text-sm text-gray-600 mt-1">{error}</p>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    {emptyIcon && <div className="text-4xl mb-4">{emptyIcon}</div>}
                    <p className="font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getRowKey(row, index)}
                  className={`hover:bg-gray-50 ${getRowClassName(row, index)} ${
                    isRowSelected(row) ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Selection Cell */}
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isRowSelected(row)}
                        onChange={(e) => handleRowSelection(row, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  
                  {/* Data Cells */}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${
                        column.align === 'center' ? 'text-center' :
                        column.align === 'right' ? 'text-right' : 'text-left'
                      } ${column.className || ''}`}
                    >
                      {column.render
                        ? column.render(row[column.key], row, index)
                        : row[column.key]
                      }
                    </td>
                  ))}
                  
                  {/* Actions Cell */}
                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {actions.map((action, actionIndex) => {
                          if (action.show && !action.show(row)) return null;
                          
                          return (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row, index)}
                              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded hover:bg-gray-100 ${
                                action.className || 'text-blue-600 hover:text-blue-900'
                              }`}
                              title={action.label}
                            >
                              {action.icon && <span className="mr-1">{action.icon}</span>}
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Mostrar:</span>
              <select
                value={pagination.limit}
                onChange={(e) => onLimitChange?.(Number(e.target.value))}
                className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-sm text-gray-700">por página</span>
            </div>
            
            {/* Pagination Info */}
            <div className="text-sm text-gray-700">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
              {pagination.total} resultados
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              
              <span className="text-sm text-gray-700">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              
              <button
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={!pagination.hasNext}
                className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;