export interface DeviceLocation {
  id: string;
  missionId?: string;
  driverId?: string;
  vehicleId?: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  recordedAt: string;
  corridor?: string;
}

export interface CorridorAlert {
  id: string;
  missionId: string;
  alertType: 'off_route' | 'idle' | 'geofence' | 'speed';
  severity: 'low' | 'medium' | 'high';
  description: string;
  createdAt: string;
}
