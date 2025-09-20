import type { NextApiRequest, NextApiResponse } from 'next';
import { callLogs } from '../../lib/mock-db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const callData = req.body;
    console.log('[POST-CALL] Received call data:', JSON.stringify(callData, null, 2));

    callLogs.push({ ...callData, receivedAt: new Date().toISOString() });
    
    res.status(200).json({ status: 'received' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
