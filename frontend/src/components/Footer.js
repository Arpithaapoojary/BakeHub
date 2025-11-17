export default function Footer() {
  return (
    <footer className="bg-[#FFE4EE] text-gray-700 mt-10 border-t border-pink-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <h3 className="text-2xl font-bold text-pink-600 mb-3">🎂 BakeHub</h3>
          <p className="text-sm text-gray-600">
            Discover local bakeries, order delicious treats, and enjoy the sweet
            moments of life.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-600 cursor-pointer">About Us</li>
            <li className="hover:text-pink-600 cursor-pointer">Contact</li>
            <li className="hover:text-pink-600 cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-pink-600 cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Follow Us</h4>
          <div className="flex gap-4 text-xl">
            <span className="cursor-pointer hover:text-pink-600">🌐</span>
            <span className="cursor-pointer hover:text-pink-600">📸</span>
            <span className="cursor-pointer hover:text-pink-600">🐦</span>
            <span className="cursor-pointer hover:text-pink-600">📘</span>
          </div>
        </div>
      </div>

      <p className="text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} BakeHub — Made with ❤️ for dessert lovers.
      </p>
    </footer>
  );
}
