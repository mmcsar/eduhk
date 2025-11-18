'use client';

import { motion } from 'framer-motion';

interface Marker {
  lat: number;
  lng: number;
  label: string;
}

interface Props {
  markers: Marker[];
}

export default function MapPanel({ markers }: Props) {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.08),_transparent_55%)]" />
      {markers.map((marker) => (
        <motion.div
          key={marker.label}
          className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/90 text-[10px] font-semibold text-black shadow-lg"
          style={{
            top: `${50 + marker.lat}%`,
            left: `${50 + marker.lng / 5}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          {marker.label}
        </motion.div>
      ))}
      <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/80">
        Websocket latency &lt; 350ms
      </div>
    </div>
  );
}
