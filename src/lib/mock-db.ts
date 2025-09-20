export interface Patient {
  name: string;
  history: string;
  allergies: string;
}

export const mockPatients: Record<string, Patient> = {
  "MED123": {
    name: "John Doe",
    history: "Last visited for a routine check-up. No major issues.",
    allergies: "Peanuts",
  },
  "MED456": {
    name: "Jane Smith",
    history: "Follow-up for seasonal allergies.",
    allergies: "None",
  },
  "MAD123": {
    name: "John Doe (Test Entry)",
    history: "Test history for MAD123.",
    allergies: "Penicillin",
  },
};

export let callLogs: any[] = [];