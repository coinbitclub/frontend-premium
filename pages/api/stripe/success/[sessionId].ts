/**
 * 🔔 STRIPE SUCCESS CALLBACK API
 * Proxy endpoint to confirm payment with backend
 */

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId } = req.query;

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'Session ID is required' });
  }

  try {
    // Call backend to confirm payment
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/stripe/success/${sessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      res.status(200).json(result);
    } else {
      res.status(response.status).json(result);
    }
  } catch (error) {
    console.error('❌ Error calling backend:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm payment with backend'
    });
  }
}
