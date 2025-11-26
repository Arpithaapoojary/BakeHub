import { Link } from "react-router-dom";
import { Search, Star, Cake, Cookie, Coffee } from "lucide-react";

export default function HomePage() {
  return (
    <div className="font-[Poppins] text-gray-800">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative bg-cover bg-center h-[85vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1509440159598-1e879b7d6e93?auto=format&fit=crop&w=1400&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-xl">
            Freshly Baked Happiness
          </h1>

          <p className="text-lg md:text-2xl mb-6 drop-shadow-md max-w-3xl mx-auto">
            Discover delicious bakeries near you. Order desserts, cakes,
            pastries & more with BakeHub.
          </p>

          {/* Search Bar */}
          <div className="max-w-lg mx-auto bg-white rounded-full flex items-center px-4 py-3 shadow-lg mt-6">
            <Search className="text-pink-500" />
            <input
              type="text"
              placeholder="Search bakeries or items..."
              className="flex-1 outline-none px-3 text-gray-700"
            />
          </div>

          {/* Hero Buttons */}
          <div className="mt-8 space-x-4">
            <Link
              to="/customer"
              className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-full text-white font-semibold shadow-lg"
            >
              Explore Bakeries →
            </Link>
            <Link
              to="/register"
              className="bg-white text-pink-600 px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-100"
            >
              Join as Owner
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURED CATEGORIES ================= */}
      <section className="py-20 px-6 bg-pink-50">
        <h2 className="text-center text-4xl font-semibold text-pink-600 mb-12">
          Popular Categories
        </h2>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
            <Cake className="mx-auto text-pink-500" size={45} />
            <h3 className="text-xl font-semibold mt-4">Cakes</h3>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
            <Cookie className="mx-auto text-pink-500" size={45} />
            <h3 className="text-xl font-semibold mt-4">Cookies</h3>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
            <Coffee className="mx-auto text-pink-500" size={45} />
            <h3 className="text-xl font-semibold mt-4">Pastries</h3>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
            <Star className="mx-auto text-pink-500" size={45} />
            <h3 className="text-xl font-semibold mt-4">Special Treats</h3>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-20 px-6">
        <h2 className="text-4xl text-center font-semibold text-pink-600 mb-12">
          Why Choose BakeHub?
        </h2>

        <div className="grid md:grid-cols-3 max-w-6xl mx-auto gap-10">
          <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <img
              className="h-40 mx-auto rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80"
              alt="customer"
            />
            <h3 className="text-2xl font-semibold text-pink-600 mt-6">
              For Customers
            </h3>
            <p className="text-gray-700 mt-3">
              Discover bakeries, browse menus, add to cart, order instantly —
              fast and easy.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <img
              className="h-40 mx-auto rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80"
              alt="owner"
            />
            <h3 className="text-2xl font-semibold text-pink-600 mt-6">
              For Bakery Owners
            </h3>
            <p className="text-gray-700 mt-3">
              Manage products, orders, analytics — everything in one simple
              dashboard.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition">
            <img
              className="h-40 mx-auto rounded-2xl object-cover"
              src="https://images.unsplash.com/photo-1491185841073-d5bcd7074f22?auto=format&fit=crop&w=800&q=80"
              alt="seamless"
            />
            <h3 className="text-2xl font-semibold text-pink-600 mt-6">
              Seamless Experience
            </h3>
            <p className="text-gray-700 mt-3">
              Beautiful design, smooth performance, mobile-ready and user
              friendly.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="py-20 px-6 bg-pink-50">
        <h2 className="text-4xl text-center font-semibold text-pink-600 mb-12">
          How It Works
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="text-6xl mb-3">🔍</div>
            <h3 className="text-xl font-semibold">1. Explore Bakeries</h3>
            <p className="text-gray-600 mt-2">
              Browse top-rated bakeries & menus.
            </p>
          </div>

          <div>
            <div className="text-6xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold">2. Place Your Order</h3>
            <p className="text-gray-600 mt-2">
              Add items to cart & checkout seamlessly.
            </p>
          </div>

          <div>
            <div className="text-6xl mb-3">🚚</div>
            <h3 className="text-xl font-semibold">3. Enjoy Delivery</h3>
            <p className="text-gray-600 mt-2">
              Sit back & enjoy freshly baked treats.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 bg-pink-600 text-white text-center px-6">
        <h2 className="text-4xl font-bold mb-4">Ready to Taste Happiness?</h2>
        <p className="text-lg mb-6">Join BakeHub today!</p>

        <Link
          to="/register"
          className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold shadow hover:bg-gray-100"
        >
          Get Started →
        </Link>
      </section>
    </div>
  );
}
