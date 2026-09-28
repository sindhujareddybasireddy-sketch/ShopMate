/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';
import { CheckoutModal } from './components/views/CheckoutModal';
import { HomeView } from './components/views/HomeView';
import { ProductsView } from './components/views/ProductsView';
import { CategoriesView } from './components/views/CategoriesView';
import { ProductDetailsView } from './components/views/ProductDetailsView';
import { CompareView } from './components/views/CompareView';
import { WishlistView } from './components/views/WishlistView';
import { CartView } from './components/views/CartView';

const MainContent: React.FC = () => {
  const { activeView } = useShop();

  return (
    <main className="min-h-[calc(100vh-16rem)]">
      {activeView === 'home' && <HomeView />}
      {activeView === 'products' && <ProductsView />}
      {activeView === 'categories' && <CategoriesView />}
      {activeView === 'product-details' && <ProductDetailsView />}
      {activeView === 'compare' && <CompareView />}
      {activeView === 'wishlist' && <WishlistView />}
      {activeView === 'cart' && <CartView />}
    </main>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <div className="flex-1">
          <MainContent />
        </div>
        <Footer />
        
        {/* Modals & Portals */}
        <AuthModal />
        <CheckoutModal />
        <ToastContainer />
      </div>
    </ShopProvider>
  );
}
