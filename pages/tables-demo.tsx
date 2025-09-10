/**
 * 📊 TABLES DEMO - T9 Implementation
 * Página de demonstração dos componentes de tabela implementados
 * Mostra DataTable, useDataTable e UsersTable em ação
 */

import React, { useState, useMemo } from 'react';
import { DataTable, UsersTable, useDataTable, createClientSideFetcher, type Column } from '../src/components/table';
import { AuthMiddleware } from '../src/guards';
import type { User } from '../src/lib/api/adapters';

// ===============================================
// 🔧 MOCK DATA
// ===============================================

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Smartphone Pro Max',
    category: 'Electronics',
    price: 1299.99,
    stock: 45,
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 199.99,
    stock: 120,
    status: 'active',
    createdAt: '2024-01-20T14:15:00Z'
  },
  {
    id: 3,
    name: 'Gaming Laptop',
    category: 'Computers',
    price: 2499.99,
    stock: 8,
    status: 'active',
    createdAt: '2024-02-01T09:00:00Z'
  },
  {
    id: 4,
    name: 'Smart Watch',
    category: 'Wearables',
    price: 399.99,
    stock: 0,
    status: 'inactive',
    createdAt: '2024-02-10T16:45:00Z'
  },
  {
    id: 5,
    name: 'Tablet Ultra',
    category: 'Electronics',
    price: 899.99,
    stock: 25,
    status: 'active',
    createdAt: '2024-02-15T11:20:00Z'
  },
  {
    id: 6,
    name: 'Bluetooth Speaker',
    category: 'Audio',
    price: 79.99,
    stock: 200,
    status: 'active',
    createdAt: '2024-02-20T13:30:00Z'
  },
  {
    id: 7,
    name: 'VR Headset',
    category: 'Gaming',
    price: 599.99,
    stock: 15,
    status: 'discontinued',
    createdAt: '2024-01-05T08:15:00Z'
  },
  {
    id: 8,
    name: 'Mechanical Keyboard',
    category: 'Accessories',
    price: 149.99,
    stock: 75,
    status: 'active',
    createdAt: '2024-02-25T15:00:00Z'
  }
];

export default function TablesDemo() {
  const [selectedTab, setSelectedTab] = useState<'basic' | 'users' | 'advanced'>('basic');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // ===============================================
  // 📊 BASIC TABLE SETUP
  // ===============================================

  const productsFetcher = useMemo(() => {
    return createClientSideFetcher(mockProducts);
  }, []);

  const {
    data: products,
    loading: productsLoading,
    error: productsError,
    pagination: productsPagination,
    sort: productsSort,
    filters: productsFilters,
    search: productsSearch,
    setPage: setProductsPage,
    setLimit: setProductsLimit,
    setSort: setProductsSort,
    setFilters: setProductsFilters,
    setSearch: setProductsSearch,
    refetch: refetchProducts
  } = useDataTable(productsFetcher, {
    initialLimit: 5,
    debounceMs: 300
  });

  // ===============================================
  // 📊 COLUMNS DEFINITION
  // ===============================================

  const productColumns = useMemo((): Column<Product>[] => [
    {
      key: 'id',
      label: 'ID',
      width: '80px',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-xs text-gray-500">#{value}</span>
      )
    },
    {
      key: 'name',
      label: 'Produto',
      sortable: true,
      searchable: true,
      render: (value, product) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Categoria',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      )
    },
    {
      key: 'price',
      label: 'Preço',
      sortable: true,
      align: 'right' as const,
      width: '120px',
      render: (value) => (
        <span className="text-sm font-medium text-gray-900">
          ${value.toFixed(2)}
        </span>
      )
    },
    {
      key: 'stock',
      label: 'Estoque',
      sortable: true,
      align: 'center' as const,
      width: '100px',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value > 50 ? 'bg-green-100 text-green-800' :
          value > 10 ? 'bg-yellow-100 text-yellow-800' :
          value > 0 ? 'bg-orange-100 text-orange-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      width: '120px',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' :
          value === 'inactive' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'Ativo' :
           value === 'inactive' ? 'Inativo' :
           'Descontinuado'}
        </span>
      )
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className="text-sm text-gray-500">
          {new Date(value).toLocaleDateString('pt-BR')}
        </span>
      )
    }
  ], []);

  // ===============================================
  // 🎬 HANDLERS
  // ===============================================

  const handleViewProduct = (product: Product) => {
    alert(`Visualizar produto: ${product.name}`);
  };

  const handleEditProduct = (product: Product) => {
    alert(`Editar produto: ${product.name}`);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`Deseja excluir o produto "${product.name}"?`)) {
      alert(`Produto "${product.name}" excluído!`);
    }
  };

  const handleViewUser = (user: User) => {
    alert(`Visualizar usuário: ${user.firstName} ${user.lastName}`);
  };

  const handleEditUser = (user: User) => {
    alert(`Editar usuário: ${user.firstName} ${user.lastName}`);
  };

  const handlePromoteUser = (user: User) => {
    alert(`Promover usuário: ${user.firstName} ${user.lastName}`);
  };

  const handleDeactivateUser = (user: User) => {
    if (confirm(`Deseja desativar o usuário "${user.firstName} ${user.lastName}"?`)) {
      alert(`Usuário "${user.firstName} ${user.lastName}" desativado!`);
    }
  };

  // ===============================================
  // 🎨 RENDER
  // ===============================================

  return (
    <AuthMiddleware>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📊 Demonstração de Tabelas - T9
            </h1>
            <p className="text-gray-600">
              Componentes de tabela com paginação server-side, filtros e busca implementados
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setSelectedTab('basic')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'basic'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📦 DataTable Básico
                </button>
                <button
                  onClick={() => setSelectedTab('users')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'users'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  👥 UsersTable
                </button>
                <button
                  onClick={() => setSelectedTab('advanced')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === 'advanced'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  ⚙️ Funcionalidades Avançadas
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {selectedTab === 'basic' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📦 DataTable com Produtos (Mock Data)
                </h2>
                <p className="text-gray-600 mb-6">
                  Exemplo de DataTable básico com dados locais, paginação client-side, filtros e busca.
                </p>
                
                <DataTable<Product>
                  data={products}
                  columns={productColumns}
                  loading={productsLoading}
                  error={productsError}
                  
                  // Pagination
                  pagination={productsPagination}
                  onPageChange={setProductsPage}
                  onLimitChange={setProductsLimit}
                  pageSizeOptions={[5, 10, 20]}
                  
                  // Sorting
                  sort={productsSort}
                  onSortChange={setProductsSort}
                  
                  // Filtering
                  filters={productsFilters}
                  onFiltersChange={setProductsFilters}
                  
                  // Search
                  search={productsSearch}
                  onSearchChange={setProductsSearch}
                  searchPlaceholder="Buscar produtos..."
                  
                  // Actions
                  actions={[
                    {
                      label: 'Ver',
                      onClick: handleViewProduct,
                      icon: '👁️',
                      className: 'text-blue-600 hover:text-blue-900'
                    },
                    {
                      label: 'Editar',
                      onClick: handleEditProduct,
                      icon: '✏️',
                      className: 'text-green-600 hover:text-green-900'
                    },
                    {
                      label: 'Excluir',
                      onClick: handleDeleteProduct,
                      icon: '🗑️',
                      className: 'text-red-600 hover:text-red-900',
                      show: (product) => product.status !== 'discontinued'
                    }
                  ]}
                  
                  // Selection
                  selectable
                  selectedRows={selectedProducts}
                  onSelectionChange={setSelectedProducts}
                  
                  // Empty state
                  emptyMessage="Nenhum produto encontrado"
                  emptyIcon="📦"
                />
                
                {selectedProducts.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{selectedProducts.length}</strong> produto(s) selecionado(s):
                      {selectedProducts.map(p => p.name).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  👥 UsersTable Especializada
                </h2>
                <p className="text-gray-600 mb-6">
                  Tabela especializada para usuários com integração ao useUsers hook e ações específicas.
                </p>
                
                <UsersTable
                  onView={handleViewUser}
                  onEdit={handleEditUser}
                  onPromote={handlePromoteUser}
                  onDeactivate={handleDeactivateUser}
                  selectable
                  selectedUsers={selectedUsers}
                  onSelectionChange={setSelectedUsers}
                />
                
                {selectedUsers.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>{selectedUsers.length}</strong> usuário(s) selecionado(s):
                      {selectedUsers.map(u => `${u.firstName} ${u.lastName}`).join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'advanced' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Features Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ✨ Funcionalidades Implementadas
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Paginação server-side e client-side
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Ordenação por colunas
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Filtros avançados por coluna
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Busca global com debounce
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Seleção múltipla de linhas
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Ações customizáveis por linha
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Estados de loading e erro
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Responsivo e acessível
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Integração com hooks existentes
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✅</span>
                      Componentes especializados
                    </li>
                  </ul>
                </div>

                {/* Stats Card */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📊 Estatísticas dos Componentes
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">DataTable (Core)</span>
                      <span className="text-sm font-medium text-gray-900">~800 linhas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">useDataTable Hook</span>
                      <span className="text-sm font-medium text-gray-900">~400 linhas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">UsersTable</span>
                      <span className="text-sm font-medium text-gray-900">~300 linhas</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Utilities</span>
                      <span className="text-sm font-medium text-gray-900">~200 linhas</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-sm text-gray-900">Total</span>
                      <span className="text-sm text-gray-900">~1.700 linhas</span>
                    </div>
                  </div>
                </div>

                {/* Usage Examples */}
                <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    💻 Exemplos de Uso
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-sm text-gray-800 overflow-x-auto">
{`// Uso básico do DataTable
import { DataTable, useDataTable, createDataFetcher } from '@/components/table';

const fetcher = createDataFetcher(async (params) => {
  const response = await api.getData(params);
  return { data: response.items, total: response.total };
});

const { data, loading, pagination, setPage } = useDataTable(fetcher);

<DataTable
  data={data}
  columns={columns}
  loading={loading}
  pagination={pagination}
  onPageChange={setPage}
/>

// Uso da UsersTable especializada
<UsersTable
  onView={(user) => navigate(\`/users/\${user.id}\`)}
  onEdit={(user) => openEditModal(user)}
  selectable
  onSelectionChange={setSelectedUsers}
/>`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>T9 - Tabelas/paginação/filtros/busca: Implementação completa! ✅</p>
            <p className="mt-1">
              <strong>Funcionalidades:</strong> DataTable reutilizável, useDataTable hook, UsersTable especializada, 
              paginação server-side, filtros avançados, busca com debounce
            </p>
          </div>
        </div>
      </div>
    </AuthMiddleware>
  );
}

// Disable SSG for this page since it uses dynamic data
export async function getServerSideProps() {
  return {
    props: {}
  };
}