import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartPageComponent from '@/components/cart/CartPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart — YOURSNEAKER',
  description: 'Review your sneaker cart and proceed to checkout.',
};

export default function CartPage() {
  return (
    <>
      <Navbar />
      <main>
        <CartPageComponent />
      </main>
      <Footer />
    </>
  );
}
