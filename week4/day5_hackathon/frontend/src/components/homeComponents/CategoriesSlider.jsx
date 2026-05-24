"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { categoriesData } from "../../../data";

const CategoriesSlider = () => {
  const catData = categoriesData;
  return (
    <div className=" ">
      <div className="flex justify-between items-center py-5 lg:px-10 px-2">
        <div>
          <h4 className="lg:text-[38px] text-[24px] lg:font-bold ">
            Explore our wide variety of categories
          </h4>
          <p className="text-[#999999] lg:text-[18px] text-[14px]">
            Whether you're looking for a comedy to make you laugh, a drama to
            make you think, or a documentary to learn something new
          </p>
        </div>

        <div className="md:block hidden">
          <div className="flex justify-center items-center gap-2 bg-black px-2 rounded-lg py-2">
            <div className="prevBtn-CategoriesSlider bg-[#202020] p-1 cursor-pointer transition-all rounded-sm">
              <ArrowLeft size={24} />
            </div>
            <div className="nextBtn-CategoriesSlider bg-[#202020] p-1 cursor-pointer transition-all rounded-sm ">
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
            nextEl: ".nextBtn-CategoriesSlider",
            prevEl: ".prevBtn-CategoriesSlider",
          }}
          pagination={{ clickable: true }}
          loop={true}
          breakpoints={{
            // Responsive breakpoints
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {catData.map((card) => (
            <SwiperSlide key={card.id}>
              <div className="bg-[#262626] lg:p-[30px] p-3 rounded-lg">
                <div>
                  <div>
                    <img src={card.image} alt="image" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-[14px]">{card.title}</div>
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

export default CategoriesSlider;
