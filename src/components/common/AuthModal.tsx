import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { X, Lock, Mail, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen, user, loginUser, logoutUser, orders, navigateTo } = useShop();
  const [tab, setTab] = useState<'login' | 'signup' | 'profile'>('login');
  const [name, setName] = useState('Alex Johnson');
  const [email, setEmail] = useState('alex@example.com');
  const [password, setPassword] = useState('••••••••');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      loginUser(name || 'Customer', email || 'customer@example.com');
    } else {
      loginUser(name || 'New Customer', email || 'customer@example.com');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              {user?.isLoggedIn
                ? 'Your ShopMate Account'
                : tab === 'login'
                ? 'Welcome Back'
                : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {user?.isLoggedIn
                ? 'Manage your orders and saved items'
                : 'Sign in to access your orders, wishlist, and fast checkout'}
            </p>
          </div>
          <button
            onClick={() => setAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {user?.isLoggedIn ? (
          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-lg border border-slate-200/70">
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recent Orders ({orders.length})
              </h4>
              {orders.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-slate-500 text-xs">
                  No orders placed yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-3 bg-white border border-slate-200 rounded-lg text-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-900">{order.id}</div>
                        <div className="text-slate-500">{order.date} · {order.items.length} item(s)</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-slate-900 tabular-nums">
                          ₹{order.total.toLocaleString('en-IN')}
                        </div>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setAuthModalOpen(false);
                  navigateTo('products');
                }}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                Browse Catalog
              </button>
              <button
                onClick={logoutUser}
                className="px-3.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Tab switch */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg mb-5">
              <button
                onClick={() => setTab('login')}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === 'login'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('signup')}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === 'signup'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Johnson"
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all duration-150"
              >
                {tab === 'login' ? 'Sign In to ShopMate' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500">
                Demo Mode: Click Sign In to instantly access your demo profile with prefilled orders.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
