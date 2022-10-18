export interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  rsvp: boolean;
  rsvpCeremony: boolean;
  rsvpReception: boolean;
};

export interface Invitation {
  id: number;
  userCode: string;
  guests: Guest[];
  notes: string;
};