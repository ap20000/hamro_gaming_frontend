"use client";

import { Gift, Coins, Trophy, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProductCategories() {
  const router = useRouter();
  const categories = [
    // {
    //   id: 1,
    //   title: "PC Games",
    //   description: "Latest AAA titles and indie gems",
    //   icon: Gamepad2,
    //   color: "from-purple-500 to-purple-700",
    // },
    {
      id: 1,
      title: "Gift Cards",
      description: "Steam, Epic, PlayStation & more",
      icon: Gift,
      color: "from-green-500 to-green-700",
      href: "/products/giftcard",
    },
    {
      id: 2,
      title: "Game Top-Up",
      description: "Instant currency for mobile games",
      icon: Coins,
      color: "from-yellow-500 to-yellow-700",
      href: "/products/top-up",
    },
    // {
    //   id: 4,
    //   title: "Instant Delivery",
    //   description: "Get your codes immediately",
    //   icon: Zap,
    //   color: "from-blue-500 to-blue-700",
    // },
    {
      id: 3,
      title: "Premium Accounts",
      description: "Subscriptions & premium services",
      icon: Trophy,
      color: "from-red-500 to-red-700",
      href: "/products/accounts",
    },
    // {
    //   id: 6,
    //   title: "Exclusive Deals",
    //   description: "Limited time offers & bundles",
    //   icon: Star,
    //   color: "from-pink-500 to-pink-700",
    // },
  ];

  return (
    <section className="py-16 bg-[var(--gaming-black)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-orbitron text-4xl md:text-5xl font-bold text-[var(--gaming-white)] mb-4 uppercase">
            Game Categories
          </h2>
          <p className="font-sans text-lg text-[var(--gaming-white)]/80 max-w-2xl mx-auto">
            Discover our wide range of gaming products and services
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => router.push(category.href)}
                className="group relative bg-[var(--gaming-gray)]/20 border border-[var(--gaming-gray)]/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-[var(--gaming-gray)]/30 hover:border-[var(--gaming-blue)]/50 hover:scale-105 hover:shadow-lg hover:shadow-[var(--gaming-blue)]/10"
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="font-orbitron text-xl font-bold text-[var(--gaming-white)] uppercase">
                    {category.title}
                  </h3>
                  <p className="font-sans text-[var(--gaming-white)]/70 text-sm leading-relaxed">
                    {category.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-end pt-3">
                    <ArrowRight className="w-4 h-4 text-[var(--gaming-white)]/50 group-hover:text-[var(--gaming-electric-blue)] group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>

                {/* Hover Effect Background */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[var(--gaming-blue)]/5 to-[var(--gaming-electric-blue)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            className="group relative px-8 py-4 bg-transparent border-2 border-gaming-blue text-gaming-white font-orbitron font-bold uppercase 
          tracking-wide rounded-lg overflow-hidden transition-all duration-300 hover:bg-gaming-blue hover:scale-105"
            onClick={() => router.push("/products/accounts")}
          >
            <span className="relative z-10 flex items-center space-x-2">
              <span>View All Categories</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
