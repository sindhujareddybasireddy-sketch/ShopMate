import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { productService } from '../../services/productService';
import { formatPrice, calculateDiscountPercentage } from '../../utils/formatters';
import { ProductCard } from '../common/ProductCard';
import {
  Star,
  Heart,
  ArrowLeftRight,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';

export const ProductDetailsView: React.FC = () => {
  const {
    selectedProductId,
    navigateTo,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    removeFromCompare,
    isInCompare,
    setCheckoutModalOpen,
    showToast,
  } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'reviews'>('specs');
  const [userReview, setUserReview] = useState({ author: '', rating: 5, comment: '' });
  const [localReviews, setLocalReviews] = useState<any[]>([]);

  const product = productService.getProductById(selectedProductId || 'prod-lap-01');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-2">The requested product could not be located.</p>
        <button
          onClick={() => navigateTo('products')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);
  const discountPercent = product.originalPrice
    ? calculateDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const relatedProducts = productService.getRecommendedProducts(product.id, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setCheckoutModalOpen(true);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReview.author.trim() || !userReview.comment.trim()) return;

    const newRev = {
      id: `rev-${Date.now()}`,
      author: userReview.author.trim(),
      rating: userReview.rating,
      date: 'Just now',
      comment: userReview.comment.trim(),
      verifiedPurchase: true,
    };

    setLocalReviews([newRev, ...localReviews]);
    setUserReview({ author: '', rating: 5, comment: '' });
    showToast('Thank you! Your verified review has been posted.');
  };

  const allReviews = [...localReviews, ...(product.reviews || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500">
        <button onClick={() => navigateTo('home')} className="hover:text-blue-600">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => navigateTo('products')} className="hover:text-blue-600">
          Products
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button
          onClick={() => navigateTo('products', undefined, product.category)}
          className="hover:text-blue-600"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid: Left Gallery + Right Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Images */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-[#F8F9FA] border border-slate-200/90 aspect-4/3 flex items-center justify-center shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-sm">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnail preview list */}
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((idx) => (
              <div
                key={idx}
                className={`relative rounded-lg overflow-hidden border aspect-4/3 bg-[#F8F9FA] cursor-pointer transition-all ${
                  idx === 1
                    ? 'border-blue-600 ring-2 ring-blue-500/20'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={product.image}
                  alt={`${product.name} angle ${idx}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>

          {/* Value props under image */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <Truck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-semibold text-slate-800">Free Express Delivery</div>
              <div className="text-[10px] text-slate-500">Dispatch in 24 hrs</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-semibold text-slate-800">Brand Warranty</div>
              <div className="text-[10px] text-slate-500">100% Genuine Tech</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <RotateCcw className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-[11px] font-semibold text-slate-800">7-Day Replacement</div>
              <div className="text-[10px] text-slate-500">No questions asked</div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-blue-600 uppercase tracking-wide">
                {product.brand}
              </span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">{product.availability}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200/60 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-slate-500">
                {product.reviewsCount} customer ratings & verified reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">
                    You save {formatPrice(product.originalPrice - product.price)} ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Inclusive of all taxes & free doorstep delivery</p>
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Key Features Bullets */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Key Highlights
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {product.features.slice(0, 5).map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quantity Selector & Action CTAs */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">Quantity:</label>
              <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-semibold text-slate-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-blue-600 border-2 border-blue-600 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow hover:shadow-md"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Secondary Actions (Wishlist & Compare) */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  isWished ? 'text-rose-600 font-semibold' : 'text-slate-600 hover:text-rose-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
                <span>{isWished ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() =>
                  isCompared ? removeFromCompare(product.id) : addToCompare(product.id)
                }
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  isCompared ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>{isCompared ? 'In Compare List' : 'Compare with Others'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Information Tabs (Specifications, Features, Reviews) */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('specs')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'features'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Features
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Reviews ({allReviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {/* Specifications Table (as requested in user prompt) */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Detailed Product Specifications
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4 w-1/3">Specification</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {product.specifications.processor && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Processor</td>
                        <td className="py-3 px-4 text-slate-900 font-mono">
                          {product.specifications.processor}
                        </td>
                      </tr>
                    )}
                    {product.specifications.ram && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">RAM</td>
                        <td className="py-3 px-4 text-slate-900 font-mono">
                          {product.specifications.ram}
                        </td>
                      </tr>
                    )}
                    {product.specifications.storage && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Storage</td>
                        <td className="py-3 px-4 text-slate-900 font-mono">
                          {product.specifications.storage}
                        </td>
                      </tr>
                    )}
                    {product.specifications.display && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Display</td>
                        <td className="py-3 px-4 text-slate-900">
                          {product.specifications.display}
                        </td>
                      </tr>
                    )}
                    {product.specifications.battery && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Battery & Power</td>
                        <td className="py-3 px-4 text-slate-900">
                          {product.specifications.battery}
                        </td>
                      </tr>
                    )}
                    {product.specifications.os && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Operating System</td>
                        <td className="py-3 px-4 text-slate-900">
                          {product.specifications.os}
                        </td>
                      </tr>
                    )}
                    {product.specifications.connectivity && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Connectivity</td>
                        <td className="py-3 px-4 text-slate-900">
                          {product.specifications.connectivity}
                        </td>
                      </tr>
                    )}
                    {product.specifications.weight && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Weight</td>
                        <td className="py-3 px-4 text-slate-900">
                          {product.specifications.weight}
                        </td>
                      </tr>
                    )}
                    {product.specifications.warranty && (
                      <tr className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-700">Warranty</td>
                        <td className="py-3 px-4 text-slate-900 font-medium text-emerald-700">
                          {product.specifications.warranty}
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-700">Rating</td>
                      <td className="py-3 px-4 text-slate-900 font-semibold flex items-center gap-1 text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{product.rating} / 5.0</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="prose prose-sm max-w-none text-slate-700">
                <p className="leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Full Feature Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-800"
                    >
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Score Summary */}
                <div className="md:col-span-4 p-5 bg-slate-50 rounded-xl border border-slate-200/80 text-center space-y-2">
                  <div className="text-4xl font-extrabold text-slate-900 tabular-nums">
                    {product.rating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(product.rating) ? 'fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Based on {product.reviewsCount + localReviews.length} verified ratings
                  </p>
                </div>

                {/* Submit Review Form */}
                <div className="md:col-span-8">
                  <form
                    onSubmit={handleAddReview}
                    className="p-5 bg-white border border-slate-200 rounded-xl space-y-4"
                  >
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Write a Customer Review
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={userReview.author}
                          onChange={(e) =>
                            setUserReview({ ...userReview, author: e.target.value })
                          }
                          placeholder="e.g. Rahul S."
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Your Rating
                        </label>
                        <select
                          value={userReview.rating}
                          onChange={(e) =>
                            setUserReview({
                              ...userReview,
                              rating: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-medium"
                        >
                          <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Exceptional</option>
                          <option value="4">⭐⭐⭐⭐ 4 Stars - Very Good</option>
                          <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                          <option value="2">⭐⭐ 2 Stars - Subpar</option>
                          <option value="1">⭐ 1 Star - Disappointed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Feedback / Review
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={userReview.comment}
                        onChange={(e) =>
                          setUserReview({ ...userReview, comment: e.target.value })
                        }
                        placeholder="What do you think of this product's performance and build?"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Verified Reviews
                </h4>
                {allReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{rev.author}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px]">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating ? 'fill-current' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-slate-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Products Section */}
      <section className="space-y-6 pt-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Related Products You May Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>
    </div>
  );
};
