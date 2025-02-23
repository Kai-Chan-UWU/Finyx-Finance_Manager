"use client"; // Ensures it runs on the client-side

import { Users, BarChart, HeartPulse, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function DemographicInsights() {
  const insights = [
    {
      category: "Age-Based Trends",
      icon: <BarChart className="w-8 h-8 text-blue-600" />,
      examples: [
        "Millennials (25-34) spend 40% more on meal delivery services compared to other age groups.",
        "Gen Z (18-24) prefers budget-friendly fashion brands and spends 30% less on luxury items.",
        "Baby Boomers (55+) allocate 50% of their grocery budget to health-focused products.",
      ],
    },
    {
      category: "Gender-Based Trends",
      icon: <Users className="w-8 h-8 text-green-600" />,
      examples: [
        "Women spend 25% more on self-care products (e.g., skincare, haircare) compared to men.",
        "Men allocate 30% more of their budget to electronics and gadgets.",
        "Non-binary individuals show a 15% higher preference for sustainable and ethical brands.",
      ],
    },
    {
      category: "Health & Lifestyle Trends",
      icon: <HeartPulse className="w-8 h-8 text-red-600" />,
      examples: [
        "45% of fitness-conscious consumers prefer plant-based diets.",
        "60% of seniors (65+) spend more on organic and health supplements.",
        "Gen Z is 2x more likely to buy mental health wellness subscriptions.",
      ],
    },
    {
      category: "Spending Preferences",
      icon: <ShoppingBag className="w-8 h-8 text-purple-600" />,
      examples: [
        "High-income individuals spend 3x more on premium subscription services.",
        "Lower-income households allocate 70% of their spending to essentials.",
        "Luxury fashion spending is highest among consumers aged 35-50.",
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
        Demographic Insights
        <span className="block w-24 h-1 bg-green-500 mt-2 mx-auto rounded-full"></span>
      </motion.h1>

      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Explore spending habits based on age, gender, and lifestyle.
      </p>

      {/* Stats Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6">
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