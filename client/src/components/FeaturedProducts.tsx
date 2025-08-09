// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Heart, Star, ShoppingCart, Eye, Sparkles } from "lucide-react";
// import { useWishlist } from "./WishlistContext";
// import { useCart } from "./CartContext";
// import { useAuth } from "./AuthContext";
// import { useNavigate } from "react-router-dom";
// import { toast } from "@/hooks/use-toast";
// import axios, { AxiosResponse } from "axios";

// // Environment variable with proper typing
// const API_URL: string = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// // API Product interface (what comes from the server)
// interface ApiProduct {
//   _id: string;
//   Product_name: string;
//   Product_price: number;
//   Product_image: string[];
//   Product_rating?: number;
//   isNew?: boolean;
//   category?: string;
//   description?: string;
//   Product_category?: any;
//   Product_discription?: string;
//   Product_available?: boolean;
// }

// // Cart Product interface (what the cart expects) - UPDATED
// interface CartProduct {
//   id: number;
//   _id: string; // ✅ Keep the MongoDB ObjectId for backend operations
//   name: string;
//   price: string;
//   originalPrice: string;
//   image: string;
//   rating: number;
//   isNew: boolean;
//   quantity?: number;
//   Product_name?: string;
//   Product_price?: number;
//   Product_image?: string[];
// }

// interface ProductsApiResponse {
//   products: ApiProduct[];
//   totalProducts?: number;
//   hasMore?: boolean;
// }

// interface FeaturedProductsProps {
//   className?: string;
//   initialLimit?: number;
//   loadMoreCount?: number;
// }

// // ✅ FIXED: Helper function to transform API product to Cart product format
// const transformProductForCart = (apiProduct: ApiProduct): CartProduct => {
//   const originalPrice = Math.round(apiProduct.Product_price * 1.2);
  
//   return {
//     id: parseInt(apiProduct._id.slice(-8), 16), // Convert MongoDB ObjectId to number for display
//     _id: apiProduct._id, // ✅ Keep the actual MongoDB ObjectId for backend operations
//     name: apiProduct.Product_name,
//     price: `₹${apiProduct.Product_price}`,
//     originalPrice: `₹${originalPrice}`,
//     image: apiProduct.Product_image[0] || '',
//     rating: apiProduct.Product_rating || 4.5,
//     isNew: apiProduct.isNew || false,
//     quantity: 1,
//     // ✅ Add these for CartContext compatibility
//     Product_name: apiProduct.Product_name,
//     Product_price: apiProduct.Product_price,
//     Product_image: apiProduct.Product_image
//   };
// };

// const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
//   className = "",
//   initialLimit = 8,
//   loadMoreCount = 10
// }) => {
//   const [products, setProducts] = useState<ApiProduct[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [loadingMore, setLoadingMore] = useState<boolean>(false);
//   const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
//   const [hasMore, setHasMore] = useState<boolean>(true);
//   const [totalProducts, setTotalProducts] = useState<number>(0);
//   const [currentLimit, setCurrentLimit] = useState<number>(initialLimit);
  
//   const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const fetchProducts = async (limit: number, skip: number = 0, append: boolean = false): Promise<void> => {
//     try {
//       if (append) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       const res: AxiosResponse<ProductsApiResponse> = await axios.get(
//         `${API_URL}/api/getproducts?limit=${limit}&skip=${skip}`
//       );
      
//       const newProducts = res.data.products || [];
      
//       if (append) {
//         // Filter out any products that already exist to prevent duplicates
//         setProducts(prev => {
//           const existingIds = new Set(prev.map(p => p._id));
//           const uniqueNewProducts = newProducts.filter(product => !existingIds.has(product._id));
          
//           const updatedProducts = uniqueNewProducts.length > 0 ? [...prev, ...uniqueNewProducts] : prev;
          
//           // Set hasMore based on API response or logical deduction
//           if (res.data.totalProducts) {
//             // If API provides total, use it
//             setHasMore(updatedProducts.length < res.data.totalProducts);
//             setTotalProducts(res.data.totalProducts);
//           } else {
//             // If no total from API, check if we got fewer new products than requested
//             // This means we've reached the end
//             setHasMore(uniqueNewProducts.length === limit);
//             // Update total estimate
//             setTotalProducts(updatedProducts.length);
//           }
          
//           return updatedProducts;
//         });
//       } else {
//         // Initial load - replace all products
//         setProducts(newProducts);
        
//         if (res.data.totalProducts) {
//           setTotalProducts(res.data.totalProducts);
//           setHasMore(newProducts.length < res.data.totalProducts);
//         } else {
//           // For initial load, assume there might be more if we got the full limit
//           setHasMore(newProducts.length === limit);
//           setTotalProducts(newProducts.length);
//         }
//       }
      
//     } catch (err) {
//       console.error("Error loading products:", err);
//       toast({
//         title: "Error",
//         description: "Failed to load products. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   };

//   useEffect(() => {
//     setCurrentLimit(initialLimit);
//     fetchProducts(initialLimit, 0, false);
//   }, [initialLimit]);

//   const handleLoadMore = (): void => {
//     fetchProducts(loadMoreCount, products.length, true);
//   };

//   const calculateDiscount = (price: number, originalPrice: number): number => {
//     return Math.round(((originalPrice - price) / originalPrice) * 100);
//   };

//   const handleWishlistToggle = (e: React.MouseEvent, product: ApiProduct): void => {
//     e.stopPropagation();
//     if (user) {
//       const wasInWishlist = isInWishlist(product._id);
      
//       // Transform API product to match WishlistContext Product interface
//       const wishlistProduct = {
//         _id: product._id,
//         Product_name: product.Product_name,
//         Product_price: product.Product_price,
//         Product_image: product.Product_image,
//         Product_rating: product.Product_rating,
//         isNew: product.isNew,
//         category: product.Product_category?.category || product.category,
//         description: product.Product_discription || product.description
//       };
      
//       toggleWishlist(wishlistProduct);
      
//       toast({ 
//         title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
//         description: wasInWishlist 
//           ? `${product.Product_name} removed from your wishlist` 
//           : `${product.Product_name} added to your wishlist`,
//         duration: 2000 
//       });
//     } else {
//       navigate("/login");
//     }
//   };

//   // ✅ UPDATED: Handle add to cart with proper ObjectId
//   const handleAddToCart = (product: ApiProduct): void => {
//     if (user) {
//       // Transform the API product to match cart format
//       const cartProduct = transformProductForCart(product);
      
//       console.log('Adding product to cart:', cartProduct);
//       console.log('Product MongoDB _id:', cartProduct._id); // ✅ This should be the real ObjectId
      
//       addToCart(cartProduct);
//       toast({ 
//         title: "Added to cart", 
//         description: `${product.Product_name} has been added to your cart`,
//         duration: 3000 
//       });
//     } else {
//       navigate("/login");
//     }
//   };

//   const handleProductClick = (productId: string): void => {
//     navigate(`/product/${productId}`);
//   };

//   // Calculate remaining products for button text
//   const remainingProducts = Math.max(0, totalProducts - products.length);
//   const productsToLoad = hasMore ? (remainingProducts > 0 ? Math.min(loadMoreCount, remainingProducts) : loadMoreCount) : 0;

//   if (loading) {
//     return (
//       <section className={`py-16 ${className}`}>
//         <div className="container mx-auto px-4 sm:px-6">
//           <div className="text-center mb-12">
//             <div className="h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-pulse mx-auto mb-4 max-w-xs"></div>
//             <div className="h-4 bg-purple-100 rounded animate-pulse mx-auto max-w-md"></div>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {Array.from({ length: initialLimit }).map((_, index) => (
//               <div key={index} className="bg-white rounded-3xl p-3 sm:p-6 shadow-lg animate-pulse">
//                 <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-2 sm:mb-4"></div>
//                 <div className="h-3 sm:h-4 bg-purple-100 rounded mb-2 sm:mb-3"></div>
//                 <div className="h-4 sm:h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-2 sm:mb-4"></div>
//                 <div className="h-8 sm:h-12 bg-purple-100 rounded-xl"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!products.length) {
//     return (
//       <section className={`py-16 ${className}`}>
//         <div className="container mx-auto px-4 sm:px-6 text-center">
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12">
//             <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Available</h3>
//             <p className="text-gray-600">Check back soon for our latest collections!</p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className={`py-12 bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-pink-100/50 ${className}`}>
//       <div className="container mx-auto px-4 sm:px-6">
//         {/* Header Section - Simplified */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4 leading-tight">
//             New Arrivals
//           </h2>
//           {totalProducts > 0 && (
//             <p className="text-sm text-purple-600">
//               Showing {products.length} {totalProducts > products.length ? `of ${totalProducts}` : ''} products
//             </p>
//           )}
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16">
//           {products.map((product) => {
//             const originalPrice = Math.round(product.Product_price * 1.2);
//             const discount = calculateDiscount(product.Product_price, originalPrice);
//             const isHovered = hoveredProduct === product._id;
//             const inWishlist = isInWishlist(product._id);

//             return (
//               <div
//                 key={product._id}
//                 className="group bg-gradient-to-br from-white/90 via-purple-50/30 to-pink-50/40 backdrop-blur-md rounded-3xl border border-purple-200/40 shadow-xl hover:shadow-2xl hover:shadow-purple-300/30 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-2 hover:scale-[1.02]"
//                 onMouseEnter={() => setHoveredProduct(product._id)}
//                 onMouseLeave={() => setHoveredProduct(null)}
//               >
//                 {/* Product Image */}
//                 <div
//                   className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-purple-100/50 via-pink-50/40 to-purple-50/60 rounded-t-3xl"
//                   onClick={() => handleProductClick(product._id)}
//                 >
//                   <img
//                     src={product.Product_image[0]}
//                     alt={product.Product_name}
//                     className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
//                     loading="lazy"
//                   />
                  
//                   {/* Overlay effects */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                   <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
//                   {/* Badges */}
//                   <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-2">
//                     {product.isNew && (
//                       <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
//                         ✨ New
//                       </div>
//                     )}
//                     {discount > 0 && (
//                       <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
//                         {discount}% OFF
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex flex-col gap-2">
//                     <Button
//                       variant="secondary"
//                       size="icon"
//                       className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full backdrop-blur-md border transition-all duration-300 ${
//                         inWishlist
//                           ? "bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400/50 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-300/40"
//                           : "bg-white/80 border-purple-200/50 text-purple-600 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:border-rose-400/50 hover:text-white"
//                       } ${isHovered ? 'scale-110 shadow-xl' : 'shadow-lg'}`}
//                       onClick={(e) => handleWishlistToggle(e, product)}
//                     >
//                       <Heart
//                         size={14}
//                         className="sm:w-[18px] sm:h-[18px]"
//                         fill={inWishlist ? "currentColor" : "none"}
//                       />
//                     </Button>
                    
//                     <Button
//                       variant="secondary"
//                       size="icon"
//                       className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 backdrop-blur-md border-purple-200/50 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-purple-400/50 transition-all duration-300 shadow-lg ${
//                         isHovered ? 'scale-110 shadow-xl' : ''
//                       }`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleProductClick(product._id);
//                       }}
//                     >
//                       <Eye size={14} className="sm:w-[18px] sm:h-[18px]" />
//                     </Button>
//                   </div>

//                   {/* Shimmer effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out" />
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-4 sm:p-6 flex-grow flex flex-col bg-gradient-to-br from-white/60 to-purple-50/40 backdrop-blur-sm">
//                   <div className="mb-3 sm:mb-4">
//                     <h3
//                       className="font-bold text-sm sm:text-lg text-gray-800 line-clamp-2 leading-tight cursor-pointer hover:text-purple-700 transition-colors mb-3"
//                       onClick={() => handleProductClick(product._id)}
//                     >
//                       {product.Product_name}
//                     </h3>
                    
//                     <div className="flex items-center justify-between">
//                       {/* <div className="flex items-center bg-gradient-to-r from-amber-100/80 to-yellow-100/80 text-amber-800 px-3 py-1.5 rounded-full border border-amber-300/40 backdrop-blur-sm shadow-sm">
//                         <Star size={12} className="sm:w-[14px] sm:h-[14px] fill-amber-500 stroke-none mr-1" />
//                         <span className="text-xs sm:text-sm font-semibold">
//                           {product.Product_rating || 4.5}
//                         </span>
//                       </div> */}
                      
//                       {product.category && (
//                         <span className="text-[10px] sm:text-xs text-purple-700 bg-gradient-to-r from-purple-100/80 to-pink-100/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-purple-200/50 backdrop-blur-sm shadow-sm">
//                           {product.category}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mt-auto">
//                     {/* Price Section */}
//                     <div className="flex items-center gap-2 mb-4">
//                       <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                         ₹{product.Product_price.toLocaleString()}
//                       </span>
//                       {discount > 0 && (
//                         <span className="text-xs sm:text-sm text-gray-500 line-through bg-gray-100/50 px-2 py-1 rounded-full">
//                           ₹{originalPrice.toLocaleString()}
//                         </span>
//                       )}
//                     </div>

//                     {/* Add to Cart Button */}
//                     <Button
//                       className="w-full rounded-2xl py-3 sm:py-4 text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/50 group border border-purple-400/20 backdrop-blur-sm"
//                       onClick={() => handleAddToCart(product)}
//                     >
//                       <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px] mr-2 group-hover:scale-110 transition-transform" />
//                       Add to Cart
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Load More Button */}
//         {hasMore && (
//           <div className="text-center">
//             <Button
//               variant="outline"
//               size="lg"
//               className="rounded-full px-12 py-6 border-2 border-purple-200 bg-white/50 backdrop-blur-sm text-purple-700 font-semibold hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//               onClick={handleLoadMore}
//               disabled={loadingMore}
//             >
//               {loadingMore ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mr-2" />
//                   Loading...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="w-5 h-5 mr-2" />
//                   View {productsToLoad} More Product{productsToLoad !== 1 ? 's' : ''}
//                 </>
//               )}
//             </Button>
//           </div>
//         )}

//         {/* No More Products Message */}
//         {!hasMore && products.length > initialLimit && (
//           <div className="text-center">
//             <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold">
//               <Sparkles className="w-4 h-4" />
//               You've seen all our amazing products!
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default FeaturedProducts;







import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios, { AxiosResponse } from "axios";

// Environment variable with proper typing
const API_URL: string = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// API Product interface (what comes from the server)
interface ApiProduct {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_image: string[];
  Product_rating?: number;
  isNew?: boolean;
  category?: string;
  description?: string;
  Product_category?: any;
  Product_discription?: string;
  Product_available?: boolean;
}

// Cart Product interface (what the cart expects) - UPDATED
interface CartProduct {
  id: number;
  _id: string; // ✅ Keep the MongoDB ObjectId for backend operations
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  isNew: boolean;
  quantity?: number;
  Product_name?: string;
  Product_price?: number;
  Product_image?: string[];
}

interface ProductsApiResponse {
  products: ApiProduct[];
  totalProducts?: number;
  hasMore?: boolean;
}

interface FeaturedProductsProps {
  className?: string;
  initialLimit?: number;
  loadMoreCount?: number;
}

// ✅ FIXED: Helper function to transform API product to Cart product format
const transformProductForCart = (apiProduct: ApiProduct): CartProduct => {
  const originalPrice = Math.round(apiProduct.Product_price * 1.2);
  
  return {
    id: parseInt(apiProduct._id.slice(-8), 16), // Convert MongoDB ObjectId to number for display
    _id: apiProduct._id, // ✅ Keep the actual MongoDB ObjectId for backend operations
    name: apiProduct.Product_name,
    price: `₹${apiProduct.Product_price}`,
    originalPrice: `₹${originalPrice}`,
    image: apiProduct.Product_image[0] || '',
    rating: apiProduct.Product_rating || 4.5,
    isNew: apiProduct.isNew || false,
    quantity: 1,
    // ✅ Add these for CartContext compatibility
    Product_name: apiProduct.Product_name,
    Product_price: apiProduct.Product_price,
    Product_image: apiProduct.Product_image
  };
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  className = "",
  initialLimit = 10, // ✅ CHANGED: 8 → 10 for perfect grid filling
  loadMoreCount = 10
}) => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentLimit, setCurrentLimit] = useState<number>(initialLimit);
  
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ FIXED: Improved fetchProducts function with better hasMore logic
  const fetchProducts = async (limit: number, skip: number = 0, append: boolean = false): Promise<void> => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      console.log(`Fetching products: limit=${limit}, skip=${skip}, append=${append}`);

      const res: AxiosResponse<ProductsApiResponse> = await axios.get(
        `${API_URL}/api/getproducts?limit=${limit}&skip=${skip}`
      );
      
      const newProducts = res.data.products || [];
      console.log(`API returned ${newProducts.length} products, totalProducts: ${res.data.totalProducts}`);
      
      if (append) {
        // Filter out any products that already exist to prevent duplicates
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNewProducts = newProducts.filter(product => !existingIds.has(product._id));
          
          const updatedProducts = uniqueNewProducts.length > 0 ? [...prev, ...uniqueNewProducts] : prev;
          console.log(`After append: showing ${updatedProducts.length} products`);
          
          // ✅ IMPROVED: Better hasMore logic
          if (res.data.totalProducts !== undefined) {
            // If API provides totalProducts, use it for accurate hasMore calculation
            const newTotalProducts = res.data.totalProducts;
            setTotalProducts(newTotalProducts);
            setHasMore(updatedProducts.length < newTotalProducts);
            console.log(`Using API totalProducts: ${newTotalProducts}, hasMore: ${updatedProducts.length < newTotalProducts}`);
          } else {
            // Fallback: If no totalProducts from API, check if we got fewer products than requested
            const hasMoreProducts = newProducts.length === limit;
            setHasMore(hasMoreProducts);
            setTotalProducts(hasMoreProducts ? updatedProducts.length + 1 : updatedProducts.length); // Estimate
            console.log(`Using fallback logic: hasMore: ${hasMoreProducts}`);
          }
          
          return updatedProducts;
        });
      } else {
        // Initial load - replace all products
        setProducts(newProducts);
        console.log(`Initial load: ${newProducts.length} products`);
        
        if (res.data.totalProducts !== undefined) {
          // Use API provided total
          const apiTotalProducts = res.data.totalProducts;
          setTotalProducts(apiTotalProducts);
          setHasMore(newProducts.length < apiTotalProducts);
          console.log(`Initial load with API totalProducts: ${apiTotalProducts}, hasMore: ${newProducts.length < apiTotalProducts}`);
        } else {
          // Fallback: Assume there might be more if we got the full requested limit
          const hasMoreProducts = newProducts.length === limit;
          setHasMore(hasMoreProducts);
          setTotalProducts(hasMoreProducts ? newProducts.length + 1 : newProducts.length); // Conservative estimate
          console.log(`Initial load fallback: hasMore: ${hasMoreProducts}`);
        }
      }
      
    } catch (err) {
      console.error("Error loading products:", err);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setCurrentLimit(initialLimit);
    fetchProducts(initialLimit, 0, false);
  }, [initialLimit]);

  const handleLoadMore = (): void => {
    console.log(`Load More clicked: current products = ${products.length}`);
    fetchProducts(loadMoreCount, products.length, true);
  };

  const calculateDiscount = (price: number, originalPrice: number): number => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: ApiProduct): void => {
    e.stopPropagation();
    if (user) {
      const wasInWishlist = isInWishlist(product._id);
      
      // Transform API product to match WishlistContext Product interface
      const wishlistProduct = {
        _id: product._id,
        Product_name: product.Product_name,
        Product_price: product.Product_price,
        Product_image: product.Product_image,
        Product_rating: product.Product_rating,
        isNew: product.isNew,
        category: product.Product_category?.category || product.category,
        description: product.Product_discription || product.description
      };
      
      toggleWishlist(wishlistProduct);
      
      toast({ 
        title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: wasInWishlist 
          ? `${product.Product_name} removed from your wishlist` 
          : `${product.Product_name} added to your wishlist`,
        duration: 2000 
      });
    } else {
      navigate("/login");
    }
  };

  // ✅ UPDATED: Handle add to cart with proper ObjectId
  const handleAddToCart = (product: ApiProduct): void => {
    if (user) {
      // Transform the API product to match cart format
      const cartProduct = transformProductForCart(product);
      
      console.log('Adding product to cart:', cartProduct);
      console.log('Product MongoDB _id:', cartProduct._id); // ✅ This should be the real ObjectId
      
      addToCart(cartProduct);
      toast({ 
        title: "Added to cart", 
        description: `${product.Product_name} has been added to your cart`,
        duration: 3000 
      });
    } else {
      navigate("/login");
    }
  };

  const handleProductClick = (productId: string): void => {
    navigate(`/product/${productId}`);
  };

  // ✅ IMPROVED: Better calculation for remaining products
  const remainingProducts = Math.max(0, totalProducts - products.length);
  const productsToLoad = hasMore ? (remainingProducts > 0 ? Math.min(loadMoreCount, remainingProducts) : loadMoreCount) : 0;

  // ✅ ADD: Debug info (remove in production)
  console.log(`Debug: totalProducts=${totalProducts}, currentProducts=${products.length}, hasMore=${hasMore}, remainingProducts=${remainingProducts}, productsToLoad=${productsToLoad}`);

  if (loading) {
    return (
      <section className={`py-8 sm:py-16 ${className}`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="h-6 sm:h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-pulse mx-auto mb-3 sm:mb-4 max-w-[200px] sm:max-w-xs"></div>
            <div className="h-3 sm:h-4 bg-purple-100 rounded animate-pulse mx-auto max-w-[160px] sm:max-w-md"></div>
          </div>
          {/* ✅ UPDATED: Show 10 skeleton cards for consistency */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-3 xl:p-4 shadow-lg animate-pulse">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl mb-2 sm:mb-3"></div>
                <div className="h-2 sm:h-3 lg:h-3 xl:h-4 bg-purple-100 rounded mb-1 sm:mb-2"></div>
                <div className="h-3 sm:h-4 lg:h-4 xl:h-5 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-2 sm:mb-3"></div>
                <div className="h-6 sm:h-8 lg:h-7 xl:h-8 bg-purple-100 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className={`py-8 sm:py-16 ${className}`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl sm:rounded-3xl p-8 sm:p-12">
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Products Available</h3>
            <p className="text-sm sm:text-base text-gray-600">Check back soon for our latest collections!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 sm:py-12 bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-pink-100/50 ${className}`}>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header Section - Optimized for 320px */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight px-2">
            New Arrivals
          </h2>
          {totalProducts > 0 && (
            <p className="text-xs sm:text-sm text-purple-600 px-2">
              Showing {products.length} {totalProducts > products.length ? `of ${totalProducts}` : ''} products
            </p>
          )}
        </div>

        {/* ✅ IMPROVED Products Grid - Perfect for 10 initial products */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 xl:gap-6 mb-8 sm:mb-16">
          {products.map((product) => {
            const originalPrice = Math.round(product.Product_price * 1.2);
            const discount = calculateDiscount(product.Product_price, originalPrice);
            const isHovered = hoveredProduct === product._id;
            const inWishlist = isInWishlist(product._id);

            return (
              <div
                key={product._id}
                className="group bg-gradient-to-br from-white/90 via-purple-50/30 to-pink-50/40 backdrop-blur-md rounded-lg sm:rounded-xl lg:rounded-2xl border border-purple-200/40 shadow-xl hover:shadow-2xl hover:shadow-purple-300/30 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-[1.01] sm:hover:scale-[1.02]"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image - Better laptop sizing */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-purple-100/50 via-pink-50/40 to-purple-50/60 rounded-t-lg sm:rounded-t-xl lg:rounded-t-2xl"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={product.Product_image[0]}
                    alt={product.Product_name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges - Better laptop sizing */}
                  <div className="absolute top-2 sm:top-2 md:top-3 lg:top-2 xl:top-3 left-2 sm:left-2 md:left-3 lg:left-2 xl:left-3 flex flex-col gap-1">
                    {product.isNew && (
                      <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white text-[8px] sm:text-[9px] md:text-[10px] lg:text-[9px] xl:text-[10px] font-bold px-1.5 sm:px-2 md:px-2.5 lg:px-2 xl:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-0.5 xl:py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                        ✨ New
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white text-[8px] sm:text-[9px] md:text-[10px] lg:text-[9px] xl:text-[10px] font-bold px-1.5 sm:px-2 md:px-2.5 lg:px-2 xl:px-2.5 py-0.5 sm:py-1 md:py-1 lg:py-0.5 xl:py-1 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Better laptop sizing */}
                  <div className="absolute top-2 sm:top-2 md:top-3 lg:top-2 xl:top-3 right-2 sm:right-2 md:right-3 lg:right-2 xl:right-3 flex flex-col gap-1">
                    <Button
                      variant="secondary"
                      size="icon"
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-7 lg:h-7 xl:w-8 xl:h-8 rounded-full backdrop-blur-md border transition-all duration-300 ${
                        inWishlist
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400/50 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-300/40"
                          : "bg-white/80 border-purple-200/50 text-purple-600 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500 hover:border-rose-400/50 hover:text-white"
                      } ${isHovered ? 'scale-110 shadow-xl' : 'shadow-lg'}`}
                      onClick={(e) => handleWishlistToggle(e, product)}
                    >
                      <Heart
                        size={10}
                        className="sm:w-[11px] sm:h-[11px] md:w-[13px] md:h-[13px] lg:w-[11px] lg:h-[11px] xl:w-[13px] xl:h-[13px]"
                        fill={inWishlist ? "currentColor" : "none"}
                      />
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="icon"
                      className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-7 lg:h-7 xl:w-8 xl:h-8 rounded-full bg-white/80 backdrop-blur-md border-purple-200/50 text-purple-600 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-purple-400/50 transition-all duration-300 shadow-lg ${
                        isHovered ? 'scale-110 shadow-xl' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product._id);
                      }}
                    >
                      <Eye size={10} className="sm:w-[11px] sm:h-[11px] md:w-[13px] md:h-[13px] lg:w-[11px] lg:h-[11px] xl:w-[13px] xl:h-[13px]" />
                    </Button>
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1200 ease-out" />
                </div>

                {/* Product Info - Better laptop sizing */}
                <div className="p-2 sm:p-3 md:p-4 lg:p-3 xl:p-4 flex-grow flex flex-col bg-gradient-to-br from-white/60 to-purple-50/40 backdrop-blur-sm">
                  <div className="mb-2 sm:mb-2 md:mb-3 lg:mb-2 xl:mb-3">
                    <h3
                      className="font-bold text-xs sm:text-sm md:text-base lg:text-sm xl:text-base text-gray-800 line-clamp-2 leading-tight cursor-pointer hover:text-purple-700 transition-colors mb-1 sm:mb-2 min-h-[28px] sm:min-h-[32px] md:min-h-[40px] lg:min-h-[32px] xl:min-h-[40px]"
                      onClick={() => handleProductClick(product._id)}
                    >
                      {product.Product_name}
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      {product.category && (
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-[9px] xl:text-[10px] text-purple-700 bg-gradient-to-r from-purple-100/80 to-pink-100/80 px-1 sm:px-1.5 md:px-2 lg:px-1.5 xl:px-2 py-0.5 sm:py-1 rounded-full border border-purple-200/50 backdrop-blur-sm shadow-sm max-w-[60px] sm:max-w-[80px] md:max-w-none truncate">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto">
                    {/* Price Section - Better laptop sizing */}
                    <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-1.5 xl:gap-2 mb-2 sm:mb-3">
                      <span className="text-sm sm:text-base md:text-lg lg:text-base xl:text-lg font-bold bg-gradient-to-r from-purple-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ₹{product.Product_price.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-[9px] sm:text-[10px] md:text-xs lg:text-[10px] xl:text-xs text-gray-500 line-through bg-gray-100/50 px-1 sm:px-1.5 md:px-2 lg:px-1.5 xl:px-2 py-0.5 rounded-full">
                          ₹{originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button - Better laptop sizing */}
                    <Button
                      className="w-full rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-lg xl:rounded-xl py-1.5 sm:py-2 md:py-2.5 lg:py-2 xl:py-2.5 text-[9px] sm:text-[10px] md:text-xs lg:text-[10px] xl:text-xs font-semibold bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-300/50 group border border-purple-400/20 backdrop-blur-sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={10} className="sm:w-[11px] sm:h-[11px] md:w-[13px] md:h-[13px] lg:w-[11px] lg:h-[11px] xl:w-[13px] xl:h-[13px] mr-1 group-hover:scale-110 transition-transform" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button - Optimized for 320px */}
        {hasMore && (
          <div className="text-center px-3">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-6 sm:px-12 py-4 sm:py-6 border-2 border-purple-200 bg-white/50 backdrop-blur-sm text-purple-700 font-semibold hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  View {productsToLoad} More Product{productsToLoad !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        )}

        {/* ✅ UPDATED: No More Products Message condition */}
        {!hasMore && products.length > initialLimit && (
          <div className="text-center px-3">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              You've seen all our amazing products!
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

