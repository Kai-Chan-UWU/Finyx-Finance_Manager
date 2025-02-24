"use client"; // Ensures it runs on the client-side

import { Gift, Snowflake, Sun, Umbrella, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function SeasonalTrends() {
  const insights = [
    {
      category: "Holiday Spending",
      icon: <Gift className="w-8 h-8 text-red-600" />,
      examples: [
        "During Diwali, 80% of users increase their spending on sweets and gifts.",
        "During Christmas, 70% of users spend more on decorations and festive meals.",
        "During Back-to-School season, 60% of users allocate a significant portion of their budget to stationery and school supplies.",
      ],
    },
    {
      category: "Weather-Based Trends",
      icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
      examples: [
        "In summer, 65% of users spend more on cold beverages and ice cream.",
        "In winter, 75% of users allocate more of their budget to warm clothing and heaters.",
        "During monsoon, 50% of users spend on rain gear and indoor entertainment.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 p-8 flex flex-col items-center">
      {/* Animated Header */}
      <motion.h1
        className="text-4xl font-bold text-blue-900 mb-6 text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Seasonal Trends
        <span className="block w-24 h-1 bg-green-500 mt-2 mx-auto rounded-full"></span>
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Discover how seasons and holidays impact consumer spending habits.
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