import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import HomePage from "./pages/HomePage";
import CollectionsPage from "./pages/CollectionsPage";
import ProductPage from "./pages/ProductPage";
import BagPage from "./pages/BagPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OrdersPage from "./pages/OrdersPage";
import DashboardPage from "./pages/DashboardPage";

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(null);

  const cartCount = cart?.items?.length || 0;

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white">
          <Navbar onCartOpen={() => setCartOpen(true)} cartCount={cartCount} />
          <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} cart={cart} setCart={setCart} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/product/:id" element={<ProductPage onCartOpen={() => setCartOpen(true)} setCart={setCart} />} />
              <Route path="/bag" element={<BagPage cart={cart} setCart={setCart} />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { fontSize: "14px", borderRadius: "4px", padding: "12px 16px" },
        }} />
      </Router>
    </AuthProvider>
  );
};

export default App;