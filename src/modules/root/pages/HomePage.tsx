import React, { useState } from 'react';
import LatestProduct from '../components/LatestProduct';
import CategorySection from './CategorySection';
import RegionSection from './RegionSection';
import PopularSection from './PopularSection';
import DiscountProducts from './DiscountProducts';
import ProductSuggestion from '../components/ProductSuggestion';

export default function HomePage() {

  return (
    <div className="min-h-screen pb-20">
      <main className="max-w-7xl mx-auto px-4 space-y-10 mt-6">
        <CategorySection />
        <LatestProduct />
        <RegionSection />
        <PopularSection />
        <DiscountProducts />
        <ProductSuggestion />
      </main>

    </div>
  );
}