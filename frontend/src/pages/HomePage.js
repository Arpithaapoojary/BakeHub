import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Store, ShoppingBag, ShieldCheck, Layers } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-[#FFF5FA] min-h-screen overflow-hidden">
      {/* ============= HERO ============= */}
      <section className="px-6 py-20 md:py-24 relative">
        {/* Background gradient circles */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute -top-20 -right-20 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-40"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 1.4 }}
          className="absolute bottom-0 -left-16 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-40"
        />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">
          {/* LEFT TEXT */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#1F1022]">
              Discover Fresh Bakeries
              <span className="text-pink-600 block">Near You</span>
            </h1>

            <p className="text-base md:text-lg text-[#5b405f] max-w-xl">
              Browse bakery listings instantly without login. Sign in only when
              you want to see menus or place orders.
            </p>

            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/customer"
                  className="px-6 py-3 bg-pink-600 text-white rounded-xl font-semibold shadow-md hover:bg-pink-700 transition"
                >
                  Browse Bakeries
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/register?role=owner"
                  className="px-6 py-3 bg-white border border-pink-200 text-pink-700 rounded-xl hover:bg-pink-50 transition"
                >
                  Register Bakery
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* ANIMATED FLOATING CARDS */}
          <div className="grid gap-4">
            <FloatingCard
              title="Easy Discovery"
              text="Find nearby bakeries without login."
              delay={0.2}
            />
            <FloatingCard
              title="Admin Verified"
              text="Only approved bakeries can publish items."
              delay={0.4}
            />
            <FloatingCard
              title="Smooth Ordering"
              text="Login to view menus & order quickly."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* ============= WHY BAKEHUB ============= */}
      <section className="py-16 px-6 bg-white border-t border-pink-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold text-gray-900"
          >
            Why Choose <span className="text-pink-600">BakeHub?</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<Store className="w-8 h-8 text-pink-500 mx-auto" />}
              title="Browse Freely"
              text="See bakeries without signing in."
            />
            <FeatureCard
              icon={<ShoppingBag className="w-8 h-8 text-pink-500 mx-auto" />}
              title="For Bakery Owners"
              text="Register, get approved & manage your shop."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-pink-500 mx-auto" />}
              title="Verified Listings"
              text="Only admin-approved bakeries go live."
            />
          </div>
        </div>
      </section>

      {/* ============= QUICK HIGHLIGHTS ============= */}
      <section className="py-16 px-6 bg-[#FFF5FA]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <HighlightRow
            icon={<Layers className="w-6 h-6 text-pink-500" />}
            title="Real-Time Availability"
            text="Owners update stock instantly."
          />

          <HighlightRow
            icon={<ShoppingBag className="w-6 h-6 text-pink-500" />}
            title="Order Tracking"
            text="Get clear status updates after login."
          />
        </div>
      </section>

      {/* ============= CTA ============= */}
      <section className="py-20 px-6 text-center bg-white border-t border-pink-100">
        <h2 className="text-3xl font-bold text-gray-900">
          Your Bakery Journey Starts Here
        </h2>
        <p className="text-gray-600 mt-3">
          Explore bakeries or bring your own bakery online.
        </p>

        <motion.div className="mt-8" whileHover={{ scale: 1.05 }}>
          <Link
            to="/customer"
            className="px-10 py-4 bg-pink-600 text-white rounded-xl text-lg font-semibold shadow hover:bg-pink-700 transition"
          >
            Browse Bakeries →
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function FloatingCard({ title, text, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ scale: 1.03 }}
      className="bg-white p-5 border border-pink-200 rounded-xl shadow-sm"
    >
      <h3 className="font-semibold text-[#2b1830]">{title}</h3>
      <p className="text-[#7a5a80] text-sm mt-1">{text}</p>
    </motion.div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-[#FFF5FA] p-7 rounded-2xl shadow-sm border border-pink-100 text-center"
    >
      {icon}
      <h3 className="font-semibold text-lg mt-3 text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{text}</p>
    </motion.div>
  );
}

function HighlightRow({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex gap-3 bg-white p-5 border border-pink-200 rounded-xl shadow-sm"
    >
      {icon}
      <div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="text-sm text-gray-600">{text}</p>
      </div>
    </motion.div>
  );
}
