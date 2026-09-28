import React from 'react';
import { useShop } from '../../context/ShopContext';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/formatters';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ChevronRight,
  ArrowRight,
  Star,
} from 'lucide-react';

export const WishlistView: React.FC = () => {
  const {
    wishlist,
    removeFromWishlist,
    moveToCartFromWishlist,
    navigateTo,
    addToCart,
    showToast,
  } = useShop();

  const wishedProducts = wishlist
    .map((id) => productService.getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const handleMoveAllToCart = () => {
    wishedProducts.forEach((p) => {
      addToCart(p, 1);
      removeFromWishlist(p.id);
    });
    showToast(`Moved all ${wishedProducts.length} items to your shopping cart!`);
  };

  if (wishedProducts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
          <Heart className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Your Wishlist is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Save items you're interested in by tapping the heart icon on any product card while browsing.
          </p>
        </div>
        <button
          onClick={() => navigateTo('products')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-medium">Saved Items</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            My Wishlist
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            You have <span className="font-semibold text-slate-900">{wishedProducts.length}</span> saved item(s)
          </p>
        </div>

        <button
          onClick={handleMoveAllToCart}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Move All to Cart</span>
        </button>
      </div>

      {/* Grid of Wishlisted items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishedProducts.map((product) => (
          <div
            key={product.id}
            className="group relative flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200"
          >
            {/* Remove button */}
            <button
              onClick={() => removeFromWishlist(product.id)}
              className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 text-slate-400 hover:text-rose-600 flex items-center justify-center shadow-sm border border-slate-200 transition-colors"
              title="Remove from wishlist"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Image */}
            <div
              onClick={() => navigateTo('product-details', product.id)}
              className="relative w-full pt-[75%] bg-[#F8F9FA] overflow-hidden cursor-pointer"
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <span>{product.brand}</span>
                  <span>·</span>
                  <span>{product.category}</span>
                </div>

                <h3
                  onClick={() => navigateTo('product-details', product.id)}
                  className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors cursor-pointer"
                >
                  {product.name}
                </h3>

                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-semibold text-slate-800 tabular-nums">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">({product.reviewsCount})</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-base font-bold text-slate-900 tabular-nums">
                  {formatPrice(product.price)}
                </div>

                <button
                  onClick={() => moveToCartFromWishlist(product.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
