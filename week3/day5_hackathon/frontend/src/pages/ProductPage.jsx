import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { productAPI, cartAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { FiMinus, FiPlus, FiGlobe, FiAward, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

const ProductPage = ({ onCartOpen, setCart }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getProduct(id);
        setProduct(data.product);
        setVariants(data.variants);
        if (data.variants.length > 0) setSelectedVariant(data.variants[0]);

        const relData = await productAPI.getRelated(id);
        setRelated(relData.data.products);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }
    setAdding(true);
    try {
      const { data } = await cartAPI.addToCart({
        productId: product._id,
        variantId: selectedVariant._id,
        quantity,
      });
      setCart(data.cart);
      toast.success("Added to bag!");
      onCartOpen();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add");
    }
    setAdding(false);
  };

  const currentPrice = product ? product.price + (selectedVariant?.priceDifference || 0) : 0;

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="animate-pulse flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 bg-gray-200 h-[400px] rounded" />
          <div className="w-full md:w-1/2 space-y-4">
            <div className="bg-gray-200 h-8 rounded w-3/4" />
            <div className="bg-gray-200 h-4 rounded w-1/2" />
            <div className="bg-gray-200 h-10 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const breadcrumb = `HOME / COLLECTIONS / ${product.category.toUpperCase()} / ${product.name.toUpperCase()}`;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-24">
      {/* Breadcrumb */}
      <div className="mb-6">
        <span className="text-[11px] text-gray-500 tracking-wider">
          <Link to="/" className="hover:text-gray-900 no-underline text-gray-500">HOME</Link>
          {" / "}
          <Link to="/collections" className="hover:text-gray-900 no-underline text-gray-500">COLLECTIONS</Link>
          {" / "}
          <Link to={`/collections?category=${product.category}`} className="hover:text-gray-900 no-underline text-gray-500">{product.category.toUpperCase()}</Link>
          {" / "}
          <span className="text-gray-900">{product.name.toUpperCase()}</span>
        </span>
      </div>

      {/* Product Top */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Image */}
        <div className="w-full md:w-1/2">
          <img
            src={product.images?.[0] || "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600"}
            alt={product.name}
            className="w-full h-[300px] md:h-[450px] object-cover rounded-sm"
          />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-gray-600 mt-3 text-sm">{product.description}</p>

          {/* Badges */}
          <div className="flex items-center gap-6 mt-4">
            {product.origin && (
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <FiGlobe size={16} /> Origin: {product.origin}
              </div>
            )}
            {product.organic && (
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <FiAward size={16} /> Organic
              </div>
            )}
            {product.vegan && (
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <FiCheck size={16} /> Vegan
              </div>
            )}
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-gray-900 mt-4">€{currentPrice.toFixed(2)}</p>

          {/* Variants */}
          <div className="mt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Variants</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v._id}
                  onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                  className={`flex flex-col items-center px-3 py-2 border rounded-lg text-xs transition-all min-w-[70px] ${
                    selectedVariant?._id === v._id
                      ? "border-gray-900 bg-gray-50 shadow-sm"
                      : "border-gray-200 hover:border-gray-400"
                  } ${v.stock === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                  disabled={v.stock === 0}
                >
                  <span className="text-lg mb-0.5">🫖</span>
                  <span className="font-medium text-gray-900">{v.weight}</span>
                  <span className="text-gray-500 text-[10px]">{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Bag */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2.5 text-gray-600 hover:text-gray-900"
              >
                <FiMinus size={14} />
              </button>
              <span className="px-4 py-2.5 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2.5 text-gray-600 hover:text-gray-900"
              >
                <FiPlus size={14} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || !selectedVariant || selectedVariant.stock === 0}
              className="flex-1 bg-gray-900 text-white py-3 px-6 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              🛒 {adding ? "ADDING..." : "ADD TO BAG"}
            </button>
          </div>

          {selectedVariant && selectedVariant.stock <= 5 && selectedVariant.stock > 0 && (
            <p className="text-xs text-orange-600 mt-2">Only {selectedVariant.stock} left in stock!</p>
          )}
        </div>
      </div>

      {/* Steeping Instructions + About */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 py-8 border-t border-gray-100">
        <div>
          <h2 className="font-serif text-2xl text-gray-900 mb-6">Steeping instructions</h2>
          <div className="space-y-4">
            {product.stepiingInstructions?.servingSize && (
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <span className="text-lg">🫖</span>
                <div>
                  <span className="text-xs font-bold tracking-wider text-gray-900 uppercase">SERVING SIZE: </span>
                  <span className="text-sm text-gray-600">{product.stepiingInstructions.servingSize}</span>
                </div>
              </div>
            )}
            {product.stepiingInstructions?.waterTemperature && (
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <span className="text-lg">🌡️</span>
                <div>
                  <span className="text-xs font-bold tracking-wider text-gray-900 uppercase">WATER TEMPERATURE: </span>
                  <span className="text-sm text-gray-600">{product.stepiingInstructions.waterTemperature}</span>
                </div>
              </div>
            )}
            {product.stepiingInstructions?.steepingTime && (
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <span className="text-lg">⏱️</span>
                <div>
                  <span className="text-xs font-bold tracking-wider text-gray-900 uppercase">STEEPING TIME: </span>
                  <span className="text-sm text-gray-600">{product.stepiingInstructions.steepingTime}</span>
                </div>
              </div>
            )}
            {product.stepiingInstructions?.colorAfterBrew && (
              <div className="flex items-start gap-3">
                <span className="text-lg">🔴</span>
                <div>
                  <span className="text-xs font-bold tracking-wider text-gray-900 uppercase">COLOR AFTER 3 MINUTES</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-gray-900 mb-6">About this tea</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">FLAVOR</p>
              <p className="text-sm text-gray-900 mt-1">{product.flavor?.join(", ") || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">QUALITIES</p>
              <p className="text-sm text-gray-900 mt-1">{product.qualities?.join(", ") || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">CAFFEINE</p>
              <p className="text-sm text-gray-900 mt-1">{product.caffeine || "-"}</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-gray-500 uppercase">ALLERGENS</p>
              <p className="text-sm text-gray-900 mt-1">{product.allergens?.join(", ") || "-"}</p>
            </div>
          </div>

          <h3 className="font-serif text-xl text-gray-900 mb-3">Ingredient</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.ingredients?.join(", ") || "-"}</p>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-12 border-t border-gray-100">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {related.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="group no-underline">
                <div className="overflow-hidden rounded-sm bg-gray-50">
                  <img
                    src={p.images?.[0] || "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400"}
                    alt={p.name}
                    className="w-full h-[180px] sm:h-[220px] md:h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="text-center mt-3">
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-bold">€{p.price.toFixed(2)}</span>
                    <span className="text-gray-400"> / 50 g</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductPage;
