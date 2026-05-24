import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import MarketTrendSection from '@/components/MarketTrendSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Circlechain – Save, Buy and Sell Your Blockchain Asset',
  description: 'The easy way to manage and trade your cryptocurrency assets on the blockchain.',
};

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <MarketTrendSection />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
