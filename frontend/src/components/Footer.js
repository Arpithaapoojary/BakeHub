import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Mail,
  PhoneCall,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-pink-50 to-rose-100 mt-16 border-t border-pink-200">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-12">
        {/* Logo + Description */}
        <div>
          <h2 className="text-3xl font-bold text-pink-600 mb-3">BakeHub</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Freshly baked happiness delivered to your doorstep. Explore the best
            bakeries near you with exclusive desserts and custom cakes.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3 text-gray-600">
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

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact</h3>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-center gap-2">
              <MapPin size={18} /> India
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@bakehub.com
            </li>
            <li className="flex items-center gap-2">
              <PhoneCall size={18} /> +91-9876543210
            </li>
          </ul>

          <div className="flex gap-5 mt-6 text-pink-600">
            <Instagram
              className="cursor-pointer hover:text-pink-800"
              size={26}
            />
            <Twitter className="cursor-pointer hover:text-pink-800" size={26} />
            <Facebook
              className="cursor-pointer hover:text-pink-800"
              size={26}
            />
          </div>
        </div>
      </div>

      <div className="text-center py-6 text-gray-500 text-sm border-t border-pink-200">
        © {new Date().getFullYear()} BakeHub — Crafted with ❤️ for dessert
        lovers.
      </div>
    </footer>
  );
}
