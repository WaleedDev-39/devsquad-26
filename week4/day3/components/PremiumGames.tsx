"use client";
import React from "react";
import { useGameStore } from "@/store/useGameStore";

const PremiumGames = () => {
  const cardsData = useGameStore((state) => state.premiumGames);
  return (
    <div className="lg:px-[181px] md:px-[60px] px-[20px] mt-[88px]">
      <div className="grid grid-cols-1 md:grid-cols-[33%_33%_33%] gap-2">
        {cardsData.map((card) => (
          <div key={card.id} className="flex flex-col justify-center gap-[7px]">
            <img src={card.image} alt="game_preview" />
            <h5 className="mt-2">{card.name}</h5>
            <p className="text-white/60 text-[14px] tracking-tigh">{card.desc}</p>
            <p>{card.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumGames;
