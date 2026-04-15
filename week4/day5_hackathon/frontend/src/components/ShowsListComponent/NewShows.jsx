import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigation, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import API from "../../api";

const NewShows = () => {
  const [catData, setCatData] = useState([]);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await API.get("/movies", { params: { type: "show", limit: 10 } });
        if (data.success) {
          setCatData(data.movies);
        }
      } catch (error) {
        console.error("Failed to fetch shows:", error);
      }
    };
    fetchShows();
  }, []);
  return (
    <div className=" ">
      <div className="flex justify-between items-center py-5 lg:px-10 px-2 mt-10">
        <div>
          <h4 className="lg:text-[38px] text-[24px] lg:font-bold ">
            New Released Shows
          </h4>
        </div>

        <div className="md:block hidden">
          <div className="flex justify-center items-center gap-2 bg-black px-2 rounded-lg py-2">
            <div className="prevBtn-NewShows bg-[#202020] p-1 cursor-pointer transition-all rounded-sm">
              <ArrowLeft size={24} />
            </div>
            <div className="nextBtn-NewShows bg-[#202020] p-1 cursor-pointer transition-all rounded-sm ">
              <ArrowRight size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="lg:px-10 px-2">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            nextEl: ".nextBtn-NewShows",
            prevEl: ".prevBtn-NewShows",
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
            <SwiperSlide key={card._id || idx}>
              <Link to={`/watch/${card._id || card.id}`}>
                <div className="bg-[#1A1A1A] border border-[#262626] lg:p-[30px] p-2 rounded-lg cursor-pointer hover:border-[#333] transition-colors">
                  <div>
                    <div className="overflow-hidden rounded-lg">
                      <img 
                        src={card.thumbnail || card.image} 
                        alt={card.title} 
                        className="w-full h-[200px] object-cover"
                      />
                    </div>
                    <div className="mt-3">
                      <h5 className="text-white font-semibold truncate">{card.title}</h5>
                    </div>
                    <div className="flex justify-between items-center bg-[#141414] border border-[#262626] rounded-full lg:mt-5 mt-2 lg:px-4 px-2 py-2">
                      <div className="lg:text-[14px] text-[9px] whitespace-nowrap text-[#999999]">
                        <span className="lg:text-[13px] text-[8px]">Released Year </span>
                        {card.releaseYear || card.time}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NewShows;
