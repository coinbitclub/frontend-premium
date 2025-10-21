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
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [planCode, setPlanCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const { session_id } = router.query;
    if (session_id && typeof session_id === 'string') {
      setSessionId(session_id);
      
      // Call backend to confirm payment and update database
      const confirmPayment = async () => {
        try {
          console.log('🔄 Confirming payment with session ID:', session_id);
          
          const response = await fetch(`/api/stripe/success/${session_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const result = await response.json();
          
          if (result.success) {
            console.log('✅ Payment confirmed and database updated:', result);
            setPaymentStatus('success');
            setPlanCode(result.planCode);
            
            // Show success message
            setTimeout(() => {
              // You can add a toast notification here if you have a toast system
              console.log(`🎉 Plan ${result.planCode} activated successfully!`);
            }, 1000);
          } else {
            console.error('❌ Payment confirmation failed:', result);
            setPaymentStatus('error');
            setErrorMessage(result.error || 'Payment confirmation failed');
          }
        } catch (error) {
          console.error('❌ Error confirming payment:', error);
          setPaymentStatus('error');
          setErrorMessage('Failed to confirm payment. Please contact support.');
        } finally {
          setLoading(false);
        }
      };
      
      confirmPayment();
    } else {
      setLoading(false);
      setPaymentStatus('error');
      setErrorMessage('No session ID provided');
    }
  }, [router.query]);

  const handleReturnToAccount = () => {
    router.push('/user/account');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Processando Pagamento...
          </h1>
          <p className="text-gray-600">
            Aguarde enquanto confirmamos seu pagamento e ativamos seu plano.
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Erro no Pagamento
          </h1>

          <p className="text-gray-600 mb-6">
            {errorMessage || 'Ocorreu um erro ao processar seu pagamento. Tente novamente.'}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/user/plans')}
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
          </div>
        </div>
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

          {planCode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-medium">
                🎉 Plano {planCode} ativado com sucesso!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Seu plano está ativo e você já pode começar a usar todas as funcionalidades.
              </p>
            </div>
          )}

          <p className="text-gray-600 mb-6">
            Seu pagamento foi processado com sucesso e seu plano foi ativado imediatamente.
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
              Ver Meu Plano Ativo
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