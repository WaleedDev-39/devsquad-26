import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../api/api";

const collectionImages = {
  "Black Tea": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop",
  "Green Tea": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=300&fit=crop",
  "White Tea": "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop",
  "Matcha": "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=300&fit=crop",
  "Herbal Tea": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&h=300&fit=crop",
  "Chai": "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400&h=300&fit=crop",
  "Oolong": "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&h=300&fit=crop",
  "Rooibos": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop",
  "Teaware": "https://images.unsplash.com/photo-1530968033775-2c92736b131e?w=400&h=300&fit=crop",
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await productAPI.getCategories();
        setCategories(data.categories);
      } catch (err) {
        console.error(err);
        setCategories(["Black Tea", "Green Tea", "White Tea", "Matcha", "Herbal Tea", "Chai", "Oolong", "Rooibos", "Teaware"]);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            {/* Image Left */}
            <div className="w-full md:w-1/2">
              <img
                src="./hero_img.png"
                alt="Premium tea collection"
                className="w-full h-[400px] md:h-[600px] lg:h-[700px] object-cover"
              />
            </div>
            {/* Text Right */}
            <div className="w-full md:w-1/2 px-8 py-16 md:px-16 lg:px-24 flex flex-col justify-center items-center">
              <div className="flex flex-col gap-5">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gray-900 leading-tight mb-6">
                  Every day is unique,<br />just like our tea
                </h1>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-10 max-w-md">
                  Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
                  Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus adipiscing odio. Neque lacus nibh eros in.
                </p>
                <div>
                  <Link
                    to="/collections"
                    className="inline-block bg-gray-900 text-white px-10 py-4 text-sm  tracking-[0.2em] hover:bg-gray-800 transition-colors no-underline uppercase  mx-auto"
                  >
                   
                      BROWSE TEAS
                
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-gray-50 py-6 mt-10">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
            {[
              { icon: "⛾", text: "450+ KIND OF LOOSE TEA" },
              { icon: <img src="./redeem.png" alt="" />, text: "CERTIFICATED ORGANIC TEAS" },
              { icon: "⛟", text: "FREE DELIVERY" },
              { icon: "🏷", text: "SAMPLE FOR ALL TEAS" },
            ].map((item) => (
              <div key={item.text} className="flex flex-col items-center gap-3">
                <span className="text-2xl md:text-3xl opacity-80">{item.icon}</span>
                <span className="text-[11px] font-bold tracking-[0.15em] text-gray-900">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn More */}
      <section className="pb-5 bg-gray-50 text-center">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="font-serif text-3xl mb-8">Discover our passion for premium tea</h2>
          <Link
            to="/collections"
            className="inline-block border border-gray-900 text-gray-900 px-10 py-4 text-sm font-bold tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-colors no-underline"
          >
            LEARN MORE
          </Link>
        </div>
      </section>

      {/* Our Collections */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">Our Collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {(categories.length ? categories : Object.keys(collectionImages)).slice(0, 9).map((cat) => (
              <Link
                key={cat}
                to={`/collections?category=${encodeURIComponent(cat)}`}
                className="group no-underline flex flex-col items-center"
              >
                <div className="overflow-hidden w-full aspect-square bg-gray-50 mb-6">
                  <img
                    src={collectionImages[cat] || "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=600&fit=crop"}
                    alt={cat}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                </div>
                <p className="text-center text-sm font-bold tracking-[0.15em] text-gray-900 uppercase">
                  {cat}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
