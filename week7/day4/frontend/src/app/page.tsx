import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroBanner from '@/components/home/HeroBanner';
import NewArrivals from '@/components/home/NewArrivals';
import SummerMood from '@/components/home/SummerMood';
import TopSneakers from '@/components/home/TopSneakers';
import BuyByCategory from '@/components/home/BuyByCategory';
import DiscountSection from '@/components/home/DiscountSection';
import MembershipSection from '@/components/home/MembershipSection';
import GlorySection from '@/components/home/GlorySection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <NewArrivals />
        <SummerMood />
        <TopSneakers />
        <BuyByCategory />
        <DiscountSection />
        <MembershipSection />
        <GlorySection />
      </main>
      <Footer />
    </>
  );
}
