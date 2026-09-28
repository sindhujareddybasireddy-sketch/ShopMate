import React, { useState } from 'react';
import { useShop, ViewType } from '../../context/ShopContext';
import {
  ShoppingBag,
  Heart,
  ArrowLeftRight,
  User,
  Search,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    navigateTo,
    cart,
    wishlist,
    compareList,
    user,
    setAuthModalOpen,
    searchQuery,
    setSearchQuery,
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearchInput, setNavSearchInput] = useState('');

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavClick = (view: ViewType) => {
    setMobileMenuOpen(false);
    navigateTo(view);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchInput.trim()) {
      setSearchQuery(navSearchInput.trim());
      navigateTo('products');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-left group"
              aria-label="ShopMate Home"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-blue-700 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                ShopMate
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-blue-600 transition-colors py-1 ${
                activeView === 'home' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`hover:text-blue-600 transition-colors py-1 ${
                activeView === 'products' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`hover:text-blue-600 transition-colors py-1 ${
                activeView === 'categories' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('compare')}
              className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 ${
                activeView === 'compare' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-semibold bg-blue-100 text-blue-700 rounded-full tabular-nums">
                  {compareList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('wishlist')}
              className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 ${
                activeView === 'wishlist' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-semibold bg-rose-100 text-rose-700 rounded-full tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('cart')}
              className={`flex items-center gap-1.5 hover:text-blue-600 transition-colors py-1 ${
                activeView === 'cart' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-semibold bg-blue-600 text-white rounded-full tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Search trigger, Auth, Mobile Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick search input (visible on lg screens) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block relative w-48 xl:w-60">
              <input
                type="text"
                value={navSearchInput}
                onChange={(e) => setNavSearchInput(e.target.value)}
                placeholder="Quick search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Wishlist icon for quick access */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart icon for quick access */}
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Login / Sign Up or Account Profile Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">
                {user?.isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={navSearchInput}
              onChange={(e) => setNavSearchInput(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 text-left text-sm rounded-lg ${
                activeView === 'home'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`p-2.5 text-left text-sm rounded-lg ${
                activeView === 'products'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleNavClick('categories')}
              className={`p-2.5 text-left text-sm rounded-lg ${
                activeView === 'categories'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => handleNavClick('compare')}
              className={`p-2.5 text-left text-sm rounded-lg flex items-center justify-between ${
                activeView === 'compare'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">
                  {compareList.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('wishlist')}
              className={`p-2.5 text-left text-sm rounded-lg flex items-center justify-between ${
                activeView === 'wishlist'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Wishlist</span>
              {wishlist.length > 0 && (
                <span className="text-xs bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNavClick('cart')}
              className={`p-2.5 text-left text-sm rounded-lg flex items-center justify-between ${
                activeView === 'cart'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="text-xs bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
