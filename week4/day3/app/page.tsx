import AchievmentGamesSlider from "@/components/AchievmentGamesSlider";
import Catalogue from "@/components/Catalogue";
import Footer from "@/components/Footer";
import FreeGames from "@/components/FreeGames";
import GamesCollection from "@/components/GamesCollection";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";
import PremiumGames from "@/components/PremiumGames";
import SalesGamesSlider from "@/components/SalesGamesSlider";

const page = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <SalesGamesSlider/>
      <PremiumGames/>
      <FreeGames/>
      <GamesCollection/>
      <PremiumGames/>
      <AchievmentGamesSlider/>
      <Catalogue/>
      <Footer/>
    </div>
  );
};

export default page;
