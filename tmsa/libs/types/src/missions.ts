export type MissionStatus =
  | 'created'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'delivered'
  | 'exception';

export interface MissionStop {
  code: string;
  name: string;
  country: string;
  eta: string;
  etd?: string;
  geo: {
    lat: number;
    lng: number;
  };
}

export interface ProofOfDelivery {
  signedBy: string;
  signatureUrl?: string;
  documents: string[];
  capturedAt: string;
  notes?: string;
}

export interface Mission {
  id: string;
  reference: string;
  status: MissionStatus;
  lane: string;
  cargoType: string;
  vehiclePlate: string;
  trailerPlate?: string;
  driverId: string;
  brokerId: string;
  checkpoints: MissionStop[];
  pod?: ProofOfDelivery;
  lastKnownLocationId?: string;
  updatedAt: string;
}
