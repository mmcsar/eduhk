import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function MissionsPage() {
  const t = useTranslations('missions');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {t('title', { default: 'Missions' })}
          </h1>
          <p className="text-gray-600">
            {t('subtitle', { default: 'Manage your transport missions' })}
          </p>
        </div>
        <Link href="/missions/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('new', { default: 'New Mission' })}
          </Button>
        </Link>
      </div>

      {/* Mission list component will go here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">{t('empty', { default: 'No missions yet' })}</p>
      </div>
    </div>
  );
}
