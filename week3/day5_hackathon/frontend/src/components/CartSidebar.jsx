import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { cartAPI } from "../api/api";
import { FiX, FiMinus, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CartSidebar = ({ isOpen, onClose, cart, setCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) fetchCart();
  }, [isOpen, user]);

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
      console.error(err);
    }
    setLoading(false);
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data.cart);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const subtotal = cart?.items?.reduce((sum, item) => {
    const price = (item.product?.price || 0) + (item.variant?.priceDifference || 0);
    return sum + price * item.quantity;
  }, 0) || 0;

  const delivery = 3.95;
  const total = subtotal + delivery;

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/40 z-60" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-70 transform transition-transform duration-300 shadow-2xl flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-serif font-bold text-gray-900">My Bag</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900">
            <FiX size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!user ? (
            <p className="text-gray-500 text-sm text-center mt-8">Please log in to view your cart.</p>
          ) : !cart?.items?.length ? (
            <p className="text-gray-500 text-sm text-center mt-8">Your bag is empty.</p>
          ) : (
            cart.items.map((item) => (
              <div key={item._id} className="flex gap-4 py-4 border-b border-gray-50">
                <img
                  src={item.product?.images?.[0] || "https://via.placeholder.com/80"}
                  alt={item.product?.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
                  <p className="text-xs text-gray-500">{item.variant?.label} - {item.variant?.weight}</p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="text-xs text-gray-500 hover:text-red-600 mt-1 uppercase tracking-wider font-medium"
                  >
                    REMOVE
                  </button>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item._id, item.quantity - 1)}
                      disabled={loading || item.quantity <= 1}
                      className="text-gray-500 hover:text-gray-900 disabled:opacity-30"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item._id, item.quantity + 1)}
                      disabled={loading}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    €{(((item.product?.price || 0) + (item.variant?.priceDifference || 0)) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {user && cart?.items?.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-200 bg-gray-50/50">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery</span>
                <span>€{delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => { onClose(); navigate("/bag"); }}
              className="w-full bg-gray-900 text-white py-3 text-sm font-semibold tracking-wider hover:bg-gray-800 transition-colors uppercase"
            >
              PURCHASE
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
