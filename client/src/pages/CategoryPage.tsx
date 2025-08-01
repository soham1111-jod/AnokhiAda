import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, Search, Filter, SortAsc, Grid3X3, LayoutGrid } from "lucide-react";

import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

interface Product {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_discription: string;
  Product_category: string;
  Product_image: string[];
  Product_rating?: number;
  isNew?: boolean;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('name');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/api/getproductsbycategory?category=${categoryName}`
        );
        setProducts(res.data.product || []);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  // Sort products based on selected criteria
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.Product_price - b.Product_price;
      case 'price-high':
        return b.Product_price - a.Product_price;
      case 'rating':
        return (b.Product_rating || 0) - (a.Product_rating || 0);
      case 'name':
      default:
        return a.Product_name.localeCompare(b.Product_name);
    }
  });

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-100/50 shadow-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100"></div>
      <div className="p-3 sm:p-6">
        <div className="h-4 bg-purple-100 rounded mb-2"></div>
        <div className="h-3 bg-purple-50 rounded mb-3"></div>
        <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-4"></div>
        <div className="h-10 bg-purple-100 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-white">
      <AnnouncementBar />
      <Header />
      
      {/* Hero Section */}
      <div className="pt-24 pb-8 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-800/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Premium Collection
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4 capitalize leading-tight">
              {categoryName} Collection
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
              Discover our exquisite range of {categoryName} pieces, crafted with precision and passion
            </p>
            
            {/* Stats */}
            {!loading && products.length > 0 && (
              <div className="inline-flex items-center gap-4 bg-white/50 backdrop-blur-sm border border-purple-100/50 rounded-full px-6 py-3 text-sm">
                <span className="text-purple-700 font-semibold">
                  {products.length} Product{products.length !== 1 ? 's' : ''} Found
                </span>
                <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                <span className="text-gray-600">
                  Premium Quality
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Controls Section */}
      {!loading && products.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm border-y border-purple-100/50 sticky top-20 z-10">
          <div className="container mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left side - View toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 font-medium hidden sm:block">View:</span>
                <div className="flex items-center bg-white rounded-lg border border-purple-200/50 p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    className={`px-3 py-2 rounded-md transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'compact' ? 'default' : 'ghost'}
                    size="sm"
                    className={`px-3 py-2 rounded-md transition-all duration-200 ${
                      viewMode === 'compact' 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm' 
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                    onClick={() => setViewMode('compact')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Right side - Sort */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium hidden sm:block">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-purple-200/50 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 transition-all duration-200"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 sm:py-24">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 sm:p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                No Products Found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any products in the {categoryName} category at the moment.
              </p>
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => window.history.back()}
              >
                ← Go Back
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
              viewMode === 'compact' 
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6' 
                : 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {sortedProducts.map((product) => (
                <div
                  key={product._id}
                  className="group hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500"
                >
                  <ProductCard
                    product={{
                      id: product._id,
                      name: product.Product_name,
                      price: `₹${product.Product_price}`,
                      image: product.Product_image[0],
                      rating: product.Product_rating || 4.5,
                      isNew: product.isNew || false,
                      originalPrice: `₹${Math.round(product.Product_price * 1.2)}`,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Results Summary */}
            <div className="text-center mt-12 pt-8 border-t border-purple-100/50">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Showing all {products.length} product{products.length !== 1 ? 's' : ''} in {categoryName}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;