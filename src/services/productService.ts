import { INITIAL_PRODUCTS } from '../data/products';
import { Product, FilterOptions } from '../types';

/**
 * Product Data & Query Service
 * Modular service designed for both the ShopMate frontend
 * and future integration with an AI shopping assistant / LLM tools.
 */

export class ProductService {
  private products: Product[];

  constructor(initialData: Product[] = INITIAL_PRODUCTS) {
    this.products = [...initialData];
  }

  /**
   * Retrieve all products
   */
  getAllProducts(): Product[] {
    return this.products;
  }

  /**
   * Get product by unique ID
   */
  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  /**
   * Get trending products for homepage showcase
   */
  getTrendingProducts(limit: number = 8): Product[] {
    return this.products.filter((p) => p.trending).slice(0, limit);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Product[] {
    if (!category || category === 'All') return this.products;
    return this.products.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Free text search query matching product name, category, brand, features, and description
   */
  searchProducts(query: string): Product[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.products;

    return this.products.filter((product) => {
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchDescription = product.description.toLowerCase().includes(q);
      const matchFeatures = product.features.some((f) =>
        f.toLowerCase().includes(q)
      );
      const matchSpecs = Object.values(product.specifications).some((val) =>
        val?.toLowerCase().includes(q)
      );

      // Handle common natural queries like "gaming laptop", "wireless headphones", "macbook", etc.
      const queryTokens = q.split(/\s+/).filter(Boolean);
      const tokenMatch = queryTokens.every(
        (token) =>
          product.name.toLowerCase().includes(token) ||
          product.category.toLowerCase().includes(token) ||
          product.brand.toLowerCase().includes(token) ||
          product.description.toLowerCase().includes(token)
      );

      return (
        matchName ||
        matchCategory ||
        matchBrand ||
        matchDescription ||
        matchFeatures ||
        matchSpecs ||
        tokenMatch
      );
    });
  }

  /**
   * Filter and sort products according to comprehensive UI criteria
   */
  filterProducts(filters: FilterOptions): Product[] {
    let result = [...this.products];

    // Search query filter
    if (filters.searchQuery.trim()) {
      result = this.searchProducts(filters.searchQuery);
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under-30k':
          result = result.filter((p) => p.price < 30000);
          break;
        case '30k-50k':
          result = result.filter((p) => p.price >= 30000 && p.price <= 50000);
          break;
        case '50k-70k':
          result = result.filter((p) => p.price > 50000 && p.price <= 70000);
          break;
        case 'above-70k':
          result = result.filter((p) => p.price > 70000);
          break;
      }
    }

    // Brands filter
    if (filters.brands && filters.brands.length > 0) {
      result = result.filter((p) =>
        filters.brands.some(
          (b) => b.toLowerCase() === p.brand.toLowerCase()
        )
      );
    }

    // Rating filter
    if (filters.minRating && filters.minRating > 0) {
      result = result.filter((p) => p.rating >= filters.minRating);
    }

    // RAM filter
    if (filters.ram && filters.ram.length > 0) {
      result = result.filter((p) => {
        const productRam = p.specifications.ram?.toLowerCase() || '';
        return filters.ram.some((ramVal) =>
          productRam.includes(ramVal.toLowerCase())
        );
      });
    }

    // Storage filter
    if (filters.storage && filters.storage.length > 0) {
      result = result.filter((p) => {
        const productStorage = p.specifications.storage?.toLowerCase() || '';
        return filters.storage.some((storVal) =>
          productStorage.includes(storVal.toLowerCase())
        );
      });
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
    }

    return result;
  }

  /**
   * Get products for side-by-side comparison
   */
  compareProducts(productIds: string[]): Product[] {
    return productIds
      .map((id) => this.getProductById(id))
      .filter((p): p is Product => p !== undefined);
  }

  /**
   * Recommend products related to a specific product (same category or similar price point)
   */
  getRecommendedProducts(productId: string, limit: number = 4): Product[] {
    const target = this.getProductById(productId);
    if (!target) return this.products.slice(0, limit);

    return this.products
      .filter((p) => p.id !== productId)
      .sort((a, b) => {
        // Prioritize same category
        if (a.category === target.category && b.category !== target.category) return -1;
        if (b.category === target.category && a.category !== target.category) return 1;
        // Prioritize rating
        return b.rating - a.rating;
      })
      .slice(0, limit);
  }

  /**
   * Extract distinct available brands, RAM, and Storage values for filters
   */
  getAvailableFilterMetadata() {
    const brands = Array.from(new Set(this.products.map((p) => p.brand))).sort();
    const categories = Array.from(new Set(this.products.map((p) => p.category))).sort();
    
    return {
      brands,
      categories,
      priceRanges: [
        { id: 'all', label: 'All Prices' },
        { id: 'under-30k', label: 'Under ₹30,000' },
        { id: '30k-50k', label: '₹30,000 – ₹50,000' },
        { id: '50k-70k', label: '₹50,000 – ₹70,000' },
        { id: 'above-70k', label: 'Above ₹70,000' },
      ],
      ramOptions: ['8 GB', '12 GB', '16 GB', '32 GB'],
      storageOptions: ['256 GB', '512 GB', '1 TB'],
    };
  }
}

export const productService = new ProductService();
