"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Map,
  ShoppingCart,
  TrendingUp,
  Gift,
  User,
  Calendar,
  Activity,
} from "lucide-react";

export default function KnowMore() {
  const insights = [
    { title: "Consumer", icon: <Users className="w-8 h-8 text-emerald-500" />, path: "/knowmore/consumer", description: "Understand consumer behavior, preferences, and spending habits." },
    { title: "Geographic", icon: <Map className="w-8 h-8 text-emerald-500" />, path: "/knowmore/geographic", description: "Explore spending patterns and trends across different regions." },
    { title: "Spending Pattern", icon: <ShoppingCart className="w-8 h-8 text-emerald-500" />, path: "/knowmore/spending-pattern", description: "Analyze how users allocate their budgets across categories." },
    { title: "Trends", icon: <TrendingUp className="w-8 h-8 text-emerald-500" />, path: "/knowmore/trends", description: "Discover the latest trends in consumer spending and behavior." },
    { title: "Loyalty & Coupons", icon: <Gift className="w-8 h-8 text-emerald-500" />, path: "/knowmore/loyalty-coupons", description: "Learn how loyalty programs and coupons drive user engagement." },
    { title: "Demographic", icon: <User className="w-8 h-8 text-emerald-500" />, path: "/knowmore/demographic", description: "Gain insights into spending habits by age, gender, and income." },
    { title: "Seasonal", icon: <Calendar className="w-8 h-8 text-emerald-500" />, path: "/knowmore/seasonal", description: "Understand how seasonal changes impact consumer spending." },
    { title: "Behavioral", icon: <Activity className="w-8 h-8 text-emerald-500" />, path: "/knowmore/behavioral", description: "Analyze user behavior and decision-making patterns." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50 p-8">
      {/* Title */}
      <h1 className="text-3xl font-bold text-emerald-600 text-center mb-8">
      ✨Know More✨</h1>
      
      {/* Grid and Animated Section */}
      <div className="flex-grow flex flex-col">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-grow">
          {insights.map((insight, index) => (
            <Link key={index} href={insight.path}>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <div className="text-blue-600 mb-4">{insight.icon}</div>
                  <h2 className="text-xl font-semibold text-green-700 mb-2">{insight.title}</h2>
                  <p className="text-gray-600">{insight.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Animated Bottom Section */}
        <motion.div
          className="h-40 w-full flex justify-center items-center mt-6 bg-white shadow-md rounded-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <p className="text-xl font-semibold text-blue-900">Enhance your insights with real-time data!</p>
        </motion.div>
      </div>
    </div>
  );
}
