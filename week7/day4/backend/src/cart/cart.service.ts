import { Injectable } from '@nestjs/common';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  sessionId: string;
  items: CartItem[];
  updatedAt: Date;
}

@Injectable()
export class CartService {
  // In-memory cart store keyed by sessionId
  private carts: Map<string, Cart> = new Map();

  getCart(sessionId: string): Cart {
    if (!this.carts.has(sessionId)) {
      this.carts.set(sessionId, {
        sessionId,
        items: [],
        updatedAt: new Date(),
      });
    }
    return this.carts.get(sessionId)!;
  }

  addItem(sessionId: string, item: CartItem): Cart {
    const cart = this.getCart(sessionId);
    const existing = cart.items.find(
      (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
    );
    if (existing) {
      existing.quantity += item.quantity || 1;
    } else {
      cart.items.push({ ...item, quantity: item.quantity || 1 });
    }
    cart.updatedAt = new Date();
    return cart;
  }

  updateItem(sessionId: string, productId: string, quantity: number, size?: string, color?: string): Cart {
    const cart = this.getCart(sessionId);
    const item = cart.items.find(
      (i) => i.productId === productId && i.size === size && i.color === color,
    );
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(
          (i) => !(i.productId === productId && i.size === size && i.color === color),
        );
      } else {
        item.quantity = quantity;
      }
    }
    cart.updatedAt = new Date();
    return cart;
  }

  removeItem(sessionId: string, productId: string, size?: string, color?: string): Cart {
    const cart = this.getCart(sessionId);
    cart.items = cart.items.filter(
      (i) => !(i.productId === productId && i.size === size && i.color === color),
    );
    cart.updatedAt = new Date();
    return cart;
  }

  clearCart(sessionId: string): Cart {
    const cart = this.getCart(sessionId);
    cart.items = [];
    cart.updatedAt = new Date();
    return cart;
  }
}
