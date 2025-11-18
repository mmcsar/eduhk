import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck, MapPin, DollarSign, Shield } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              {t('hero.title', { default: 'Transforming Transport in Africa' })}
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              {t('hero.subtitle', {
                default:
                  'The leading platform connecting mines, brokers, and transporters across the African corridor',
              })}
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary">
                  {t('hero.dashboard', { default: 'Access Dashboard' })}
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  {t('hero.marketplace', { default: 'Explore Marketplace' })}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('features.title', { default: 'Why Choose TMSA?' })}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<MapPin className="w-10 h-10 text-blue-600" />}
              title={t('features.tracking.title', { default: 'Real-time Tracking' })}
              description={t('features.tracking.desc', {
                default: 'Track your cargo across borders with GPS precision',
              })}
            />
            <FeatureCard
              icon={<Truck className="w-10 h-10 text-blue-600" />}
              title={t('features.marketplace.title', { default: 'Marketplace' })}
              description={t('features.marketplace.desc', {
                default: 'Connect cargo owners with available trucks',
              })}
            />
            <FeatureCard
              icon={<DollarSign className="w-10 h-10 text-blue-600" />}
              title={t('features.payments.title', { default: 'Secure Payments' })}
              description={t('features.payments.desc', {
                default: 'Integrated mobile money and international payments',
              })}
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-blue-600" />}
              title={t('features.security.title', { default: 'Verified Network' })}
              description={t('features.security.desc', {
                default: 'All participants verified and insured',
              })}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('cta.title', { default: 'Ready to Transform Your Transport Operations?' })}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('cta.subtitle', { default: 'Join thousands of transport professionals across Africa' })}
          </p>
          <Link href="/auth/register">
            <Button size="lg">
              {t('cta.button', { default: 'Get Started Free' })}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">TMSA</h3>
              <p className="text-gray-400">
                {t('footer.tagline', { default: 'Connecting Africa through transport' })}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.product', { default: 'Product' })}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/marketplace">Marketplace</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.company', { default: 'Company' })}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.legal', { default: 'Legal' })}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2024 TMSA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
