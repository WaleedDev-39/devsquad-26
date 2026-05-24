// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { popularMoviesData } from "../../../data";

const PopularMovies = () => {
  const catData = [...popularMoviesData, ...popularMoviesData, ...popularMoviesData];
  return (
    <div className=" ">
      <div className="flex justify-between items-center mt-10 py-5 lg:px-10 px-2">
        <div>
          <h4 className="lg:text-[38px] text-[24px] lg:font-bold ">
            Popular Top 10 In Genres
          </h4>
        </div>

        <div className="md:block hidden">
          <div className="flex justify-center items-center gap-2 bg-black px-2 rounded-lg py-2">
            <div className="prevBtn-PopularMovies bg-[#202020] p-1 cursor-pointer transition-all rounded-sm">
              <ArrowLeft size={24} />
            </div>
            <div className="nextBtn-PopularMovies bg-[#202020] p-1 cursor-pointer transition-all rounded-sm ">
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
            nextEl: ".nextBtn-PopularMovies",
            prevEl: ".prevBtn-PopularMovies",
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
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col ">
                      <div className=" bg-[#E50000] border lg:text-[10px] text-[8px] border-black px-2 py-1 rounded-lg">
                        Top 10 in
                      </div>
                      <div className="lg:text-[14px] text-[10px]">{card.title}</div>
                    </div>
                    <ArrowRight />
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

export default PopularMovies;
