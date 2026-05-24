// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ArrowLeft, ArrowRight, Clock, Eye } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { trendingShowsData } from "../../../data";

const TrendingShows = () => {
  const catData = [...trendingShowsData, ...trendingShowsData, ...trendingShowsData];
  return (
    <div className=" ">
      <div className="flex justify-between items-center mt-10 py-5 lg:px-10 px-2">
        <div>
          <h4 className="lg:text-[38px] text-[24px] lg:font-bold ">
            Trending Shows Now
          </h4>
        </div>

        <div className="md:block hidden">
          <div className="flex justify-center items-center gap-2 bg-black px-2 rounded-lg py-2">
            <div className="prevBtn-TrendingShows bg-[#202020] p-1 cursor-pointer transition-all rounded-sm">
              <ArrowLeft size={24} />
            </div>
            <div className="nextBtn-TrendingShows bg-[#202020] p-1 cursor-pointer transition-all rounded-sm ">
              <ArrowRight size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:px-10 px-2">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          navigation={{
            nextEl: ".nextBtn-TrendingShows",
            prevEl: ".prevBtn-TrendingShows",
          }}
          pagination={{ clickable: true }}
          loop={true}
          loopAdditionalSlides={4}
          breakpoints={{
            // Responsive breakpoints
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {catData.map((card, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-[#1A1A1A] border border-[#262626] lg:p-[30px] p-2 rounded-lg">
                <div>
                  <div>
                    <img src={card.image} alt="image" />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[#999999]">
                    <div className="flex items-center lg:gap-1 lg:text-[14px] text-[8px] whitespace-nowrap bg-[#141414] border border-[#262626] px-2 py-1 rounded-full">
                      <Clock size={16} /> {card.duration}
                    </div>
                    <div className="flex items-center lg:gap-1 lg:text-[14px] text-[8px] bg-[#141414] border border-[#262626] px-2 py-1 rounded-full">
                      <Eye size={16} /> {card.views}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default TrendingShows;
