import type { NextApiRequest, NextApiResponse } from 'next';

const mockUsersByPhone: Record<string, any> = {
  "default": {
    user_name: "John Doe",
    patient_history: "Last visited for a routine check-up.",
    allergies: "Peanuts",
    caseId: "MED123"
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('[PRE-CALL] Request received:', JSON.stringify(req.body, null, 2));

    const fromNumber = req.body.call?.from_number || "default";
    const user = mockUsersByPhone[fromNumber] || mockUsersByPhone["default"];

    if (user) {
      console.log('[PRE-CALL] Found user data. Sending response to OpenMic.');
      
      res.status(200).json({
        call: {
          dynamic_variables: {
            user_name: user.user_name,
            patient_history: user.patient_history
          }
        }
      });
    } else {
      console.error('[PRE-CALL] FAILED! No default user found.');
      res.status(404).json({ error: 'User not found' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}