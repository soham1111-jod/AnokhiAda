import React from "react";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const WishlistPage: React.FC = () => {
  const { wishlist, legacyWishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Combine both wishlists for display
  const allWishlistItems = [...wishlist, ...legacyWishlist];

  // Function to calculate discount percentage
  const calculateDiscount = (price: number | string, originalPrice?: number | string): number => {
    let priceNum: number;
    let originalPriceNum: number;

    if (typeof price === 'string') {
      priceNum = parseInt(price.replace(/[^\d]/g, ""));
    } else {
      priceNum = price;
    }

    if (originalPrice) {
      if (typeof originalPrice === 'string') {
        originalPriceNum = parseInt(originalPrice.replace(/[^\d]/g, ""));
      } else {
        originalPriceNum = originalPrice;
      }
    } else {
      // If no original price, assume 20% discount
      originalPriceNum = Math.round(priceNum * 1.2);
    }

    return Math.round(((originalPriceNum - priceNum) / originalPriceNum) * 100);
  };

  if (allWishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white text-center px-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl shadow-purple-200/20 border border-purple-100">
          <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Your Wishlist is Empty
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Browse our beautiful collection and add your favorites to the wishlist.
          </p>
          <Button 
            onClick={() => navigate("/")} 
            size="lg" 
            className="rounded-full px-12 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white min-h-screen">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" fill="currentColor" />
              {allWishlistItems.length} {allWishlistItems.length === 1 ? 'Item' : 'Items'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Wishlist
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearWishlist();
              toast({ 
                title: "Wishlist cleared", 
                description: "All items have been removed from your wishlist",
                duration: 2000 
              });
            }}
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
          >
            Clear All
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Render new API products */}
          {wishlist.map((product) => {
            const originalPrice = Math.round(product.Product_price * 1.2);
            const discount = calculateDiscount(product.Product_price, originalPrice);

            return (
              <div
                key={product._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-100/50 shadow-lg hover:shadow-2xl hover:shadow-purple-200/20 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.Product_image[0]}
                    alt={product.Product_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Wishlist Button */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 border-rose-500 text-white hover:bg-rose-600 hover:border-rose-600 shadow-lg shadow-rose-200/50 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                      toast({ 
                        title: "Removed from wishlist",
                        description: `${product.Product_name} has been removed`,
                        duration: 2000 
                      });
                    }}
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={14} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
                  </Button>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-6 flex-grow flex flex-col">
                  <div className="mb-2 sm:mb-4">
                    <h3 
                      className="font-bold text-sm sm:text-lg text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-purple-600 transition-colors mb-2"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      {product.Product_name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-200/50">
                        <Star size={12} className="sm:w-[14px] sm:h-[14px] fill-amber-400 stroke-none mr-1" />
                        <span className="text-xs sm:text-sm font-semibold">
                          {product.Product_rating || 4.5}
                        </span>
                      </div>
                      
                      {discount > 0 && (
                        <span className="text-[10px] sm:text-xs font-semibold text-rose-500 bg-rose-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {/* Price Section */}
                    <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                      <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{product.Product_price.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          ₹{originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                      className="w-full rounded-xl sm:rounded-2xl py-3 sm:py-6 text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/50 group"
                      onClick={() => {
                        addToCart(product);
                        toast({ 
                          title: "Added to cart",
                          description: `${product.Product_name} has been added to your cart`,
                          duration: 2000 
                        });
                      }}
                    >
                      <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px] mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Render legacy products (if any) */}
          {legacyWishlist.map((product) => {
            const discount = calculateDiscount(product.price, product.originalPrice);

            return (
              <div
                key={`legacy-${product.id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-100/50 shadow-lg hover:shadow-2xl hover:shadow-purple-200/20 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1 sm:hover:-translate-y-2"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-500 border-rose-500 text-white hover:bg-rose-600 shadow-lg z-10"
                    onClick={() => {
                      toggleWishlist(product);
                      toast({ title: "Removed from wishlist", duration: 2000 });
                    }}
                  >
                    <Heart size={14} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
                  </Button>
                </div>

                <div className="p-3 sm:p-6 flex-grow flex flex-col">
                  <div className="mb-2 sm:mb-4">
                    <h3 className="font-bold text-sm sm:text-lg text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200/50">
                      <Star size={12} className="fill-amber-400 stroke-none mr-1" />
                      <span className="text-xs font-semibold">{product.rating}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-gray-900">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      {discount > 0 && (
                        <span className="text-xs font-semibold text-rose-500">{discount}% off</span>
                      )}
                    </div>

                    <Button
                      className="w-full rounded-xl py-3 text-xs font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                      onClick={() => {
                        addToCart(product);
                        toast({ title: "Added to cart", duration: 2000 });
                      }}
                    >
                      <ShoppingCart size={14} className="mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WishlistPage;