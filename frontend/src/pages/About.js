export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 pt-24 px-6 pb-16">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-pink-600 mb-6">
        About BakeHub
      </h1>

      {/* Intro */}
      <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto text-center mb-12">
        BakeHub is a modern platform connecting bakery lovers with the finest
        bakeries, while also empowering bakery owners with tools to manage
        orders, menus, and business growth.
      </p>

      {/* Mission Section */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <img
          src="https://images.unsplash.com/photo-1509440159598-7bb11b5e07c0"
          alt="bakery"
          className="rounded-2xl shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-semibold text-pink-600 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            We aim to bring simplicity, creativity and technology together—
            making dessert ordering effortless for customers and giving bakery
            owners a platform to showcase their passion and grow their business.
            BakeHub helps transform local bakeries into digital powerhouses.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="mt-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center text-pink-600 mb-10">
          What We Offer
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              🎂 For Customers
            </h3>
            <p className="text-gray-700">
              Explore bakeries, browse menus, add to cart, order, and enjoy!
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              🧁 For Bakery Owners
            </h3>
            <p className="text-gray-700">
              Manage products, orders, analytics and grow your business online.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-pink-600 mb-3">
              ⚙️ Seamless Technology
            </h3>
            <p className="text-gray-700">
              Smooth UI, clean dashboard, secure logins and real-time updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
