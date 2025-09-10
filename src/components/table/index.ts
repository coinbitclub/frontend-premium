/**
 * 📊 TABLE COMPONENTS INDEX - T9 Implementation
 * Exportação centralizada de todos os componentes de tabela
 */

// ===============================================
// 📦 COMPONENT EXPORTS
// ===============================================

// Main DataTable component
export {
  DataTable,
  type Column,
  type PaginationInfo,
  type SortInfo,
  type FilterInfo,
  type SearchInfo,
  type DataTableProps
} from './DataTable';

// DataTable hook
export {
  useDataTable,
  createDataFetcher,
  createClientSideFetcher,
  type UseDataTableOptions,
  type DataFetcher,
  type UseDataTableReturn
} from './useDataTable';

// Specialized table components
export {
  UsersTable,
  type UsersTableProps
} from './UsersTable';

// ===============================================
// 📊 TABLE REGISTRY
// ===============================================

/**
 * Registry de todos os componentes de tabela disponíveis
 * Útil para debugging e listagem dinâmica
 */
export const tableRegistry = {
  // Core Components
  DataTable: 'Main reusable data table component with server-side pagination, filtering, and search',
  useDataTable: 'Hook for managing table state with server-side operations',
  
  // Specialized Tables
  UsersTable: 'Specialized table for user management with role-based actions',
  
  // Utilities
  createDataFetcher: 'Utility to create data fetcher functions for server-side tables',
  createClientSideFetcher: 'Utility to create data fetcher functions for client-side tables'
} as const;

/**
 * Tipos dos componentes de tabela registrados
 */
export type TableComponentName = keyof typeof tableRegistry;

// ===============================================
// 🔧 UTILITY FUNCTIONS
// ===============================================

/**
 * 📋 Get Available Table Components
 */
export function getAvailableTableComponents(): TableComponentName[] {
  return Object.keys(tableRegistry) as TableComponentName[];
}

/**
 * 📝 Get Table Component Description
 */
export function getTableComponentDescription(componentName: TableComponentName): string {
  return tableRegistry[componentName];
}

/**
 * ✅ Check if Table Component Exists
 */
export function hasTableComponent(name: string): name is TableComponentName {
  return name in tableRegistry;
}

/**
 * 📊 Get Table Components Stats
 */
export function getTableComponentsStats() {
  const components = Object.keys(tableRegistry);
  const coreComponents = components.filter(name => 
    ['DataTable', 'useDataTable'].includes(name)
  );
  const specializedTables = components.filter(name => 
    name.endsWith('Table')
  );
  const utilities = components.filter(name => 
    name.startsWith('create')
  );
  
  return {
    total: components.length,
    coreComponents: coreComponents.length,
    specializedTables: specializedTables.length,
    utilities: utilities.length,
    components: {
      all: components,
      core: coreComponents,
      specialized: specializedTables,
      utilities: utilities
    },
    status: 'ready'
  };
}

// ===============================================
// 🎯 DEFAULT EXPORT
// ===============================================

/**
 * Export padrão com todos os componentes e utilities
 */
export default {
  // Utility functions
  getAvailableTableComponents,
  getTableComponentDescription,
  hasTableComponent,
  getTableComponentsStats,
  
  // Registry
  tableRegistry
};

// ===============================================
// 📝 TABLE COMPONENTS DOCUMENTATION
// ===============================================

/**
 * Documentação dos componentes de tabela implementados
 * 
 * @example
 * ```typescript
 * import { DataTable, useDataTable, UsersTable } from '@/components/table';
 * 
 * // Basic DataTable usage
 * function MyTable() {
 *   const fetcher = createDataFetcher(async (params) => {
 *     const response = await api.getData(params);
 *     return { data: response.items, total: response.total };
 *   });
 * 
 *   const {
 *     data,
 *     loading,
 *     pagination,
 *     setPage,
 *     setSearch
 *   } = useDataTable(fetcher);
 * 
 *   return (
 *     <DataTable
 *       data={data}
 *       columns={columns}
 *       loading={loading}
 *       pagination={pagination}
 *       onPageChange={setPage}
 *       onSearchChange={setSearch}
 *     />
 *   );
 * }
 * 
 * // Specialized UsersTable
 * function UsersPage() {
 *   return (
 *     <UsersTable
 *       onView={(user) => navigate(`/users/${user.id}`)}
 *       onEdit={(user) => openEditModal(user)}
 *       selectable
 *       onSelectionChange={setSelectedUsers}
 *     />
 *   );
 * }
 * ```
 */
export const TABLE_DOCS = {
  DataTable: {
    description: 'Main reusable data table component with comprehensive features',
    features: [
      'Server-side pagination',
      'Column sorting',
      'Advanced filtering',
      'Global search',
      'Row selection',
      'Custom actions',
      'Loading states',
      'Error handling',
      'Empty states',
      'Responsive design'
    ],
    props: [
      'data', 'columns', 'loading', 'error',
      'pagination', 'onPageChange', 'onLimitChange',
      'sort', 'onSortChange',
      'filters', 'onFiltersChange',
      'search', 'onSearchChange',
      'actions', 'selectable', 'selectedRows', 'onSelectionChange'
    ],
    usage: 'Use for any tabular data that needs advanced features'
  },
  useDataTable: {
    description: 'Hook for managing table state with server-side operations',
    features: [
      'Pagination state management',
      'Sorting state management',
      'Filtering state management',
      'Search state management',
      'Data fetching with loading states',
      'Error handling',
      'Debounced search',
      'Auto-fetch on state changes'
    ],
    returns: [
      'data', 'loading', 'error',
      'pagination', 'sort', 'filters', 'search',
      'setPage', 'setLimit', 'setSort', 'setFilters', 'setSearch',
      'fetchData', 'refetch', 'reset'
    ],
    usage: 'Use with DataTable or custom table implementations'
  },
  UsersTable: {
    description: 'Specialized table for user management',
    features: [
      'User-specific columns (name, email, role, status)',
      'Role-based styling',
      'Status indicators',
      'User actions (view, edit, promote, deactivate)',
      'Avatar placeholders',
      'Compact mode support',
      'Integrated with useUsers hook'
    ],
    props: [
      'onView', 'onEdit', 'onDelete', 'onPromote', 'onDeactivate',
      'selectable', 'selectedUsers', 'onSelectionChange',
      'showActions', 'compactMode'
    ],
    usage: 'Use for user management pages and admin panels'
  },
  createDataFetcher: {
    description: 'Utility to create data fetcher functions for server-side tables',
    usage: 'Transform your API calls into useDataTable-compatible fetchers'
  },
  createClientSideFetcher: {
    description: 'Utility to create data fetcher functions for client-side tables',
    usage: 'Use when you have all data locally and want client-side operations'
  }
} as const;