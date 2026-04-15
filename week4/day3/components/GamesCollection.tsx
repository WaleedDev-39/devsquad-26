"use client";
import React from "react";
import { useGameStore } from "@/store/useGameStore";

const GamesCollection = () => {
  const topGames = useGameStore((state) => state.topGames);
  const bestGames = useGameStore((state) => state.bestGames);
  const upcomingGames = useGameStore((state) => state.upcomingGames);
  return (
    <div>
      <div className="lg:px-[181px] md:px-[60px] px-[20px] mt-[77px]">
        <div className="grid grid-cols-3 gap-5">
          {/* top games section */}
          <div className="pl-5">
            <div className="flex md:flex-row flex-col justify-between gap-1 text-[10px] text-center">
              <h4>Top Sellers</h4>
              <a href="" className="border rounded-[4px] px-2 py-1 whitespace-nowrap">
                view more
              </a>
            </div>
            {/* games card */}
            <div className="flex flex-col gap-2 mt-[22px]">
              {topGames.map((card) => (
                <div key={card.id}>
                  <div className="flex md:flex-row flex-col md:gap-4 gap-1 items-center">
                    <img src={card.image} alt="game_preview" />
                    <div>
                      <h5 className="md:block hidden">{card.name}</h5>
                      <p>{card.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* best games section */}
          <div className="border-l border-white/10 pl-5">
            <div className="flex md:flex-row flex-col justify-between gap-1 text-[10px] text-center">
              <h4>Best Seller</h4>
              <a href="" className="border rounded-[4px] px-2 py-1 whitespace-nowrap">
                view more
              </a>
            </div>
            {/* games card */}
            <div className="flex flex-col gap-2 mt-[22px]">
              {bestGames.map((card) => (
                <div key={card.id}>
                  <div className="flex md:flex-row flex-col md:gap-4 gap-1 items-center">
                    <img src={card.image} alt="game_preview" />
                    <div>
                      <h5 className="md:block hidden">{card.name}</h5>
                      <p>{card.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* upcoming games section */}
          <div className="border-l border-white/10 pl-5">
            <div className="flex md:flex-row flex-col justify-between gap-1 text-[10px] text-center">
              <h4 className="whitespace-nowrap line-clamp-1">Top Upcoming game</h4>
              <a href="" className="border rounded-[4px] px-2 py-1 whitespace-nowrap">
                view more
              </a>
            </div>
            {/* games card */}
            <div className="flex flex-col gap-2 mt-[22px]">
              {upcomingGames.map((card) => (
                <div key={card.id}>
                  <div className="flex md:flex-row flex-col md:gap-4 gap-1 items-center">
                    <img src={card.image} alt="game_preview" />
                    <div>
                      <h5 className="md:block hidden">{card.name}</h5>
                      <p>{card.price}</p>
                    </div>
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

export default GamesCollection;
