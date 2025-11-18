import { useTranslations } from 'next-intl';
import { TrackingMap } from '@/components/tracking/tracking-map';

export default function TrackingPage() {
  const t = useTranslations('tracking');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {t('title', { default: 'Live Tracking' })}
        </h1>
        <p className="text-gray-600">
          {t('subtitle', { default: 'Monitor your fleet in real-time' })}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: 'calc(100vh - 250px)' }}>
        <TrackingMap />
      </div>
    </div>
  );
}
