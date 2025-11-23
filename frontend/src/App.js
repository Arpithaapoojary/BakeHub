import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import CustomerBrowse from "./pages/customer/CustomerBrowse";

import CustomerMenu from "./pages/customer/CustomerMenu";
import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import OrderSuccess from "./pages/customer/OrderSuccess";
import MyOrders from "./pages/customer/MyOrders";
import OrderTracking from "./pages/customer/OrderTracking";

import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="font-[Poppins] bg-[#FFF5FA] min-h-screen flex flex-col">
          <Header />

          <main className="flex-1">
            <Routes>
              {/* Home Page */}
              <Route path="/" element={<HomePage />} />

              {/* Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />

              {/* Basic Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Customer */}
              <Route path="/customer" element={<CustomerBrowse />} />
              <Route path="/customer/menu/:id" element={<CustomerMenu />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<OrderSuccess />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/track/:orderId" element={<OrderTracking />} />

              {/* Owner */}
              <Route path="/owner" element={<OwnerDashboard />} />

              {/* Admin */}
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
