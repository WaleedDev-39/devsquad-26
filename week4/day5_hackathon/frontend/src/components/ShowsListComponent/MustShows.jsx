// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ArrowLeft, ArrowRight, Clock, Star } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { mustWatchShowsData } from "../../../data";

const MustShows = () => {
  const catData = [...mustWatchShowsData, ...mustWatchShowsData, ...mustWatchShowsData];
  return (
    <div className=" ">
      <div className="flex justify-between items-center py-5 lg:px-10 px-2 mt-10">
        <div>
          <h4 className="lg:text-[38px] text-[24px] lg:font-bold ">
            Must - Watch Shows
          </h4>
          {/* <p className="text-[#999999] lg:text-[18px] text-[14px]">
            Whether you're looking for a comedy to make you laugh, a drama to
            make you think, or a documentary to learn something new
          </p> */}
        </div>

        <div className="md:block hidden">
          <div className="flex justify-center items-center gap-2 bg-black px-2 rounded-lg py-2">
            <div className="prevBtn-MustShows bg-[#202020] p-1 cursor-pointer transition-all rounded-sm">
              <ArrowLeft size={24} />
            </div>
            <div className="nextBtn-MustShows bg-[#202020] p-1 cursor-pointer transition-all rounded-sm ">
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
            nextEl: ".nextBtn-MustShows",
            prevEl: ".prevBtn-MustShows",
          }}
          pagination={{ clickable: true }}
          loop={true}
          loopAddBlankSlides={4}
          breakpoints={{
            // Responsive breakpoints
            320: {
              slidesPerView: 1.5,
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
                    <div className="flex items-center lg:gap-1 lg:text-[10px] text-[8px] whitespace-nowrap bg-[#141414] border border-[#262626] lg:px-2 px-1 py-1 rounded-full">
                      <Clock size={12} /> {card.duration}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] bg-[#141414] border border-[#262626] px-2 py-1 rounded-full">
                      <span className="flex">
                        <Star size={12} fill="red" stroke="red" />
                        <Star size={12} fill="red" stroke="red" />
                        <Star size={12} fill="red" stroke="red" />
                        <Star size={12} fill="red" stroke="red" />
                        <Star size={12} fill="#999999" stroke="#999999" />
                      </span>{" "}
                      {card.reviews}
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

export default MustShows;
