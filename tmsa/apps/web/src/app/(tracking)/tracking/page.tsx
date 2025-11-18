'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MOCK_COORDINATES = [
  { lat: -1.9577, lng: 30.1127, label: 'Kigali' },
  { lat: -12.365, lng: 13.536, label: 'Lobito' },
  { lat: -4.4419, lng: 15.2663, label: 'Kinshasa' },
];

const Map = dynamic(() => import('@/components/tracking/MapPanel'), { ssr: false });

export default function TrackingPage() {
  const markers = useMemo(() => MOCK_COORDINATES, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Realtime tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <Map markers={markers} />
        </CardContent>
      </Card>
    </div>
  );
}
