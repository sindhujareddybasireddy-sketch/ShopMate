import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  ChevronRight,
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    navigateTo,
    setCheckoutModalOpen,
    showToast,
  } = useShop();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const { subtotal, deliveryFee } = getCartTotal();
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount + deliveryFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'TECH10' || code === 'SHOPMATE') {
      setDiscountPercent(10);
      showToast('Promo code applied: 10% savings added!');
    } else if (code === 'FREESHIP') {
      setDiscountPercent(5);
      showToast('Promo code applied: 5% savings added!');
    } else {
      showToast('Invalid promo code. Try "TECH10"', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            You haven't added any products to your shopping bag yet. Explore our curated catalog of electronics.
          </p>
        </div>
        <button
          onClick={() => navigateTo('products')}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <button onClick={() => navigateTo('home')} className="hover:text-blue-600">
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-medium">Shopping Cart</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-slate-200 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Product Info */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div
                    onClick={() => navigateTo('product-details', product.id)}
                    className="w-20 h-20 rounded-lg overflow-hidden bg-[#F8F9FA] border border-slate-200 shrink-0 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase">
                      {product.brand} · {product.category}
                    </div>
                    <h3
                      onClick={() => navigateTo('product-details', product.id)}
                      className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {product.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Unit Price: <span className="font-semibold text-slate-800 tabular-nums">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity - 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-slate-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(product.id, quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <div className="text-sm font-bold text-slate-900 tabular-nums">
                      {formatPrice(product.price * quantity)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-slate-50"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <button
              onClick={() => navigateTo('products')}
              className="text-blue-600 font-semibold hover:underline"
            >
              ← Continue Shopping
            </button>
            <span className="text-slate-400">ShopMate 100% Buyer Protection</span>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Order Summary
            </h3>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon (e.g. TECH10)"
                  className="w-full pl-8 pr-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </form>

            {/* Price Calculations */}
            <div className="space-y-3 pt-2 text-xs border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span className="tabular-nums">- {formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery</span>
                <span className="font-semibold text-emerald-600">
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-lg font-extrabold text-slate-900 tabular-nums">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all duration-150 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
