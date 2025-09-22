/**
 * 💳 PAYMENT INTEGRATION COMPONENT - COINBITCLUB ENTERPRISE
 * Complete payment integration with Stripe
 */

import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

interface PaymentFormData {
    amount: number;
    currency: 'BRL' | 'USD';
    description: string;
}

interface StripeCheckoutData {
    planType: 'recharge' | 'monthly';
    country: 'BR' | 'US';
    amount?: number;
}

interface PaymentMethod {
    id: string;
    type: string;
    card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
}

const PaymentIntegration: React.FC = () => {
    const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
        amount: 100,
        currency: 'BRL',
        description: ''
    });

    const [checkoutForm, setCheckoutForm] = useState<StripeCheckoutData>({
        planType: 'recharge',
        country: 'BR',
        amount: 15000
    });

    const [balances, setBalances] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            setLoading(true);
            const [balancesData, transactionsData] = await Promise.all([
                apiService.getBalances(),
                apiService.getAdminTransactions()
            ]);
            
            setBalances(balancesData);
            setTransactions(transactionsData as any[]);
        } catch (error) {
            console.error('Error loading user data:', error);
            setError('Failed to load user data');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentIntent = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('/api/stripe/payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_access_token')}`
                },
                body: JSON.stringify({
                    amount: paymentForm.amount,
                    currency: paymentForm.currency,
                    description: paymentForm.description
                })
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Payment intent created: ${data.paymentIntentId}`);
                console.log('Payment intent created:', data);
                
                // In a real implementation, you would use Stripe.js to confirm the payment
                // For now, we'll just show success
                setTimeout(() => {
                    loadUserData(); // Refresh balances
                }, 1000);
            } else {
                setError(data.error || 'Failed to create payment intent');
            }
        } catch (error) {
            console.error('Payment intent error:', error);
            setError('Failed to create payment intent');
        } finally {
            setLoading(false);
        }
    };

    const handleStripeCheckout = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_access_token')}`
                },
                body: JSON.stringify(checkoutForm)
            });

            const data = await response.json();

            if (data.success && data.url) {
                // Redirect to Stripe Checkout
                window.open(data.url, '_blank');
                setSuccess(`Checkout session created: ${data.sessionId}`);
            } else {
                setError(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            setError('Failed to create checkout session');
        } finally {
            setLoading(false);
        }
    };

    const handleSetupIntent = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const response = await fetch('/api/stripe/setup-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_access_token')}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(`Setup intent created: ${data.setupIntentId}`);
                console.log('Setup intent created:', data);
                
                // In a real implementation, you would use Stripe.js to confirm the setup intent
                // For now, we'll just show success
            } else {
                setError(data.error || 'Failed to create setup intent');
            }
        } catch (error) {
            console.error('Setup intent error:', error);
            setError('Failed to create setup intent');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    return (
        <div className="payment-integration">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-center">💳 Payment Integration</h1>

                {/* User Balances */}
                {balances && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">💰 Your Balances</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-green-800">Real BRL</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(balances.balances.real.brl, 'BRL')}
                                </p>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-blue-800">Real USD</h3>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(balances.balances.real.usd, 'USD')}
                                </p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-purple-800">Total</h3>
                                <p className="text-lg font-bold text-purple-600">
                                    {formatCurrency(balances.total.brl, 'BRL')} / {formatCurrency(balances.total.usd, 'USD')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Intent Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">💳 Direct Payment</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                value={paymentForm.amount}
                                onChange={(e) => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter amount"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Currency
                            </label>
                            <select
                                value={paymentForm.currency}
                                onChange={(e) => setPaymentForm({...paymentForm, currency: e.target.value as 'BRL' | 'USD'})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="BRL">BRL</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <input
                            type="text"
                            value={paymentForm.description}
                            onChange={(e) => setPaymentForm({...paymentForm, description: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Payment description"
                        />
                    </div>
                    <button
                        onClick={handlePaymentIntent}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating Payment...' : 'Create Payment Intent'}
                    </button>
                </div>

                {/* Stripe Checkout Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">🛒 Stripe Checkout</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Plan Type
                            </label>
                            <select
                                value={checkoutForm.planType}
                                onChange={(e) => setCheckoutForm({...checkoutForm, planType: e.target.value as 'recharge' | 'monthly'})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="recharge">Recharge</option>
                                <option value="monthly">Monthly Subscription</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Country
                            </label>
                            <select
                                value={checkoutForm.country}
                                onChange={(e) => setCheckoutForm({...checkoutForm, country: e.target.value as 'BR' | 'US'})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="BR">Brazil (BRL)</option>
                                <option value="US">United States (USD)</option>
                            </select>
                        </div>
                    </div>
                    {checkoutForm.planType === 'recharge' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (cents)
                            </label>
                            <input
                                type="number"
                                value={checkoutForm.amount}
                                onChange={(e) => setCheckoutForm({...checkoutForm, amount: parseInt(e.target.value)})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Amount in cents"
                            />
                        </div>
                    )}
                    <button
                        onClick={handleStripeCheckout}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating Checkout...' : 'Create Checkout Session'}
                    </button>
                </div>

                {/* Setup Intent */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">💳 Save Payment Method</h2>
                    <p className="text-gray-600 mb-4">
                        Create a setup intent to save payment methods for future use.
                    </p>
                    <button
                        onClick={handleSetupIntent}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating Setup...' : 'Create Setup Intent'}
                    </button>
                </div>

                {/* Recent Transactions */}
                {transactions.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">📋 Recent Transactions</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 text-left">Type</th>
                                        <th className="px-4 py-2 text-left">Amount</th>
                                        <th className="px-4 py-2 text-left">Status</th>
                                        <th className="px-4 py-2 text-left">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 10).map((transaction, index) => (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2">{transaction.transaction_type}</td>
                                            <td className="px-4 py-2">
                                                {formatCurrency(transaction.amount, transaction.currency)}
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2">
                                                {new Date(transaction.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Messages */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        ❌ {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        ✅ {success}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentIntegration;
