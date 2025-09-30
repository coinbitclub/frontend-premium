/**
 * 💳 PAYMENT CANCEL PAGE
 * Handles cancelled Stripe payment redirects
 */

import { useRouter } from 'next/router';
import Head from 'next/head';
import { XCircleIcon } from '@heroicons/react/24/outline';

export default function PaymentCancel() {
  const router = useRouter();

  const handleReturnToAccount = () => {
    router.push('/user/account');
  };

  const handleTryAgain = () => {
    router.push('/user/account');
  };

  return (
    <>
      <Head>
        <title>Pagamento Cancelado - CoinBitClub</title>
        <meta name="description" content="Pagamento foi cancelado" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Cancel Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>

          {/* Cancel Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Pagamento Cancelado
          </h1>

          <p className="text-gray-600 mb-6">
            Seu pagamento foi cancelado. Nenhuma cobrança foi realizada.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Tentar Novamente
            </button>

            <button
              onClick={handleReturnToAccount}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Voltar à Minha Conta
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full text-gray-500 py-2 px-4 rounded-lg hover:text-gray-700 transition-colors"
            >
              Ir para Dashboard
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Se você encontrar problemas com o pagamento, entre em contato com o suporte.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}