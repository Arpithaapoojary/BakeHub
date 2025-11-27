export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 pt-24 px-6 pb-20">
      {/* MAIN TITLE */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-4 tracking-tight animate-fadeIn">
        About BakeHub
      </h1>

      {/* SUB TEXT */}
      <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto text-center leading-relaxed mb-12 animate-fadeIn delay-200">
        BakeHub is a modern digital platform designed to connect customers with
        local bakeries. Whether you're craving fresh pastries, cakes, cookies,
        or handmade desserts, BakeHub helps you discover nearby bakeries and
        order with ease.
      </p>

      {/* SECTION 1 — OUR MISSION */}
      <div
        className="max-w-5xl mx-auto bg-white border border-pink-100 rounded-2xl p-8 
                      shadow-md mb-12 animate-slideUp"
      >
        <h2 className="text-2xl font-semibold text-pink-600 mb-3">
          Our Mission
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          Our mission is to empower local bakeries by giving them a beautiful
          online presence, helping them reach more customers, and simplifying
          their daily operations. At the same time, we ensure customers have a
          smooth experience exploring menus, placing orders, and enjoying their
          favourite treats.
        </p>
      </div>

      {/* SECTION 2 — WHAT WE DO */}
      <div
        className="max-w-5xl mx-auto bg-white border border-pink-100 rounded-2xl p-8 
                      shadow-md mb-12 animate-slideUp delay-200"
      >
        <h2 className="text-2xl font-semibold text-pink-600 mb-4">
          What We Do
        </h2>

        <ul className="space-y-3 text-gray-700 text-base md:text-lg leading-relaxed">
          <li>
            • Help customers browse nearby bakeries without needing an account.
          </li>
          <li>• Provide bakery owners with easy product management tools.</li>
          <li>
            • Offer a streamlined ordering system for both customers and owners.
          </li>
          <li>
            • Ensure real-time updates on order status and bakery availability.
          </li>
          <li>• Deliver a beautiful, fast, and mobile-friendly experience.</li>
        </ul>
      </div>

      {/* SECTION 3 — WHY BAKEHUB */}
      <div
        className="max-w-5xl mx-auto bg-white border border-pink-100 rounded-2xl p-8 
                      shadow-md mb-12 animate-slideUp delay-300"
      >
        <h2 className="text-2xl font-semibold text-pink-600 mb-3">
          Why BakeHub?
        </h2>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          BakeHub focuses on simplicity, reliability, and user satisfaction. We
          believe that technology should make life easier — not complicated. Our
          platform combines clean design, smooth performance, and
          bakery-specific features that create the perfect digital experience
          for everyone.
        </p>

        <p className="text-gray-700 text-base md:text-lg leading-relaxed mt-3">
          Whether you're a customer exploring new desserts or a bakery owner
          expanding your business, BakeHub provides everything you need in a
          single, beautiful, and easy-to-use platform.
        </p>
      </div>

      {/* SECTION 4 — OUR VALUES */}
      <div
        className="max-w-5xl mx-auto bg-white border border-pink-100 rounded-2xl p-8 
                      shadow-md animate-slideUp delay-400"
      >
        <h2 className="text-2xl font-semibold text-pink-600 mb-4">
          Our Values
        </h2>

        <ul className="space-y-3 text-gray-700 text-base md:text-lg leading-relaxed">
          <li>✨ Customer Convenience First</li>
          <li>✨ Support for Local Businesses</li>
          <li>✨ Professional, Clean, and Trustworthy Design</li>
          <li>✨ Smooth and Fast Performance</li>
          <li>✨ User-friendly experience for all</li>
        </ul>
      </div>
    </div>
  );
}
