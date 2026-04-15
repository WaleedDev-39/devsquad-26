"use client";
import { GiftIcon } from "lucide-react";
import { useGameStore } from "@/store/useGameStore";

const FreeGames = () => {
  const cardsData = useGameStore((state) => state.freeGames);
  return (
    <div>
      <div className="lg:px-[181px] md:px-[60px] px-[20px] mt-[54px]">
        <div className="bg-[#2A2A2A] rounded-[4px]">
          <div className="px-[34px] py-[27px]">
            <div className="flex justify-between items-center ">
              <div className="flex md:gap-3 gap-1 items-center md:text-[16px] text-[12px]">
                <GiftIcon size={40} />
                Free Games
              </div>
              <a
                className="border px-2 py-1 md:text-[16px] text-[10px] hover:bg-[#ffff]/40 hover:text-[#ffff] text-shadow-2xs transition-all"
                href=""
              >
                View More
              </a>
            </div>

            {/* free games cards */}

            <div className="grid lg:grid-cols-4 grid-cols-2 gap-10 mt-10">
              {cardsData.map((card) => (
                <div key={card.id}>
                  <div className="flex flex-col gap-2 text-[14px]">
                    <img src={card.image} alt="game_preview" />
                    <h5 className="line-clamp-1">{card.name}</h5>
                    <p className="text-[#AAAAAA] ">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeGames;
