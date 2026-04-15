import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cartAPI, orderAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { FiMinus, FiPlus } from "react-icons/fi";
import toast from "react-hot-toast";

const BagPage = ({ cart, setCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (user) fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.getCart();
      setCart(data.cart);
    } catch (err) {
      console.error(err);
    }
  };

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return;
    setLoading(true);
    try {
      const { data } = await cartAPI.updateItem(itemId, { quantity });
      setCart(data.cart);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
    setLoading(false);
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data.cart);
    } catch (err) {
      toast.error("Failed to remove item");
    }
    setLoading(false);
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await orderAPI.placeOrder({ shippingAddress: {} });
      setCart({ items: [] });
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
    setPlacing(false);
  };

  if (!user) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 text-lg mb-4">Please log in to view your bag.</p>
        <Link to="/login" className="bg-gray-900 text-white px-8 py-3 text-sm font-semibold no-underline">LOGIN</Link>
      </div>
    );
  }

  const subtotal = cart?.items?.reduce((sum, item) => {
    const price = (item.product?.price || 0) + (item.variant?.priceDifference || 0);
    return sum + price * item.quantity;
  }, 0) || 0;

  const delivery = 3.95;
  const total = subtotal + delivery;

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-24">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <span className="text-sm font-semibold text-gray-900 italic">1. MY BAG</span>
        <div className="w-16 md:w-32 h-px bg-gray-300" />
        <span className="text-sm text-gray-400 italic">2. DELIVERY</span>
        <div className="w-16 md:w-32 h-px bg-gray-300" />
        <span className="text-sm text-gray-400 italic">2. REVIEW & PAYMENT</span>
      </div>

      {!cart?.items?.length ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">Your bag is empty.</p>
          <Link to="/collections" className="border border-gray-900 text-gray-900 px-8 py-3 text-sm font-semibold no-underline hover:bg-gray-900 hover:text-white transition-colors">BACK TO SHOPPING</Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Cart Items */}
          <div className="flex-1">
            {cart.items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 py-5 border-b border-gray-100">
                <img
                  src={item.product?.images?.[0] || "https://via.placeholder.com/80"}
                  alt={item.product?.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                  <p className="text-xs text-gray-500">{item.variant?.label} - {item.variant?.weight}</p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-xs text-gray-500 hover:text-red-600 mt-1 uppercase tracking-wider font-medium"
                  >
                    REMOVE
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)} disabled={loading || item.quantity <= 1} className="text-gray-500 hover:text-gray-900 disabled:opacity-30 text-lg font-bold">−</button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)} disabled={loading} className="text-gray-500 hover:text-gray-900 text-lg font-bold">+</button>
                </div>
                <span className="text-sm font-bold text-gray-900 w-16 text-right">
                  €{(((item.product?.price || 0) + (item.variant?.priceDifference || 0)) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Subtotal</span>
              <span className="text-sm font-bold text-gray-900">€{subtotal.toFixed(2)}</span>
            </div>

            <Link to="/collections" className="inline-block mt-6 border border-gray-900 text-gray-900 px-6 py-2.5 text-sm font-medium no-underline hover:bg-gray-900 hover:text-white transition-colors">
              BACK TO SHOPPING
            </Link>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[360px] space-y-6">
            {/* Summary */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-4">Order summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span>€{delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-200 mt-2">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Estimated shipping time: 2 days</p>
              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full bg-gray-900 text-white py-3 mt-4 text-sm font-semibold tracking-wider uppercase hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {placing ? "PLACING ORDER..." : "CHECK OUT"}
              </button>
            </div>

            {/* Payment Type */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Payment type</h3>
              <div className="flex gap-3">
                {["VISA", "MC", "Maestro", "iD", "AP"].map((type) => (
                  <div key={type} className="w-10 h-7 bg-white border border-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-600">
                    {type}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Delivery and retour</h3>
              <ul className="space-y-2.5 text-sm text-gray-600">
                <li className="flex gap-2"><span className="text-gray-400">›</span> Order before 12:00 and we will ship the same day.</li>
                <li className="flex gap-2"><span className="text-gray-400">›</span> Orders made after Friday 12:00 are processed on Monday.</li>
                <li className="flex gap-2"><span className="text-gray-400">›</span> To return your articles, please contact us first.</li>
                <li className="flex gap-2"><span className="text-gray-400">›</span> Postal charges for retour are not reimbursed.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Popular This Season */}
      <section className="py-12 border-t border-gray-100 mt-12">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">Popular this season</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {(cart?.items || []).slice(0, 3).map((item) => (
            <Link key={item._id} to={`/product/${item.product?._id}`} className="group no-underline">
              <div className="overflow-hidden rounded-sm bg-gray-50">
                <img
                  src={item.product?.images?.[0] || "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400"}
                  alt={item.product?.name}
                  className="w-full h-[180px] sm:h-[220px] md:h-[260px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="text-center mt-3">
                <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-bold">€{item.product?.price?.toFixed(2)}</span>
                  <span className="text-gray-400"> / 50 g</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BagPage;
