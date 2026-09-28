import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import {
  ArrowLeftRight,
  Plus,
  Trash2,
  ShoppingBag,
  Star,
  Check,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const CompareView: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    addToCompare,
    addToCart,
    navigateTo,
  } = useShop();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [selectedToAdd, setSelectedToAdd] = useState('');

  const allProducts = productService.getAllProducts();
  const comparedProducts = productService.compareProducts(compareList);

  const availableToAdd = allProducts.filter(
    (p) => !compareList.includes(p.id)
  );

  const handleAddProduct = () => {
    if (selectedToAdd) {
      addToCompare(selectedToAdd);
      setSelectedToAdd('');
    }
  };

  const isValueDifferent = (extractor: (p: typeof comparedProducts[0]) => any) => {
    if (comparedProducts.length < 2) return false;
    const firstVal = extractor(comparedProducts[0]);
    return comparedProducts.some((p) => extractor(p) !== firstVal);
  };

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <ArrowLeftRight className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            No Products Selected for Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Select 2 to 4 products from our catalog to compare specifications, prices, processors, and customer ratings side-by-side.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigateTo('products')}
            className="px-5 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Explore Catalog
          </button>
          <button
            onClick={() => {
              addToCompare('prod-lap-01');
              addToCompare('prod-lap-02');
            }}
            className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Compare Sample Laptops (Ryzen 5 vs Core i5)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-medium">Product Comparison</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Compare Products
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparing <span className="font-semibold text-slate-900">{comparedProducts.length}</span> of 4 items
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Add product dropdown */}
          {compareList.length < 4 && availableToAdd.length > 0 && (
            <div className="flex items-center gap-1.5">
              <select
                value={selectedToAdd}
                onChange={(e) => setSelectedToAdd(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">+ Add product to compare...</option>
                {availableToAdd.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand})
                  </option>
                ))}
              </select>
              <button
                disabled={!selectedToAdd}
                onClick={handleAddProduct}
                className="p-2 bg-blue-600 disabled:bg-slate-300 text-white rounded-lg transition-colors"
                title="Add product"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Highlight toggle */}
          <button
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              highlightDifferences
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {highlightDifferences ? 'Highlighting Differences' : 'Highlight Differences'}
          </button>

          <button
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            {/* Header row with Product Images and CTAs */}
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70">
                <th className="p-4 w-44 min-w-[176px] font-bold text-slate-900 sticky left-0 bg-slate-50/95 backdrop-blur z-10 border-r border-slate-200">
                  Products ({comparedProducts.length})
                </th>
                {comparedProducts.map((p) => (
                  <th key={p.id} className="p-4 align-top w-64 min-w-[256px]">
                    <div className="space-y-3">
                      <div className="relative rounded-lg overflow-hidden bg-white border border-slate-200 aspect-4/3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-slate-500 hover:text-rose-600 shadow-sm"
                          title="Remove from comparison"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-400 font-semibold uppercase">
                          {p.brand}
                        </div>
                        <h4
                          onClick={() => navigateTo('product-details', p.id)}
                          className="font-bold text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                        >
                          {p.name}
                        </h4>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="text-base font-extrabold text-slate-900 tabular-nums">
                          {formatPrice(p.price)}
                        </div>
                        <button
                          onClick={() => addToCart(p, 1)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Buy</span>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {/* Rating */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.rating) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Rating
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-900">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{p.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({p.reviewsCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.price) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Price
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-bold text-slate-900 tabular-nums text-sm">
                    {formatPrice(p.price)}
                  </td>
                ))}
              </tr>

              {/* Processor */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.processor) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Processor
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-mono">
                    {p.specifications.processor || '—'}
                  </td>
                ))}
              </tr>

              {/* RAM */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.ram) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  RAM
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-mono">
                    {p.specifications.ram || '—'}
                  </td>
                ))}
              </tr>

              {/* Storage */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.storage) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Storage
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-mono">
                    {p.specifications.storage || '—'}
                  </td>
                ))}
              </tr>

              {/* Display */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.display) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Display
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800">
                    {p.specifications.display || '—'}
                  </td>
                ))}
              </tr>

              {/* Battery & Power */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.battery) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Battery & Power
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800">
                    {p.specifications.battery || '—'}
                  </td>
                ))}
              </tr>

              {/* OS */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.os) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Operating System
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800">
                    {p.specifications.os || '—'}
                  </td>
                ))}
              </tr>

              {/* Connectivity */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.connectivity) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Connectivity
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800">
                    {p.specifications.connectivity || '—'}
                  </td>
                ))}
              </tr>

              {/* Warranty */}
              <tr className={highlightDifferences && isValueDifferent((p) => p.specifications.warranty) ? 'bg-amber-50/50' : ''}>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Warranty
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-emerald-700 font-medium">
                    {p.specifications.warranty || '1 Year Standard Warranty'}
                  </td>
                ))}
              </tr>

              {/* Availability */}
              <tr>
                <td className="p-4 font-semibold text-slate-700 sticky left-0 bg-white border-r border-slate-200">
                  Availability
                </td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-slate-800 font-medium">
                    {p.availability}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
