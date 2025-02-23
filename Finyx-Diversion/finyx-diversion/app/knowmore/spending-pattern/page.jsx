"use client"; // Ensures client-side rendering

import { ShoppingCart, Smile, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";

export default function SpendingHabits() {
  const insights = [
    {
      category: "Essentials",
      icon: <ShoppingCart className="w-8 h-8 text-blue-600" />,
      examples: [
        "80% of users allocate at least 50% of their budget to groceries and rent.",
        "60% of urban users spend more on convenience food than home-cooked meals.",
        "45% of people prioritize utility bills over entertainment expenses.",
      ],
    },
    {
      category: "Leisure & Entertainment",
      icon: <Smile className="w-8 h-8 text-green-600" />,
      examples: [
        "70% of young adults spend a significant part of their budget on streaming services and online gaming.",
        "50% of users allocate money for weekend outings at least twice a month.",
        "35% of users prefer spending on experiences like concerts and travel over physical goods.",
      ],
    },
    {
      category: "Savings & Investments",
      icon: <PiggyBank className="w-8 h-8 text-red-600" />,
      examples: [
        "65% of users save at least 20% of their income every month.",
        "40% of young professionals invest in mutual funds and stock markets.",
        "30% of people prioritize emergency funds over long-term savings.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8 flex flex-col items-center">
      {/* Animated Header */}
      <motion.h1
        className="text-4xl font-bold text-blue-900 mb-6 text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Spending Habits Insights
        <span className="block w-24 h-1 bg-blue-500 mt-2 mx-auto rounded-full"></span>
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Discover how people manage their expenses across essentials, leisure, and savings.
      </p>

      {/* Stats Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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