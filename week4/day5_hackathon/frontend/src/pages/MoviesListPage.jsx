import {
  ArrowLeft,
  ArrowRight,
  Play,
  Plus,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import React from "react";
import OurGenres from "../components/MoviesListComponents/OurGenres";
import PopularMovies from "../components/MoviesListComponents/PopularMovies";
import TrendingMovies from "../components/MoviesListComponents/TrendingMovies";
import NewMovies from "../components/MoviesListComponents/NewMovies";
import MustMovies from "../components/MoviesListComponents/MustMovies";
import TrendingShows from "../components/ShowsListComponent/TrendingShows";
import NewShows from "../components/ShowsListComponent/NewShows";
import MustShows from "../components/ShowsListComponent/MustShows";
import TrialBox from "../components/TrialBox";
import Footer from "../components/Footer";
import { useState } from "react";
import { useEffect } from "react";

const MoviesListPage = () => {
  const [activeTab, setActiveTab] = useState("movies");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="">
      <div className="lg:px-10 px-2 text-white mt-10">
        <div className="bg-[url('/assets/avengers-img.png')] bg-cover bg-center bg-no-repeat pt-50 pb-5 rounded-lg ">
          <div className="flex flex-col items-center text-center gap-6">
            <h5 className="lg:text-[38px] text-[24px] font-bold">
              Avengers : Endgame
            </h5>
            <p className="text-[#999999] lg:text-[18px] text-[14px] lg:block hidden">
              With the help of remaining allies, the Avengers must assemble once
              more in order to undo Thanos's actions and undo the chaos to the
              universe, no matter what consequences may be in store, and no
              matter who they face... Avenge the fallen.
            </p>
            {/* buttons */}
            <div className="flex lg:flex-row flex-col gap-5 items-center">
              <a
                href=""
                className=" bg-[#E50000]  hover:bg-red-700 border transition-all border-black px-3 py-2.5 rounded-lg flex items-center gap-2"
              >
                <Play fill="white" />
                Play Now
              </a>
              <div className="flex items-center gap-2">
                <div className="bg-[#0F0F0F] hover:bg-black transition-all p-2 border border-[#262626] rounded-md cursor-pointer">
                  <Plus />
                </div>
                <div className="bg-[#0F0F0F] hover:bg-black transition-all p-2 border border-[#262626] rounded-md cursor-pointer">
                  <ThumbsUp />
                </div>
                <div className="bg-[#0F0F0F] hover:bg-black transition-all p-2 border border-[#262626] rounded-md cursor-pointer">
                  <Volume2 />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-between w-full px-10 mt-5">
              <div className="prevBtn bg-[#0F0F0F] border border-[#1f1f1f] p-1 cursor-pointer transition-all rounded-sm">
                <ArrowLeft size={24} />
              </div>
              <div className="nextBtn bg-[#0F0F0F] border border-[#1f1f1f] p-1 cursor-pointer transition-all rounded-sm ">
                <ArrowRight size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* category selection buttons for mobile */}
      {isMobile && (
        <div className="grid grid-cols-2 justify-center items-center rounded-lg gap-2 mt-20 mx-2 px-2 py-2 bg-[#0F0F0F] border border-[#262626] ">
          <a
            onClick={() => setActiveTab("movies")}
            className={` text-[14px] text-center transition-colors ${
              activeTab === "movies"
                ? "text-white bg-[#1F1F1F] py-4 rounded-lg"
                : "text-[#999999]"
            }`}
          >
            Movies
          </a>
          <a
            onClick={() => setActiveTab("shows")}
            className={`text-[14px] text-center transition-colors ${
              activeTab === "shows"
                ? "text-white bg-[#1F1F1F] py-4 rounded-lg"
                : "text-[#999999]"
            }`}
          >
            Shows
          </a>
        </div>
      )}

      {/* movies section */}
      <div
        className={`relative lg:mx-10 mx-2 px-2 lg:mt-40 mt-12 lg:border border-[#262626] rounded-md ${
          isMobile && activeTab !== "movies" ? "hidden" : "block"
        }`}
      >
        <a
          href=""
          className="lg:block hidden bg-[#E50000]  hover:bg-red-700 border transition-all border-black px-3 py-2 rounded-lg absolute -top-5 left-12"
        >
          Movies
        </a>
        <OurGenres />
        <PopularMovies />
        <TrendingMovies />
        <NewMovies />
        <MustMovies />
      </div>

      <div
        className={`relative lg:mx-10 mx-2 px-2 lg:mt-30 mt-12 lg:border border-[#262626] rounded-md ${
          isMobile && activeTab !== "shows" ? "hidden" : "block"
        }`}
      >
        <a
          href=""
          className=" lg:block hidden bg-[#E50000]  hover:bg-red-700 border transition-all border-black px-3 py-2 rounded-lg absolute -top-5 left-12"
        >
          Shows
        </a>
        <OurGenres />
        <PopularMovies />
        <TrendingShows />
        <NewShows />
        <MustShows />
      </div>

      <div className="lg:px-10 px-2">
        <TrialBox />
      </div>

      <Footer />
    </div>
  );
};

export default MoviesListPage;
