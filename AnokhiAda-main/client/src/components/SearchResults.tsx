import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid, 
  List, 
  ArrowLeft, 
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Sparkles
} from 'lucide-react';
import Fuse from 'fuse.js';

interface Product {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_image: string[];
  Product_category: {
    category: string;
  };
  Product_discription?: string;
  Product_available: boolean;
  score?: number;
  matches?: any[];
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'name'>('relevance');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Optimized Fuse.js configuration
  const fuseOptions = useMemo(() => ({
    keys: [
      { name: "Product_name", weight: 0.7 },
      { name: "Product_category.category", weight: 0.2 },
      { name: "Product_discription", weight: 0.1 },
    ],
    threshold: 0.6,
    minMatchCharLength: 1,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    findAllMatches: true,
    shouldSort: true,
    isCaseSensitive: false,
    distance: 100,
  }), []);

  // Memoized Fuse instance
  const fuse = useMemo(() => {
    if (products.length === 0) return null;
    return new Fuse(products, fuseOptions);
  }, [products, fuseOptions]);

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_URL}/api/getproducts`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const productArray = data.products || [];
        
        setProducts(Array.isArray(productArray) ? productArray : []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Optimized search with single implementation
  useEffect(() => {
    if (!query || products.length === 0 || !fuse) {
      setSearchResults([]);
      return;
    }

    try {
      const searchResponse = fuse.search(query);

      if (searchResponse.length === 0) {
        // Fallback manual search
        const manualResults = products.filter(product => {
          const searchTerm = query.toLowerCase();
          return (
            (product.Product_name || '').toLowerCase().includes(searchTerm) ||
            (product.Product_discription || '').toLowerCase().includes(searchTerm) ||
            (product.Product_category?.category || '').toLowerCase().includes(searchTerm)
          );
        }).slice(0, 20);

        setSearchResults(manualResults.map(item => ({
          ...item,
          score: 0.5,
          matches: [],
        })));
      } else {
        const results = searchResponse.slice(0, 20).map((result) => ({
          ...result.item,
          score: result.score,
          matches: result.matches,
        }));
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    }
  }, [query, products, fuse]);

  // Sort results
  const sortedResults = useMemo(() => {
    if (!searchResults.length) return [];

    const sorted = [...searchResults];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.Product_price || 0) - (b.Product_price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.Product_price || 0) - (a.Product_price || 0));
      case 'name':
        return sorted.sort((a, b) => 
          (a.Product_name || '').localeCompare(b.Product_name || '')
        );
      case 'relevance':
      default:
        return sorted.sort((a, b) => (a.score || 0) - (b.score || 0));
    }
  }, [searchResults, sortBy]);

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-600" size={20} />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching Products...</h3>
              <p className="text-gray-600">Finding the perfect jewelry for you</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Back Button */}
        <button
          onClick={handleGoBack}
          className="group flex items-center gap-3 text-gray-600 hover:text-purple-600 mb-8 transition-all duration-200 hover:bg-white px-4 py-2 rounded-lg hover:shadow-md"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to browsing</span>
        </button>

        {/* Enhanced Search Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border mb-4">
            <Search size={18} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Search Results for</span>
            <span className="font-bold text-purple-600">"{query}"</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {sortedResults.length > 0 ? (
              <>Found {sortedResults.length} Beautiful Product{sortedResults.length !== 1 ? 's' : ''}</>
            ) : (
              'No Products Found'
            )}
          </h1>
          {sortedResults.length > 0 && (
            <p className="text-gray-600 flex items-center justify-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              Discover your perfect jewelry match
            </p>
          )}
        </div>

        {/* Enhanced Filters and Sort */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <Grid size={16} />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <List size={16} />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <div className="relative">
                <SortAsc size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-8 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A to Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Results */}
        {sortedResults.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No products found
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We couldn't find any products matching "<span className="font-semibold text-purple-600">{query}</span>". 
                Try different keywords or explore our collections.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all font-medium"
                >
                  Browse All Products
                </button>
                <button
                  onClick={handleGoBack}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-6'
          }`}>
            {sortedResults.map((product) => (
              <div
                key={product._id}
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product._id)}
                className={`group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-purple-200 overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center' : ''
                }`}
              >
                {/* Product Image */}
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'w-full h-64'
                }`}>
                  <img
                    src={product.Product_image?.[0] || "/api/placeholder/300/300"}
                    alt={product.Product_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/300/300";
                    }}
                  />
                  
                  {/* Availability Badge */}
                  {product.Product_available && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Available
                      </span>
                    </div>
                  )}

                  {/* Match Score Badge */}
                  {product.score && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        <Star size={12} className="fill-current" />
                        {Math.round((1 - product.score) * 100)}%
                      </span>
                    </div>
                  )}

                  {/* Quick Actions (shown on hover) */}
                  <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center gap-3 transition-opacity duration-300 ${
                    hoveredProduct === product._id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all">
                      <Eye size={18} className="text-gray-700" />
                    </button>
                    <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all">
                      <Heart size={18} className="text-red-500" />
                    </button>
                    <button className="bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full transition-all">
                      <ShoppingCart size={18} className="text-purple-600" />
                    </button>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors text-lg">
                      {product.Product_name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 capitalize">
                      {product.Product_category?.category}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatPrice(product.Product_price || 0)}
                      </p>
                      {product.score && (
                        <p className="text-xs text-gray-400 mt-1">
                          {Math.round((1 - product.score) * 100)}% match
                        </p>
                      )}
                    </div>
                    
                    {viewMode === 'grid' && (
                      <button className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-2 rounded-full transition-colors">
                        <ShoppingCart size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Summary */}
        {sortedResults.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm border">
              <Sparkles size={16} className="text-yellow-500" />
              <span className="text-sm text-gray-600">
                Showing {sortedResults.length} results for "{query}"
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
