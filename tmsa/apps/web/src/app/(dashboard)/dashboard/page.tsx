import { Suspense } from 'react';
import { Activity, Satellite, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const alerts = [
  { id: 1, type: 'Off route', corridor: 'Lobito -> Kolwezi', age: '3m', severity: 'high' },
  { id: 2, type: 'Idle 45min', corridor: 'Matadi -> Kinshasa', age: '8m', severity: 'medium' },
];

function MissionStreams() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission streams</CardTitle>
        <Button variant="ghost" className="text-xs uppercase">
          Stream logs
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl bg-black/20 p-4">
          <code className="text-xs text-emerald-300">
            {`mission.8263.status -> en_route @ 2025-11-18T06:33Z`}
          </code>
        </div>
        <div className="rounded-2xl bg-black/20 p-4">
          <code className="text-xs text-sky-300">driver.211.lat -> -4.3171, 15.2905</code>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="h-4 w-4 text-cyan-300" />
              Corridor coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">12</p>
            <p className="text-xs text-white/60">corridors monitored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">99.1%</p>
            <p className="text-xs text-white/60">documents validated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-300" />
              Latency budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">320 ms</p>
            <p className="text-xs text-white/60">websocket RTT</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Security alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p className="font-semibold">{alert.type}</p>
                  <p className="text-xs text-white/60">{alert.corridor}</p>
                </div>
                <div className="text-right text-xs uppercase text-white/60">
                  <p>{alert.age} ago</p>
                  <p>{alert.severity}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Suspense fallback={<Card><CardContent>Loading mission stream…</CardContent></Card>}>
          <MissionStreams />
        </Suspense>
      </section>
    </div>
  );
}
