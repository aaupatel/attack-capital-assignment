import type { NextApiRequest, NextApiResponse } from 'next';
import { mockPatients } from '../../lib/mock-db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('[IN-CALL] Full request body received:', JSON.stringify(req.body, null, 2));

    const { medicalId } = req.body;

    if (!medicalId) {
      console.error("[IN-CALL] FAILED! 'medicalId' was not found directly in the request body.");
      return res.status(200).json({
        error: "The Medical ID was not provided in the correct format.",
      });
    }

    console.log(`[IN-CALL] Successfully extracted medicalId: ${medicalId}`);

    const patient = mockPatients[medicalId.toUpperCase() as string];

    if (patient) {
      console.log(`[IN-CALL] Found patient: ${patient.name}. Sending allergies: ${patient.allergies}`);
      res.status(200).json({
        allergies: patient.allergies,
      });
    } else {
      console.log(`[IN-CALL] Patient ID "${medicalId}" not found in mock database.`);
      res.status(200).json({
        allergies: `Patient ID ${medicalId} was not found in our records.`,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}