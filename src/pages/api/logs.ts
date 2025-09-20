import type { NextApiRequest, NextApiResponse } from 'next';
import { callLogs } from '../../lib/mock-db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json([...callLogs].reverse());
}
