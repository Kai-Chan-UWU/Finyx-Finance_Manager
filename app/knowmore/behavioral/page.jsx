"use client"; // Ensures client-side rendering

import { ShoppingCart, Bell, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function BehavioralInsights() {
  const insights = [
    {
      category: "Impulse Buying",
      icon: <ShoppingCart className="w-8 h-8 text-red-600" />,
      examples: [
        "40% of users make impulse purchases when they see limited-time offers.",
        "55% of users are more likely to buy add-on items when offered a discount on the main product.",
        "30% of users make unplanned purchases after receiving personalized recommendations.",
      ],
    },
    {
      category: "Subscription Preferences",
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      examples: [
        "50% of users prefer monthly subscriptions for streaming services.",
        "35% of users opt for annual subscriptions to save 20% on costs.",
        "25% of users cancel subscriptions after the first month.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8 flex flex-col items-center">
      {/* Animated Header */}
      <motion.h1
        className="text-4xl font-bold text-blue-900 mb-6 text-center relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Behavioral Insights
        <span className="block w-24 h-1 bg-red-500 mt-2 mx-auto rounded-full"></span>
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Analyze user behavior, impulse purchases, and subscription trends.
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