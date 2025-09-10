/**
 * 🔌 REALTIME PAGE - T3 Implementation
 * Página de demonstração da conexão WebSocket realtime
 */

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '../src/hooks/useWebSocket';

interface RealtimeMessage {
  type: string;
  timestamp: string;
  [key: string]: any;
}

const RealtimePage: React.FC = () => {
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [selectedRoom, setSelectedRoom] = useState('lobby');

  const {
    isConnected,
    isConnecting,
    error,
    send,
    subscribe,
    unsubscribe,
    joinRoom,
    leaveRoom,
    reconnect,
    disconnect,
    stats
  } = useWebSocket({
    onMessage: (message) => {
      setMessages(prev => [message as RealtimeMessage, ...prev].slice(0, 50)); // Manter apenas 50 mensagens
    },
    onConnect: () => {
      console.log('✅ Conectado ao WebSocket');
    },
    onDisconnect: () => {
      console.log('🚪 Desconectado do WebSocket');
    },
    onError: (error) => {
      console.error('❌ Erro WebSocket:', error);
    }
  });

  // Auto-subscribe to general channel on connect
  useEffect(() => {
    if (isConnected) {
      subscribe('general');
      joinRoom('lobby');
    }
  }, [isConnected, subscribe, joinRoom]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const success = send({
      type: 'custom_message',
      message: inputMessage,
      channel: selectedChannel,
      timestamp: new Date().toISOString()
    });
    
    if (success) {
      setInputMessage('');
    }
  };

  const handleSubscribeChannel = () => {
    if (selectedChannel) {
      subscribe(selectedChannel);
    }
  };

  const handleUnsubscribeChannel = () => {
    if (selectedChannel) {
      unsubscribe(selectedChannel);
    }
  };

  const handleJoinRoom = () => {
    if (selectedRoom) {
      joinRoom(selectedRoom);
    }
  };

  const handleLeaveRoom = () => {
    if (selectedRoom) {
      leaveRoom(selectedRoom);
    }
  };

  const getStatusColor = () => {
    if (isConnecting) return 'text-yellow-600';
    if (isConnected) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (isConnecting) return 'Conectando...';
    if (isConnected) return 'Conectado';
    return 'Desconectado';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">WebSocket Realtime</h1>
              <p className="text-gray-600 mt-1">
                Demonstração da conexão WebSocket - T3 Implementation
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center ${getStatusColor()}`}>
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  isConnected ? 'bg-green-500' : 
                  isConnecting ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="font-medium">{getStatusText()}</span>
              </div>
              <button
                onClick={isConnected ? disconnect : reconnect}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isConnected 
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isConnected ? '🚪 Desconectar' : '🔗 Conectar'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erro de Conexão</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Controles</h2>
              
              {/* Send Message */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enviar Mensagem
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    disabled={!isConnected}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!isConnected || !inputMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    📤
                  </button>
                </div>
              </div>

              {/* Channel Management */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gerenciar Canais
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    placeholder="Nome do canal"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleSubscribeChannel}
                    disabled={!isConnected}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    📡 Subscrever
                  </button>
                  <button
                    onClick={handleUnsubscribeChannel}
                    disabled={!isConnected}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    📡 Desinscrever
                  </button>
                </div>
              </div>

              {/* Room Management */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gerenciar Salas
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    placeholder="Nome da sala"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleJoinRoom}
                    disabled={!isConnected}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    🏠 Entrar
                  </button>
                  <button
                    onClick={handleLeaveRoom}
                    disabled={!isConnected}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    🏠 Sair
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tentativas de Reconexão:</span>
                  <span className="text-sm font-medium">{stats.reconnectAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mensagens Recebidas:</span>
                  <span className="text-sm font-medium">{stats.messagesReceived}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Mensagens Enviadas:</span>
                  <span className="text-sm font-medium">{stats.messagesSent}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Mensagens Realtime ({messages.length})
                </h2>
                <button
                  onClick={() => setMessages([])}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  🗑️ Limpar
                </button>
              </div>
              
              <div className="h-96 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    <div className="text-4xl mb-4">📡</div>
                    <p>Nenhuma mensagem recebida ainda</p>
                    <p className="text-sm mt-2">
                      {isConnected ? 'Aguardando mensagens...' : 'Conecte-se para receber mensagens'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 shadow-sm border">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            message.type === 'welcome' ? 'bg-green-100 text-green-800' :
                            message.type === 'subscribed' ? 'bg-blue-100 text-blue-800' :
                            message.type === 'joined_room' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {message.type}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString('pt-BR')}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-100 p-2 rounded">
                            {JSON.stringify(message, null, 2)}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-400">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Informações T3 - WebSocket</h3>
              <div className="text-sm text-blue-700 mt-1">
                <p>• URL: {process.env.NEXT_PUBLIC_SOCKET_URL?.replace('http', 'ws')}/realtime</p>
                <p>• Protocolo: WebSocket nativo (ws)</p>
                <p>• Namespace: /realtime</p>
                <p>• Reconexão automática: Ativada</p>
                <p>• Heartbeat: 30s</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimePage;