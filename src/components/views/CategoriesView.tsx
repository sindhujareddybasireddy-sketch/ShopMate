import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES } from '../../data/products';
import { productService } from '../../services/productService';
import {
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Monitor,
  Sliders,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Laptops: Laptop,
  Mobiles: Smartphone,
  Audio: Headphones,
  Smartwatches: Watch,
  Monitors: Monitor,
  Accessories: Sliders,
};

export const CategoriesView: React.FC = () => {
  const { navigateTo } = useShop();

  const handleSelectCategory = (catName: string) => {
    navigateTo('products', undefined, catName);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <button onClick={() => navigateTo('home')} className="hover:text-blue-600">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-medium">Categories</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Explore Product Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
          Browse our curated departments of consumer electronics, high-performance computing, audio gear, and precision accessories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.name] || Sliders;
          const count = productService.getProductsByCategory(cat.name).length;

          return (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.name)}
              className="group relative flex flex-col bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              {/* Image Preview Container */}
              <div className="relative w-full h-48 bg-[#F8F9FA] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <div className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-sm">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <span className="text-xs font-semibold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                    {count} products
                  </span>
                </div>
              </div>

              {/* Text Description */}
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                  <span>Browse {cat.name}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
