import React, { useState, useMemo } from 'react';
import { useShop } from '../../context/ShopContext';
import { productService } from '../../services/productService';
import { FilterOptions } from '../../types';
import { ProductCard } from '../common/ProductCard';
import {
  Search,
  SlidersHorizontal,
  X,
  RotateCcw,
  ChevronDown,
  Star,
  Check,
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useShop();

  const metadata = useMemo(() => productService.getAvailableFilterMetadata(), []);

  // Filter state
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<FilterOptions['sortBy']>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Compute filtered products
  const filteredProducts = useMemo(() => {
    return productService.filterProducts({
      searchQuery,
      category: selectedCategory,
      priceRange,
      brands: selectedBrands,
      minRating,
      ram: selectedRam,
      storage: selectedStorage,
      sortBy,
    });
  }, [
    searchQuery,
    selectedCategory,
    priceRange,
    selectedBrands,
    minRating,
    selectedRam,
    selectedStorage,
    sortBy,
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRam = (ramVal: string) => {
    setSelectedRam((prev) =>
      prev.includes(ramVal) ? prev.filter((r) => r !== ramVal) : [...prev, ramVal]
    );
  };

  const toggleStorage = (storageVal: string) => {
    setSelectedStorage((prev) =>
      prev.includes(storageVal)
        ? prev.filter((s) => s !== storageVal)
        : [...prev, storageVal]
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange('all');
    setSelectedBrands([]);
    setMinRating(0);
    setSelectedRam([]);
    setSelectedStorage([]);
    setSortBy('featured');
  };

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    selectedBrands.length +
    (minRating > 0 ? 1 : 0) +
    selectedRam.length +
    selectedStorage.length +
    (searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-semibold text-slate-900 tabular-nums">{filteredProducts.length}</span> items
            {searchQuery && (
              <span> for query "{searchQuery}"</span>
            )}
          </p>
        </div>

        {/* Search Bar & Sort Dropdown */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword (e.g. Ryzen, 16 GB)..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as FilterOptions['sortBy'])}
              className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({activeFiltersCount})</span>
          </button>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block md:col-span-1 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Category
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === 'All'
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {metadata.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Price
            </h4>
            <div className="space-y-1.5">
              {metadata.priceRanges.map((range) => (
                <label
                  key={range.id}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === range.id}
                    onChange={() => setPriceRange(range.id)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                  />
                  <span>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Brand
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {metadata.brands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 rounded border-slate-300"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Customer Rating
            </h4>
            <div className="space-y-1.5">
              {[4, 3, 2].map((stars) => (
                <label
                  key={stars}
                  className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                >
                  <input
                    type="radio"
                    name="ratingFilter"
                    checked={minRating === stars}
                    onChange={() => setMinRating(stars)}
                    className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-slate-800 font-medium">{stars}★ & above</span>
                  </div>
                </label>
              ))}
              {minRating > 0 && (
                <button
                  onClick={() => setMinRating(0)}
                  className="text-[11px] text-blue-600 hover:underline pt-1 block"
                >
                  Clear rating filter
                </button>
              )}
            </div>
          </div>

          {/* RAM Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              RAM
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {metadata.ramOptions.map((ram) => {
                const isSelected = selectedRam.includes(ram);
                return (
                  <button
                    key={ram}
                    type="button"
                    onClick={() => toggleRam(ram)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded border text-center transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {ram}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Storage Filter */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Storage
            </h4>
            <div className="grid grid-cols-2 gap-1.5">
              {metadata.storageOptions.map((stor) => {
                const isSelected = selectedStorage.includes(stor);
                return (
                  <button
                    key={stor}
                    type="button"
                    onClick={() => toggleStorage(stor)}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded border text-center transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {stor}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-3 space-y-4">
          {/* Active Filter Badges */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <span className="text-slate-500 font-medium">Active Filters:</span>

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}

              {priceRange !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                  {metadata.priceRanges.find((r) => r.id === priceRange)?.label}
                  <button onClick={() => setPriceRange('all')}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}

              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700"
                >
                  {b}
                  <button onClick={() => toggleBrand(b)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              ))}

              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700">
                  {minRating}★+
                  <button onClick={() => setMinRating(0)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              )}

              {selectedRam.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700"
                >
                  RAM: {r}
                  <button onClick={() => toggleRam(r)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              ))}

              {selectedStorage.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700"
                >
                  Storage: {s}
                  <button onClick={() => toggleStorage(s)}>
                    <X className="w-3 h-3 text-slate-400 hover:text-slate-600" />
                  </button>
                </span>
              ))}

              <button
                onClick={handleResetFilters}
                className="text-xs text-blue-600 hover:underline font-semibold ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white border border-dashed border-slate-300 rounded-xl p-8 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-slate-900">
                  No matching products found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search criteria, clearing selected brands or widening your price range.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white h-full ml-auto p-5 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-semibold text-slate-900 text-sm">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium ${
                      selectedCategory === 'All' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
                    }`}
                  >
                    All Categories
                  </button>
                  {metadata.categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium ${
                        selectedCategory === c ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Price
                </h4>
                <div className="space-y-1.5">
                  {metadata.priceRanges.map((r) => (
                    <label key={r.id} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="radio"
                        name="mobilePrice"
                        checked={priceRange === r.id}
                        onChange={() => setPriceRange(r.id)}
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Brand
                </h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {metadata.brands.map((b) => (
                    <label key={b} className="flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => toggleBrand(b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
