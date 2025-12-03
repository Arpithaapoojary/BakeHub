import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-600 to-pink-500 text-white mt-14 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* BRAND SECTION */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-wide">BakeHub</h2>
          <p className="mt-3 text-pink-100 leading-relaxed">
            Discover the best bakeries near you. Helping bakery owners grow with
            powerful online tools.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-5">
            <a href="#" className="hover:text-yellow-200 transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-yellow-200 transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-yellow-200 transition">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-pink-300 pb-2">
            Quick Links
          </h3>

          <ul className="space-y-3 text-pink-100">
            <li>
              <a href="/" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="/customer" className="hover:text-white transition">
                Browse Bakeries
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-white transition">
                Register Bakery
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-pink-300 pb-2">
            Support
          </h3>

          <ul className="space-y-3 text-pink-100">
            <li>
              <a href="/faq" className="hover:text-white transition">
                FAQ
              </a>
            </li>
            <li>
              <a href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-pink-300 pb-2">
            Contact Us
          </h3>

          <ul className="space-y-3 text-pink-100">
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@bakehub.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={18} /> Bengaluru, India
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <p className="text-center text-pink-200 text-xs mt-12 tracking-wide">
        © {new Date().getFullYear()} BakeHub — All Rights Reserved.
      </p>
    </footer>
  );
}
