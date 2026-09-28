import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { formatPrice } from '../../utils/formatters';
import { UserOrder } from '../../types';
import {
  X,
  CheckCircle2,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  PackageCheck,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setCheckoutModalOpen,
    cart,
    getCartTotal,
    placeOrder,
    navigateTo,
  } = useShop();

  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [confirmedOrder, setConfirmedOrder] = useState<UserOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Alex Johnson',
    phone: '+91 98765 43210',
    email: 'alex.johnson@example.com',
    street: 'Flat 402, Skyline Residency, Outer Ring Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');

  if (!isCheckoutModalOpen) return null;

  const { subtotal, deliveryFee, total } = getCartTotal();

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const methodNames: Record<string, string> = {
      cod: 'Cash on Delivery (COD)',
      upi: 'Instant UPI / QR Payment',
      card: 'Credit / Debit Card',
    };

    const order = placeOrder({
      items: cart,
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      shippingAddress: formData,
      paymentMethod: methodNames[paymentMethod],
    });

    setConfirmedOrder(order);
    setStep('confirmed');
  };

  const handleClose = () => {
    setCheckoutModalOpen(false);
    setStep('details');
    setConfirmedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900">
              {step === 'confirmed' ? 'Order Successful' : 'ShopMate Express Checkout'}
            </span>
            {step !== 'confirmed' && (
              <span className="text-xs text-slate-400">
                · Step {step === 'details' ? '1 of 2' : '2 of 2'}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content based on Step */}
        <div className="p-6">
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Standard Delivery: Free guaranteed delivery in 2 business days</span>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  1. Shipping Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email for Invoice *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Street Address & Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Order total snapshot */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Order Subtotal:</span>{' '}
                  <span className="font-semibold text-slate-900 tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Total Payable:</span>{' '}
                  <span className="text-sm font-bold text-slate-900 tabular-nums">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Payment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  2. Select Payment Method
                </h4>

                <div className="space-y-2.5">
                  <label
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Cash on Delivery (COD) / Pay on Delivery
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Pay in cash or scan QR on arrival via UPI. No advance payment required.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Instant UPI / Google Pay / PhonePe / Paytm
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Zero transaction fees with instant payment confirmation.
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3.5 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mt-0.5 text-blue-600"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-bold text-slate-900">
                          Credit / Debit Card (Visa, MasterCard, RuPay)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Supports EMI and full 3D secure authentication.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery destination summary */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Delivering to:</span>
                  <button
                    onClick={() => setStep('details')}
                    className="text-blue-600 hover:underline font-medium text-[11px]"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-semibold text-slate-900">
                  {formData.fullName} ({formData.phone})
                </p>
                <p className="text-slate-600">
                  {formData.street}, {formData.city}, {formData.state} - {formData.pincode}
                </p>
              </div>

              {/* Final Place Order */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order ({formatPrice(total)})</span>
                </button>
              </div>
            </div>
          )}

          {step === 'confirmed' && confirmedOrder && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <PackageCheck className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                  Payment & Order Verified
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Order {confirmedOrder.id} Confirmed!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Preparing shipment for delivery to {confirmedOrder.shippingAddress.city}. We've sent a detailed confirmation invoice to {confirmedOrder.shippingAddress.email}.
                </p>
              </div>

              {/* Receipt Breakdown Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-3 max-w-md mx-auto">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Order Number</span>
                  <span className="font-mono font-bold text-slate-900">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Mode</span>
                  <span className="font-medium text-slate-900">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Delivery</span>
                  <span className="font-medium text-emerald-700">3 Business Days (Express)</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total Amount Paid / Due</span>
                  <span className="tabular-nums">{formatPrice(confirmedOrder.total)}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    navigateTo('products');
                  }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
