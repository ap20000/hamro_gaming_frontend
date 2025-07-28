import FeaturedProducts from "@/components/ui/user/featured_products";
import HeroSection from "@/components/ui/user/hero_section";
import ProductCategories from "@/components/ui/user/prouduct_categories";
import React, { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading top-up games...</div>}>
      <div className="bg-gaming-black">
        <HeroSection />
        <ProductCategories />
        <FeaturedProducts />
      </div>
    </Suspense>
  );
}
