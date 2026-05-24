import { Play } from "lucide-react";
import CategoriesSlider from "../components/homeComponents/CategoriesSlider";
import SupportedDevices from "../components/homeComponents/SupportedDevices";
import FAQs from "../components/homeComponents/FAQs";
import Plans from "../components/homeComponents/Plans";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <div className="relative -top-25 bg-black  text-white overflow-x-clip ">
      <div className="bg-[url('/assets/hero-img.png')] bg-cover bg-center bg-no-repeat h-[100vh] ">
        <div className="bg-black h-screen opacity-30 z-100 overflow-x-hidden"></div>
        <div className=" flex flex-col justify-center items-center ">
          <h3 className="font-bold lg:text-[58px] text-[28px] text-center">
            The Best Streaming Experience
          </h3>
          <p className="w-full text-[#999999] lg:text-[18px] text-[14px] text-center lg:px-30 mb-10 lg:block hidden">
            StreamVibe is the best streaming experience for watching your
            favorite movies and shows on demand, anytime, anywhere. With
            StreamVibe, you can enjoy a wide variety of content, including the
            latest blockbusters, classic movies, popular TV shows, and more. You
            can also create your own watchlists, so you can easily find the
            content you want to watch.
          </p>
          <p className="w-full text-[#999999] lg:text-[18px] text-[14px] text-center lg:px-30 mb-10 lg:hidden block">
            StreamVibe is the best streaming experience for watching your
            favorite movies and shows on demand, anytime, anywhere.
          </p>
          <a
            href=""
            className="flex gap-2 bg-[#E50000]  hover:bg-red-700 border transition-all border-black px-3 py-2 rounded-lg"
          >
            <Play fill="white" />
            Start Watching Now
          </a>
        </div>
        <CategoriesSlider />
        <SupportedDevices />
        <FAQs />
        <Plans />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
