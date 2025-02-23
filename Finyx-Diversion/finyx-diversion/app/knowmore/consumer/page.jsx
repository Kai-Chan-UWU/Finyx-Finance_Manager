"use client"; // ✅ Ensures it runs on the client-side

import { ShoppingCart, TrendingUp, Store, PackageSearch, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function ConsumerSpendingPatterns() {
  const stats = [
    {
      category: "Cross-Store Purchases",
      icon: <Store className="w-8 h-8 text-blue-600" />,
      examples: [
        "70% of users who buy sugar from More Supermarket also buy laddoo from Spencer's.",
        "45% of users who purchase coffee beans from Starbucks also buy pastries from local bakeries.",
        "60% of users who buy pet food from PetCo also purchase toys from PetSmart.",
      ],
    },
    {
      category: "Category Preferences",
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      examples: [
        "80% of users who spend on organic groceries also invest in eco-friendly household products.",
        "65% of users who buy luxury skincare also purchase premium haircare products.",
        "55% of users who spend on fitness gear also buy protein supplements.",
      ],
    },
    {
      category: "Product Exploration",
      icon: <PackageSearch className="w-8 h-8 text-purple-600" />,
      examples: [
        "50% of users who buy budget smartphones tend to upgrade within two years.",
        "40% of users who purchase gaming consoles also invest in VR accessories.",
        "30% of users who try plant-based meat continue to explore vegan products.",
      ],
    },
    {
      category: "Sustainability Trends",
      icon: <Leaf className="w-8 h-8 text-green-700" />,
      examples: [
        "75% of eco-conscious consumers prefer brands with plastic-free packaging.",
        "55% of users who buy recycled paper products also use refillable water bottles.",
        "60% of consumers who support sustainable fashion choose second-hand clothing.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-8 flex flex-col items-center">
      {/* Animated Header */}
      <motion.h1
        className="text-4xl font-bold text-blue-900 mb-6 text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Consumer Spending Insights
        <span className="block w-24 h-1 bg-green-500 mt-2 mx-auto rounded-full"></span>
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Discover consumer behavior trends and spending patterns across different sectors.
      </p>

      {/* Stats Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {stats.map((section, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.3 }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <motion.div
                initial={{ rotate: -20 }}
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