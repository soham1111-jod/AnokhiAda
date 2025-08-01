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

// // Cart Product interface (what the cart expects)
// interface CartProduct {
//   id: number;
//   name: string;
//   price: string;
//   originalPrice: string;
//   image: string;
//   rating: number;
//   isNew: boolean;
//   quantity?: number;
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

// // Helper function to transform API product to Cart product format
// const transformProductForCart = (apiProduct: ApiProduct): CartProduct => {
//   const originalPrice = Math.round(apiProduct.Product_price * 1.2);
  
//   return {
//     id: parseInt(apiProduct._id.slice(-8), 16), // Convert MongoDB ObjectId to number
//     name: apiProduct.Product_name,
//     price: `₹${apiProduct.Product_price}`, // Convert number to formatted string
//     originalPrice: `₹${originalPrice}`,
//     image: apiProduct.Product_image[0] || '',
//     rating: apiProduct.Product_rating || 4.5,
//     isNew: apiProduct.isNew || false,
//     quantity: 1
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
//   const [currentLimit, setCurrentLimit] = useState<number>(initialLimit);
//   const [totalProducts, setTotalProducts] = useState<number>(0);
  
//   const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
//   const { addToCart } = useCart();
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const fetchProducts = async (limit: number, append: boolean = false): Promise<void> => {
//     try {
//       if (append) {
//         setLoadingMore(true);
//       } else {
//         setLoading(true);
//       }

//       const res: AxiosResponse<ProductsApiResponse> = await axios.get(
//         `${API_URL}/api/getproducts?limit=${limit}`
//       );
      
//       const newProducts = res.data.products || [];
      
//       if (append) {
//         setProducts(prev => [...prev, ...newProducts]);
//       } else {
//         setProducts(newProducts);
//       }

//       // If totalProducts is not provided by API, assume there might be more if we got the full limit
//       if (res.data.totalProducts) {
//         setTotalProducts(res.data.totalProducts);
//         setHasMore(newProducts.length > 0 && (products.length + newProducts.length) < res.data.totalProducts);
//       } else {
//         // Fallback logic: assume there are more products if we got exactly the limit requested
//         setHasMore(newProducts.length === limit);
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
//     fetchProducts(currentLimit);
//   }, []);

//   const handleLoadMore = async (): Promise<void> => {
//     const newLimit = currentLimit + loadMoreCount;
//     setCurrentLimit(newLimit);
    
//     try {
//       setLoadingMore(true);
//       const res: AxiosResponse<ProductsApiResponse> = await axios.get(
//         `${API_URL}/api/getproducts?limit=${newLimit}`
//       );
      
//       const allProducts = res.data.products || [];
//       // Get only the new products (beyond current products length)
//       const newProducts = allProducts.slice(products.length);
      
//       if (newProducts.length > 0) {
//         setProducts(prev => [...prev, ...newProducts]);
//       }
      
//       // Update hasMore status - if we got fewer products than requested, we've reached the end
//       setHasMore(allProducts.length === newLimit);
      
//       // Update total if provided by API
//       if (res.data.totalProducts) {
//         setTotalProducts(res.data.totalProducts);
//       } else {
//         // Estimate total based on current data
//         setTotalProducts(allProducts.length);
//       }
      
//     } catch (err) {
//       console.error("Error loading more products:", err);
//       toast({
//         title: "Error",
//         description: "Failed to load more products. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoadingMore(false);
//     }
//   };

//   const calculateDiscount = (price: number, originalPrice: number): number => {
//     return Math.round(((originalPrice - price) / originalPrice) * 100);
//   };

//   const handleWishlistToggle = (e: React.MouseEvent, product: ApiProduct): void => {
//     e.stopPropagation();
//     if (user) {
//       const wasInWishlist = isInWishlist(product._id);
      
//       // Transform product for wishlist if needed
//       const transformedProduct = transformProductForCart(product);
//       toggleWishlist(transformedProduct);
      
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

//   const handleAddToCart = (product: ApiProduct): void => {
//     if (user) {
//       // Transform the API product to match cart format
//       const cartProduct = transformProductForCart(product);
      
//       console.log('Adding product to cart:', cartProduct); // Debug log
      
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
//   const remainingProducts = hasMore ? Math.max(0, totalProducts - products.length) : 0;
//   const productsToLoad = remainingProducts > 0 ? Math.min(loadMoreCount, remainingProducts) : loadMoreCount;

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
//     <section className={`py-20 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white ${className}`}>
//       <div className="container mx-auto px-4 sm:px-6">
//         {/* Header Section */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full text-sm font-semibold mb-6">
//             <Sparkles className="w-4 h-4" />
//             Featured Collections
//           </div>
//           <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
//             New Arrivals
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//             Discover our latest collection of handcrafted jewelry pieces, designed with love and attention to detail
//           </p>
//           {totalProducts > 0 && (
//             <p className="text-sm text-purple-600 mt-2">
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
//                 className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-100/50 shadow-lg hover:shadow-2xl hover:shadow-purple-200/20 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1 sm:hover:-translate-y-2"
//                 onMouseEnter={() => setHoveredProduct(product._id)}
//                 onMouseLeave={() => setHoveredProduct(null)}
//               >
//                 {/* Product Image */}
//                 <div
//                   className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
//                   onClick={() => handleProductClick(product._id)}
//                 >
//                   <img
//                     src={product.Product_image[0]}
//                     alt={product.Product_name}
//                     className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
//                     loading="lazy"
//                   />
                  
//                   {/* Overlay effects */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
//                   {/* Badges */}
//                   <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
//                     {product.isNew && (
//                       <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
//                         ✨ New
//                       </div>
//                     )}
//                     {discount > 0 && (
//                       <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
//                         {discount}% OFF
//                       </div>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2">
//                     <Button
//                       variant="secondary"
//                       size="icon"
//                       className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-sm border transition-all duration-300 ${
//                         inWishlist
//                           ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600 hover:border-rose-600 shadow-lg shadow-rose-200/50"
//                           : "bg-white/90 border-white/50 text-gray-600 hover:bg-rose-500 hover:border-rose-500 hover:text-white"
//                       } ${isHovered ? 'scale-110 shadow-lg' : ''}`}
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
//                       className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm border-white/50 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all duration-300 ${
//                         isHovered ? 'scale-110 shadow-lg' : ''
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
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-3 sm:p-6 flex-grow flex flex-col">
//                   <div className="mb-2 sm:mb-4">
//                     <h3
//                       className="font-bold text-sm sm:text-lg text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-purple-600 transition-colors mb-2"
//                       onClick={() => handleProductClick(product._id)}
//                     >
//                       {product.Product_name}
//                     </h3>
                    
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-amber-200/50">
//                         <Star size={12} className="sm:w-[14px] sm:h-[14px] fill-amber-400 stroke-none mr-1" />
//                         <span className="text-xs sm:text-sm font-semibold">
//                           {product.Product_rating || 4.5}
//                         </span>
//                       </div>
                      
//                       {product.category && (
//                         <span className="text-[10px] sm:text-xs text-purple-600 bg-purple-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
//                           {product.category}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mt-auto">
//                     {/* Price Section */}
//                     <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
//                       <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                         ₹{product.Product_price.toLocaleString()}
//                       </span>
//                       {discount > 0 && (
//                         <span className="text-xs sm:text-sm text-gray-500 line-through">
//                           ₹{originalPrice.toLocaleString()}
//                         </span>
//                       )}
//                     </div>

//                     {/* Add to Cart Button */}
//                     <Button
//                       className="w-full rounded-xl sm:rounded-2xl py-3 sm:py-6 text-xs sm:text-sm font-semibold bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 text-white hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-200/50 group"
//                       onClick={() => handleAddToCart(product)}
//                     >
//                       <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px] mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
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

// Cart Product interface (what the cart expects)
interface CartProduct {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  isNew: boolean;
  quantity?: number;
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

// Helper function to transform API product to Cart product format
const transformProductForCart = (apiProduct: ApiProduct): CartProduct => {
  const originalPrice = Math.round(apiProduct.Product_price * 1.2);
  
  return {
    id: parseInt(apiProduct._id.slice(-8), 16), // Convert MongoDB ObjectId to number
    name: apiProduct.Product_name,
    price: `₹${apiProduct.Product_price}`, // Convert number to formatted string
    originalPrice: `₹${originalPrice}`,
    image: apiProduct.Product_image[0] || '',
    rating: apiProduct.Product_rating || 4.5,
    isNew: apiProduct.isNew || false,
    quantity: 1
  };
};

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ 
  className = "",
  initialLimit = 8,
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

  const fetchProducts = async (limit: number, skip: number = 0, append: boolean = false): Promise<void> => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const res: AxiosResponse<ProductsApiResponse> = await axios.get(
        `${API_URL}/api/getproducts?limit=${limit}&skip=${skip}`
      );
      
      const newProducts = res.data.products || [];
      
      if (append) {
        // Filter out any products that already exist to prevent duplicates
        setProducts(prev => {
          const existingIds = new Set(prev.map(p => p._id));
          const uniqueNewProducts = newProducts.filter(product => !existingIds.has(product._id));
          
          const updatedProducts = uniqueNewProducts.length > 0 ? [...prev, ...uniqueNewProducts] : prev;
          
          // Set hasMore based on API response or logical deduction
          if (res.data.totalProducts) {
            // If API provides total, use it
            setHasMore(updatedProducts.length < res.data.totalProducts);
            setTotalProducts(res.data.totalProducts);
          } else {
            // If no total from API, check if we got fewer new products than requested
            // This means we've reached the end
            setHasMore(uniqueNewProducts.length === limit);
            // Update total estimate
            setTotalProducts(updatedProducts.length);
          }
          
          return updatedProducts;
        });
      } else {
        // Initial load - replace all products
        setProducts(newProducts);
        
        if (res.data.totalProducts) {
          setTotalProducts(res.data.totalProducts);
          setHasMore(newProducts.length < res.data.totalProducts);
        } else {
          // For initial load, assume there might be more if we got the full limit
          setHasMore(newProducts.length === limit);
          setTotalProducts(newProducts.length);
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
    fetchProducts(loadMoreCount, products.length, true);
  };

  const calculateDiscount = (price: number, originalPrice: number): number => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: ApiProduct): void => {
    e.stopPropagation();
    if (user) {
      const wasInWishlist = isInWishlist(product._id);
      
      // Transform product for wishlist if needed
      const transformedProduct = transformProductForCart(product);
      toggleWishlist(transformedProduct);
      
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

  const handleAddToCart = (product: ApiProduct): void => {
    if (user) {
      // Transform the API product to match cart format
      const cartProduct = transformProductForCart(product);
      
      console.log('Adding product to cart:', cartProduct); // Debug log
      
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

  // Calculate remaining products for button text
  const remainingProducts = Math.max(0, totalProducts - products.length);
  const productsToLoad = hasMore ? (remainingProducts > 0 ? Math.min(loadMoreCount, remainingProducts) : loadMoreCount) : 0;

  if (loading) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full animate-pulse mx-auto mb-4 max-w-xs"></div>
            <div className="h-4 bg-purple-100 rounded animate-pulse mx-auto max-w-md"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: initialLimit }).map((_, index) => (
              <div key={index} className="bg-white rounded-3xl p-3 sm:p-6 shadow-lg animate-pulse">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-2 sm:mb-4"></div>
                <div className="h-3 sm:h-4 bg-purple-100 rounded mb-2 sm:mb-3"></div>
                <div className="h-4 sm:h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded mb-2 sm:mb-4"></div>
                <div className="h-8 sm:h-12 bg-purple-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12">
            <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Products Available</h3>
            <p className="text-gray-600">Check back soon for our latest collections!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            Featured Collections
          </div>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
            New Arrivals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our latest collection of handcrafted jewelry pieces, designed with love and attention to detail
          </p>
          {totalProducts > 0 && (
            <p className="text-sm text-purple-600 mt-2">
              Showing {products.length} {totalProducts > products.length ? `of ${totalProducts}` : ''} products
            </p>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16">
          {products.map((product) => {
            const originalPrice = Math.round(product.Product_price * 1.2);
            const discount = calculateDiscount(product.Product_price, originalPrice);
            const isHovered = hoveredProduct === product._id;
            const inWishlist = isInWishlist(product._id);

            return (
              <div
                key={product._id}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-purple-100/50 shadow-lg hover:shadow-2xl hover:shadow-purple-200/20 transition-all duration-500 overflow-hidden flex flex-col hover:-translate-y-1 sm:hover:-translate-y-2"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Image */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer bg-gradient-to-br from-purple-50 to-pink-50"
                  onClick={() => handleProductClick(product._id)}
                >
                  <img
                    src={product.Product_image[0]}
                    alt={product.Product_name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Overlay effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges */}
                  <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex flex-col gap-1 sm:gap-2">
                    {product.isNew && (
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                        ✨ New
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-lg">
                        {discount}% OFF
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1 sm:gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full backdrop-blur-sm border transition-all duration-300 ${
                        inWishlist
                          ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600 hover:border-rose-600 shadow-lg shadow-rose-200/50"
                          : "bg-white/90 border-white/50 text-gray-600 hover:bg-rose-500 hover:border-rose-500 hover:text-white"
                      } ${isHovered ? 'scale-110 shadow-lg' : ''}`}
                      onClick={(e) => handleWishlistToggle(e, product)}
                    >
                      <Heart
                        size={14}
                        className="sm:w-[18px] sm:h-[18px]"
                        fill={inWishlist ? "currentColor" : "none"}
                      />
                    </Button>
                    
                    <Button
                      variant="secondary"
                      size="icon"
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm border-white/50 text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all duration-300 ${
                        isHovered ? 'scale-110 shadow-lg' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product._id);
                      }}
                    >
                      <Eye size={14} className="sm:w-[18px] sm:h-[18px]" />
                    </Button>
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-6 flex-grow flex flex-col">
                  <div className="mb-2 sm:mb-4">
                    <h3
                      className="font-bold text-sm sm:text-lg text-gray-900 line-clamp-2 leading-tight cursor-pointer hover:text-purple-600 transition-colors mb-2"
                      onClick={() => handleProductClick(product._id)}
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
                      
                      {product.category && (
                        <span className="text-[10px] sm:text-xs text-purple-600 bg-purple-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                          {product.category}
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
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart size={14} className="sm:w-[18px] sm:h-[18px] mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-12 py-6 border-2 border-purple-200 bg-white/50 backdrop-blur-sm text-purple-700 font-semibold hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-transparent hover:shadow-xl hover:shadow-purple-200/50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  View {productsToLoad} More Product{productsToLoad !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        )}

        {/* No More Products Message */}
        {!hasMore && products.length > initialLimit && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              You've seen all our amazing products!
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;