import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  title: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}

export function KpiCard({ title, value, delta, icon }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-white/80">
          {icon}
          {title}
        </CardTitle>
        {delta && <span className="text-xs text-emerald-300">{delta}</span>}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
