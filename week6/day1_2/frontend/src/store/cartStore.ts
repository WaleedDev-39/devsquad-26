import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { cartApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface LocalCartItem {
  _id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface CartStore {
  items: LocalCartItem[];
  isLoading: boolean;
  addItem: (product: Product, qty: number, size: string, color: string, isLoggedIn: boolean) => Promise<void>;
  removeItem: (itemId: string, isLoggedIn: boolean) => Promise<void>;
  updateQty: (itemId: string, qty: number, isLoggedIn: boolean) => Promise<void>;
  clearCart: () => void;
  syncFromServer: (items: CartItem[]) => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (product, qty, size, color, isLoggedIn) => {
        if (isLoggedIn) {
          try {
            const res = await cartApi.addItem({ 
              productId: product._id.toString(), 
              quantity: qty, 
              size, 
              color 
            });
            const serverItems = res.data.items;
            get().syncFromServer(serverItems);
            toast.success('Added to cart!');
          } catch {
            toast.error('Failed to add to cart');
          }
        } else {
          const existing = get().items.findIndex(
            (i) => i.productId === product._id && i.size === size && i.color === color,
          );
          if (existing > -1) {
            set((s) => ({
              items: s.items.map((item, idx) =>
                idx === existing ? { ...item, quantity: item.quantity + qty } : item,
              ),
            }));
          } else {
            set((s) => ({
              items: [
                ...s.items,
                {
                  _id: `local_${Date.now()}`,
                  productId: product._id,
                  name: product.name,
                  image: product.images?.[0] || '',
                  price: product.price,
                  quantity: qty,
                  size,
                  color,
                },
              ],
            }));
          }
          toast.success('Added to cart!');
        }
      },

      removeItem: async (itemId, isLoggedIn) => {
        if (isLoggedIn) {
          try {
            const res = await cartApi.removeItem(itemId);
            get().syncFromServer(res.data.items);
          } catch {
            toast.error('Failed to remove item');
          }
        } else {
          set((s) => ({ items: s.items.filter((i) => i._id !== itemId) }));
        }
      },

      updateQty: async (itemId, qty, isLoggedIn) => {
        if (qty < 1) return;
        if (isLoggedIn) {
          try {
            const res = await cartApi.updateItem(itemId, qty);
            get().syncFromServer(res.data.items);
          } catch {
            toast.error('Failed to update quantity');
          }
        } else {
          set((s) => ({
            items: s.items.map((i) => (i._id === itemId ? { ...i, quantity: qty } : i)),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      syncFromServer: (serverItems) => {
        set({
          items: serverItems.map((i) => {
            const pId = (i.productId as any)?._id || i.productId;
            return {
              _id: (i as any)._id || pId.toString(),
              productId: pId.toString(),
              name: i.name,
              image: i.image,
              price: i.price,
              quantity: i.quantity,
              size: i.size,
              color: i.color,
            };
          }),
        });
      },

      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'shopco-cart' },
  ),
);
