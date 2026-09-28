import React from 'react';
import { useShop, ViewType } from '../../context/ShopContext';
import { ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useShop();

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600 text-sm">
      {/* Trust Badges Bar */}
      <div className="border-b border-slate-100 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm">Free Express Delivery</p>
                <p className="text-xs text-slate-500">On all orders across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm">1-Year Brand Warranty</p>
                <p className="text-xs text-slate-500">100% genuine guaranteed products</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm">7-Day Easy Returns</p>
                <p className="text-xs text-slate-500">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-xs sm:text-sm">24/7 Expert Support</p>
                <p className="text-xs text-slate-500">Ready assistance for all tech needs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">ShopMate</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Your trusted destination for modern consumer electronics, laptops, flagship smartphones, studio audio gear, and precision peripherals. Built for quality and seamless shopping.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Catalog
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('products', undefined, 'Laptops')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Laptops & Ultrabooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', undefined, 'Mobiles')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Smartphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', undefined, 'Audio')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Audio & Headphones
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', undefined, 'Smartwatches')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Smartwatches
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products', undefined, 'Monitors')}
                  className="hover:text-blue-600 transition-colors"
                >
                  4K Monitors
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('compare')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Compare Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('wishlist')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Saved Wishlist
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('cart')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('products')}
                  className="hover:text-blue-600 transition-colors"
                >
                  All Products
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>Track Order</li>
              <li>Warranty & Claims</li>
              <li>Shipping & Delivery Policy</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ShopMate Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Secure 256-bit SSL Checkout</span>
            <span>·</span>
            <span>UPI & Cards Accepted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
