import React, { useState, useCallback, useMemo, useRef } from "react";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Sparkles, Plus, Minus, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// ✅ Individual WishlistItem with local quantity state
const OptimizedWishlistItem = React.memo(({ 
  item, 
  onRemove, 
  onAddToCart, 
  onNavigate 
}: {
  item: any;
  onRemove: (productId: string) => void;
  onAddToCart: (product: any, quantity: number) => void;
  onNavigate: (productId: string) => void;
}) => {
  const { updateQuantity } = useWishlist();
  const product = item.product;
  
  // ✅ LOCAL state for immediate UI feedback
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  // ✅ Debounced update to context/backend
  const debouncedUpdate = useCallback((newQuantity: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsUpdating(true);
      try {
        if (newQuantity < 1) {
          onRemove(product._id);
        } else {
          await updateQuantity(product._id, newQuantity);
        }
      } catch (error) {
        // Rollback on error
        setLocalQuantity(item.quantity);
        toast({
          title: "Error",
          description: "Failed to update quantity",
          variant: "destructive"
        });
      } finally {
        setIsUpdating(false);
      }
    }, 500); // 500ms debounce
  }, [product._id, updateQuantity, onRemove, item.quantity]);

  // ✅ Immediate local update with debounced sync
  const handleQuantityChange = useCallback((change: number) => {
    const newQuantity = Math.max(0, localQuantity + change);
    setLocalQuantity(newQuantity);
    debouncedUpdate(newQuantity);
  }, [localQuantity, debouncedUpdate]);

  // ✅ Memoized calculations
  const { originalPrice, discount } = useMemo(() => {
    const orig = Math.round(product.Product_price * 1.2);
    const disc = Math.round(((orig - product.Product_price) / orig) * 100);
    return { originalPrice: orig, discount: disc };
  }, [product.Product_price]);

  const handleProductClick = useCallback(() => {
    onNavigate(product._id);
  }, [product._id, onNavigate]);

  const handleAddToCartClick = useCallback(() => {
    onAddToCart(product, localQuantity);
  }, [product, localQuantity, onAddToCart]);

  const handleRemoveClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(product._id);
  }, [product._id, onRemove]);

  return (
    <div className="group bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl border border-purple-100/50 shadow-lg hover:shadow-2xl hover:shadow-purple-200/20 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1 sm:hover:-translate-y-2">
      {/* Product Image */}
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
        onClick={handleProductClick}
      >
        <img
          src={product.Product_image?.[0] || '/placeholder-image.jpg'}
          alt={product.Product_name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Quantity Badge */}
        {localQuantity > 1 && (
          <div className="absolute top-1.5 sm:top-2 md:top-4 left-1.5 sm:left-2 md:left-4 bg-purple-600 text-white text-xs sm:text-sm font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shadow-lg">
            {localQuantity}
          </div>
        )}
        
        {/* Wishlist Button */}
        <Button
          variant="secondary"
          size="icon"
          type="button"
          className="absolute top-1.5 sm:top-2 md:top-4 right-1.5 sm:right-2 md:right-4 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-rose-500 border-rose-500 text-white hover:bg-rose-600 hover:border-rose-600 shadow-lg shadow-rose-200/50 z-10"
          onClick={handleRemoveClick}
          disabled={isUpdating}
        >
          <Heart size={12} className="sm:w-[14px] sm:h-[14px] md:w-[18px] md:h-[18px]" fill="currentColor" />
        </Button>

        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-6 flex-grow flex flex-col">
        <div className="mb-2 sm:mb-3 md:mb-4">
          <h3 
            className="font-bold text-xs sm:text-sm md:text-lg text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-purple-600 transition-colors mb-1 sm:mb-2"
            onClick={handleProductClick}
          >
            {product.Product_name}
          </h3>
        </div>

        <div className="mt-auto">
          {/* Price Section */}
          <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
            <span className="text-sm sm:text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{product.Product_price.toLocaleString()}
            </span>
            {discount > 0 && (
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* ✅ Optimized Quantity Controls - NO re-render of parent */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600">Qty:</span>
            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 p-0 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
                onClick={() => handleQuantityChange(-1)}
                disabled={isUpdating}
              >
                <Minus size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
              </Button>
              
              {/* ✅ Show local quantity with loading indicator */}
              <span className="px-2 sm:px-2.5 md:px-3 py-1 text-xs sm:text-sm font-semibold min-w-[1.5rem] sm:min-w-[2rem] text-center relative">
                {localQuantity}
                {isUpdating && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 p-0 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
                onClick={() => handleQuantityChange(1)}
                disabled={isUpdating || localQuantity >= 99}
              >
                <Plus size={10} className="sm:w-[12px] sm:h-[12px] md:w-[14px] md:h-[14px]" />
              </Button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            type="button"
            className="w-full rounded-lg sm:rounded-xl md:rounded-2xl py-2 sm:py-3 md:py-6 text-[10px] sm:text-xs md:text-sm font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/50 group disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCartClick}
            disabled={isUpdating || !product.Product_available}
          >
            {isUpdating ? (
              <Loader2 size={12} className="sm:w-[14px] sm:h-[14px] mr-1 animate-spin" />
            ) : (
              <ShoppingCart size={10} className="sm:w-[12px] sm:h-[12px] md:w-[18px] md:h-[18px] mr-0.5 sm:mr-1 md:mr-2 group-hover:scale-110 transition-transform" />
            )}
            {!product.Product_available 
              ? 'Out of Stock' 
              : `Add ${localQuantity > 1 ? `${localQuantity} ` : ''}to Cart`
            }
          </Button>
        </div>
      </div>
    </div>
  );
});

OptimizedWishlistItem.displayName = 'OptimizedWishlistItem';

// ✅ Main WishlistPage with minimal re-renders
const WishlistPage: React.FC = () => {
  const { 
    wishlist, 
    clearWishlist, 
    removeFromWishlist,
    getTotalItems,
    getTotalUniqueItems,
    loading
  } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // ✅ Stable handlers - only recreate when dependencies change
  const handleAddToCart = useCallback((product: any, quantity: number) => {
    try {
      const cartProduct = {
        id: Math.floor(Math.random() * 1000000),
        _id: product._id,
        name: product.Product_name,
        price: `₹${product.Product_price}`,
        originalPrice: `₹${Math.round(product.Product_price * 1.2)}`,
        image: product.Product_image?.[0] || '/placeholder-image.jpg',
        isNew: false,
        quantity: quantity,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_image: product.Product_image,
      };

      addToCart(cartProduct);
      
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.Product_name} added to cart`,
        duration: 2000
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Could not add to cart",
        variant: "destructive"
      });
    }
  }, [addToCart]);

  const handleRemove = useCallback((productId: string) => {
    removeFromWishlist(productId);
    toast({ 
      title: "Removed from wishlist",
      description: "Item has been removed",
      duration: 2000 
    });
  }, [removeFromWishlist]);

  const handleNavigate = useCallback((productId: string) => {
    navigate(`/product/${productId}`);
  }, [navigate]);

  const handleClearWishlist = useCallback(() => {
    clearWishlist();
    toast({ 
      title: "Wishlist cleared", 
      description: "All items have been removed from your wishlist",
      duration: 2000 
    });
  }, [clearWishlist]);

  // ✅ Memoize expensive calculations
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems]);
  const totalUniqueItems = useMemo(() => getTotalUniqueItems(), [getTotalUniqueItems]);

  // Loading and empty states...
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl shadow-purple-200/20 border border-purple-100">
          <Loader2 className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-spin" />
          <h2 className="text-2xl font-bold text-center text-gray-700">
            Loading your wishlist...
          </h2>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
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
            type="button"
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
        {/* Header - only re-renders when totals actually change */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Heart className="w-4 h-4" fill="currentColor" />
              <span className="flex items-center gap-2">
                <span>{totalUniqueItems} {totalUniqueItems === 1 ? 'Item' : 'Items'}</span>
                <span className="text-purple-500">•</span>
                <span>{totalItems} Total Qty</span>
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Wishlist
            </h2>
          </div>
          
          {wishlist.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleClearWishlist}
              className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
              disabled={loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* ✅ Optimized Products Grid - Each item manages its own state */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {wishlist.map((item) => (
            <OptimizedWishlistItem
              key={item.product._id}
              item={item}
              onRemove={handleRemove}
              onAddToCart={handleAddToCart}
              onNavigate={handleNavigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(WishlistPage);
