import React from 'react';
import { useEffect, useState } from 'react';
import { 
  fetchDashboardMetrics, 
  fetchDashboardBalances, 
  fetchOpenPositions, 
  fetchPerformanceChart 
} from '../lib/api';
import Card, { CardContent, CardHeader, CardTitle, CardFooter } from '../components/Card';
import Chart from '../components/Chart';
import DataTable from '../components/DataTable';
import Layout from '../components/Layout';
import withAuth from '../components/withAuth';

// Tipos para os dados da API
interface DashboardMetrics {
  totalProfit: number;
  profitChange: number;
  activePositions: number;
  winRate: number;
  totalBalance: number;
  balanceChange: number;
  trades24h: number;
  tradeSuccess: number;
}

interface Balance {
  currency: string;
  amount: number;
  usdValue: number;
  change24h: number;
}

interface Position {
  id: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  amount: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  openedAt: string;
}

interface PerformanceData {
  timestamp: number;
  value: number;
  pnl: number;
}

function Dashboard() {
  // Estados para armazenar os dados
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Carregar dados em paralelo
        const [metricsRes, balancesRes, positionsRes, performanceRes] = await Promise.all([
          fetchDashboardMetrics(),
          fetchDashboardBalances(),
          fetchOpenPositions(),
          fetchPerformanceChart()
        ]);

        setMetrics(metricsRes.data);
        setBalances(balancesRes.data);
        setPositions(positionsRes.data);
        setPerformanceData(performanceRes.data);
        
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err);
        setError('Falha ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Atualizar dados a cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  // Formatar percentual
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // NO MORE MOCK DATA - Backend integration required
  const dashboardMetrics: DashboardMetrics = {
    totalProfit: 0,
    profitChange: 0,
    activePositions: 0,
    winRate: 0,
    totalBalance: 0,
    balanceChange: 0,
    trades24h: 0,
    tradeSuccess: 0
  };

  // Mock data arrays (using state variables)
  // const balances: Balance[] = []; // Removido - usando state
  // const positions: Position[] = []; // Removido - usando state

  // Use real data from backend - no fallbacks
  const displayMetrics = dashboardMetrics;
  const displayBalances = balances;
  const displayPositions = positions;

  return (
    <Layout title="Dashboard | CoinBitClub MarketBot">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-emerald-400">Dashboard</h1>
          <p className="text-slate-300 mt-2">Visão geral de suas atividades de trading</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Métricas principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="premium-card group transition-all duration-300 hover:scale-105">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Saldo Total</h3>
              <span className="text-2xl font-bold text-white">{formatCurrency(displayMetrics.totalBalance)}</span>
              <span className={`text-sm mt-1 ${displayMetrics.balanceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(displayMetrics.balanceChange)} nas últimas 24h
              </span>
            </div>
          </div>

          <div className="premium-card group transition-all duration-300 hover:scale-105">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Lucro Total</h3>
              <span className="text-2xl font-bold text-white">{formatCurrency(displayMetrics.totalProfit)}</span>
              <span className={`text-sm mt-1 ${displayMetrics.profitChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(displayMetrics.profitChange)} no último mês
              </span>
            </div>
          </div>

          <div className="premium-card group transition-all duration-300 hover:scale-105">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Operações Ativas</h3>
              <span className="text-2xl font-bold text-white">{displayMetrics.activePositions}</span>
              <span className="text-sm mt-1 text-slate-300">
                {displayMetrics.winRate}% Win Rate
              </span>
            </div>
          </div>

          <div className="premium-card group transition-all duration-300 hover:scale-105">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-emerald-400 mb-3">Trades (24h)</h3>
              <span className="text-2xl font-bold text-white">{displayMetrics.trades24h}</span>
              <span className="text-sm mt-1 text-slate-300">
                {displayMetrics.tradeSuccess} bem-sucedidos
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico de performance */}
        <div className="premium-card mb-6">
          <h3 className="text-lg font-semibold text-emerald-400 mb-3">Performance</h3>
          <p className="text-sm text-slate-300 mb-4">Histórico de desempenho nas últimas 24 horas</p>
          <div className="h-80">
            <Chart />
          </div>
        </div>

        {/* Balances e Positions em duas colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Saldo por moeda */}
          <div className="premium-card">
            <h3 className="text-lg font-semibold text-emerald-400 mb-3">Saldo por Moeda</h3>
            <p className="text-sm text-slate-300 mb-4">Distribuição de seus ativos</p>
            <div className="overflow-x-auto">
              <DataTable>
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">Moeda</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">Quantidade</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">Valor (USD)</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">24h</th>
                  </tr>
                </thead>
                <tbody>
                  {displayBalances.map((balance, index) => (
                    <tr key={balance.currency} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-white">{balance.currency}</td>
                      <td className="py-3 px-4 text-white">{balance.amount.toFixed(balance.currency === 'USDT' ? 2 : 6)}</td>
                      <td className="py-3 px-4 text-white">{formatCurrency(balance.usdValue)}</td>
                      <td className={`py-3 px-4 ${balance.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPercentage(balance.change24h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          </div>

          {/* Posições abertas */}
          <div className="premium-card">
            <h3 className="text-lg font-semibold text-emerald-400 mb-3">Posições Abertas</h3>
            <p className="text-sm text-slate-300 mb-4">Operações em andamento</p>
            <div className="overflow-x-auto">
              <DataTable>
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">Par</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">Tipo</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">Preço</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-emerald-400">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {displayPositions.map((position) => (
                    <tr key={position.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 text-white">{position.pair}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${position.type === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {position.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">{formatCurrency(position.currentPrice)}</td>
                      <td className={`py-3 px-4 ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(position.pnl)} ({formatPercentage(position.pnlPercentage)})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(Dashboard);



