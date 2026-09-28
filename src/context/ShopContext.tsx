import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, UserOrder } from '../types';
import { productService } from '../services/productService';

export type ViewType =
  | 'home'
  | 'products'
  | 'categories'
  | 'product-details'
  | 'compare'
  | 'wishlist'
  | 'cart';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface UserState {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: string[];
  compareList: string[];
  activeView: ViewType;
  selectedProductId: string | null;
  selectedCategory: string;
  searchQuery: string;
  user: UserState | null;
  orders: UserOrder[];
  isAuthModalOpen: boolean;
  isCheckoutModalOpen: boolean;
  toasts: ToastState[];
  
  // Navigation & Filtering
  navigateTo: (view: ViewType, productId?: string, category?: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; deliveryFee: number; total: number; itemCount: number };
  
  // Wishlist Actions
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  moveToCartFromWishlist: (productId: string) => void;
  
  // Compare Actions
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  
  // Auth & Checkout
  setAuthModalOpen: (open: boolean) => void;
  setCheckoutModalOpen: (open: boolean) => void;
  loginUser: (name: string, email: string) => void;
  logoutUser: () => void;
  placeOrder: (orderData: Omit<UserOrder, 'id' | 'date' | 'status'>) => UserOrder;
  
  // Feedback
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart State with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State with localStorage persistence
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare State with localStorage persistence
  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_compare');
      return saved ? JSON.parse(saved) : ['prod-lap-01', 'prod-lap-02']; // default 2 comparison items
    } catch {
      return ['prod-lap-01', 'prod-lap-02'];
    }
  });

  // User & Orders State
  const [user, setUser] = useState<UserState | null>(() => {
    try {
      const saved = localStorage.getItem('shopmate_user');
      return saved ? JSON.parse(saved) : { name: 'Alex Johnson', email: 'alex@example.com', isLoggedIn: true };
    } catch {
      return { name: 'Alex Johnson', email: 'alex@example.com', isLoggedIn: true };
    }
  });

  const [orders, setOrders] = useState<UserOrder[]>(() => {
    try {
      const saved = localStorage.getItem('shopmate_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Persist storage changes
  useEffect(() => {
    localStorage.setItem('shopmate_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopmate_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shopmate_compare', JSON.stringify(compareList));
  }, [compareList]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('shopmate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shopmate_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('shopmate_orders', JSON.stringify(orders));
  }, [orders]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigateTo = (view: ViewType, productId?: string, category?: string) => {
    setActiveView(view);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    if (category !== undefined) {
      setSelectedCategory(category);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed "${item.product.name}" from cart`, 'info');
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    // Free delivery for orders above ₹500 or standard delivery fee ₹0
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;
    const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

    return { subtotal, deliveryFee, total, itemCount };
  };

  // Wishlist Operations
  const toggleWishlist = (productId: string) => {
    const product = productService.getProductById(productId);
    if (!product) return;

    if (wishlist.includes(productId)) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast(`Removed from wishlist`, 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast(`Saved "${product.name}" to wishlist`);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    showToast(`Removed from wishlist`, 'info');
  };

  const moveToCartFromWishlist = (productId: string) => {
    const product = productService.getProductById(productId);
    if (!product) return;
    addToCart(product, 1);
    removeFromWishlist(productId);
  };

  // Compare Operations
  const addToCompare = (productId: string) => {
    const product = productService.getProductById(productId);
    if (!product) return;

    if (compareList.includes(productId)) {
      showToast(`"${product.name}" is already in comparison`, 'info');
      return;
    }

    if (compareList.length >= 4) {
      showToast(`You can compare up to 4 products at once`, 'error');
      return;
    }

    setCompareList((prev) => [...prev, productId]);
    showToast(`Added "${product.name}" to compare list`);
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== productId));
    showToast(`Item removed from compare`, 'info');
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast(`Comparison cleared`, 'info');
  };

  const isInCompare = (productId: string) => {
    return compareList.includes(productId);
  };

  // Auth & Orders
  const loginUser = (name: string, email: string) => {
    setUser({ name, email, isLoggedIn: true });
    setAuthModalOpen(false);
    showToast(`Welcome back, ${name}!`);
  };

  const logoutUser = () => {
    setUser(null);
    showToast(`Logged out successfully`, 'info');
  };

  const placeOrder = (orderData: Omit<UserOrder, 'id' | 'date' | 'status'>): UserOrder => {
    const newOrder: UserOrder = {
      ...orderData,
      id: `SM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Processing',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setCheckoutModalOpen(false);
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        compareList,
        activeView,
        selectedProductId,
        selectedCategory,
        searchQuery,
        user,
        orders,
        isAuthModalOpen,
        isCheckoutModalOpen,
        toasts,
        navigateTo,
        setSearchQuery,
        setSelectedCategory,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        moveToCartFromWishlist,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        setAuthModalOpen,
        setCheckoutModalOpen,
        loginUser,
        logoutUser,
        placeOrder,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
