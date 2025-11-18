import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const offers = [
  { id: 'RG-772', cargo: 'Copper cathodes', load: 'Kolwezi', unload: 'Durban', rate: '$2.4/km' },
  { id: 'RG-811', cargo: 'Lithium ore', load: 'Manono', unload: 'Matadi', rate: '$2.1/km' },
];

export default function MarketplacePage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Live tenders</CardTitle>
          <Button variant="ghost" className="text-xs uppercase">
            Publish load
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {offers.map((offer) => (
            <div key={offer.id} className="flex flex-wrap items-center justify-between rounded-2xl bg-white/5 p-4 text-sm text-white/80">
              <div>
                <p className="text-white">{offer.cargo}</p>
                <p className="text-xs">{offer.load} → {offer.unload}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{offer.rate}</p>
                <Button size="sm" className="mt-2">
                  Bid now
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
