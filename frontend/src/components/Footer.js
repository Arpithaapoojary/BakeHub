export default function Footer() {
  return (
    <footer className="bg-white border-t border-pink-200 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-gray-700 text-sm">
        <div>
          <h2 className="text-xl font-bold text-pink-600">BakeHub</h2>
          <p className="mt-3 text-gray-600">
            A simple, powerful platform for discovering bakeries and helping
            bakery owners grow.
          </p>
        </div>

        <div>
          <h3 className="text-pink-600 font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-pink-600">
                Home
              </a>
            </li>
            <li>
              <a href="/customer" className="hover:text-pink-600">
                Browse Bakeries
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-pink-600">
                Register Bakery
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-pink-600">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-pink-600 font-semibold mb-3">Support</h3>
          <ul className="space-y-2">
            <li>
              <a href="/faq" className="hover:text-pink-600">
                FAQ
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-pink-600">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-pink-600">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-8">
        © {new Date().getFullYear()} BakeHub. All rights reserved.
      </p>
    </footer>
  );
}
