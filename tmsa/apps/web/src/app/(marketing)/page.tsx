import { Activity, CreditCard, LocateIcon, Map } from 'lucide-react';
import { Hero } from '@/components/marketing/Hero';
import { KpiCard } from '@/components/charts/KpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const missionSample = [
  { corridor: 'SN-KG', progress: 82, status: 'en_route' },
  { corridor: 'CD-ZA', progress: 46, status: 'assigned' },
  { corridor: 'GH-NG', progress: 100, status: 'delivered' },
];

export default function MarketingHome() {
  return (
    <div className="space-y-6">
      <Hero />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Avg SLA" value="97.9%" delta="+1.2%" icon={<Activity className="h-4 w-4 text-emerald-300" />} />
        <KpiCard title="Missions" value="182" delta="+32 this week" icon={<Map className="h-4 w-4 text-sky-300" />} />
        <KpiCard title="Drivers online" value="412" delta="+54" icon={<LocateIcon className="h-4 w-4 text-amber-300" />} />
        <KpiCard title="Payments" value="$2.4M" delta="settled / 24h" icon={<CreditCard className="h-4 w-4 text-fuchsia-300" />} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Live missions</CardTitle>
            <Button variant="ghost" className="text-xs uppercase">
              View board
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {missionSample.map((mission) => (
              <div key={mission.corridor} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Corridor {mission.corridor}</span>
                  <span className="uppercase text-xs text-white/50">{mission.status}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${mission.progress}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Marketplace snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>New tenders (24h)</span>
              <strong>68</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Verified fleets</span>
              <strong>312</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Lead time</span>
              <strong>2.8 hrs</strong>
            </div>
            <Button variant="outline" className="w-full">
              Open marketplace
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
