"use client";
import { useParams } from "next/navigation";
import { useGameStore } from "@/store/useGameStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const GameDetail = () => {
  const { id } = useParams();
  
  const swiperCards = useGameStore((state) => state.swiperCards);
  const premiumGames = useGameStore((state) => state.premiumGames);
  const freeGames = useGameStore((state) => state.freeGames);
  const topGames = useGameStore((state) => state.topGames);
  const bestGames = useGameStore((state) => state.bestGames);
  const upcomingGames = useGameStore((state) => state.upcomingGames);
  
  // Combine all sources to find the game
  const allSources: any[] = [
    ...swiperCards,
    ...premiumGames,
    ...freeGames,
    ...topGames,
    ...bestGames,
    ...upcomingGames
  ];
  
  const game = allSources.find((g) => g.id === id);

  if (!game) {
    return (
      <div>
        <Navbar />
        <div className="min-h-[80vh] flex items-center justify-center pt-[100px]">
          <h1 className="text-2xl text-white/60">Game not found or currently loading...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="lg:px-[181px] md:px-[60px] px-[20px] py-10 pt-[120px] min-h-[80vh]">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <img src={game.image} alt={game.name} className="w-full rounded-[10px] shadow-lg" />
          </div>
          <div className="flex flex-col justify-start gap-5 py-5">
            <h1 className="text-4xl font-bold">{game.name}</h1>
            {game.desc && <p className="text-lg text-white/70 leading-relaxed">{game.desc}</p>}
            
            <div className="flex items-center gap-4 mt-4 text-xl bg-[#202020] p-5 rounded-lg w-max">
              {game.discount && (
                <span className="bg-[#0074E4] px-3 py-1 rounded text-white text-sm font-semibold">{game.discount}</span>
              )}
              {game.actualPrice && (
                <span className="line-through text-white/50 text-base">{game.actualPrice}</span>
              )}
              <span className="font-bold text-[28px]">{game.price || game.discountedPrice || "Free"}</span>
            </div>
            
            <button className="bg-[#0074E4] text-white py-4 px-10 rounded-[4px] mt-8 font-bold hover:bg-blue-600 transition-colors w-full md:w-max uppercase tracking-wider">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GameDetail;
