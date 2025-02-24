"use client"; // Ensures it runs on the client-side

import { Tag, Ticket, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function LoyaltyCoupons() {
  const insights = [
    {
      category: "Coupon Redemption Rates",
      icon: <Tag className="w-8 h-8 text-orange-600" />,
      examples: [
        "60% of users who receive coupons for grocery stores redeem them within 7 days.",
        "45% of users who receive discounts on fashion brands make a purchase within 10 days.",
        "70% of users who receive free shipping offers complete their purchase immediately.",
      ],
    },
    {
      category: "Loyalty Program Engagement",
      icon: <CreditCard className="w-8 h-8 text-blue-600" />,
      examples: [
        "Users enrolled in loyalty programs spend 30% more than non-enrolled users.",
        "50% of loyalty program members redeem points for discounts within 3 months.",
        "80% of users who receive exclusive offers through loyalty programs make repeat purchases.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 p-8 flex flex-col items-center">
      {/* Animated Header */}
      <motion.h1
        className="text-4xl font-bold text-blue-900 mb-6 text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Loyalty & Coupon Usage
        <span className="block w-24 h-1 bg-orange-500 mt-2 mx-auto rounded-full"></span>
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Discover how coupons and loyalty programs influence spending behavior.
      </p>

      {/* Stats Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {insights.map((section, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <motion.div
                initial={{ rotate: -15 }}
                animate={{ rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {section.icon}
              </motion.div>
              <h2 className="text-xl font-semibold text-green-900">
                {section.category}
              </h2>
            </div>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {section.examples.map((example, i) => (
                <li key={i} className="text-lg">{example}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}