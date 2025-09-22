/**
 * 💳 PAYMENT PAGE - COINBITCLUB ENTERPRISE
 * Complete payment integration page
 */

import React from 'react';
import Head from 'next/head';
import PaymentIntegration from '../src/components/PaymentIntegration';
import ProtectedRoute from '../src/components/ProtectedRoute';

const PaymentPage: React.FC = () => {
    return (
        <ProtectedRoute>
            <div>
                <Head>
                    <title>Payment Integration - CoinBitClub Enterprise</title>
                    <meta name="description" content="Complete payment integration with Stripe" />
                </Head>

                <PaymentIntegration />
            </div>
        </ProtectedRoute>
    );
};

export default PaymentPage;
