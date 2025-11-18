import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin MMC</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-white/80">
          <p>Multi-market control with RBAC and audit-ready exports.</p>
          <Button className="rounded-full">Launch MMC</Button>
        </CardContent>
      </Card>
    </div>
  );
}
