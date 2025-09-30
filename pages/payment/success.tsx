/**
 * 💳 PAYMENT SUCCESS PAGE
 * Handles successful Stripe payment redirects
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentSuccess() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { session_id } = router.query;
    if (session_id && typeof session_id === 'string') {
      setSessionId(session_id);
      setLoading(false);
    }
  }, [router.query]);

  const handleReturnToAccount = () => {
    router.push('/user/account');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pagamento Confirmado - CoinBitClub</title>
        <meta name="description" content="Seu pagamento foi processado com sucesso" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado!
          </h1>

          <p className="text-gray-600 mb-6">
            Seu pagamento foi processado com sucesso. O saldo será creditado em sua conta em alguns minutos.
          </p>

          {/* Session ID (for debugging) */}
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">ID da Sessão:</p>
              <p className="font-mono text-xs text-gray-700 break-all">
                {sessionId}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleReturnToAccount}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Voltar à Minha Conta
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Ir para Dashboard
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Se você não receber o saldo em até 10 minutos, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}