import React, { useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { Star, Heart, ArrowLeftRight, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    navigateTo,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    removeFromCompare,
    isInCompare,
  } = useShop();

  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isWished = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product.id);
    }
  };

  const handleCardClick = () => {
    navigateTo('product-details', product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white border border-slate-200/90 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      {/* Top action buttons (Wishlist & Compare) */}
      <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleToggleWishlist}
          title={isWished ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-sm ${
            isWished
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-slate-600 hover:text-rose-600 hover:bg-white border border-slate-200/80'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleToggleCompare}
          title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all shadow-sm ${
            isCompared
              ? 'bg-blue-50 text-blue-600 border border-blue-200'
              : 'bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white border border-slate-200/80'
          }`}
          aria-label="Compare"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image container */}
      <div className="relative w-full pt-[75%] bg-[#F8F9FA] overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
            <span className="text-xs font-medium text-slate-500">{product.name}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Brand Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span>{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
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

        {/* Price & Action Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-bold text-slate-900 tabular-nums">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-[11px] text-slate-400 line-through tabular-nums">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
