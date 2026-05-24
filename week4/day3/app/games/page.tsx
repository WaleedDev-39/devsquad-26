"use client";
import { useGameStore } from "@/store/useGameStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

const GamesShowcase = () => {
  const topGames = useGameStore((state) => state.topGames);
  const bestGames = useGameStore((state) => state.bestGames);
  const upcomingGames = useGameStore((state) => state.upcomingGames);
  
  // Combine all standard games to show in showcase
  const allGames = [...topGames, ...bestGames, ...upcomingGames];
  
  // Deduplicate by ID just in case
  const uniqueGames = Array.from(new Map(allGames.map(item => [item.id, item])).values());

  return (
    <div>
      <Navbar />
      <div className="lg:px-[181px] md:px-[60px] px-[20px] py-10 pt-[100px] min-h-[80vh]">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Games Showcase</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {uniqueGames.map((game) => (
             <Link href={`/games/${game.id}`} key={`showcase-${game.id}`}>
              <div className="flex flex-col gap-3 cursor-pointer group">
                <div className="overflow-hidden rounded-md">
                  <img 
                    src={game.image} 
                    alt={game.name} 
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                </div>
                <div>
                  <h5 className="font-semibold line-clamp-1 text-[16px]">{game.name}</h5>
                  <p className="text-[#AAAAAA] text-[14px] mt-1">{game.price}</p>
                </div>
              </div>
            </Link>
          ))}
          {uniqueGames.length === 0 && (
            <div className="col-span-full py-20 text-center text-[#AAAAAA]">
              Loading amazing games for you...
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GamesShowcase;
