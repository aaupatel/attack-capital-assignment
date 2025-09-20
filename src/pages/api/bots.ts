import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const OPENMIC_API_KEY = process.env.OPENMIC_API_KEY;
  const API_URL = process.env.NEXT_PUBLIC_OPENMIC_API_URL;

  if (!OPENMIC_API_KEY || !API_URL) {
    return res.status(500).json({ error: 'API key or URL is not configured' });
  }

  const headers = {
    'Authorization': `Bearer ${OPENMIC_API_KEY}`,
    'Content-Type': 'application/json',
  };

  if (req.method === 'GET') {
    try {
      const response = await fetch(`${API_URL}/bots`, { headers, cache: 'no-store' });
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenMic GET Error:", errorBody);
        throw new Error(`API Error: ${response.statusText}`);
      }
      const openMicData = await response.json();
      const formattedData = { data: openMicData.bots || [] };
      res.status(200).json(formattedData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  else if (req.method === 'POST') {
    try {
      const response = await fetch(`${API_URL}/bots`, {
        method: 'POST',
        headers,
        body: JSON.stringify(req.body),
      });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      const data = await response.json();
      res.status(201).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  else if (req.method === 'PUT') {
    try {
      const { botId, name, prompt } = req.body;
      if (!botId || !name || !prompt) return res.status(400).json({ error: 'Bot ID, name, and prompt are required' });
      
      const response = await fetch(`${API_URL}/bots/${botId}`, {
        method: 'PATCH', // Changed from 'PUT' to 'PATCH'
        headers,
        body: JSON.stringify({ name, prompt }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("OpenMic PATCH Error:", errorBody);
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  else if (req.method === 'DELETE') {
    try {
      const { botId } = req.body;
      if (!botId) return res.status(400).json({ error: 'Bot ID is required' });
      const response = await fetch(`${API_URL}/bots/${botId}`, { method: 'DELETE', headers });
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      res.status(200).json({ message: 'Bot deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

