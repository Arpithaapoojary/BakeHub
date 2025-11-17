import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="font-[Poppins] text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[70vh] flex items-center justify-center"
        style={{ backgroundImage: "url('/images/bakery-hero.jpg')" }}
      >
        <div className="absolute inset-0 bg-pink-600/40"></div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🍰 Welcome to <span className="text-pink-300">BakeHub</span>
          </h1>
          <p className="text-lg md:text-xl text-white mb-8 max-w-3xl mx-auto">
            A platform where bakeries and dessert lovers meet — explore, order &
            manage with ease.
          </p>
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-white text-pink-600 px-6 py-3 rounded-full font-medium shadow hover:shadow-md"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-pink-500 text-pink-600 px-5 py-2 rounded-full hover:bg-pink-50"
            >
              Register
            </Link>
          </div>
        </div>
      </section>
      {/* What is BakeHub */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-pink-600 mb-4">
          What is BakeHub?
        </h2>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700">
          BakeHub connects you with the best local bakeries. Whether you’re
          craving fresh pastries or looking to manage your bakery business
          better, we’ve got you covered.
        </p>
      </section>
      {/* Features Section */}
      <section className="py-20 px-6 bg-pink-50">
        <h2 className="text-3xl md:text-4xl font-semibold text-pink-600 text-center mb-12">
          Why Choose BakeHub?
        </h2>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              🎂 For Customers
            </h3>
            <p className="text-gray-700">
              Discover nearby bakeries, browse menus, add to cart and enjoy your
              treats.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              🧁 For Bakery Owners
            </h3>
            <p className="text-gray-700">
              Manage your menu, track orders, analyse sales — all in one place.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              🍪 Seamless Experience
            </h3>
            <p className="text-gray-700">
              Modern UI, fast performance, mobile-ready and built for you.
            </p>
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section className="py-20 px-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-pink-600 text-center mb-12">
          How It Works
        </h2>
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto text-center">
          <div>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-pink-600 mb-2">
              1. Explore Bakeries
            </h3>
            <p className="text-gray-700">
              Browse through top rated bakeries and menus in your area.
            </p>
          </div>
          <div>
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-pink-600 mb-2">
              2. Place Your Order
            </h3>
            <p className="text-gray-700">
              Add items to cart, checkout and get your goodies.
            </p>
          </div>
          <div>
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-pink-600 mb-2">
              3. Manage & Grow
            </h3>
            <p className="text-gray-700">
              Bakery owners get a full dashboard to grow their business.
            </p>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-16 px-6 bg-pink-600 text-white text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg mb-6">
          Join BakeHub today — whether you’re a customer or bakery owner.
        </p>
        <Link
          to="/register"
          className="border border-pink-500 text-pink-600 px-5 py-2 rounded-full hover:bg-pink-50"
        >
          Register
        </Link>
      </section>
      {/* Footer will be inherited from your Footer component */}
    </div>
  );
}
