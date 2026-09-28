import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { productService } from '../../services/productService';
import { CATEGORIES, heroTechEcosystem } from '../../data/products';
import { ProductCard } from '../common/ProductCard';
import {
  Search,
  ArrowRight,
  Sparkles,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Monitor,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Laptops: Laptop,
  Mobiles: Smartphone,
  Audio: Headphones,
  Smartwatches: Watch,
  Monitors: Monitor,
  Accessories: Sliders,
};

export const HomeView: React.FC = () => {
  const { navigateTo, setSearchQuery } = useShop();
  const [heroSearchInput, setHeroSearchInput] = useState('');

  const trendingProducts = productService.getTrendingProducts(8);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      setSearchQuery(heroSearchInput.trim());
      navigateTo('products');
    }
  };

  const handleCategorySelect = (categoryName: string) => {
    navigateTo('products', undefined, categoryName);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Tech & Electronics</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                Everything you need, <br className="hidden sm:inline" />
                all in one place.
              </h1>

              <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                Discover flagship smartphones, creator laptops, audiophile sound, and precision gear backed by official brand warranty and lightning-fast delivery.
              </p>

              {/* Prominent Search Bar */}
              <form
                onSubmit={handleHeroSearch}
                className="relative max-w-xl flex items-center shadow-sm"
              >
                <div className="relative w-full">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={heroSearchInput}
                    onChange={(e) => setHeroSearchInput(e.target.value)}
                    placeholder="Search for products, brands, specs (e.g. Ryzen 5, iPhone, Sony)..."
                    className="w-full pl-11 pr-28 py-3.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Product Categories below search bar */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Popular Categories
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
                  {CATEGORIES.map((cat) => {
                    const IconComponent = CATEGORY_ICONS[cat.name] || Sliders;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.name)}
                        className="group flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-blue-500 hover:shadow-sm transition-all duration-150 text-center"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-slate-700 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors mb-1.5 shadow-2xs">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-medium text-slate-800 group-hover:text-blue-600 transition-colors">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 group">
                <img
                  src={heroTechEcosystem}
                  alt="ShopMate Electronics Ecosystem"
                  className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-medium text-slate-300">Curated Collection</div>
                  <h3 className="text-xl font-bold text-white mt-1">
                    Studio Audio & Creator Workstations
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-slate-200">From ₹2,499</span>
                    <button
                      onClick={() => navigateTo('products')}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-white/20 backdrop-blur-md hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              Top Picks This Week
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Trending Products
            </h2>
          </div>

          <button
            onClick={() => navigateTo('products')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 to 8 Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Feature Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 sm:p-10 shadow-lg border border-slate-700/60">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                ShopMate Guarantee
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Compare models spec-by-spec before making your decision.
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Unsure between Ryzen 5 vs Intel Core i5 or Titanium vs Aluminum? Add products to our comparison engine to evaluate display, RAM, processor benchmarks, and warranty side-by-side.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end">
              <button
                onClick={() => navigateTo('compare')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition-all duration-150 whitespace-nowrap"
              >
                Launch Comparison Tool
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
