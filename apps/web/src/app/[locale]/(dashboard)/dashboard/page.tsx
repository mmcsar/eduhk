import { useTranslations } from 'next-intl';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentMissions } from '@/components/dashboard/recent-missions';
import { MissionChart } from '@/components/dashboard/mission-chart';

export default function DashboardPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {t('title', { default: 'Dashboard' })}
        </h1>
        <p className="text-gray-600">
          {t('subtitle', { default: 'Overview of your operations' })}
        </p>
      </div>

      <StatsCards />
      
      <div className="grid lg:grid-cols-2 gap-6">
        <MissionChart />
        <RecentMissions />
      </div>
    </div>
  );
}
