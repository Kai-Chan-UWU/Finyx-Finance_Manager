"use client"; // Ensures it runs on the client-side

import { MapPin, Globe, Utensils, Running, Beer } from "lucide-react";
import { motion } from "framer-motion";

export default function GeographicTrends() {
  const insights = [
    {
      category: "Regional Preferences",
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      examples: [
        "Users in urban areas spend 20% more on ride-sharing services compared to rural areas.",
        "Users in coastal regions allocate 35% more of their budget to seafood and fresh produce.",
        "Users in mountainous regions spend 25% more on outdoor gear and adventure sports.",
      ],
    },
    {
      category: "City-Specific Insights",
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      examples: [
        "In New York City, 60% of users prefer gourmet food delivery over cooking at home.",
        "In Los Angeles, 70% of users spend on fitness classes and wellness products.",
        "In Chicago, 50% of users allocate a significant portion of their budget to local breweries and craft beer.",
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
        Geographic Trends
        <span className="block w-24 h-1 bg-green-500 mt-2 mx-auto rounded-full"></span>
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Explore spending patterns based on region and city preferences.
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