import { Search } from "lucide-react";

const HeroSection = () => {
  return (
    <div>
      <div className="lg:px-[181px] md:px-[60px] px-[20px] text-[12px]">
        <div className="py-5 flex md:flex-row flex-col  items-center gap-5">
          <div className="relative flex gap-2 items-center bg-[#202020] px-3 py-2 rounded-full md:w-auto w-full">
            <Search size={14} color="#A0A0A0" />
            <input
              type="text"
              placeholder="Search Store"
              className="outline-none  text-[#A0A0A0] w-full"
            />
          </div>
          <div className="md:flex hidden gap-5">
            <a href="" className="text-white ">
              Discover
            </a>
            <a href="" className="text-white ">
              Browse
            </a>
            <a href="" className="text-white ">
              News
            </a>
          </div>
        </div>
        {/* hero image */}
        <div className="grid lg:grid-cols-2 grid-cols-1 lg:grid-cols-[80%_20%] gap-5">
          <div className="">
            <img
              src="./assets/hero_img.png"
              alt="game-preview"
              className="rounded-[20px]"
            />
          </div>
          {/* small images slider */}
          <div className="flex lg:flex-col justify-around items-start gap-5 ">
            <div className="flex justify-start items-center gap-2">
              <img src="./assets/hero_preview_1.png" alt="" />
              <p className="lg:block hidden">God of War 4</p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <img src="./assets/hero_preview_2.png" alt="" />
              <p className="w-1/2 lg:block hidden">Farcry 6 Golden Edition</p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <img src="./assets/hero_preview_3.png" alt="" />
              <p className="lg:block hidden">GTA V</p>
            </div>
            <div className="flex justify-start items-center gap-2">
              <img src="./assets/hero_preview_4.png" alt="" />
              <p className="lg:block hidden">Outlast 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
