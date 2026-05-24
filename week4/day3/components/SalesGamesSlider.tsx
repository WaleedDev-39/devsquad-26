"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";
import { Navigation } from "swiper/modules";

const SalesGamesSlider = () => {
  const swiperCards = useGameStore((state) => state.swiperCards);
  return (
    <div className="lg:px-[181px] md:px-[60px] px-[20px]">
      <div className="flex justify-between py-5">
        <h5 className="flex items-center gap-1">
          Game on sale <ChevronRight size={10} />
        </h5>
        <div className="flex items-center gap-2">
          <div className="prevBtn bg-[#202020] rounded-full p-0.5 cursor-pointer text-[#f5f5f5]/50 hover:text-[#f5f5f5] transition-all ">
            <ChevronLeft size={12} />
          </div>
          <div className="nextBtn bg-[#202020] rounded-full p-0.5 cursor-pointer text-[#f5f5f5]/50 hover:text-[#f5f5f5] transition-all ">
            <ChevronRight size={12} />
          </div>
        </div>
      </div>

      {/* swiper code */}
      <Swiper
        modules={[Navigation]}
        spaceBetween={30}
        slidesPerView={3}
        navigation={{
          nextEl: ".nextBtn",
          prevEl: ".prevBtn",
        }}
      >
        {swiperCards.map((card) => (
          <SwiperSlide key={card.id}>
            <div className="flex flex-col justify-center">
              <div>
                <img src={card.image} alt="game_preview" />
              </div>
              <div className="my-[10px] line-clamp-1">{card.name}</div>
              <div className="flex md:flex-row flex-col items-center  gap-2">
                <p className="bg-[#0074E4] inline px-2 rounded-[4px]">
                  {card.discount}
                </p>
                <p className="line-through text-[#F5F5F5]/60">
                  {card.actualPrice}
                </p>
                <p>{card.discountedPrice}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SalesGamesSlider;
