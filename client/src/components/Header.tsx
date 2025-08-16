// import { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   ShoppingCart,
//   Heart,
//   User,
//   Menu,
//   X,
//   LayoutDashboard,
//   Clock,
//   TrendingUp,
// } from "lucide-react";
// import { useAuth } from "@/components/AuthContext";
// import { useCart } from "./CartContext";
// import { useWishlist } from "./WishlistContext";
// import { useToast } from "@/hooks/use-toast";
// import { motion, AnimatePresence } from "framer-motion";
// import Fuse from "fuse.js";

// const Header = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);
//   const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
//   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [recentSearches, setRecentSearches] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [productsLoading, setProductsLoading] = useState(true);

//   const profileMenuRef = useRef(null);
//   const mobileSearchRef = useRef(null);
//   const searchResultsRef = useRef(null);
//   const lastScrollY = useRef(0);
//   const searchTimeoutRef = useRef(null);

//   const { user, logout, isAuthenticated } = useAuth();
//   const { cart, clearCart } = useCart();
//   const { clearWishlist, getTotalItems, getTotalUniqueItems } = useWishlist();
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   // Calculate cart and wishlist totals
//   const totalQuantity = useMemo(() => {
//     return cart?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
//   }, [cart]);

//   const totalWishlistItems = useMemo(() => {
//     return getTotalItems ? getTotalItems() : 0;
//   }, [getTotalItems]);

//   const uniqueWishlistItems = useMemo(() => {
//     return getTotalUniqueItems ? getTotalUniqueItems() : 0;
//   }, [getTotalUniqueItems]);

//   // Enhanced Fuse.js configuration with better performance
//   const fuseOptions = useMemo(() => ({
//     keys: [
//       { name: "Product_name", weight: 0.7 },
//       { name: "Product_category.category", weight: 0.2 },
//       { name: "Product_discription", weight: 0.1 },
//     ],
//     threshold: 0.5, // Balanced - not too strict, not too loose
//     minMatchCharLength: 2,
//     includeScore: true,
//     includeMatches: true,
//     ignoreLocation: true,
//     findAllMatches: false,
//     shouldSort: true,
//     isCaseSensitive: false,
//     distance: 100, // Limit search distance for better performance
//   }), []);

//   // Create Fuse instance with proper memoization
//   const fuse = useMemo(() => {
//     if (products.length === 0) return null;
//     return new Fuse(products, fuseOptions);
//   }, [products, fuseOptions]);

//   // Load recent searches from localStorage
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem("recentSearches");
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
//       }
//     } catch (error) {
//       console.error("Error loading recent searches:", error);
//       setRecentSearches([]);
//     }
//   }, []);

//   // Fetch products from backend
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setProductsLoading(true);
//       try {
//         const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";
//         const response = await fetch(`${API_URL}/api/getproducts`);
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
        
//         // Fix: Properly extract products
//         const productArray = data.products || [];
//         console.log("Products loaded:", productArray.length);
        
//         setProducts(Array.isArray(productArray) ? productArray : []);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         setProducts([]);
//         toast({
//           title: "Connection Issue",
//           description: "Unable to load products. Please check your connection.",
//           variant: "destructive",
//         });
//       } finally {
//         setProductsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [toast]);

//   // Optimized single search function
//   const performSearch = useCallback(async (query) => {
//     if (!query.trim() || !fuse) {
//       setSearchResults([]);
//       setShowSearchResults(false);
//       return;
//     }

//     setIsSearching(true);
//     setShowSearchResults(true);

//     try {
//       // Use the memoized Fuse instance
//       const searchResponse = fuse.search(query);

//       if (searchResponse.length === 0) {
//         // Optimized fallback search with early termination
//         const manualResults = products.filter(product => {
//           const searchTerm = query.toLowerCase();
//           return (
//             (product.Product_name || '').toLowerCase().includes(searchTerm) ||
//             (product.Product_discription || '').toLowerCase().includes(searchTerm) ||
//             (product.Product_category?.category || '').toLowerCase().includes(searchTerm)
//           );
//         }).slice(0, 8); // Limit results for performance

//         setSearchResults(manualResults.map(item => ({
//           ...item,
//           score: 0.5,
//           matches: [],
//         })));
//       } else {
//         // Process Fuse.js results
//         const results = searchResponse
//           .slice(0, 8) // Limit results early
//           .map((result) => ({
//             ...result.item,
//             score: result.score,
//             matches: result.matches,
//           }));

//         setSearchResults(results);
//       }
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchResults([]);
//       toast({
//         title: "Search Error",
//         description: "Something went wrong while searching. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSearching(false);
//     }
//   }, [fuse, products, toast]);

//   // Optimized debounced search
//   useEffect(() => {
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//     }

//     searchTimeoutRef.current = setTimeout(() => {
//       if (searchQuery.trim()) {
//         performSearch(searchQuery);
//       } else {
//         setSearchResults([]);
//         setShowSearchResults(false);
//       }
//     }, 300);

//     return () => {
//       if (searchTimeoutRef.current) {
//         clearTimeout(searchTimeoutRef.current);
//       }
//     };
//   }, [searchQuery, performSearch]);

//   // Save recent search
//   const saveRecentSearch = useCallback((query) => {
//     const trimmed = query.trim();
//     if (!trimmed) return;

//     try {
//       const updated = [
//         trimmed,
//         ...recentSearches.filter((s) => s !== trimmed),
//       ].slice(0, 5);
//       setRecentSearches(updated);
//       localStorage.setItem("recentSearches", JSON.stringify(updated));
//     } catch (error) {
//       console.error("Error saving recent search:", error);
//     }
//   }, [recentSearches]);

//   // Handle search submission
//   const handleSearch = useCallback((e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) {
//       toast({
//         title: "Empty search",
//         description: "Please enter a keyword to search.",
//       });
//       return;
//     }

//     saveRecentSearch(searchQuery);
//     navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
//     setShowSearchResults(false);
//     setIsMobileSearchOpen(false);
//   }, [searchQuery, saveRecentSearch, navigate, toast]);

//   // Handle product click
//   const handleProductClick = useCallback((productId) => {
//     navigate(`/product/${productId}`);
//     setShowSearchResults(false);
//     setIsMobileSearchOpen(false);
//     setSearchQuery("");
//   }, [navigate]);

//   // Handle recent search click
//   const handleRecentSearchClick = useCallback((query) => {
//     setSearchQuery(query);
//     performSearch(query);
//   }, [performSearch]);

//   // Helper function to highlight matched text
//   const highlightMatches = useCallback((text, matches) => {
//     if (!matches || matches.length === 0 || !text) return text;

//     // Find matches for the current field
//     const fieldMatches = matches.filter(
//       (match) =>
//         match.key === "Product_name" ||
//         match.key === "Product_category.category"
//     );

//     if (fieldMatches.length === 0) return text;

//     // Simple highlighting
//     let highlightedText = text;
//     fieldMatches.forEach((match) => {
//       match.indices.forEach(([start, end]) => {
//         const matchedText = text.slice(start, end + 1);
//         highlightedText = highlightedText.replace(
//           matchedText,
//           `<mark class="bg-yellow-200 px-1 rounded">${matchedText}</mark>`
//         );
//       });
//     });

//     return highlightedText;
//   }, []);

//   // Handle logout
//   const handleLogout = useCallback(() => {
//     logout();
//     toast({
//       title: "Logged out successfully",
//       description: "Come back soon!",
//       variant: "default",
//     });
//     navigate("/");
//     setIsProfileMenuOpen(false);
//   }, [logout , toast, navigate]);

//   // Click outside handler and scroll handler
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target)
//       ) {
//         setIsProfileMenuOpen(false);
//       }
//       if (
//         mobileSearchRef.current &&
//         !mobileSearchRef.current.contains(event.target)
//       ) {
//         setIsMobileSearchOpen(false);
//       }
//       if (
//         searchResultsRef.current &&
//         !searchResultsRef.current.contains(event.target)
//       ) {
//         setShowSearchResults(false);
//       }
//     };

//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setShowNavbar(
//         currentScrollY <= lastScrollY.current || currentScrollY <= 60
//       );
//       lastScrollY.current = currentScrollY;
//     };

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     if (isProfileMenuOpen || isMobileSearchOpen || showSearchResults) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isProfileMenuOpen, isMobileSearchOpen, showSearchResults]);

//   return (
//     <>
//       <motion.header
//         initial={{ y: -100 }}
//         animate={{ y: showNavbar ? 0 : -100 }}
//         transition={{ duration: 0.3 }}
//         className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-200 shadow-sm"
//       >
//         <div className="container mx-auto px-4">
//           <div className="flex items-center justify-between py-3 gap-4">
//             {/* Logo */}
//             <div
//               className="flex items-center cursor-pointer flex-shrink-0"
//               onClick={() => navigate("/")}
//             >
//               <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
//                 <span className="text-purple-600">Anokhi</span>{" "}
//                 <span className="text-gray-600">अदा</span>
//               </h1>
//             </div>

//             {/* Enhanced Desktop Search Bar with Fuzzy Search */}
//             <div
//               className="hidden md:flex flex-1 max-w-2xl mx-4 relative"
//               ref={searchResultsRef}
//             >
//               <div className="w-full relative">
//                 <Search
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
//                   size={20}
//                 />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
//                   onFocus={() => searchQuery && setShowSearchResults(true)}
//                   placeholder="Search for jewelry, collections... (fuzzy search enabled)"
//                   className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
//                   aria-label="Search products"
//                   aria-expanded={showSearchResults}
//                   aria-haspopup="listbox"
//                   role="combobox"
//                 />

//                 {/* Enhanced Search Results Dropdown with Fuzzy Matching */}
//                 <AnimatePresence>
//                   {showSearchResults && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       className="absolute mt-2 bg-white border border-gray-200 rounded-xl w-full z-50 shadow-2xl max-h-96 overflow-hidden"
//                       role="listbox"
//                     >
//                       {isSearching ? (
//                         <div className="p-4 text-center">
//                           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
//                           <p className="text-sm text-gray-500 mt-2">
//                             Searching...
//                           </p>
//                         </div>
//                       ) : (
//                         <div className="max-h-96 overflow-y-auto">
//                           {/* Recent Searches */}
//                           {!searchQuery && recentSearches.length > 0 && (
//                             <div className="p-3 border-b border-gray-100">
//                               <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center">
//                                 <Clock size={12} className="mr-1" />
//                                 Recent Searches
//                               </h4>
//                               {recentSearches.map((recent, i) => (
//                                 <button
//                                   key={i}
//                                   onClick={() =>
//                                     handleRecentSearchClick(recent)
//                                   }
//                                   className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
//                                   role="option"
//                                 >
//                                   <Search className="inline mr-2" size={12} />
//                                   {recent}
//                                 </button>
//                               ))}
//                             </div>
//                           )}

//                           {/* Fuzzy Search Results */}
//                           {searchResults.length > 0 ? (
//                             <div className="p-2">
//                               <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-2 flex items-center">
//                                 <TrendingUp size={12} className="mr-1" />
//                                 Products ({searchResults.length}) - Fuzzy
//                                 matched
//                               </h4>
//                               {searchResults.map((product) => (
//                                 <button
//                                   key={product._id}
//                                   onClick={() =>
//                                     handleProductClick(product._id)
//                                   }
//                                   className="w-full p-3 hover:bg-purple-50 cursor-pointer rounded-lg transition-colors flex items-center space-x-3"
//                                   role="option"
//                                 >
//                                   <div className="w-12 h-12 flex-shrink-0">
//                                     <img
//                                       src={
//                                         product.Product_image?.[0] ||
//                                         "/api/placeholder/48/48"
//                                       }
//                                       alt={product.Product_name}
//                                       className="w-full h-full object-cover rounded-lg"
//                                       onError={(e) => {
//                                         e.currentTarget.src = "/api/placeholder/48/48";
//                                       }}
//                                     />
//                                   </div>
//                                   <div className="flex-1 text-left min-w-0">
//                                     <h4
//                                       className="font-semibold text-gray-900 truncate text-sm"
//                                       dangerouslySetInnerHTML={{
//                                         __html: highlightMatches(
//                                           product.Product_name,
//                                           product.matches
//                                         ),
//                                       }}
//                                     />
//                                     <p className="text-purple-600 font-medium text-sm">
//                                       ₹{product.Product_price?.toLocaleString()}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                       {product.Product_category?.category}
//                                     </p>
//                                     {product.score && (
//                                       <p className="text-xs text-gray-400">
//                                         Match:{" "}
//                                         {Math.round((1 - product.score) * 100)}%
//                                       </p>
//                                     )}
//                                   </div>
//                                   {product.Product_available && (
//                                     <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
//                                   )}
//                                 </button>
//                               ))}

//                               <button
//                                 onClick={handleSearch}
//                                 className="w-full p-3 text-center text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors border-t border-gray-100 mt-2"
//                               >
//                                 View all results for "{searchQuery}"
//                               </button>
//                             </div>
//                           ) : searchQuery && !isSearching ? (
//                             <div className="p-6 text-center">
//                               <Search className="mx-auto h-8 w-8 text-gray-400 mb-2" />
//                               <p className="text-sm text-gray-500">
//                                 No products found for "{searchQuery}"
//                               </p>
//                               <p className="text-xs text-gray-400 mt-1">
//                                 Try different keywords or check spelling
//                               </p>
//                             </div>
//                           ) : null}
//                         </div>
//                       )}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>

//             {/* Right Actions */}
//             <div className="flex items-center gap-2 md:gap-3">
//               {/* Mobile Search Button */}
//               <button
//                 className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
//                 onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
//                 title="Search"
//                 aria-label="Toggle search"
//               >
//                 <Search size={20} />
//               </button>

//               {/* Admin Button - Desktop/Tablet */}
//               {user?.role === "admin" && (
//                 <div className="relative group hidden sm:flex">
//                   <button
//                     className="px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
//                     onClick={() => navigate("/admin")}
//                   >
//                     <LayoutDashboard size={18} className="inline-block mr-1" />
//                     Admin
//                   </button>
//                   <div className="absolute top-full mt-2 w-40 bg-white border border-gray-200 shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-50">
//                     <button
//                       onClick={() => navigate("/admin")}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-md"
//                     >
//                       Dashboard
//                     </button>
//                     <button
//                       onClick={() => navigate("/admin/products")}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
//                     >
//                       Manage Products
//                     </button>
//                     <button
//                       onClick={() => navigate("/admin/orders")}
//                       className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-b-md"
//                     >
//                       Manage Orders
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Wishlist with Quantity Badge */}
//               <button
//                 className="p-2 text-gray-600 hover:text-purple-600 transition-colors relative"
//                 onClick={() => navigate("/wishlist")}
//                 title={`Wishlist (${uniqueWishlistItems} items${
//                   totalWishlistItems !== uniqueWishlistItems
//                     ? `, ${totalWishlistItems} total`
//                     : ""
//                 })`}
//                 aria-label={`Wishlist with ${totalWishlistItems} items`}
//               >
//                 <Heart size={20} />
//                 {totalWishlistItems > 0 && (
//                   <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full">
//                     {totalWishlistItems}
//                   </span>
//                 )}
//               </button>

//               {/* Cart with Quantity Badge */}
//               <button
//                 className="p-2 text-gray-600 hover:text-purple-600 transition-colors relative"
//                 onClick={() => navigate("/cart")}
//                 title="Shopping Cart"
//                 aria-label={`Shopping cart with ${totalQuantity} items`}
//               >
//                 <ShoppingCart size={20} />
//                 {totalQuantity > 0 && (
//                   <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
//                     {totalQuantity}
//                   </span>
//                 )}
//               </button>

//               {/* Desktop Authentication */}
//               <div className="hidden md:flex items-center">
//                 {!isAuthenticated ? (
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => navigate("/login")}
//                       className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium"
//                     >
//                       Sign In
//                     </button>
//                     <button
//                       onClick={() => navigate("/signup")}
//                       className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all"
//                     >
//                       Sign Up
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="relative" ref={profileMenuRef}>
//                     <button
//                       className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
//                       onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
//                       title={user.firstName || user.email}
//                       aria-label="User menu"
//                     >
//                       <User size={20} />
//                     </button>

//                     <AnimatePresence>
//                       {isProfileMenuOpen && (
//                         <motion.div
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: 10 }}
//                           className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
//                         >
//                           <div className="px-4 py-3 border-b border-gray-100">
//                             <p className="text-sm font-medium text-gray-900">
//                               {user.firstName || user.email}
//                             </p>
//                             <p className="text-xs text-gray-500">
//                               {user.email}
//                             </p>
//                           </div>
//                           <button
//                             onClick={() => {
//                               navigate("/profile");
//                               setIsProfileMenuOpen(false);
//                             }}
//                             className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                           >
//                             My Profile
//                           </button>
//                           <button
//                             onClick={() => {
//                               navigate("/orders");
//                               setIsProfileMenuOpen(false);
//                             }}
//                             className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                           >
//                             My Orders
//                           </button>
//                           {user?.role === "admin" && (
//                             <button
//                               onClick={() => {
//                                 navigate("/admin");
//                                 setIsProfileMenuOpen(false);
//                               }}
//                               className="w-full text-left px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors border-t border-gray-100"
//                             >
//                               Admin Panel
//                             </button>
//                           )}
//                           <button
//                             onClick={handleLogout}
//                             className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
//                           >
//                             Logout
//                           </button>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </div>
//                 )}
//               </div>

//               {/* Mobile Menu Button */}
//               <button
//                 className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 aria-label="Toggle mobile menu"
//               >
//                 {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.header>

//       {/* Enhanced Mobile Search Bar */}
//       <AnimatePresence>
//         {isMobileSearchOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className="fixed top-16 inset-x-0 bg-white z-40 shadow-lg border-b border-gray-200 md:hidden"
//             ref={mobileSearchRef}
//           >
//             <div className="px-4 py-3">
//               <div className="relative">
//                 <Search
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       handleSearch(e);
//                     }
//                   }}
//                   placeholder="Search jewelry..."
//                   className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                   autoFocus
//                 />
//                 <button
//                   onClick={() => setIsMobileSearchOpen(false)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>

//               {/* Mobile Search Results */}
//               {(searchResults.length > 0 || recentSearches.length > 0) && (
//                 <div className="mt-3 bg-gray-50 rounded-lg max-h-64 overflow-y-auto">
//                   {!searchQuery && recentSearches.length > 0 && (
//                     <div className="p-3">
//                       <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
//                         Recent
//                       </h4>
//                       {recentSearches.map((recent, i) => (
//                         <button
//                           key={i}
//                           onClick={() => handleRecentSearchClick(recent)}
//                           className="block w-full text-left px-2 py-1.5 text-sm text-gray-600 hover:text-purple-600 rounded"
//                         >
//                           <Clock className="inline mr-2" size={12} />
//                           {recent}
//                         </button>
//                       ))}
//                     </div>
//                   )}

//                   {searchResults.length > 0 && (
//                     <div className="p-2">
//                       {searchResults.slice(0, 4).map((product) => (
//                         <button
//                           key={product._id}
//                           onClick={() => handleProductClick(product._id)}
//                           className="w-full p-2 hover:bg-white cursor-pointer rounded flex items-center space-x-3"
//                         >
//                           <img
//                             src={product.Product_image?.[0] || "/api/placeholder/40/40"}
//                             alt={product.Product_name}
//                             className="w-10 h-10 object-cover rounded"
//                             onError={(e) => {
//                               e.currentTarget.src = "/api/placeholder/40/40";
//                             }}
//                           />
//                           <div className="flex-1 text-left min-w-0">
//                             <h4 className="font-medium text-gray-900 truncate text-sm">
//                               {product.Product_name}
//                             </h4>
//                             <p className="text-purple-600 text-sm">
//                               ₹{product.Product_price?.toLocaleString()}
//                             </p>
//                           </div>
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             className={`fixed inset-x-0 bg-white z-40 shadow-lg border-b border-gray-200 md:hidden ${
//               isMobileSearchOpen ? "top-[76px]" : "top-16"
//             }`}
//           >
//             <div className="container mx-auto px-4 py-4">
//               <div className="flex flex-col space-y-3">
//                 {/* Navigation Links */}
//                 <div className="space-y-1">
//                   <button
//                     onClick={() => {
//                       navigate("/");
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
//                   >
//                     Home
//                   </button>
//                 </div>

//                 {/* Admin Section for Mobile */}
//                 {user?.role === "admin" && (
//                   <div className="pt-2 border-t border-gray-200">
//                     <div className="space-y-1">
//                       <button
//                         onClick={() => {
//                           navigate("/admin");
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="block w-full text-left py-3 px-4 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors"
//                       >
//                         <LayoutDashboard
//                           size={18}
//                           className="inline-block mr-2"
//                         />
//                         Admin Dashboard
//                       </button>
//                       <button
//                         onClick={() => {
//                           navigate("/admin/products");
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                       >
//                         Manage Products
//                       </button>
//                       <button
//                         onClick={() => {
//                           navigate("/admin/orders");
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                       >
//                         Manage Orders
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Authentication Section */}
//                 <div className="pt-4 border-t border-gray-200">
//                   {!isAuthenticated ? (
//                     <div className="flex flex-col gap-3">
//                       <button
//                         onClick={() => {
//                           navigate("/login");
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                       >
//                         Sign In
//                       </button>
//                       <button
//                         onClick={() => {
//                           navigate("/signup");
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
//                       >
//                         Create Account
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="space-y-1">
//                       <div className="px-4 py-3 bg-gray-50 rounded-lg">
//                         <p className="text-sm font-medium text-gray-900">
//                           {user.firstName || "User"}
//                         </p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                       <button
//                         onClick={() => {
//                           navigate("/profile");
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                       >
//                         My Profile
//                       </button>
//                       <button
//                         onClick={() => {
//                           navigate("/orders");
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
//                       >
//                         My Orders
//                       </button>
//                       <button
//                         onClick={() => {
//                           handleLogout();
//                           setIsMobileMenuOpen(false);
//                         }}
//                         className="w-full text-left py-3 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                       >
//                         Logout
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default Header;







import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Gift,
  User,
  Menu,
  X,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import { TokenManager } from '@/utils/tokenManager'; 

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const profileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const searchResultsRef = useRef(null);
  const lastScrollY = useRef(0);
  const searchTimeoutRef = useRef(null);

  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const { getTotalItems } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();
   const [isAdmin, setIsAdmin] = useState(false);

  // Navigation items (removed Home route)
  const navigationItems = [
    {
      name: 'Custom Hamper',
      href: '/custom-hamper',
      icon: <Gift className="w-4 h-4" />,
      highlight: true,
      badge: 'New'
    },
  ];

  // Calculate totals
  const totalQuantity = useMemo(() => {
    return cart?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  }, [cart]);

  const totalWishlistItems = useMemo(() => {
    return getTotalItems ? getTotalItems() : 0;
  }, [getTotalItems]);

  // Enhanced Fuse.js configuration
  const fuseOptions = useMemo(() => ({
    keys: [
      { name: "Product_name", weight: 0.7 },
      { name: "Product_category.category", weight: 0.2 },
      { name: "Product_discription", weight: 0.1 },
    ],
    threshold: 0.5,
    minMatchCharLength: 2,
    includeScore: true,
    includeMatches: true,
    ignoreLocation: true,
    findAllMatches: false,
    shouldSort: true,
    isCaseSensitive: false,
    distance: 100,
  }), []);

  const fuse = useMemo(() => {
    if (products.length === 0) return null;
    return new Fuse(products, fuseOptions);
  }, [products, fuseOptions]);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecentSearches(Array.isArray(parsed) ? parsed.slice(0, 5) : []);
      }
    } catch (error) {
      console.error("Error loading recent searches:", error);
      setRecentSearches([]);
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
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
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Search functionality
  const performSearch = useCallback(async (query) => {
    if (!query.trim() || !fuse) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const searchResponse = fuse.search(query);
      const results = searchResponse.slice(0, 6).map((result) => ({
        ...result.item,
        score: result.score,
        matches: result.matches,
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [fuse]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, performSearch]);

  // Handle search submission
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setShowSearchResults(false);
    setIsMobileSearchOpen(false);
    setIsMobileMenuOpen(false);
  }, [searchQuery, navigate]);

  // Handle product click
  const handleProductClick = useCallback((productId) => {
    navigate(`/product/${productId}`);
    setShowSearchResults(false);
    setIsMobileSearchOpen(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  }, [navigate]);

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
      variant: "default",
    });
    navigate("/");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [logout, toast, navigate]);

  // Event handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY <= lastScrollY.current || currentScrollY <= 60);
      lastScrollY.current = currentScrollY;
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isMobileMenuOpen]);

  // Body scroll lock for mobile
  useEffect(() => {
    if (isMobileMenuOpen || isMobileSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isMobileSearchOpen]);


   // ✅ Add admin status check
  useEffect(() => {
  const checkAdminStatus = () => {
    const adminToken = TokenManager.getToken('admin');
    // Read user from your AuthContext and/or localStorage
    const userRole = user?.role === 'admin' ||
      localStorage.getItem('user_role') === 'admin' ||
      (() => {
        try {
          const parsedAdmin = JSON.parse(localStorage.getItem('admin_user') || '{}');
          return parsedAdmin?.role === 'admin'; // if storing role in admin_user object
        } catch {
          return false;
        }
      })();

    setIsAdmin(Boolean(adminToken) && Boolean(userRole));
  };

  checkAdminStatus();

  // Listen for storage changes if user switches account in another tab
  window.addEventListener('storage', checkAdminStatus);

  return () => {
    window.removeEventListener('storage', checkAdminStatus);
  };
}, [user]);

  return (
    <>
      {/* ✅ Clean Professional Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: showNavbar ? 0 : -100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 focus:outline-none group"
                aria-label="Go to homepage"
              >
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
                  <span className="text-purple-600">Anokhi</span>{" "}
                  <span className="text-gray-600">अदा</span>
                </h1>
              </button>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className={`relative text-sm font-medium transition-all duration-200 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg px-4 py-2 group ${
                    item.highlight 
                      ? 'text-orange-600 hover:text-orange-700 font-semibold' 
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-orange-400 to-pink-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              ))}
            </nav>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchResultsRef}>
              <div className="w-full relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" strokeWidth={1.5} />
                </div>
                
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  placeholder="Search for Amazing jewelry..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 focus:bg-white transition-all duration-200 text-sm placeholder-gray-400"
                />

                {/* Search Results */}
                <AnimatePresence>
                  {showSearchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 bg-white border border-gray-200 rounded-xl w-full z-50 shadow-xl max-h-96 overflow-hidden"
                    >
                      {isSearching ? (
                        <div className="p-4 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                          <p className="text-sm text-gray-500 mt-2">Searching...</p>
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="p-2 max-h-80 overflow-y-auto">
                          {searchResults.map((product) => (
                            <button
                              key={product._id}
                              onClick={() => handleProductClick(product._id)}
                              className="w-full p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors flex items-center space-x-3"
                            >
                              <img
                                src={product.Product_image?.[0] || "/api/placeholder/48/48"}
                                alt={product.Product_name}
                                className="w-10 h-10 object-cover rounded-lg"
                                onError={(e) => { e.currentTarget.src = "/api/placeholder/48/48"; }}
                              />
                              <div className="flex-1 text-left min-w-0">
                                <h4 className="font-medium text-gray-900 truncate text-sm">
                                  {product.Product_name}
                                </h4>
                                <p className="text-purple-600 font-medium text-sm">
                                  ₹{product.Product_price?.toLocaleString()}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery && !isSearching ? (
                        <div className="p-6 text-center">
                          <Search className="mx-auto h-8 w-8 text-gray-300 mb-2" strokeWidth={1.5} />
                          <p className="text-sm text-gray-500">No products found</p>
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 lg:space-x-3">
              
              {/* Mobile Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Search"
              >
                <Search size={20} strokeWidth={1.5} />
              </motion.button>

              {/* Admin Button */}
              {isAdmin && (
                <motion.div 
                  className="relative group hidden lg:block"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onClick={() => navigate("/admin")}
                  >
                    <LayoutDashboard size={16} className="inline-block mr-2" strokeWidth={1.5} />
                    Admin
                  </button>
                </motion.div>
              )}

              {/* Custom Hamper Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-orange-600 hover:text-orange-700 transition-colors rounded-lg hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500 relative group"
                onClick={() => navigate("/custom-hamper")}
                aria-label="Create custom hamper"
              >
                <Gift size={20} strokeWidth={1.5} />
                
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Custom Hamper
                </div>
              </motion.button>

              {/* ✅ Wishlist Button - HIDDEN ON MOBILE, SHOWN ON DESKTOP */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex p-2 text-gray-600 hover:text-pink-600 transition-colors rounded-lg hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 relative"
                onClick={() => navigate("/wishlist")}
                aria-label={`Wishlist with ${totalWishlistItems} items`}
              >
                <Heart size={20} strokeWidth={1.5} />
                {totalWishlistItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full"
                  >
                    {totalWishlistItems > 99 ? '99+' : totalWishlistItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Cart Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 relative"
                onClick={() => navigate("/cart")}
                aria-label={`Shopping cart with ${totalQuantity} items`}
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {totalQuantity > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
                  >
                    {totalQuantity > 99 ? '99+' : totalQuantity}
                  </motion.span>
                )}
              </motion.button>

              {/* Desktop Authentication */}
              <div className="hidden md:flex items-center">
                {!isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/login")}
                      className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Sign In
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/signup")}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Sign Up
                    </motion.button>
                  </div>
                ) : (
                  <div className="relative" ref={profileMenuRef}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      aria-label="User menu"
                    >
                      <User size={20} strokeWidth={1.5} />
                    </motion.button>

                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.firstName || user.email}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          </div>
                          
                          <div className="py-1">
                            <button
                              onClick={() => {
                                navigate("/profile");
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              My Profile
                            </button>
                            
                            <button
                              onClick={() => {
                                navigate("/orders");
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              My Orders
                            </button>
                            
                            <button
                              onClick={() => {
                                navigate("/wishlist");
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-between"
                            >
                              My Wishlist
                              {totalWishlistItems > 0 && (
                                <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-pink-500 rounded-full">
                                  {totalWishlistItems > 9 ? '9+' : totalWishlistItems}
                                </span>
                              )}
                            </button>
                            
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  navigate("/admin");
                                  setIsProfileMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 transition-colors border-t border-gray-100"
                              >
                                Admin Panel
                              </button>
                            )}
                            
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                            >
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2 text-gray-600 hover:text-purple-600 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isMobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-white md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center p-4 border-b border-gray-200 bg-white">
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg mr-2"
                  aria-label="Close search"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                    placeholder="Search jewelry..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isSearching ? (
                  <div className="flex justify-center items-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-4 space-y-2">
                    {searchResults.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                        className="w-full p-4 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-3 text-left"
                      >
                        <img
                          src={product.Product_image?.[0] || "/api/placeholder/48/48"}
                          alt={product.Product_name}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => { e.currentTarget.src = "/api/placeholder/48/48"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{product.Product_name}</h4>
                          <p className="text-purple-600 font-medium text-sm">
                            ₹{product.Product_price?.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery && !isSearching ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" strokeWidth={1.5} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-500">Try searching with different keywords</p>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Mobile Menu with Wishlist Included */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-black/50 md:hidden mobile-menu-container"
            onClick={(e) => e.target === e.currentTarget && setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-900">Menu</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors rounded-lg"
                    aria-label="Close menu"
                  >
                    <X size={20} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Navigation Links */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Navigation</h3>
                    {navigationItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          navigate(item.href);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                          item.highlight 
                            ? 'text-orange-600 bg-orange-50 hover:bg-orange-100' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                        {item.highlight && (
                          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Featured
                          </span>
                        )}
                      </button>
                    ))}

                    {/* ✅ Wishlist in Mobile Menu */}
                    <button
                      onClick={() => {
                        navigate("/wishlist");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-3 rounded-lg font-medium transition-colors text-gray-700 hover:bg-gray-50 justify-between"
                    >
                      <div className="flex items-center">
                        <Heart size={18} className="mr-3" strokeWidth={1.5} />
                        My Wishlist
                      </div>
                      {totalWishlistItems > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-pink-500 rounded-full">
                          {totalWishlistItems > 9 ? '9+' : totalWishlistItems}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Admin Section */}
                  {isAdmin && (
                    <div className="px-4 pb-4 border-t border-gray-200 mt-4 pt-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Admin</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            navigate("/admin");
                            setIsMobileMenuOpen(false);
                          }}
                          className="flex items-center w-full text-left px-4 py-3 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg font-medium transition-colors"
                        >
                          <LayoutDashboard size={18} className="mr-3" strokeWidth={1.5} />
                          Admin Dashboard
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Authentication Section */}
                  <div className="px-4 pb-4 border-t border-gray-200 mt-4 pt-4">
                    {!isAuthenticated ? (
                      <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Account</h3>
                        <button
                          onClick={() => {
                            navigate("/login");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            navigate("/signup");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all"
                        >
                          Create Account
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="px-4 py-3 bg-gray-50 rounded-lg mb-3">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.firstName || "User"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          My Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate("/orders");
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          My Orders
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-t border-gray-200 mt-3 pt-3"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Menu Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-xs text-center text-gray-500">
                    © 2025 Anokhi अदा. All rights reserved.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
