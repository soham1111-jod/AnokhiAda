// import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";
// import { useToast } from "../components/ui/use-toast";
// import axiosInstance from "../utils/axiosConfig";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Card, CardContent } from "../components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Badge } from "../components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Minus,
//   X,
//   ShoppingCart,
//   Package,
//   Gift,
//   Filter,
//   Search,
//   RefreshCw,
//   AlertCircle,
//   Trash2,
//   Eye,
//   ShoppingBag,
//   Truck,
//   Grid3X3,
//   List,
//   ChevronUp,
//   ChevronDown
// } from "lucide-react";

// const CustomHamperBuilder = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();

//   // Core hamper state
//   const [hamperItems, setHamperItems] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);

//   // Products state
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // UI state
//   const [activeTab, setActiveTab] = useState("explore"); // "explore" or "hamper"
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Filter and search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [sortBy, setSortBy] = useState("name");

//   // Checkout form
//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     phone: ""
//   });

//   // Constants
//   const MINIMUM_HAMPER_AMOUNT = 200;
//   const DELIVERY_CHARGE = totalAmount >= 500 ? 0 : 80;
//   const minimumAmountGap = Math.max(0, MINIMUM_HAMPER_AMOUNT - totalAmount);
//   const freeDeliveryGap = Math.max(0, 500 - totalAmount);
//     const justAddedItem = useRef(false);

//   // ✅ Detect mobile screen size
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//    // ✅ Fixed auto-switch logic - only switch immediately after adding an item
//   useEffect(() => {
//     if (isMobile && hamperItems.length > 0 && activeTab === "explore" && justAddedItem.current) {
//       // Small delay to show the add animation
//       setTimeout(() => {
//         setActiveTab("hamper");
//         justAddedItem.current = false; // Reset the flag
//       }, 800);
//     }
//   }, [hamperItems.length, isMobile, activeTab]);

//   // ✅ Fetch hamper-eligible products using backend filtering
//   const fetchHamperProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log('🎁 Fetching hamper-eligible products from backend...');

//       const response = await axiosInstance.get('api/getproducts?type=hamper&limit=100');

//       console.log('📦 Hamper products response:', response.data);

//       if (response.data && response.data.product) {
//         const hamperProducts = response.data.product;

//         setProducts(hamperProducts);
//         setFilteredProducts(hamperProducts);

//         const uniqueCategories = [
//           ...new Set(hamperProducts
//             .map((p) => p.Product_category_name || p.Product_category?.category || 'Uncategorized')
//             .filter(Boolean)
//           )
//         ];
//         setCategories(uniqueCategories);

//         console.log(`✅ Loaded ${hamperProducts.length} hamper-eligible products`);

//         if (hamperProducts.length === 0) {
//           toast({
//             title: "No Hamper Products",
//             description: "No products are currently available for custom hampers.",
//             variant: "default",
//           });
//         }
//       } else {
//         setProducts([]);
//         setFilteredProducts([]);
//         setCategories([]);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching hamper products:", error);
//       const errorMessage = error.response?.data?.message || error.message || 'Failed to load hamper products';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]);

//   // ✅ Fetch user's hamper from database
//   const fetchUserHamper = useCallback(async () => {
//     if (!user) return;

//     try {
//       const response = await axiosInstance.get("/hamper");
//       const data = response.data;

//       if (data.hamper && data.hamper.length > 0) {
//         setHamperItems(data.hamper);
//         setTotalAmount(data.totalAmount || 0);
//         setTotalItems(data.totalItems || 0);
//         console.log("Hamper loaded from database:", data);
//       } else {
//         setHamperItems([]);
//         setTotalAmount(0);
//         setTotalItems(0);
//       }
//     } catch (error) {
//       console.error("Error fetching hamper from database:", error);
//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);
//     }
//   }, [user]);

//   // Initialize component
//   useEffect(() => {
//     fetchHamperProducts();
//     fetchUserHamper();
//   }, [fetchHamperProducts, fetchUserHamper]);

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = [...products];

//     if (searchQuery) {
//       filtered = filtered.filter((product) =>
//         product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (product) => (product.Product_category_name || product.Product_category) === selectedCategory
//       );
//     }

//     if (priceRange.min) {
//       filtered = filtered.filter(
//         (product) => (product.Hamper_price || product.Product_price) >= parseFloat(priceRange.min)
//       );
//     }
//     if (priceRange.max) {
//       filtered = filtered.filter(
//         (product) => (product.Hamper_price || product.Product_price) <= parseFloat(priceRange.max)
//       );
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return (a.Hamper_price || a.Product_price) - (b.Hamper_price || b.Product_price);
//         case "price-high":
//           return (b.Hamper_price || b.Product_price) - (a.Hamper_price || a.Product_price);
//         case "name":
//         default:
//           return a.Product_name.localeCompare(b.Product_name);
//       }
//     });

//     setFilteredProducts(filtered);
//   }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

//   // Hamper validation
//   const hamperValidation = useMemo(() => {
//     if (totalAmount < MINIMUM_HAMPER_AMOUNT) {
//       return {
//         isValid: false,
//         message: `Add ₹${minimumAmountGap} more to reach minimum hamper value of ₹${MINIMUM_HAMPER_AMOUNT}`,
//       };
//     }
//     return { isValid: true, message: "Hamper is ready for checkout!" };
//   }, [totalAmount, minimumAmountGap]);

//   // ✅ Modified addItemToHamper function
//   const addItemToHamper = async (product) => {
//     try {
//       setIsProcessing(true);
//       console.log('🎁 Adding product to hamper:', product.Product_name);

//       const response = await axiosInstance.post('/hamper/add', {
//         productId: product._id,
//         quantity: 1
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         // ✅ Set flag that we just added an item
//         justAddedItem.current = true;

//         toast({
//           title: "Added to Hamper",
//           description: `${product.Product_name} added to your custom hamper`,
//         });
//       }
//     } catch (error) {
//       console.error('Error adding to hamper:', error);
//       toast({
//         title: "Error",
//         description: error.response?.data?.message || "Failed to add item to hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // ✅ Reset the flag when user manually switches to explore tab
//   const handleTabChange = (newTab) => {
//     if (newTab === "explore") {
//       justAddedItem.current = false; // Reset flag when manually going to explore
//     }
//     setActiveTab(newTab);
//   };

//   // Update item quantity in hamper
//   const updateItemQuantity = async (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       return removeItemFromHamper(productId);
//     }

//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.put(`/hamper/update/${productId}`, {
//         quantity: newQuantity
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);
//       }
//     } catch (error) {
//       console.error('Error updating hamper quantity:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update quantity",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Remove item from hamper
//   const removeItemFromHamper = async (productId) => {
//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.delete(`/hamper/remove/${productId}`);

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         toast({
//           title: "Item Removed",
//           description: "Item removed from hamper",
//           duration: 2000,
//         });
//       }
//     } catch (error) {
//       console.error('Error removing from hamper:', error);
//       toast({
//         title: "Error",
//         description: "Failed to remove item",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Clear entire hamper
//   const clearHamper = async () => {
//     try {
//       setIsProcessing(true);
//       await axiosInstance.delete("/hamper/clear");

//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);

//       toast({
//         title: "Hamper Cleared",
//         description: "All items removed from hamper",
//         duration: 2000,
//       });
//     } catch (error) {
//       console.error("Error clearing hamper:", error);
//       toast({
//         title: "Error",
//         description: "Failed to clear hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle checkout form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle hamper checkout
//   const handleHamperCheckout = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       toast({
//         title: "Please login",
//         description: "You need to be logged in to checkout",
//         variant: "destructive"
//       });
//       navigate("/login");
//       return;
//     }

//     if (!hamperValidation.isValid) {
//       toast({
//         title: "Cannot Proceed",
//         description: hamperValidation.message,
//         variant: "destructive",
//       });
//       return;
//     }

//     const requiredFields = ['fullName', 'address', 'city', 'state', 'pinCode', 'phone'];
//     const missingFields = requiredFields.filter(field =>
//       !shippingAddress[field].trim()
//     );

//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive"
//       });
//       return;
//     }

//     setCheckoutLoading(true);
//     try {
//       const orderItems = hamperItems.map(item => ({
//         product: item.productId._id,
//         name: item.productId.Product_name,
//         quantity: item.quantity,
//         price: item.productId.Hamper_price || item.productId.Product_price,
//         image: item.productId.Product_image?.[0],
//         isHamperItem: true
//       }));

//       const response = await axiosInstance.post('/orders/create', {
//         items: orderItems,
//         shippingAddress,
//         paymentMethod: "cod",
//         totalAmount: totalAmount + DELIVERY_CHARGE,
//         isCustomHamper: true
//       });

//       await axiosInstance.delete("/hamper/clear");
//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);

//       toast({
//         title: "Custom Hamper Ordered Successfully!",
//         description: "Your custom hamper is being prepared. Track your order in your profile.",
//         variant: "default"
//       });

//       navigate("/profile");
//     } catch (err) {
//       console.error('Hamper order creation error:', err);
//       toast({
//         title: "Error",
//         description: err?.response?.data?.message || "Failed to place hamper order. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setCheckoutLoading(false);
//       setIsCheckingOut(false);
//     }
//   };

//   // Helper functions
//   const getItemTotal = (item) => {
//     const price = item.productId.Hamper_price || item.productId.Product_price;
//     return price * item.quantity;
//   };

//   const getItemUnitPrice = (item) => {
//     return item.productId.Hamper_price || item.productId.Product_price;
//   };

//   // Check if product is in hamper
//   const isProductInHamper = (productId) => {
//     return hamperItems.some(item => item.productId._id === productId);
//   };

//   // Get product quantity in hamper
//   const getProductQuantityInHamper = (productId) => {
//     const item = hamperItems.find(item => item.productId._id === productId);
//     return item ? item.quantity : 0;
//   };

//   // ✅ Compact Filter Component for Mobile
//   const MobileFilters = () => (
//     <motion.div
//       initial={false}
//       animate={{ height: showFilters ? "auto" : 0 }}
//       transition={{ duration: 0.3 }}
//       className="overflow-hidden bg-white border-b border-gray-200"
//     >
//       <div className="p-3 space-y-3">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10 h-9 text-sm"
//           />
//         </div>

//         {/* Category and Sort in a row */}
//         <div className="grid grid-cols-2 gap-2">
//           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//             <SelectTrigger className="h-9 text-sm">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Categories</SelectItem>
//               {categories.map((category) => (
//                 <SelectItem key={category} value={category}>
//                   {category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="h-9 text-sm">
//               <SelectValue placeholder="Sort" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="name">Name</SelectItem>
//               <SelectItem value="price-low">Price: Low to High</SelectItem>
//               <SelectItem value="price-high">Price: High to Low</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Price Range */}
//         <div className="grid grid-cols-2 gap-2">
//           <Input
//             type="number"
//             placeholder="Min Price"
//             value={priceRange.min}
//             onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
//             className="h-9 text-sm"
//           />
//           <Input
//             type="number"
//             placeholder="Max Price"
//             value={priceRange.max}
//             onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
//             className="h-9 text-sm"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );

//   // ✅ Product Card Component
//   const ProductCard = ({ product }) => {
//     const hamperPrice = product.Hamper_price || product.Product_price;
//     const regularPrice = product.Product_price;
//     const discount = regularPrice > hamperPrice ? ((regularPrice - hamperPrice) / regularPrice * 100) : 0;
//     const inHamper = isProductInHamper(product._id);
//     const hamperQuantity = getProductQuantityInHamper(product._id);

//     return (
//       <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
//         <CardContent className="p-0">
//           <div className="relative overflow-hidden rounded-t-lg">
//             <img
//               src={product.Product_image?.[0] || "/placeholder-product.jpg"}
//               alt={product.Product_name}
//               className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
//               onError={(e) => {
//                 e.currentTarget.src = "/placeholder-product.jpg";
//               }}
//             />
//             {discount > 0 && (
//               <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
//                 {discount.toFixed(0)}% OFF
//               </Badge>
//             )}
//             {inHamper && (
//               <Badge className="absolute top-2 right-2 bg-purple-500 text-white text-xs">
//                 In Hamper
//               </Badge>
//             )}
//           </div>
//           <div className="p-3">
//             <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-2">
//               {product.Product_name}
//             </h3>

//             <div className="flex items-center justify-between mb-2">
//               <div className="flex flex-col">
//                 <span className="text-sm sm:text-lg font-bold text-green-600">
//                   ₹{hamperPrice.toLocaleString()}
//                 </span>
//                 {discount > 0 && (
//                   <span className="text-xs text-gray-500 line-through">
//                     ₹{regularPrice.toLocaleString()}
//                   </span>
//                 )}
//               </div>

//               {inHamper ? (
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-7 w-7 p-0"
//                     onClick={() => updateItemQuantity(product._id, hamperQuantity - 1)}
//                     disabled={isProcessing}
//                   >
//                     <Minus className="h-3 w-3" />
//                   </Button>

//                   <span className="w-6 text-center font-medium text-xs">
//                     {hamperQuantity}
//                   </span>

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-7 w-7 p-0"
//                     onClick={() => updateItemQuantity(product._id, hamperQuantity + 1)}
//                     disabled={isProcessing}
//                   >
//                     <Plus className="h-3 w-3" />
//                   </Button>
//                 </div>
//               ) : (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => addItemToHamper(product)}
//                   className="hover:bg-green-50 hover:border-green-500 hover:text-green-600 text-xs px-2 py-1 h-7"
//                   disabled={isProcessing}
//                 >
//                   <Plus className="h-3 w-3 mr-1" />
//                   Add
//                 </Button>
//               )}
//             </div>

//             <Badge variant="secondary" className="text-xs">
//               {product.Product_category_name || product.Product_category || 'Uncategorized'}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
//           <p className="text-lg font-medium">Loading hamper products...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2">Unable to Load Products</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Button onClick={fetchHamperProducts}>
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Try Again
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   // ✅ Main render with tabs
//   return (
//     <>
//       <style>{`
//         body, html {
//           overflow-x: hidden !important;
//           max-width: 100vw !important;
//         }
//         * {
//           box-sizing: border-box;
//         }
//         @media (max-width: 320px) {
//           .container {
//             padding-left: 4px;
//             padding-right: 4px;
//           }
//         }
//       `}</style>

//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-6 px-1 overflow-x-hidden">
//   <div className="container mx-auto max-w-6xl px-1">
//     {/* Header - Optimized for 320px */}
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="text-center mb-2 sm:mb-4 px-1"
//     >
//       <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
//         Custom <span className="text-purple-600">Hamper Builder</span>
//       </h1>
//       <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-tight px-2">
//         Create your perfect gift hamper • Min ₹{MINIMUM_HAMPER_AMOUNT}
//       </p>
//     </motion.div>

//     {/* Hamper Status Banner - Ultra responsive */}
//     {totalItems > 0 && (
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md sm:rounded-lg p-1.5 sm:p-3 mb-2 sm:mb-4 mx-1"
//       >
//         <div className="flex items-center justify-between text-[10px] xs:text-xs sm:text-sm">
//           <div className="flex items-center gap-1 min-w-0">
//             <Gift className="w-3 h-3 flex-shrink-0" />
//             <span className="font-semibold truncate">
//               Hamper: {totalItems} • ₹{totalAmount.toLocaleString()}
//             </span>
//           </div>
//           <Badge className="bg-white/20 text-white text-[9px] xs:text-xs px-1 py-0.5 ml-1 flex-shrink-0">
//             {hamperValidation.isValid ? "Ready!" : `₹${minimumAmountGap}`}
//           </Badge>
//         </div>
//       </motion.div>
//     )}

//     {/* ✅ Tab Interface - 320px Optimized */}
//     <Tabs
//       value={activeTab}
//       onValueChange={handleTabChange}
//       className="w-full mx-1"
//     >
//       {/* Tab Navigation - Compact for 320px */}
//       <div className="bg-white rounded-t-md sm:rounded-t-xl shadow-lg border border-b-0 border-purple-100">
//         <TabsList className="w-full h-10 sm:h-12 bg-transparent p-0.5 sm:p-1">
//           <TabsTrigger
//             value="explore"
//             className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//           >
//             <Grid3X3 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//             <span className="hidden xs:inline">Explore</span>
//             <span className="xs:hidden">Shop</span>
//             <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-purple-100 text-purple-700 px-1 py-0">
//               {filteredProducts.length}
//             </Badge>
//           </TabsTrigger>
//           <TabsTrigger
//             value="hamper"
//             className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//           >
//             <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//             <span className="hidden xs:inline">Hamper</span>
//             <span className="xs:hidden">Cart</span>
//             {totalItems > 0 && (
//               <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-orange-500 text-white px-1 py-0">
//                 {totalItems}
//               </Badge>
//             )}
//           </TabsTrigger>
//         </TabsList>

//         {/* Mobile Filter Toggle - 320px Optimized */}
//         {activeTab === "explore" && isMobile && (
//           <div className="border-t border-gray-200">
//             <Button
//               variant="ghost"
//               onClick={() => setShowFilters(!showFilters)}
//               className="w-full h-8 sm:h-10 justify-between text-[11px] xs:text-xs sm:text-sm text-gray-600 hover:bg-purple-50 px-2"
//             >
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
//                 <span className="hidden xs:inline">Filters & Search</span>
//                 <span className="xs:hidden">Filters</span>
//               </div>
//               {showFilters ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
//             </Button>
//           </div>
//         )}

//         {/* Mobile Filters - Enhanced for 320px */}
//         {activeTab === "explore" && isMobile && showFilters && (
//           <motion.div
//             initial={false}
//             animate={{ height: "auto" }}
//             transition={{ duration: 0.3 }}
//             className="overflow-hidden bg-white border-b border-gray-200"
//           >
//             <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
//               {/* Search - Compact for 320px */}
//               <div className="relative">
//                 <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
//                 <Input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-7 sm:pl-10 h-7 sm:h-9 text-[11px] xs:text-xs sm:text-sm"
//                 />
//               </div>

//               {/* Category and Sort in a row - Optimized spacing */}
//               <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                   <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//                     <SelectValue placeholder="Category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all" className="text-[10px] xs:text-xs">All</SelectItem>
//                     {categories.map((category) => (
//                       <SelectItem key={category} value={category} className="text-[10px] xs:text-xs">
//                         {category.length > 15 ? category.substring(0, 15) + '...' : category}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>

//                 <Select value={sortBy} onValueChange={setSortBy}>
//                   <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//                     <SelectValue placeholder="Sort" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="name" className="text-[10px] xs:text-xs">Name</SelectItem>
//                     <SelectItem value="price-low" className="text-[10px] xs:text-xs">Price ↑</SelectItem>
//                     <SelectItem value="price-high" className="text-[10px] xs:text-xs">Price ↓</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Price Range - Optimized for 320px */}
//               <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//                 <Input
//                   type="number"
//                   placeholder="Min ₹"
//                   value={priceRange.min}
//                   onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
//                   className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//                 />
//                 <Input
//                   type="number"
//                   placeholder="Max ₹"
//                   value={priceRange.max}
//                   onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
//                   className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//                 />
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </div>

//       {/* Tab Content - Optimized container */}
//       <div className="bg-white rounded-b-md sm:rounded-b-xl shadow-lg border border-t-0 border-purple-100 min-h-[60vh]">
//         {/* ✅ Explore Products Tab - 320px Optimized */}
//         <TabsContent value="explore" className="m-0 p-1 xs:p-2 sm:p-4">
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">
//             {/* Desktop Filters Sidebar - Hidden on mobile as intended */}
//             {!isMobile && (
//               <div className="lg:col-span-1">
//                 <Card>
//                   <CardContent className="p-3 sm:p-4">
//                     <h3 className="font-semibold mb-3 flex items-center gap-2">
//                       <Filter className="h-4 w-4" />
//                       Filters
//                     </h3>

//                     {/* Search */}
//                     <div className="space-y-2 mb-4">
//                       <Label className="text-xs">Search Products</Label>
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                         <Input
//                           type="text"
//                           placeholder="Search..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           className="pl-10 h-8 text-sm"
//                         />
//                       </div>
//                     </div>

//                     {/* Category */}
//                     <div className="space-y-2 mb-4">
//                       <Label className="text-xs">Category</Label>
//                       <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                         <SelectTrigger className="h-8 text-sm">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Categories</SelectItem>
//                           {categories.map((category) => (
//                             <SelectItem key={category} value={category}>
//                               {category}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     {/* Price Range */}
//                     <div className="space-y-2 mb-4">
//                       <Label className="text-xs">Price Range</Label>
//                       <div className="grid grid-cols-2 gap-2">
//                         <Input
//                           type="number"
//                           placeholder="Min"
//                           value={priceRange.min}
//                           onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
//                           className="h-8 text-sm"
//                         />
//                         <Input
//                           type="number"
//                           placeholder="Max"
//                           value={priceRange.max}
//                           onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
//                           className="h-8 text-sm"
//                         />
//                       </div>
//                     </div>

//                     {/* Sort */}
//                     <div className="space-y-2">
//                       <Label className="text-xs">Sort By</Label>
//                       <Select value={sortBy} onValueChange={setSortBy}>
//                         <SelectTrigger className="h-8 text-sm">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="name">Name (A-Z)</SelectItem>
//                           <SelectItem value="price-low">Price (Low to High)</SelectItem>
//                           <SelectItem value="price-high">Price (High to Low)</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}

//             {/* Products Grid - Ultra-responsive for 320px */}
//             <div className={isMobile ? "col-span-1" : "lg:col-span-3"}>
//               <div className="mb-2 sm:mb-4 flex items-center justify-between px-1">
//                 <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">
//                   {filteredProducts.length} products
//                 </p>
//               </div>

//               {filteredProducts.length === 0 ? (
//                 <div className="text-center py-8 sm:py-12 px-2">
//                   <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-2 sm:mb-4" />
//                   <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No products found</h3>
//                   <p className="text-[11px] xs:text-xs sm:text-sm text-gray-500">Try adjusting your filters</p>
//                 </div>
//               ) : (
//                 <div className={`grid gap-1.5 xs:gap-2 sm:gap-3 ${
//                   isMobile
//                     ? 'grid-cols-2'
//                     : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
//                 } px-0.5 sm:px-0`}>
//                   {filteredProducts.map((product) => (
//                     <ProductCard key={product._id} product={product} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </TabsContent>

//               {/* ✅ My Hamper Tab */}
//               <TabsContent value="hamper" className="m-0 p-2 sm:p-4">
//                 {hamperItems.length === 0 ? (
//                   <div className="text-center py-12">
//                     <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">Your hamper is empty</h3>
//                     <p className="text-gray-500 mb-4">Start building your custom hamper by exploring products</p>
//                     <Button
//                       onClick={() => setActiveTab("explore")}
//                       className="bg-purple-600 hover:bg-purple-700"
//                     >
//                       <Grid3X3 className="w-4 h-4 mr-2" />
//                       Explore Products
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
//                     {/* Hamper Items */}
//                     <div className="lg:col-span-2">
//                       <div className="space-y-2 sm:space-y-3">
//                         {hamperItems.map((item, index) => (
//                           <motion.div
//                             key={`${item.productId._id}-${index}`}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
//                           >
//                             {/* Product Image */}
//                             <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
//                               <img
//                                 src={item.productId.Product_image?.[0] || "/placeholder-product.jpg"}
//                                 alt={item.productId.Product_name}
//                                 className="w-full h-full object-cover rounded-md"
//                                 onError={(e) => {
//                                   e.currentTarget.src = '/placeholder-jewelry.jpg';
//                                 }}
//                               />
//                             </div>

//                             {/* Product Info */}
//                             <div className="flex-grow min-w-0">
//                               <div className="space-y-1 sm:space-y-2">
//                                 {/* Product Name */}
//                                 <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
//                                   {item.productId.Product_name}
//                                 </h3>

//                                 {/* Price Display */}
//                                 <div className="space-y-1">
//                                   <div className="flex items-center gap-2">
//                                     <span className="text-[10px] sm:text-xs text-gray-500">Hamper Price:</span>
//                                     <span className="text-xs sm:text-sm font-medium text-purple-600">
//                                       ₹{getItemUnitPrice(item).toLocaleString()}
//                                     </span>
//                                   </div>

//                                   {/* Quantity and Total */}
//                                   <div className="flex items-center justify-between gap-2">
//                                     <div className="flex items-center gap-2">
//                                       <span className="text-[10px] sm:text-xs text-gray-500">Qty:</span>
//                                       <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
//                                         <button
//                                           className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-l-md hover:bg-gray-200 transition-colors"
//                                           onClick={() => updateItemQuantity(item.productId._id, item.quantity - 1)}
//                                           disabled={isProcessing}
//                                         >
//                                           <Minus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                                         </button>
//                                         <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium py-0.5">
//                                           {item.quantity}
//                                         </span>
//                                         <button
//                                           className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-r-md hover:bg-gray-200 transition-colors"
//                                           onClick={() => updateItemQuantity(item.productId._id, item.quantity + 1)}
//                                           disabled={isProcessing}
//                                         >
//                                           <Plus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                                         </button>
//                                       </div>
//                                     </div>

//                                     {/* Item Total Price */}
//                                     <div className="flex flex-col items-end">
//                                       <span className="text-[10px] sm:text-xs text-gray-500">Total:</span>
//                                       <span className="text-sm sm:text-lg font-bold text-purple-700">
//                                         ₹{getItemTotal(item).toLocaleString()}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Remove Button */}
//                                 <div className="flex justify-end pt-1">
//                                   <button
//                                     className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors"
//                                     onClick={() => removeItemFromHamper(item.productId._id)}
//                                     disabled={isProcessing}
//                                   >
//                                     <Trash2 className="w-3 h-3" />
//                                     <span className="hidden sm:inline">Remove</span>
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 space-y-2">
//                         <Button
//                           variant="outline"
//                           className="w-full rounded-full px-3 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
//                           onClick={() => setActiveTab("explore")}
//                         >
//                           Add More Products
//                         </Button>
//                         <div className="flex flex-col sm:flex-row gap-2">
//                           <Button
//                             variant="destructive"
//                             className="flex-1 rounded-full px-3 py-2 text-xs sm:text-sm"
//                             onClick={clearHamper}
//                             disabled={isProcessing}
//                           >
//                             Clear Hamper
//                           </Button>
//                           <Button
//                             className={`flex-1 rounded-full px-3 py-2 text-xs sm:text-sm font-semibold ${
//                               hamperValidation.isValid
//                                 ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
//                                 : 'bg-gray-400 cursor-not-allowed'
//                             }`}
//                             onClick={() => setIsCheckingOut(true)}
//                             disabled={!hamperValidation.isValid || isProcessing}
//                           >
//                             Checkout Hamper
//                           </Button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Hamper Summary */}
//                     <div className="lg:col-span-1">
//                       <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sticky top-20">
//                         <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
//                           <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
//                           Hamper Summary
//                         </h2>

//                         {/* Items List */}
//                         <div className="space-y-1.5 mb-4 max-h-32 sm:max-h-40 overflow-y-auto">
//                           {hamperItems.map((item, index) => (
//                             <div
//                               key={`summary-${item.productId._id}-${index}`}
//                               className="flex justify-between items-start text-xs sm:text-sm py-1"
//                             >
//                               <div className="flex-1 min-w-0 mr-2">
//                                 <div className="font-medium text-gray-700 truncate leading-tight">
//                                   {item.productId.Product_name}
//                                 </div>
//                                 <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
//                                   ₹{getItemUnitPrice(item).toLocaleString()} × {item.quantity}
//                                 </div>
//                               </div>
//                               <div className="font-semibold text-purple-600 flex-shrink-0">
//                                 ₹{getItemTotal(item).toLocaleString()}
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Calculation Section */}
//                         <div className="border-t border-gray-200 pt-3 space-y-2">
//                           <div className="flex justify-between items-center text-sm">
//                             <span className="text-gray-600">Hamper Total ({totalItems} items)</span>
//                             <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
//                           </div>

//                           <div className="flex justify-between items-center text-sm">
//                             <span className="text-gray-600">Delivery Charge</span>
//                             <span className={`font-semibold ${DELIVERY_CHARGE > 0 ? 'text-orange-600' : 'text-green-600'}`}>
//                               {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
//                             </span>
//                           </div>

//                           {/* Minimum Amount Progress */}
//                           {!hamperValidation.isValid && (
//                             <div className="py-2 px-3 bg-red-50 rounded-lg border border-red-100">
//                               <div className="flex items-center justify-between text-xs text-red-700 mb-1">
//                                 <span className="font-medium">Minimum Amount Progress</span>
//                                 <span className="font-bold">₹{minimumAmountGap} more</span>
//                               </div>
//                               <div className="bg-red-200 h-2 rounded-full relative overflow-hidden">
//                                 <div
//                                   className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-500"
//                                   style={{
//                                     width: `${Math.min((totalAmount / MINIMUM_HAMPER_AMOUNT) * 100, 100)}%`,
//                                   }}
//                                 />
//                               </div>
//                               <div className="text-[10px] text-red-600 mt-1 text-center">
//                                 {Math.round((totalAmount / MINIMUM_HAMPER_AMOUNT) * 100)}% of minimum amount
//                               </div>
//                             </div>
//                           )}

//                           {/* Total */}
//                           <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-200 bg-purple-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-lg">
//                             <span className="text-gray-900">Total Amount</span>
//                             <span className="text-purple-700">₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}</span>
//                           </div>
//                         </div>

//                         {/* Validation Message */}
//                         <div className="mt-3 text-center">
//                           <div className={`text-xs px-3 py-2 rounded-full ${
//                             hamperValidation.isValid
//                               ? 'bg-green-100 text-green-800 border border-green-200'
//                               : 'bg-red-100 text-red-800 border border-red-200'
//                           }`}>
//                             {hamperValidation.message}
//                           </div>
//                         </div>

//                         {/* Checkout Button */}
//                         <Button
//                           className={`w-full mt-4 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
//                             hamperValidation.isValid
//                               ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
//                               : 'bg-gray-400 cursor-not-allowed'
//                           }`}
//                           onClick={() => setIsCheckingOut(true)}
//                           disabled={!hamperValidation.isValid || isProcessing}
//                         >
//                           {hamperValidation.isValid ? 'Proceed to Checkout' : `Add ₹${minimumAmountGap} More`}
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </TabsContent>
//             </div>
//           </Tabs>
//         </div>
//       </div>

//       {/* Checkout Modal (same as before) */}
//       <AnimatePresence>
//         {isCheckingOut && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center overflow-hidden p-2"
//             onClick={() => !checkoutLoading && setIsCheckingOut(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: "100%", scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: "100%", scale: 0.95 }}
//               transition={{ type: "spring", damping: 25, stiffness: 500 }}
//               className="bg-white w-full max-w-[95vw] sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-purple-100 sm:border max-h-[95vh] flex flex-col overflow-hidden"
//               onClick={e => e.stopPropagation()}
//             >
//               {/* Header */}
//               <div className="relative flex-shrink-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-base sm:text-lg font-bold">Checkout Custom Hamper</h2>
//                     <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
//                       Total: ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                     </p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex-shrink-0"
//                     onClick={() => !checkoutLoading && setIsCheckingOut(false)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Scrollable Content */}
//               <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
//                 {/* Compact Hamper Summary */}
//                 <div className="bg-purple-50 rounded-lg p-3 mb-4">
//                   <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
//                     <Gift className="w-3 h-3" />
//                     Custom Hamper ({totalItems} items)
//                   </h3>
//                   <div className="space-y-1 text-xs">
//                     <div className="flex justify-between font-medium border-b border-purple-200 pb-1">
//                       <span>Hamper Total</span>
//                       <span>₹{totalAmount.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-orange-600">
//                       <span>Delivery</span>
//                       <span>{DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
//                       <span>Total Amount</span>
//                       <span>₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleHamperCheckout} className="space-y-3">
//                   <div className="grid grid-cols-1 gap-3">
//                     <div className="space-y-1">
//                       <Label htmlFor="fullName" className="text-xs font-medium text-gray-700">
//                         Full Name *
//                       </Label>
//                       <Input
//                         id="fullName"
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={shippingAddress.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <Label htmlFor="phone" className="text-xs font-medium text-gray-700">
//                         Phone Number *
//                       </Label>
//                       <Input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         placeholder="Enter your phone number"
//                         value={shippingAddress.phone}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <Label htmlFor="address" className="text-xs font-medium text-gray-700">
//                         Address *
//                       </Label>
//                       <Input
//                         id="address"
//                         name="address"
//                         placeholder="Enter your address"
//                         value={shippingAddress.address}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="space-y-1">
//                         <Label htmlFor="city" className="text-xs font-medium text-gray-700">
//                           City *
//                         </Label>
//                         <Input
//                           id="city"
//                           name="city"
//                           placeholder="City"
//                           value={shippingAddress.city}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <Label htmlFor="state" className="text-xs font-medium text-gray-700">
//                           State *
//                         </Label>
//                         <Input
//                           id="state"
//                           name="state"
//                           placeholder="State"
//                           value={shippingAddress.state}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <Label htmlFor="pinCode" className="text-xs font-medium text-gray-700">
//                         PIN Code *
//                       </Label>
//                       <Input
//                         id="pinCode"
//                         name="pinCode"
//                         placeholder="PIN Code"
//                         value={shippingAddress.pinCode}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Fixed Bottom */}
//               <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 space-y-2">
//                 <Button
//                   type="submit"
//                   onClick={handleHamperCheckout}
//                   className="w-full h-10 text-sm rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
//                   disabled={checkoutLoading}
//                 >
//                   {checkoutLoading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Placing Order...
//                     </div>
//                   ) : (
//                     `Place Hamper Order - ₹${(totalAmount + DELIVERY_CHARGE).toLocaleString()}`
//                   )}
//                 </Button>
//                 <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                   <span>Cash on Delivery • Secure Payment</span>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default CustomHamperBuilder;

// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";
// import { useToast } from "../components/ui/use-toast";
// import axiosInstance from "../utils/axiosConfig";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import { Badge } from "../components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Minus,
//   X,
//   ShoppingCart,
//   Package,
//   Gift,
//   Filter,
//   Search,
//   RefreshCw,
//   AlertCircle,
//   Trash2,
//   Eye,
//   ShoppingBag,
//   Truck,
//   Grid3X3,
//   List,
//   ChevronUp,
//   ChevronDown,
//   Heart,
// } from "lucide-react";
// import PhoneVerificationModal from "@/components/PhoneVerificationModal";
// import { usePhoneVerification } from "@/hooks/usePhoneVerification";

// const CustomHamperBuilder = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const justAddedItem = useRef(false);

//   // Core hamper state
//   const [hamperItems, setHamperItems] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);

//   // Products state
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter and search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [sortBy, setSortBy] = useState("name");

//   // UI state
//   const [activeTab, setActiveTab] = useState("explore");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Phone verification hook - ADD THIS
//   const {
//     isVerificationModalOpen,
//     closeVerificationModal,
//     initiatePhoneVerification,
//     verifiedPhoneNumber,
//   } = usePhoneVerification();

//   // Checkout form
//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     phone: "",
//   });

//   // Constants
//   const MINIMUM_HAMPER_AMOUNT = 200;
//   const DELIVERY_CHARGE = totalAmount >= 500 ? 0 : 80;
//   const minimumAmountGap = Math.max(0, MINIMUM_HAMPER_AMOUNT - totalAmount);
//   const freeDeliveryGap = Math.max(0, 500 - totalAmount);

//   // Detect mobile screen size
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Auto-switch to hamper tab when items are added (mobile only)
//   useEffect(() => {
//     if (
//       isMobile &&
//       hamperItems.length > 0 &&
//       activeTab === "explore" &&
//       justAddedItem.current
//     ) {
//       setTimeout(() => {
//         setActiveTab("hamper");
//         justAddedItem.current = false;
//       }, 800);
//     }
//   }, [hamperItems.length, isMobile, activeTab]);

//   // Fetch hamper-eligible products using backend filtering
//   const fetchHamperProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       console.log("🎁 Fetching hamper-eligible products from backend...");

//       const response = await axiosInstance.get(
//         "api/getproducts?type=hamper&limit=100"
//       );

//       console.log("📦 Hamper products response:", response.data);

//       if (response.data && response.data.product) {
//         const hamperProducts = response.data.product;

//         setProducts(hamperProducts);
//         setFilteredProducts(hamperProducts);

//         const uniqueCategories = [
//           ...new Set(
//             hamperProducts
//               .map(
//                 (p) =>
//                   p.Product_category_name ||
//                   p.Product_category?.category ||
//                   "Uncategorized"
//               )
//               .filter(Boolean)
//           ),
//         ];
//         setCategories(uniqueCategories);

//         console.log(
//           `✅ Loaded ${hamperProducts.length} hamper-eligible products`
//         );

//         if (hamperProducts.length === 0) {
//           toast({
//             title: "No Hamper Products",
//             description:
//               "No products are currently available for custom hampers.",
//             variant: "default",
//           });
//         }
//       } else {
//         setProducts([]);
//         setFilteredProducts([]);
//         setCategories([]);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching hamper products:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to load hamper products";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]);

//   // Fetch user's hamper from database
//   const fetchUserHamper = useCallback(async () => {
//     if (!user) return;

//     try {
//       const response = await axiosInstance.get("/hamper");
//       const data = response.data;

//       if (data.hamper && data.hamper.length > 0) {
//         setHamperItems(data.hamper);
//         setTotalAmount(data.totalAmount || 0);
//         setTotalItems(data.totalItems || 0);
//         console.log("Hamper loaded from database:", data);
//       } else {
//         setHamperItems([]);
//         setTotalAmount(0);
//         setTotalItems(0);
//       }
//     } catch (error) {
//       console.error("Error fetching hamper from database:", error);
//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);
//     }
//   }, [user]);

//   // Initialize component
//   useEffect(() => {
//     fetchHamperProducts();
//     fetchUserHamper();
//   }, [fetchHamperProducts, fetchUserHamper]);

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = [...products];

//     if (searchQuery) {
//       filtered = filtered.filter((product) =>
//         product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Product_category_name || product.Product_category) ===
//           selectedCategory
//       );
//     }

//     if (priceRange.min) {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Hamper_price || product.Product_price) >=
//           parseFloat(priceRange.min)
//       );
//     }
//     if (priceRange.max) {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Hamper_price || product.Product_price) <=
//           parseFloat(priceRange.max)
//       );
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return (
//             (a.Hamper_price || a.Product_price) -
//             (b.Hamper_price || b.Product_price)
//           );
//         case "price-high":
//           return (
//             (b.Hamper_price || b.Product_price) -
//             (a.Hamper_price || a.Product_price)
//           );
//         case "name":
//         default:
//           return a.Product_name.localeCompare(b.Product_name);
//       }
//     });

//     setFilteredProducts(filtered);
//   }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

//   // Hamper validation
//   const hamperValidation = useMemo(() => {
//     if (totalAmount < MINIMUM_HAMPER_AMOUNT) {
//       return {
//         isValid: false,
//         message: `Add ₹${minimumAmountGap} more to reach minimum hamper value of ₹${MINIMUM_HAMPER_AMOUNT}`,
//       };
//     }
//     return { isValid: true, message: "Hamper is ready for checkout!" };
//   }, [totalAmount, minimumAmountGap]);

//   // Add item to hamper
//   const addItemToHamper = async (product) => {
//     try {
//       setIsProcessing(true);
//       justAddedItem.current = true;
//       console.log("🎁 Adding product to hamper:", product.Product_name);

//       const response = await axiosInstance.post("/hamper/add", {
//         productId: product._id,
//         quantity: 1,
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         toast({
//           title: "Added to Hamper",
//           description: `${product.Product_name} added to your custom hamper`,
//         });
//       }
//     } catch (error) {
//       console.error("Error adding to hamper:", error);
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to add item to hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Update item quantity in hamper
//   const updateItemQuantity = async (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       return removeItemFromHamper(productId);
//     }

//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.put(`/hamper/update/${productId}`, {
//         quantity: newQuantity,
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);
//       }
//     } catch (error) {
//       console.error("Error updating hamper quantity:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update quantity",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Remove item from hamper
//   const removeItemFromHamper = async (productId) => {
//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.delete(
//         `/hamper/remove/${productId}`
//       );

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         toast({
//           title: "Item Removed",
//           description: "Item removed from hamper",
//           duration: 2000,
//         });
//       }
//     } catch (error) {
//       console.error("Error removing from hamper:", error);
//       toast({
//         title: "Error",
//         description: "Failed to remove item",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Clear entire hamper
//   const clearHamper = async () => {
//     try {
//       setIsProcessing(true);
//       await axiosInstance.delete("/hamper/clear");

//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);

//       toast({
//         title: "Hamper Cleared",
//         description: "All items removed from hamper",
//         duration: 2000,
//       });
//     } catch (error) {
//       console.error("Error clearing hamper:", error);
//       toast({
//         title: "Error",
//         description: "Failed to clear hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle tab change
//   const handleTabChange = (newTab) => {
//     if (newTab === "explore") justAddedItem.current = false;
//     setActiveTab(newTab);
//   };

//   // Handle checkout form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // // Handle hamper checkout
//   // const handleHamperCheckout = async (e) => {
//   //   e.preventDefault();

//   //   if (!user) {
//   //     toast({
//   //       title: "Please login",
//   //       description: "You need to be logged in to checkout",
//   //       variant: "destructive"
//   //     });
//   //     navigate("/login");
//   //     return;
//   //   }

//   //   if (!hamperValidation.isValid) {
//   //     toast({
//   //       title: "Cannot Proceed",
//   //       description: hamperValidation.message,
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }

//   //   const requiredFields = ['fullName', 'address', 'city', 'state', 'pinCode', 'phone'];
//   //   const missingFields = requiredFields.filter(field =>
//   //     !shippingAddress[field].trim()
//   //   );

//   //   if (missingFields.length > 0) {
//   //     toast({
//   //       title: "Missing Information",
//   //       description: "Please fill in all shipping address fields",
//   //       variant: "destructive"
//   //     });
//   //     return;
//   //   }

//   //   setCheckoutLoading(true);
//   //   try {
//   //     const orderItems = hamperItems.map(item => ({
//   //       product: item.productId._id,
//   //       name: item.productId.Product_name,
//   //       quantity: item.quantity,
//   //       price: item.productId.Hamper_price || item.productId.Product_price,
//   //       image: item.productId.Product_image?.[0],
//   //       isHamperItem: true
//   //     }));

//   //     const response = await axiosInstance.post('/orders/create', {
//   //       items: orderItems,
//   //       shippingAddress,
//   //       paymentMethod: "cod",
//   //       totalAmount: totalAmount + DELIVERY_CHARGE,
//   //       isCustomHamper: true
//   //     });

//   //     await axiosInstance.delete("/hamper/clear");
//   //     setHamperItems([]);
//   //     setTotalAmount(0);
//   //     setTotalItems(0);

//   //     toast({
//   //       title: "Custom Hamper Ordered Successfully!",
//   //       description: "Your custom hamper is being prepared. Track your order in your profile.",
//   //       variant: "default"
//   //     });

//   //     navigate("/profile");
//   //   } catch (err) {
//   //     console.error('Hamper order creation error:', err);
//   //     toast({
//   //       title: "Error",
//   //       description: err?.response?.data?.message || "Failed to place hamper order. Please try again.",
//   //       variant: "destructive"
//   //     });
//   //   } finally {
//   //     setCheckoutLoading(false);
//   //     setIsCheckingOut(false);
//   //   }
//   // };

//   // Replace your existing handleHamperCheckout with this
//   // Replace your existing handleHamperCheckout with this
//   const handleHamperCheckout = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       toast({
//         title: "Please login",
//         description: "You need to be logged in to checkout",
//         variant: "destructive",
//       });
//       navigate("/login");
//       return;
//     }

//     if (!hamperValidation.isValid) {
//       toast({
//         title: "Cannot Proceed",
//         description: hamperValidation.message,
//         variant: "destructive",
//       });
//       return;
//     }

//     const requiredFields = [
//       "fullName",
//       "address",
//       "city",
//       "state",
//       "pinCode",
//       "phone",
//     ];
//     const missingFields = requiredFields.filter(
//       (field) => !shippingAddress[field].trim()
//     );

//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     setCheckoutLoading(true);

//     try {
//       // ADD PHONE VERIFICATION - this is the only new part
//       const isPhoneVerified = await initiatePhoneVerification(
//         shippingAddress.phone
//       );

//       if (isPhoneVerified) {
//         await proceedWithActualCheckout();
//       }
//     } catch (error) {
//       console.error("Checkout initiation error:", error);
//       toast({
//         title: "Error",
//         description: "Failed to initiate checkout. Please try again.",
//         variant: "destructive",
//       });
//       setCheckoutLoading(false);
//     }
//   };

//   // ADD THESE TWO NEW FUNCTIONS
//   const proceedWithActualCheckout = async () => {
//     try {
//       const orderItems = hamperItems.map((item) => ({
//         product: item.productId._id,
//         name: item.productId.Product_name,
//         quantity: item.quantity,
//         price: item.productId.Hamper_price || item.productId.Product_price,
//         image: item.productId.Product_image?.[0],
//         isHamperItem: true,
//       }));

//       const response = await axiosInstance.post("/api/cashfree/create", {
//         userId: user.id || user._id,
//         items: orderItems,
//         shippingAddress: {
//           ...shippingAddress,
//           phone:
//             verifiedPhoneNumber?.replace(/^\+91/, "") || shippingAddress.phone,
//         },
//         paymentMethod: "cod",
//         Contact_number:
//           verifiedPhoneNumber?.replace(/^\+91/, "") || shippingAddress.phone,
//         user_email: user.email,
//         totalAmount: totalAmount + DELIVERY_CHARGE,
//         isCustomHamper: true,
//       });

//       if (response.data.success) {
//         await axiosInstance.delete("/hamper/clear");
//         setHamperItems([]);
//         setTotalAmount(0);
//         setTotalItems(0);

//         toast({
//           title: "Custom Hamper Ordered Successfully!",
//           description:
//             "Your custom hamper is being prepared. Track your order in your profile.",
//           variant: "default",
//         });

//         navigate("/profile");
//       }
//     } catch (err) {
//       console.error("Hamper order creation error:", err);
//       toast({
//         title: "Error",
//         description:
//           err?.response?.data?.message ||
//           "Failed to place hamper order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setCheckoutLoading(false);
//       setIsCheckingOut(false);
//     }
//   };

//   const handlePhoneVerificationSuccess = (phoneNumber) => {
//     console.log("✅ Phone verified:", phoneNumber);
//     proceedWithActualCheckout();
//   };

//   // Helper functions
//   const getItemTotal = (item) => {
//     const price = item.productId.Hamper_price || item.productId.Product_price;
//     return price * item.quantity;
//   };

//   const getItemUnitPrice = (item) => {
//     return item.productId.Hamper_price || item.productId.Product_price;
//   };

//   const isProductInHamper = (productId) => {
//     return hamperItems.some((item) => item.productId._id === productId);
//   };

//   const getProductQuantityInHamper = (productId) => {
//     const item = hamperItems.find((item) => item.productId._id === productId);
//     return item ? item.quantity : 0;
//   };

//   // Compact Mobile Filters Component
//   const MobileFilters = () => (
//     <motion.div
//       initial={false}
//       animate={{ height: showFilters ? "auto" : 0 }}
//       transition={{ duration: 0.3 }}
//       className="overflow-hidden bg-white border-b border-gray-200"
//     >
//       <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-7 sm:pl-10 h-7 sm:h-9 text-[11px] xs:text-xs sm:text-sm"
//           />
//         </div>

//         {/* Category and Sort in a row */}
//         <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//             <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all" className="text-[10px] xs:text-xs">
//                 All
//               </SelectItem>
//               {categories.map((category) => (
//                 <SelectItem
//                   key={category}
//                   value={category}
//                   className="text-[10px] xs:text-xs"
//                 >
//                   {category.length > 15
//                     ? category.substring(0, 15) + "..."
//                     : category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//               <SelectValue placeholder="Sort" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="name" className="text-[10px] xs:text-xs">
//                 Name
//               </SelectItem>
//               <SelectItem value="price-low" className="text-[10px] xs:text-xs">
//                 Price ↑
//               </SelectItem>
//               <SelectItem value="price-high" className="text-[10px] xs:text-xs">
//                 Price ↓
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Price Range */}
//         <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//           <Input
//             type="number"
//             placeholder="Min ₹"
//             value={priceRange.min}
//             onChange={(e) =>
//               setPriceRange((prev) => ({ ...prev, min: e.target.value }))
//             }
//             className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//           />
//           <Input
//             type="number"
//             placeholder="Max ₹"
//             value={priceRange.max}
//             onChange={(e) =>
//               setPriceRange((prev) => ({ ...prev, max: e.target.value }))
//             }
//             className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );

//   // Product Card Component
//   const ProductCard = ({ product }) => {
//     const hamperPrice = product.Hamper_price || product.Product_price;
//     const regularPrice = product.Product_price;
//     const discount =
//       regularPrice > hamperPrice
//         ? ((regularPrice - hamperPrice) / regularPrice) * 100
//         : 0;
//     const inHamper = isProductInHamper(product._id);
//     const hamperQuantity = getProductQuantityInHamper(product._id);

//     // Compact Quantity Control
//     const QuantityControl = () => (
//       <div className="flex items-center gap-1">
//         <span className="text-[10px] xs:text-xs text-gray-500">Qty:</span>
//         <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
//           <button
//             className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => updateItemQuantity(product._id, hamperQuantity - 1)}
//             disabled={isProcessing}
//             aria-label="Decrease quantity"
//           >
//             <Minus className="w-3 h-3 text-gray-600" />
//           </button>

//           <span className="w-7 text-center text-sm font-semibold bg-white border-x border-gray-300 leading-6">
//             {hamperQuantity}
//           </span>

//           <button
//             className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => updateItemQuantity(product._id, hamperQuantity + 1)}
//             disabled={isProcessing}
//             aria-label="Increase quantity"
//           >
//             <Plus className="w-3 h-3 text-gray-600" />
//           </button>
//         </div>
//       </div>
//     );

//     return (
//       <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
//         <CardContent className="p-0">
//           <div className="relative overflow-hidden rounded-t-lg">
//             <img
//               src={product.Product_image?.[0] || "/placeholder-product.jpg"}
//               alt={product.Product_name}
//               className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
//               onError={(e) => {
//                 e.currentTarget.src = "/placeholder-product.jpg";
//               }}
//             />
//             {discount > 0 && (
//               <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
//                 {discount.toFixed(0)}% OFF
//               </Badge>
//             )}
//             {inHamper && (
//               <Badge className="absolute top-2 right-2 bg-purple-500 text-white text-xs">
//                 In Hamper
//               </Badge>
//             )}
//           </div>
//           <div className="p-3">
//             <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-2">
//               {product.Product_name}
//             </h3>

//             <div className="flex items-center justify-between mb-2">
//               <div className="flex flex-col">
//                 <span className="text-sm sm:text-lg font-bold text-green-600">
//                   ₹{hamperPrice.toLocaleString()}
//                 </span>
//                 {discount > 0 && (
//                   <span className="text-xs text-gray-500 line-through">
//                     ₹{regularPrice.toLocaleString()}
//                   </span>
//                 )}
//               </div>

//               {inHamper ? (
//                 <QuantityControl />
//               ) : (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => addItemToHamper(product)}
//                   className="hover:bg-green-50 hover:border-green-500 hover:text-green-600 text-xs px-2 py-1 h-7"
//                   disabled={isProcessing}
//                 >
//                   <Plus className="h-3 w-3 mr-1" />
//                   Add
//                 </Button>
//               )}
//             </div>

//             <Badge variant="secondary" className="text-xs">
//               {product.Product_category_name ||
//                 product.Product_category ||
//                 "Uncategorized"}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
//           <p className="text-lg font-medium">Loading hamper products...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2">
//             Unable to Load Products
//           </h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Button onClick={fetchHamperProducts}>
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Try Again
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   // Main render
//   return (
//     <>
//       <style>{`
//         body, html {
//           overflow-x: hidden !important;
//           max-width: 100vw !important;
//         }
//         * {
//           box-sizing: border-box;
//         }
//         @media (max-width: 320px) {
//           .container {
//             padding-left: 4px;
//             padding-right: 4px;
//           }
//         }
//         /* Add xs breakpoint support */
//         @media (min-width: 360px) {
//           .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
//           .xs\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
//           .xs\\:w-3 { width: 0.75rem; }
//           .xs\\:h-3 { height: 0.75rem; }
//           .xs\\:w-4 { width: 1rem; }
//           .xs\\:h-4 { height: 1rem; }
//           .xs\\:mr-1 { margin-right: 0.25rem; }
//           .xs\\:ml-1 { margin-left: 0.25rem; }
//           .xs\\:mr-2 { margin-right: 0.5rem; }
//           .xs\\:ml-2 { margin-left: 0.5rem; }
//           .xs\\:p-2 { padding: 0.5rem; }
//           .xs\\:px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
//           .xs\\:gap-2 { gap: 0.5rem; }
//           .xs\\:inline { display: inline; }
//         }
//         .xs\\:hidden {
//           @media (max-width: 359px) {
//             display: none;
//           }
//         }
//       `}</style>

//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-6 px-1 overflow-x-hidden">
//         <div className="container mx-auto max-w-6xl px-1">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-2 sm:mb-4 px-1"
//           >
//             <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
//               Custom <span className="text-purple-600">Hamper Builder</span>
//             </h1>
//             <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-tight px-2">
//               Create your perfect gift hamper • Min ₹{MINIMUM_HAMPER_AMOUNT}
//             </p>
//           </motion.div>

//           {/* Hamper Status Banner */}
//           {totalItems > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md sm:rounded-lg p-1.5 sm:p-3 mb-2 sm:mb-4 mx-1"
//             >
//               <div className="flex items-center justify-between text-[10px] xs:text-xs sm:text-sm">
//                 <div className="flex items-center gap-1 min-w-0">
//                   <Gift className="w-3 h-3 flex-shrink-0" />
//                   <span className="font-semibold truncate">
//                     Hamper: {totalItems} • ₹{totalAmount.toLocaleString()}
//                   </span>
//                 </div>
//                 <Badge className="bg-white/20 text-white text-[9px] xs:text-xs px-1 py-0.5 ml-1 flex-shrink-0">
//                   {hamperValidation.isValid ? "Ready!" : `₹${minimumAmountGap}`}
//                 </Badge>
//               </div>
//             </motion.div>
//           )}

//           {/* Tab Interface */}
//           <Tabs
//             value={activeTab}
//             onValueChange={handleTabChange}
//             className="w-full mx-1"
//           >
//             {/* Tab Navigation */}
//             <div className="bg-white rounded-t-md sm:rounded-t-xl shadow-lg border border-b-0 border-purple-100">
//               <TabsList className="w-full h-10 sm:h-12 bg-transparent p-0.5 sm:p-1">
//                 <TabsTrigger
//                   value="explore"
//                   className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//                 >
//                   <Grid3X3 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//                   <span className="hidden xs:inline">Explore</span>
//                   <span className="xs:hidden">Shop</span>
//                   <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-purple-100 text-purple-700 px-1 py-0">
//                     {filteredProducts.length}
//                   </Badge>
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hamper"
//                   className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//                 >
//                   <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//                   <span className="hidden xs:inline">Hamper</span>
//                   <span className="xs:hidden">Cart</span>
//                   {totalItems > 0 && (
//                     <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-orange-500 text-white px-1 py-0">
//                       {totalItems}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//               </TabsList>

//               {/* Mobile Filter Toggle */}
//               {activeTab === "explore" && isMobile && (
//                 <div className="border-t border-gray-200">
//                   <Button
//                     variant="ghost"
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="w-full h-8 sm:h-10 justify-between text-[11px] xs:text-xs sm:text-sm text-gray-600 hover:bg-purple-50 px-2"
//                   >
//                     <div className="flex items-center gap-1 sm:gap-2">
//                       <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span className="hidden xs:inline">Filters & Search</span>
//                       <span className="xs:hidden">Filters</span>
//                     </div>
//                     {showFilters ? (
//                       <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
//                     ) : (
//                       <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
//                     )}
//                   </Button>
//                 </div>
//               )}

//               {/* Mobile Filters */}
//               {activeTab === "explore" && isMobile && <MobileFilters />}
//             </div>

//             {/* Tab Content */}
//             <div className="bg-white rounded-b-md sm:rounded-b-xl shadow-lg border border-t-0 border-purple-100 min-h-[60vh]">
//               {/* Explore Products Tab */}
//               <TabsContent value="explore" className="m-0 p-1 xs:p-2 sm:p-4">
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">
//                   {/* Desktop Filters Sidebar */}
//                   {!isMobile && (
//                     <div className="lg:col-span-1">
//                       <Card>
//                         <CardContent className="p-3 sm:p-4">
//                           <h3 className="font-semibold mb-3 flex items-center gap-2">
//                             <Filter className="h-4 w-4" />
//                             Filters
//                           </h3>

//                           {/* Search */}
//                           <div className="space-y-2 mb-4">
//                             <Label className="text-xs">Search Products</Label>
//                             <div className="relative">
//                               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                               <Input
//                                 type="text"
//                                 placeholder="Search..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="pl-10 h-8 text-sm"
//                               />
//                             </div>
//                           </div>

//                           {/* Category */}
//                           <div className="space-y-2 mb-4">
//                             <Label className="text-xs">Category</Label>
//                             <Select
//                               value={selectedCategory}
//                               onValueChange={setSelectedCategory}
//                             >
//                               <SelectTrigger className="h-8 text-sm">
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="all">
//                                   All Categories
//                                 </SelectItem>
//                                 {categories.map((category) => (
//                                   <SelectItem key={category} value={category}>
//                                     {category}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </div>

//                           {/* Price Range */}
//                           <div className="space-y-2 mb-4">
//                             <Label className="text-xs">Price Range</Label>
//                             <div className="grid grid-cols-2 gap-2">
//                               <Input
//                                 type="number"
//                                 placeholder="Min"
//                                 value={priceRange.min}
//                                 onChange={(e) =>
//                                   setPriceRange((prev) => ({
//                                     ...prev,
//                                     min: e.target.value,
//                                   }))
//                                 }
//                                 className="h-8 text-sm"
//                               />
//                               <Input
//                                 type="number"
//                                 placeholder="Max"
//                                 value={priceRange.max}
//                                 onChange={(e) =>
//                                   setPriceRange((prev) => ({
//                                     ...prev,
//                                     max: e.target.value,
//                                   }))
//                                 }
//                                 className="h-8 text-sm"
//                               />
//                             </div>
//                           </div>

//                           {/* Sort */}
//                           <div className="space-y-2">
//                             <Label className="text-xs">Sort By</Label>
//                             <Select value={sortBy} onValueChange={setSortBy}>
//                               <SelectTrigger className="h-8 text-sm">
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="name">Name (A-Z)</SelectItem>
//                                 <SelectItem value="price-low">
//                                   Price (Low to High)
//                                 </SelectItem>
//                                 <SelectItem value="price-high">
//                                   Price (High to Low)
//                                 </SelectItem>
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         </CardContent>
//                       </Card>
//                     </div>
//                   )}

//                   {/* Products Grid */}
//                   <div className={isMobile ? "col-span-1" : "lg:col-span-3"}>
//                     <div className="mb-2 sm:mb-4 flex items-center justify-between px-1">
//                       <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">
//                         {filteredProducts.length} products
//                       </p>
//                     </div>

//                     {filteredProducts.length === 0 ? (
//                       <div className="text-center py-8 sm:py-12 px-2">
//                         <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-2 sm:mb-4" />
//                         <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
//                           No products found
//                         </h3>
//                         <p className="text-[11px] xs:text-xs sm:text-sm text-gray-500">
//                           Try adjusting your filters
//                         </p>
//                       </div>
//                     ) : (
//                       <div
//                         className={`grid gap-1.5 xs:gap-2 sm:gap-3 ${
//                           isMobile
//                             ? "grid-cols-2"
//                             : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
//                         } px-0.5 sm:px-0`}
//                       >
//                         {filteredProducts.map((product) => (
//                           <ProductCard key={product._id} product={product} />
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </TabsContent>

//               {/* My Hamper Tab */}
//               <TabsContent value="hamper" className="m-0 p-2 sm:p-4">
//                 {hamperItems.length === 0 ? (
//                   <div className="text-center py-12">
//                     <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       Your hamper is empty
//                     </h3>
//                     <p className="text-gray-500 mb-4">
//                       Start building your custom hamper by exploring products
//                     </p>
//                     <Button
//                       onClick={() => setActiveTab("explore")}
//                       className="bg-purple-600 hover:bg-purple-700"
//                     >
//                       <Grid3X3 className="w-4 h-4 mr-2" />
//                       Explore Products
//                     </Button>
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
//                     {/* Hamper Items */}
//                     <div className="lg:col-span-2">
//                       <div className="space-y-2 sm:space-y-3">
//                         {hamperItems.map((item, index) => (
//                           <motion.div
//                             key={`${item.productId._id}-${index}`}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
//                           >
//                             {/* Product Image */}
//                             <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
//                               <img
//                                 src={
//                                   item.productId.Product_image?.[0] ||
//                                   "/placeholder-product.jpg"
//                                 }
//                                 alt={item.productId.Product_name}
//                                 className="w-full h-full object-cover rounded-md"
//                                 onError={(e) => {
//                                   e.currentTarget.src =
//                                     "/placeholder-jewelry.jpg";
//                                 }}
//                               />
//                             </div>

//                             {/* Product Info */}
//                             <div className="flex-grow min-w-0">
//                               <div className="space-y-1 sm:space-y-2">
//                                 {/* Product Name */}
//                                 <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
//                                   {item.productId.Product_name}
//                                 </h3>

//                                 {/* Price Display */}
//                                 <div className="space-y-1">
//                                   <div className="flex items-center gap-2">
//                                     <span className="text-[10px] sm:text-xs text-gray-500">
//                                       Hamper Price:
//                                     </span>
//                                     <span className="text-xs sm:text-sm font-medium text-purple-600">
//                                       ₹{getItemUnitPrice(item).toLocaleString()}
//                                     </span>
//                                   </div>

//                                   {/* Quantity and Total */}
//                                   <div className="flex items-center justify-between gap-2">
//                                     <div className="flex items-center gap-1">
//                                       <span className="text-[10px] xs:text-xs text-gray-500">
//                                         Qty:
//                                       </span>
//                                       <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
//                                         <button
//                                           className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                           onClick={() =>
//                                             updateItemQuantity(
//                                               item.productId._id,
//                                               item.quantity - 1
//                                             )
//                                           }
//                                           disabled={isProcessing}
//                                           aria-label="Decrease quantity"
//                                         >
//                                           <Minus className="w-3 h-3 text-gray-600" />
//                                         </button>

//                                         <span className="w-7 text-center text-sm font-semibold bg-white border-x border-gray-300 leading-6">
//                                           {item.quantity}
//                                         </span>

//                                         <button
//                                           className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                                           onClick={() =>
//                                             updateItemQuantity(
//                                               item.productId._id,
//                                               item.quantity + 1
//                                             )
//                                           }
//                                           disabled={isProcessing}
//                                           aria-label="Increase quantity"
//                                         >
//                                           <Plus className="w-3 h-3 text-gray-600" />
//                                         </button>
//                                       </div>
//                                     </div>

//                                     {/* Item Total Price */}
//                                     <div className="flex flex-col items-end">
//                                       <span className="text-[10px] sm:text-xs text-gray-500">
//                                         Total:
//                                       </span>
//                                       <span className="text-sm sm:text-lg font-bold text-purple-700">
//                                         ₹{getItemTotal(item).toLocaleString()}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Remove Button */}
//                                 <div className="flex justify-end pt-1">
//                                   <button
//                                     className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors"
//                                     onClick={() =>
//                                       removeItemFromHamper(item.productId._id)
//                                     }
//                                     disabled={isProcessing}
//                                   >
//                                     <Trash2 className="w-3 h-3" />
//                                     <span className="hidden sm:inline">
//                                       Remove
//                                     </span>
//                                   </button>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>

//                       {/* Action Buttons */}
//                       <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 space-y-2">
//                         <Button
//                           variant="outline"
//                           className="w-full rounded-full px-3 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
//                           onClick={() => setActiveTab("explore")}
//                         >
//                           Add More Products
//                         </Button>
//                         <div className="flex flex-col sm:flex-row gap-2">
//                           <Button
//                             variant="destructive"
//                             className="flex-1 rounded-full px-3 py-2 text-xs sm:text-sm"
//                             onClick={clearHamper}
//                             disabled={isProcessing}
//                           >
//                             Clear Hamper
//                           </Button>
//                           <Button
//                             className={`flex-1 rounded-full px-3 py-2 text-xs sm:text-sm font-semibold ${
//                               hamperValidation.isValid
//                                 ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
//                                 : "bg-gray-400 cursor-not-allowed"
//                             }`}
//                             onClick={() => setIsCheckingOut(true)}
//                             disabled={!hamperValidation.isValid || isProcessing}
//                           >
//                             Checkout Hamper
//                           </Button>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Hamper Summary */}
//                     <div className="lg:col-span-1">
//                       <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sticky top-20">
//                         <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
//                           <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
//                           Hamper Summary
//                         </h2>

//                         {/* Items List */}
//                         <div className="space-y-1.5 mb-4 max-h-32 sm:max-h-40 overflow-y-auto">
//                           {hamperItems.map((item, index) => (
//                             <div
//                               key={`summary-${item.productId._id}-${index}`}
//                               className="flex justify-between items-start text-xs sm:text-sm py-1"
//                             >
//                               <div className="flex-1 min-w-0 mr-2">
//                                 <div className="font-medium text-gray-700 truncate leading-tight">
//                                   {item.productId.Product_name}
//                                 </div>
//                                 <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
//                                   ₹{getItemUnitPrice(item).toLocaleString()} ×{" "}
//                                   {item.quantity}
//                                 </div>
//                               </div>
//                               <div className="font-semibold text-purple-600 flex-shrink-0">
//                                 ₹{getItemTotal(item).toLocaleString()}
//                               </div>
//                             </div>
//                           ))}
//                         </div>

//                         {/* Calculation Section */}
//                         <div className="border-t border-gray-200 pt-3 space-y-2">
//                           <div className="flex justify-between items-center text-sm">
//                             <span className="text-gray-600">
//                               Hamper Total ({totalItems} items)
//                             </span>
//                             <span className="font-semibold">
//                               ₹{totalAmount.toLocaleString()}
//                             </span>
//                           </div>

//                           <div className="flex justify-between items-center text-sm">
//                             <span className="text-gray-600">
//                               Delivery Charge
//                             </span>
//                             <span
//                               className={`font-semibold ${
//                                 DELIVERY_CHARGE > 0
//                                   ? "text-orange-600"
//                                   : "text-green-600"
//                               }`}
//                             >
//                               {DELIVERY_CHARGE > 0
//                                 ? `₹${DELIVERY_CHARGE}`
//                                 : "FREE"}
//                             </span>
//                           </div>

//                           {/* Minimum Amount Progress */}
//                           {!hamperValidation.isValid && (
//                             <div className="py-2 px-3 bg-red-50 rounded-lg border border-red-100">
//                               <div className="flex items-center justify-between text-xs text-red-700 mb-1">
//                                 <span className="font-medium">
//                                   Minimum Amount Progress
//                                 </span>
//                                 <span className="font-bold">
//                                   ₹{minimumAmountGap} more
//                                 </span>
//                               </div>
//                               <div className="bg-red-200 h-2 rounded-full relative overflow-hidden">
//                                 <div
//                                   className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-500"
//                                   style={{
//                                     width: `${Math.min(
//                                       (totalAmount / MINIMUM_HAMPER_AMOUNT) *
//                                         100,
//                                       100
//                                     )}%`,
//                                   }}
//                                 />
//                               </div>
//                               <div className="text-[10px] text-red-600 mt-1 text-center">
//                                 {Math.round(
//                                   (totalAmount / MINIMUM_HAMPER_AMOUNT) * 100
//                                 )}
//                                 % of minimum amount
//                               </div>
//                             </div>
//                           )}

//                           {/* Free Delivery Progress */}
//                           {hamperValidation.isValid && DELIVERY_CHARGE > 0 && (
//                             <div className="py-2 px-3 bg-orange-50 rounded-lg border border-orange-100">
//                               <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
//                                 <span className="font-medium">
//                                   Free Delivery Progress
//                                 </span>
//                                 <span className="font-bold">
//                                   ₹{freeDeliveryGap} more
//                                 </span>
//                               </div>
//                               <div className="bg-orange-200 h-2 rounded-full relative overflow-hidden">
//                                 <div
//                                   className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
//                                   style={{
//                                     width: `${Math.min(
//                                       (totalAmount / 500) * 100,
//                                       100
//                                     )}%`,
//                                   }}
//                                 />
//                               </div>
//                               <div className="text-[10px] text-orange-600 mt-1 text-center">
//                                 {Math.round((totalAmount / 500) * 100)}% towards
//                                 free delivery
//                               </div>
//                             </div>
//                           )}

//                           {/* Total */}
//                           <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-200 bg-purple-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-lg">
//                             <span className="text-gray-900">Total Amount</span>
//                             <span className="text-purple-700">
//                               ₹
//                               {(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Validation Message */}
//                         <div className="mt-3 text-center">
//                           <div
//                             className={`text-xs px-3 py-2 rounded-full ${
//                               hamperValidation.isValid
//                                 ? "bg-green-100 text-green-800 border border-green-200"
//                                 : "bg-red-100 text-red-800 border border-red-200"
//                             }`}
//                           >
//                             {hamperValidation.message}
//                           </div>
//                         </div>

//                         {/* Checkout Button */}
//                         <Button
//                           className={`w-full mt-4 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
//                             hamperValidation.isValid
//                               ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                               : "bg-gray-400 cursor-not-allowed"
//                           }`}
//                           onClick={() => setIsCheckingOut(true)}
//                           disabled={!hamperValidation.isValid || isProcessing}
//                         >
//                           {hamperValidation.isValid
//                             ? "Proceed to Checkout"
//                             : `Add ₹${minimumAmountGap} More`}
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </TabsContent>
//             </div>
//           </Tabs>
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       <AnimatePresence>
//         {isCheckingOut && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center overflow-hidden p-2"
//             onClick={() => !checkoutLoading && setIsCheckingOut(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: "100%", scale: 0.95 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: "100%", scale: 0.95 }}
//               transition={{ type: "spring", damping: 25, stiffness: 500 }}
//               className="bg-white w-full max-w-[95vw] sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-purple-100 sm:border max-h-[95vh] flex flex-col overflow-hidden"
//               onClick={(e) => e.stopPropagation()}
//             >
//               {/* Header */}
//               <div className="relative flex-shrink-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-base sm:text-lg font-bold">
//                       Checkout Custom Hamper
//                     </h2>
//                     <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
//                       Total: ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                     </p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex-shrink-0"
//                     onClick={() => !checkoutLoading && setIsCheckingOut(false)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Scrollable Content */}
//               <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
//                 {/* Compact Hamper Summary */}
//                 <div className="bg-purple-50 rounded-lg p-3 mb-4">
//                   <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
//                     <Gift className="w-3 h-3" />
//                     Custom Hamper ({totalItems} items)
//                   </h3>
//                   <div className="space-y-1 text-xs">
//                     <div className="flex justify-between font-medium border-b border-purple-200 pb-1">
//                       <span>Hamper Total</span>
//                       <span>₹{totalAmount.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-orange-600">
//                       <span>Delivery</span>
//                       <span>
//                         {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
//                       </span>
//                     </div>
//                     <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
//                       <span>Total Amount</span>
//                       <span>
//                         ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleHamperCheckout} className="space-y-3">
//                   <div className="grid grid-cols-1 gap-3">
//                     <div className="space-y-1">
//                       <Label
//                         htmlFor="fullName"
//                         className="text-xs font-medium text-gray-700"
//                       >
//                         Full Name *
//                       </Label>
//                       <Input
//                         id="fullName"
//                         name="fullName"
//                         placeholder="Enter your full name"
//                         value={shippingAddress.fullName}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <Label
//                         htmlFor="phone"
//                         className="text-xs font-medium text-gray-700"
//                       >
//                         Phone Number *
//                       </Label>
//                       <Input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         placeholder="Enter your phone number"
//                         value={shippingAddress.phone}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>

//                     <div className="space-y-1">
//                       <Label
//                         htmlFor="address"
//                         className="text-xs font-medium text-gray-700"
//                       >
//                         Address *
//                       </Label>
//                       <Input
//                         id="address"
//                         name="address"
//                         placeholder="Enter your address"
//                         value={shippingAddress.address}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-2">
//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="city"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           City *
//                         </Label>
//                         <Input
//                           id="city"
//                           name="city"
//                           placeholder="City"
//                           value={shippingAddress.city}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>
//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="state"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           State *
//                         </Label>
//                         <Input
//                           id="state"
//                           name="state"
//                           placeholder="State"
//                           value={shippingAddress.state}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-1">
//                       <Label
//                         htmlFor="pinCode"
//                         className="text-xs font-medium text-gray-700"
//                       >
//                         PIN Code *
//                       </Label>
//                       <Input
//                         id="pinCode"
//                         name="pinCode"
//                         placeholder="PIN Code"
//                         value={shippingAddress.pinCode}
//                         onChange={handleInputChange}
//                         required
//                         className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>
//                   </div>
//                 </form>
//               </div>

//               {/* Fixed Bottom */}
//               <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 space-y-2">
//                 <Button
//                   type="submit"
//                   onClick={handleHamperCheckout}
//                   className="w-full h-10 text-sm rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
//                   disabled={checkoutLoading}
//                 >
//                   {checkoutLoading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Placing Order...
//                     </div>
//                   ) : (
//                     `Place Hamper Order - ₹${(
//                       totalAmount + DELIVERY_CHARGE
//                     ).toLocaleString()}`
//                   )}
//                 </Button>
//                 <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
//                   <svg
//                     className="w-3 h-3"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                     />
//                   </svg>
//                   <span>Cash on Delivery • Secure Payment</span>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Phone Verification Modal - ADD THIS before closing </> */}
//       <PhoneVerificationModal
//         isOpen={isVerificationModalOpen}
//         onClose={closeVerificationModal}
//         onVerificationSuccess={handlePhoneVerificationSuccess}
//         initialPhone={shippingAddress.phone}
//         title="Verify Phone for Checkout"
//         description="Please verify your phone number to complete your hamper order"
//       />
//     </>
//   );
// };

// export default CustomHamperBuilder;

// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";
// import { useToast } from "../components/ui/use-toast";
// import axiosInstance from "../utils/axiosConfig";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Card, CardContent } from "../components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import { Badge } from "../components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Minus,
//   X,
//   ShoppingCart,
//   Package,
//   Gift,
//   Filter,
//   Search,
//   RefreshCw,
//   AlertCircle,
//   Trash2,
//   Eye,
//   ShoppingBag,
//   Truck,
//   Grid3X3,
//   List,
//   ChevronUp,
//   ChevronDown,
//   Heart,
//   Phone,
//   Shield,
//   Clock,
//   CheckCircle,
//   ArrowRight,
//   MessageSquare,
//   RotateCcw,
//   ArrowLeft,
//   Lock,
// } from "lucide-react";

// // Enhanced TypeScript declaration

// // Even clearer TypeScript declaration
// interface CashfreeInstance {
//   checkout: (options: {
//     paymentSessionId: string;
//     redirectTarget?: string;
//   }) => Promise<{
//     error?: { message: string };
//     redirect?: boolean;
//     paymentDetails?: any;
//   }>;
// }

// declare global {
//   interface Window {
//     Cashfree: (config: { mode: string }) => CashfreeInstance;
//   }
// }

// export {};

// const CustomHamperBuilder = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const justAddedItem = useRef(false);

//   // Core hamper state
//   const [hamperItems, setHamperItems] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);
//   const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   // Products state
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter and search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [sortBy, setSortBy] = useState("name");

//   // UI state
//   const [activeTab, setActiveTab] = useState("explore");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // Phone verification state - RESTORED FROM FIRST CODE
//   const [showPhoneVerification, setShowPhoneVerification] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
//   const [phoneVerified, setPhoneVerified] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [canResendOTP, setCanResendOTP] = useState(false);
//   const [verificationId, setVerificationId] = useState("");
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // Checkout form
//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     phone: "",
//   });

//   // Constants
//   const MINIMUM_HAMPER_AMOUNT = 200;
//   const DELIVERY_CHARGE = totalAmount >= 500 ? 0 : 80;
//   const minimumAmountGap = Math.max(0, MINIMUM_HAMPER_AMOUNT - totalAmount);
//   const freeDeliveryGap = Math.max(0, 500 - totalAmount);

//   // OTP Timer effect - RESTORED FROM FIRST CODE
//   useEffect(() => {
//     let interval = null;
//     if (otpTimer > 0) {
//       interval = setInterval(() => {
//         setOtpTimer((timer) => timer - 1);
//       }, 1000);
//     } else if (otpTimer === 0 && showOTPInput) {
//       setCanResendOTP(true);
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer, showOTPInput]);

//   // Detect mobile screen size
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Auto-switch to hamper tab when items are added (mobile only)
//   useEffect(() => {
//     if (
//       isMobile &&
//       hamperItems.length > 0 &&
//       activeTab === "explore" &&
//       justAddedItem.current
//     ) {
//       setTimeout(() => {
//         setActiveTab("hamper");
//         justAddedItem.current = false;
//       }, 800);
//     }
//   }, [hamperItems.length, isMobile, activeTab]);

//   // Fetch hamper-eligible products using backend filtering
//   const fetchHamperProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log("🎁 Fetching hamper-eligible products from backend...");
//       const response = await axiosInstance.get(
//         "api/getproducts?type=hamper&limit=100"
//       );
//       console.log("📦 Hamper products response:", response.data);

//       if (response.data && response.data.product) {
//         const hamperProducts = response.data.product;
//         setProducts(hamperProducts);
//         setFilteredProducts(hamperProducts);

//         const uniqueCategories = [
//           ...new Set(
//             hamperProducts
//               .map(
//                 (p) =>
//                   p.Product_category_name ||
//                   p.Product_category?.category ||
//                   "Uncategorized"
//               )
//               .filter(Boolean)
//           ),
//         ];
//         setCategories(uniqueCategories);

//         console.log(
//           `✅ Loaded ${hamperProducts.length} hamper-eligible products`
//         );

//         if (hamperProducts.length === 0) {
//           toast({
//             title: "No Hamper Products",
//             description:
//               "No products are currently available for custom hampers.",
//             variant: "default",
//           });
//         }
//       } else {
//         setProducts([]);
//         setFilteredProducts([]);
//         setCategories([]);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching hamper products:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to load hamper products";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]);

//   // Fetch user's hamper from database
//   const fetchUserHamper = useCallback(async () => {
//     if (!user) return;

//     try {
//       const response = await axiosInstance.get("/hamper");
//       const data = response.data;

//       if (data.hamper && data.hamper.length > 0) {
//         setHamperItems(data.hamper);
//         setTotalAmount(data.totalAmount || 0);
//         setTotalItems(data.totalItems || 0);
//         console.log("Hamper loaded from database:", data);
//       } else {
//         setHamperItems([]);
//         setTotalAmount(0);
//         setTotalItems(0);
//       }
//     } catch (error) {
//       console.error("Error fetching hamper from database:", error);
//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);
//     }
//   }, [user]);

//   // Initialize component
//   useEffect(() => {
//     fetchHamperProducts();
//     fetchUserHamper();
//   }, [fetchHamperProducts, fetchUserHamper]);

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = [...products];

//     if (searchQuery) {
//       filtered = filtered.filter((product) =>
//         product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Product_category_name || product.Product_category) ===
//           selectedCategory
//       );
//     }

//     if (priceRange.min) {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Hamper_price || product.Product_price) >=
//           parseFloat(priceRange.min)
//       );
//     }

//     if (priceRange.max) {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Hamper_price || product.Product_price) <=
//           parseFloat(priceRange.max)
//       );
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return (
//             (a.Hamper_price || a.Product_price) -
//             (b.Hamper_price || b.Product_price)
//           );
//         case "price-high":
//           return (
//             (b.Hamper_price || b.Product_price) -
//             (a.Hamper_price || a.Product_price)
//           );
//         case "name":
//         default:
//           return a.Product_name.localeCompare(b.Product_name);
//       }
//     });

//     setFilteredProducts(filtered);
//   }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

//   // Hamper validation
//   const hamperValidation = useMemo(() => {
//     if (totalAmount < MINIMUM_HAMPER_AMOUNT) {
//       return {
//         isValid: false,
//         message: `Add ₹${minimumAmountGap} more to reach minimum hamper value of ₹${MINIMUM_HAMPER_AMOUNT}`,
//       };
//     }
//     return { isValid: true, message: "Hamper is ready for checkout!" };
//   }, [totalAmount, minimumAmountGap]);

//   // Add item to hamper
//   const addItemToHamper = async (product) => {
//     try {
//       setIsProcessing(true);
//       justAddedItem.current = true;
//       console.log("🎁 Adding product to hamper:", product.Product_name);

//       const response = await axiosInstance.post("/hamper/add", {
//         productId: product._id,
//         quantity: 1,
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         toast({
//           title: "Added to Hamper",
//           description: `${product.Product_name} added to your custom hamper`,
//         });
//       }
//     } catch (error) {
//       console.error("Error adding to hamper:", error);
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to add item to hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Update item quantity in hamper
//   const updateItemQuantity = async (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       return removeItemFromHamper(productId);
//     }

//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.put(`/hamper/update/${productId}`, {
//         quantity: newQuantity,
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);
//       }
//     } catch (error) {
//       console.error("Error updating hamper quantity:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update quantity",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Remove item from hamper
//   const removeItemFromHamper = async (productId) => {
//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.delete(
//         `/hamper/remove/${productId}`
//       );

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         toast({
//           title: "Item Removed",
//           description: "Item removed from hamper",
//           duration: 2000,
//         });
//       }
//     } catch (error) {
//       console.error("Error removing from hamper:", error);
//       toast({
//         title: "Error",
//         description: "Failed to remove item",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Clear entire hamper
//   const clearHamper = async () => {
//     try {
//       setIsProcessing(true);
//       await axiosInstance.delete("/hamper/clear");

//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);

//       toast({
//         title: "Hamper Cleared",
//         description: "All items removed from hamper",
//         duration: 2000,
//       });
//     } catch (error) {
//       console.error("Error clearing hamper:", error);
//       toast({
//         title: "Error",
//         description: "Failed to clear hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle tab change
//   const handleTabChange = (newTab) => {
//     if (newTab === "explore") justAddedItem.current = false;
//     setActiveTab(newTab);
//   };

//   // Handle checkout form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Phone verification functions - RESTORED FROM FIRST CODE
//   const handlePhoneVerification = async (e) => {
//     e.preventDefault();
//     if (!phoneNumber || phoneNumber.length !== 10) {
//       toast({
//         title: "Invalid Phone Number",
//         description: "Please enter a valid 10-digit phone number",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsVerifyingPhone(true);
//       // Check if phone number exists in database with correct endpoint
//       const checkResponse = await axiosInstance.post(
//         "/api/verify/check-phone",
//         {
//           phoneNumber: phoneNumber,
//         }
//       );

//       if (checkResponse.data.success && checkResponse.data.isVerified) {
//         // Phone number exists and is verified, no OTP needed
//         setPhoneVerified(true);
//         setShippingAddress((prev) => ({ ...prev, phone: phoneNumber }));
//         setShowPhoneVerification(false);
//         setIsCheckingOut(true);
//         toast({
//           title: "Phone Verified! 📱",
//           description:
//             "Phone number found in our records. Proceeding to checkout.",
//           variant: "default",
//         });
//       } else {
//         // Phone number doesn't exist or not verified, send OTP
//         const otpResponse = await axiosInstance.post("/api/verify/send", {
//           countryCode: "91",
//           mobileNumber: phoneNumber.replace(/\D/g, ""),
//         });

//         if (otpResponse.data.success) {
//           setVerificationId(otpResponse.data.verificationId); // Store verification ID
//           setShowOTPInput(true);
//           setOtpTimer(otpResponse.data.timeout || 60);
//           setCanResendOTP(false);
//           toast({
//             title: "OTP Sent! 📲",
//             description: `Verification code sent to ${phoneNumber}`,
//             variant: "default",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Phone verification error:", error);
//       toast({
//         title: "Verification Failed",
//         description:
//           error.response?.data?.message || "Failed to verify phone number",
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifyingPhone(false);
//     }
//   };

//   // OTP verification - RESTORED FROM FIRST CODE
//   const handleOTPVerification = async (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) {
//       toast({
//         title: "Invalid OTP",
//         description: "Please enter a valid 4-digit OTP",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsVerifyingOTP(true);
//       const response = await axiosInstance.post("/api/verify/verify", {
//         countryCode: "91",
//         mobileNumber: phoneNumber.replace(/\D/g, ""),
//         verificationId: verificationId, // Use stored verification ID
//         code: otp,
//       });

//       if (response.data.success) {
//         setPhoneVerified(true);
//         setShippingAddress((prev) => ({ ...prev, phone: phoneNumber }));
//         setShowPhoneVerification(false);
//         setShowOTPInput(false);
//         setIsCheckingOut(true);
//         toast({
//           title: "Phone Verified Successfully! ✅",
//           description:
//             "Your phone number has been verified. Proceeding to checkout.",
//           variant: "default",
//         });
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       toast({
//         title: "Invalid OTP",
//         description:
//           error.response?.data?.message || "Please enter the correct OTP",
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifyingOTP(false);
//     }
//   };

//   // Resend OTP - RESTORED FROM FIRST CODE
//   const handleResendOTP = async () => {
//     try {
//       setIsVerifyingPhone(true);
//       const response = await axiosInstance.post("/api/verify/send", {
//         countryCode: "91",
//         mobileNumber: phoneNumber.replace(/\D/g, ""),
//       });

//       if (response.data.success) {
//         setVerificationId(response.data.verificationId); // Update verification ID
//         setOtpTimer(response.data.timeout || 60);
//         setCanResendOTP(false);
//         setOtp("");
//         toast({
//           title: "OTP Resent! 📲",
//           description: `New verification code sent to ${phoneNumber}`,
//           variant: "default",
//         });
//       }
//     } catch (error) {
//       console.error("Resend OTP error:", error);
//       toast({
//         title: "Failed to Resend",
//         description: error.response?.data?.message || "Failed to resend OTP",
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifyingPhone(false);
//     }
//   };

//   // Reset phone verification state - RESTORED FROM FIRST CODE
//   const resetPhoneVerification = () => {
//     setShowPhoneVerification(false);
//     setShowOTPInput(false);
//     setPhoneNumber("");
//     setOtp("");
//     setPhoneVerified(false);
//     setOtpTimer(0);
//     setCanResendOTP(false);
//   };

//   // Start checkout process - MODIFIED TO USE PHONE VERIFICATION
//   const startCheckout = () => {
//     if (!user) {
//       toast({
//         title: "Please login",
//         description: "You need to be logged in to checkout",
//         variant: "destructive",
//       });
//       navigate("/login");
//       return;
//     }

//     if (!hamperValidation.isValid) {
//       toast({
//         title: "Cannot Proceed",
//         description: hamperValidation.message,
//         variant: "destructive",
//       });
//       return;
//     }

//     // Start with phone verification
//     setShowPhoneVerification(true);
//   };

//   // Handle hamper checkout - MODIFIED TO USE PHONE VERIFICATION
//   const handleHamperCheckout = async (e) => {
//     e.preventDefault();

//     if (!phoneVerified) {
//       toast({
//         title: "Phone Not Verified",
//         description: "Please verify your phone number first",
//         variant: "destructive",
//       });
//       return;
//     }

//     const requiredFields = ["fullName", "address", "city", "state", "pinCode"];
//     const missingFields = requiredFields.filter(
//       (field) => !shippingAddress[field].trim()
//     );

//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     setCheckoutLoading(true);

//     try {
//       const orderItems = hamperItems.map((item) => ({
//         product: item.productId._id,
//         name: item.productId.Product_name,
//         quantity: item.quantity,
//         price: item.productId.Hamper_price || item.productId.Product_price,
//         image: item.productId.Product_image?.[0],
//         isHamperItem: true,
//       }));

//       const response = await axiosInstance.post("/orders/create", {
//         items: orderItems,
//         shippingAddress,
//         paymentMethod: "cod",
//         totalAmount: totalAmount + DELIVERY_CHARGE,
//         isCustomHamper: true,
//       });

//       await axiosInstance.delete("/hamper/clear");

//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);

//       toast({
//         title: "Custom Hamper Ordered Successfully!",
//         description:
//           "Your custom hamper is being prepared. Track your order in your profile.",
//         variant: "default",
//       });

//       navigate("/profile");
//     } catch (err) {
//       console.error("Hamper order creation error:", err);
//       toast({
//         title: "Error",
//         description:
//           err?.response?.data?.message ||
//           "Failed to place hamper order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setCheckoutLoading(false);
//       setIsCheckingOut(false);
//       resetPhoneVerification();
//     }
//   };

// // Add this function to your CustomHamperBuilder.tsx
// // const loadCashfreeSDK = (): Promise<void> => {
// //   return new Promise((resolve, reject) => {
// //     // Check if already loaded
// //     if (window.Cashfree) {
// //       resolve();
// //       return;
// //     }

// //     // Create script element
// //     const script = document.createElement('script');
// //     script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
// //     script.async = true;

// //     script.onload = () => {
// //       console.log('✅ Cashfree SDK loaded successfully');
// //       resolve();
// //     };

// //     script.onerror = () => {
// //       console.error('❌ Failed to load Cashfree SDK');
// //       reject(new Error('Failed to load Cashfree SDK'));
// //     };

// //     document.head.appendChild(script);
// //   });
// // };

//   // You only need this simple function
//   const handlePaymentSelection = async (paymentMethod: string) => {
//   try {
//     console.log('🎯 Payment method selected:', paymentMethod);

//     // Form validation
//     const requiredFields = ["fullName", "address", "city", "state", "pinCode", "phone"];
//     const missingFields = requiredFields.filter(
//       (field) => !shippingAddress[field].trim()
//     );

//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     // ✅ Add delivery charge calculation
//     const itemsTotal = hamperItems.reduce((total, item) => {
//       return total + (item.productId.Hamper_price || item.productId.Product_price) * item.quantity;
//     }, 0);

//     const deliveryCharge = 80; // Define delivery charge
//     const totalAmount = itemsTotal + deliveryCharge;

//     console.log(`💰 Order breakdown:
//       Items Total: ₹${itemsTotal}
//       Delivery Charge: ₹${deliveryCharge}
//       Final Total: ₹${totalAmount}`);

//     const orderData = {
//       userId: user._id,
//       items: hamperItems.map(item => ({
//         productId: item.productId._id,
//         quantity: item.quantity,
//         price: item.productId.Hamper_price || item.productId.Product_price,
//          // ✅ Include product details for proper display
//         name: item.productId.Product_name,
//         image: item.productId.Product_image?.[0] || null
//       })),
//       shippingAddress: {
//         street: shippingAddress.address,
//         city: shippingAddress.city,
//         state: shippingAddress.state,
//         pincode: shippingAddress.pinCode,
//         country: 'India'
//       },
//        // ✅ Add delivery charge fields
//       itemsTotal: itemsTotal,
//       deliveryCharge: deliveryCharge,
//       totalAmount: totalAmount,
//       paymentMethod: paymentMethod,
//       Contact_number: shippingAddress.phone,
//       user_email: user.email
//     };

//     console.log('📤 Sending order data:', orderData);
//     setCheckoutLoading(true);

//     const response = await axiosInstance.post('/cashfree/create', orderData);

//     if (response.data.success) {
//       if (paymentMethod === 'cod') {
//         // COD order created successfully
//         toast({
//           title: "COD Order Placed!",
//           description: "Your order has been placed successfully."
//         });
//         setIsCheckingOut(false);
//         navigate('/orders');
//       } else {
//         // Online payment - ensure Cashfree SDK is loaded
//         console.log('💳 Processing online payment...');

//         // Option A: If using script tag in index.html
//         if (!window.Cashfree) {
//           toast({
//             title: "Payment Error",
//             description: "Payment system is loading. Please try again in a moment.",
//             variant: "destructive"
//           });
//           setCheckoutLoading(false);
//           return;
//         }

//         // Option B: If loading SDK dynamically (uncomment if using Option B)
//         // try {
//         //   await loadCashfreeSDK();
//         // } catch (error) {
//         //   toast({
//         //     title: "Payment Error",
//         //     description: "Failed to load payment system. Please refresh and try again.",
//         //     variant: "destructive"
//         //   });
//         //   setCheckoutLoading(false);
//         //   return;
//         // }
//          const cashfree = window.Cashfree({ mode: "sandbox" });
//         // const { cashfreeSession, orderId, tempOrder } = response.data;
//         const { cashfreeSession, orderId, internalOrderId } = response.data;

//         // Persist so PaymentCallback can always find them
// sessionStorage.setItem("orderId",       orderId);
// sessionStorage.setItem("internalOrderId", internalOrderId);
// sessionStorage.setItem("paymentMethod",  paymentMethod);

//         console.log('🔑 Payment session ID:', cashfreeSession.payment_session_id);

//         // Open Cashfree checkout
//        // This should no longer show TypeScript error
//         cashfree.checkout({
//           paymentSessionId: cashfreeSession.payment_session_id,
//           redirectTarget: "_self"
//         }).then(function(result: any) {
//           if (result.error) {
//             toast({
//               title: "Payment Failed",
//               description: result.error.message,
//               variant: "destructive"
//             });
//           }

//           // if (result.redirect) {
//           //   console.log('✅ Payment redirect success');
//           //   // Handle payment verification
//           //   handlePaymentVerification(orderId, result.paymentDetails, tempOrder);
//           // }
//           // This provides working user feedback
// if (result.redirect) {
//   toast({
//     title: "Payment Successful!",
//     description: "Your payment has been processed."
//   });
//   setIsCheckingOut(false);
//   navigate('/orders');
// }

//         }).catch(function(error: any) {
//           console.error('❌ Cashfree checkout error:', error);
//           toast({
//             title: "Payment Error",
//             description: "Something went wrong with the payment. Please try again.",
//             variant: "destructive"
//           });
//         });
//       }
//     }
//   } catch (error: any) {
//     console.error('❌ Payment selection error:', error);
//     toast({
//       title: "Payment Error",
//       description: error.response?.data?.message || "Failed to process payment. Please try again.",
//       variant: "destructive"
//     });
//   } finally {
//     setCheckoutLoading(false);
//   }
// };

// // Add this useEffect in your CustomHamperBuilder component
// // useEffect(() => {
// //   // Check if Cashfree SDK is loaded
// //   const checkCashfreeSDK = () => {
// //     if (window.Cashfree) {
// //       console.log('✅ Cashfree SDK is available');
// //     } else {
// //       console.warn('⚠️ Cashfree SDK not loaded yet');
// //       // Retry after 1 second
// //       setTimeout(checkCashfreeSDK, 1000);
// //     }
// //   };

// //   checkCashfreeSDK();
// // }, []);

//   const handlePaymentVerification = async (
//     orderId: string,
//     paymentDetails: any,
//     tempOrder: any
//   ) => {
//     try {
//       console.log("🔍 Verifying payment:", { orderId, paymentDetails });

//       // Add loading state for better UX
//       setIsProcessingPayment(true); // Add this state if you don't have it

//       const verifyResponse = await axiosInstance.post("/cashfree/verify", {
//         orderId: orderId,
//         paymentStatus: paymentDetails?.paymentStatus || "SUCCESS",
//         paymentId: paymentDetails?.paymentId,
//         tempOrder: tempOrder,
//       });

//       console.log("✅ Payment verification response:", verifyResponse.data);

//       if (verifyResponse.data.success) {
//         toast({
//           title: "Payment Successful!",
//           description: `Your order has been placed successfully. Order ID: #${verifyResponse.data.order._id
//             .toString()
//             .slice(-6)
//             .toUpperCase()}`,
//         });

//         // Clear hamper items after successful payment
//         setHamperItems([]);

//         // Navigate to the specific order page
//         navigate(`/orders/${verifyResponse.data.order._id}`);
//       } else {
//         console.error("❌ Payment verification failed:", verifyResponse.data);

//         toast({
//           title: "Payment Verification Failed",
//           description:
//             verifyResponse.data.message ||
//             "There was an issue verifying your payment. Please contact support if amount was debited.",
//           variant: "destructive",
//         });
//       }
//     } catch (error: any) {
//       console.error("❌ Payment verification error:", error);

//       // Handle different types of errors
//       let errorMessage = "Failed to verify payment. Please contact support.";

//       if (error.response) {
//         // Server responded with error
//         errorMessage = error.response.data?.message || errorMessage;

//         if (error.response.status === 400) {
//           errorMessage = "Invalid payment data. Please try again.";
//         } else if (error.response.status === 500) {
//           errorMessage =
//             "Server error during verification. Please contact support if amount was debited.";
//         }
//       } else if (error.request) {
//         // Network error
//         errorMessage =
//           "Network error. Please check your connection and try again.";
//       }

//       toast({
//         title: "Verification Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessingPayment(false); // Reset loading state
//     }
//   };

//   // Helper functions
//   const getItemTotal = (item) => {
//     const price = item.productId.Hamper_price || item.productId.Product_price;
//     return price * item.quantity;
//   };

//   const getItemUnitPrice = (item) => {
//     return item.productId.Hamper_price || item.productId.Product_price;
//   };

//   const isProductInHamper = (productId) => {
//     return hamperItems.some((item) => item.productId._id === productId);
//   };

//   const getProductQuantityInHamper = (productId) => {
//     const item = hamperItems.find((item) => item.productId._id === productId);
//     return item ? item.quantity : 0;
//   };

//   // Compact Mobile Filters Component - KEEPING SECOND CODE STYLING
//   const MobileFilters = () => (
//     <motion.div
//       initial={false}
//       animate={{ height: showFilters ? "auto" : 0 }}
//       transition={{ duration: 0.3 }}
//       className="overflow-hidden bg-white border-b border-gray-200"
//     >
//       <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-7 sm:pl-10 h-7 sm:h-9 text-[11px] xs:text-xs sm:text-sm"
//           />
//         </div>

//         {/* Category and Sort in a row */}
//         <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//             <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all" className="text-[10px] xs:text-xs">
//                 All
//               </SelectItem>
//               {categories.map((category) => (
//                 <SelectItem
//                   key={category}
//                   value={category}
//                   className="text-[10px] xs:text-xs"
//                 >
//                   {category.length > 15
//                     ? category.substring(0, 15) + "..."
//                     : category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//               <SelectValue placeholder="Sort" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="name" className="text-[10px] xs:text-xs">
//                 Name
//               </SelectItem>
//               <SelectItem value="price-low" className="text-[10px] xs:text-xs">
//                 Price ↑
//               </SelectItem>
//               <SelectItem value="price-high" className="text-[10px] xs:text-xs">
//                 Price ↓
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Price Range */}
//         <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//           <Input
//             type="number"
//             placeholder="Min ₹"
//             value={priceRange.min}
//             onChange={(e) =>
//               setPriceRange((prev) => ({ ...prev, min: e.target.value }))
//             }
//             className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//           />
//           <Input
//             type="number"
//             placeholder="Max ₹"
//             value={priceRange.max}
//             onChange={(e) =>
//               setPriceRange((prev) => ({ ...prev, max: e.target.value }))
//             }
//             className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );

//   // Product Card Component - KEEPING SECOND CODE STYLING
//   const ProductCard = ({ product }) => {
//     const hamperPrice = product.Hamper_price || product.Product_price;
//     const regularPrice = product.Product_price;
//     const discount =
//       regularPrice > hamperPrice
//         ? ((regularPrice - hamperPrice) / regularPrice) * 100
//         : 0;

//     const inHamper = isProductInHamper(product._id);
//     const hamperQuantity = getProductQuantityInHamper(product._id);

//     // Compact Quantity Control
//     const QuantityControl = () => (
//       <div className="flex items-center gap-1">
//         <span className="text-[10px] xs:text-xs text-gray-500">Qty:</span>
//         <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
//           <button
//             className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => updateItemQuantity(product._id, hamperQuantity - 1)}
//             disabled={isProcessing}
//             aria-label="Decrease quantity"
//           >
//             <Minus className="w-3 h-3 text-gray-600" />
//           </button>
//           <span className="w-7 text-center text-sm font-semibold bg-white border-x border-gray-300 leading-6">
//             {hamperQuantity}
//           </span>
//           <button
//             className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             onClick={() => updateItemQuantity(product._id, hamperQuantity + 1)}
//             disabled={isProcessing}
//             aria-label="Increase quantity"
//           >
//             <Plus className="w-3 h-3 text-gray-600" />
//           </button>
//         </div>
//       </div>
//     );

//     return (
//       <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
//         <CardContent className="p-0">
//           <div className="relative overflow-hidden rounded-t-lg">
//             <img
//               src={product.Product_image?.[0] || "/placeholder-product.jpg"}
//               alt={product.Product_name}
//               className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
//               onError={(e) => {
//                 e.currentTarget.src = "/placeholder-product.jpg";
//               }}
//             />
//             {discount > 0 && (
//               <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
//                 {discount.toFixed(0)}% OFF
//               </Badge>
//             )}
//             {inHamper && (
//               <Badge className="absolute top-2 right-2 bg-purple-500 text-white text-xs">
//                 In Hamper
//               </Badge>
//             )}
//           </div>

//           <div className="p-3">
//             <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-2">
//               {product.Product_name}
//             </h3>

//             <div className="flex items-center justify-between mb-2">
//               <div className="flex flex-col">
//                 <span className="text-sm sm:text-lg font-bold text-green-600">
//                   ₹{hamperPrice.toLocaleString()}
//                 </span>
//                 {discount > 0 && (
//                   <span className="text-xs text-gray-500 line-through">
//                     ₹{regularPrice.toLocaleString()}
//                   </span>
//                 )}
//               </div>
//               {inHamper ? (
//                 <QuantityControl />
//               ) : (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => addItemToHamper(product)}
//                   className="hover:bg-green-50 hover:border-green-500 hover:text-green-600 text-xs px-2 py-1 h-7"
//                   disabled={isProcessing}
//                 >
//                   <Plus className="h-3 w-3 mr-1" />
//                   Add
//                 </Button>
//               )}
//             </div>

//             <Badge variant="secondary" className="text-xs">
//               {product.Product_category_name ||
//                 product.Product_category ||
//                 "Uncategorized"}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   // Loading state - KEEPING SECOND CODE STYLING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
//           <p className="text-lg font-medium">Loading hamper products...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   // Error state - KEEPING SECOND CODE STYLING
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2">
//             Unable to Load Products
//           </h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Button onClick={fetchHamperProducts}>
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Try Again
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   // Main render - KEEPING SECOND CODE STYLING BUT ADDING PHONE VERIFICATION MODAL
//   return (
//     <>
//       <style>{`
//   body, html {
//     overflow-x: hidden !important;
//     max-width: 100vw !important;
//   }
//   * {
//     box-sizing: border-box;
//   }

//   /* Enhanced 320px support */
//   @media (max-width: 320px) {
//     .container {
//       padding-left: 2px;
//       padding-right: 2px;
//     }
//     .hamper-card {
//       padding: 8px !important;
//     }
//     .hamper-item-image {
//       width: 50px !important;
//       height: 50px !important;
//     }
//     .quantity-control-btn {
//       width: 24px !important;
//       height: 24px !important;
//     }
//     .quantity-display {
//       width: 32px !important;
//       font-size: 12px !important;
//     }
//   }

//   /* Add xs breakpoint support */
//   @media (min-width: 360px) {
//     .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
//     .xs\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
//     .xs\\:p-2 { padding: 0.5rem; }
//     .xs\\:px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
//     .xs\\:gap-2 { gap: 0.5rem; }
//     .xs\\:w-12 { width: 3rem; }
//     .xs\\:h-12 { height: 3rem; }
//   }

//   .xs\\:hidden {
//     @media (max-width: 359px) {
//       display: none;
//     }
//   }
// `}</style>

//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-6 px-1 overflow-x-hidden">
//         <div className="container mx-auto max-w-6xl px-1">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-2 sm:mb-4 px-1"
//           >
//             <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
//               Custom <span className="text-purple-600">Hamper Builder</span>
//             </h1>
//             <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-tight px-2">
//               Create your perfect gift hamper • Min ₹{MINIMUM_HAMPER_AMOUNT}
//             </p>
//           </motion.div>

//           {/* Hamper Status Banner */}
//           {totalItems > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md sm:rounded-lg p-1.5 sm:p-3 mb-2 sm:mb-4 mx-1"
//             >
//               <div className="flex items-center justify-between text-[10px] xs:text-xs sm:text-sm">
//                 <div className="flex items-center gap-1 min-w-0">
//                   <Gift className="w-3 h-3 flex-shrink-0" />
//                   <span className="font-semibold truncate">
//                     Hamper: {totalItems} • ₹{totalAmount.toLocaleString()}
//                   </span>
//                 </div>
//                 <Badge className="bg-white/20 text-white text-[9px] xs:text-xs px-1 py-0.5 ml-1 flex-shrink-0">
//                   {hamperValidation.isValid ? "Ready!" : `₹${minimumAmountGap}`}
//                 </Badge>
//               </div>
//             </motion.div>
//           )}

//           {/* Tab Interface */}
//           <Tabs
//             value={activeTab}
//             onValueChange={handleTabChange}
//             className="w-full mx-1"
//           >
//             {/* Tab Navigation */}
//             <div className="bg-white rounded-t-md sm:rounded-t-xl shadow-lg border border-b-0 border-purple-100">
//               <TabsList className="w-full h-10 sm:h-12 bg-transparent p-0.5 sm:p-1">
//                 <TabsTrigger
//                   value="explore"
//                   className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//                 >
//                   <Grid3X3 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//                   <span className="hidden xs:inline">Explore</span>
//                   <span className="xs:hidden">Shop</span>
//                   <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-purple-100 text-purple-700 px-1 py-0">
//                     {filteredProducts.length}
//                   </Badge>
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="hamper"
//                   className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//                 >
//                   <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//                   <span className="hidden xs:inline">Hamper</span>
//                   <span className="xs:hidden">Cart</span>
//                   {totalItems > 0 && (
//                     <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-orange-500 text-white px-1 py-0">
//                       {totalItems}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//               </TabsList>

//               {/* Mobile Filter Toggle */}
//               {activeTab === "explore" && isMobile && (
//                 <div className="border-t border-gray-200">
//                   <Button
//                     variant="ghost"
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="w-full h-8 sm:h-10 justify-between text-[11px] xs:text-xs sm:text-sm text-gray-600 hover:bg-purple-50 px-2"
//                   >
//                     <div className="flex items-center gap-1 sm:gap-2">
//                       <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span className="hidden xs:inline">Filters & Search</span>
//                       <span className="xs:hidden">Filters</span>
//                     </div>
//                     {showFilters ? (
//                       <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
//                     ) : (
//                       <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
//                     )}
//                   </Button>
//                 </div>
//               )}

//               {/* Mobile Filters */}
//               {activeTab === "explore" && isMobile && <MobileFilters />}
//             </div>

//             {/* Tab Content */}
//             <div className="bg-white rounded-b-md sm:rounded-b-xl shadow-lg border border-t-0 border-purple-100 min-h-[60vh]">
//               {/* Explore Products Tab */}
//               <TabsContent value="explore" className="m-0 p-1 xs:p-2 sm:p-4">
//                 {!isMobile && (
//                   <div className="mb-4 p-3 bg-gray-50 rounded-lg">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
//                       <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                         <Input
//                           type="text"
//                           placeholder="Search products..."
//                           value={searchQuery}
//                           onChange={(e) => setSearchQuery(e.target.value)}
//                           className="pl-10"
//                         />
//                       </div>
//                       <Select
//                         value={selectedCategory}
//                         onValueChange={setSelectedCategory}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="All Categories" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="all">All Categories</SelectItem>
//                           {categories.map((category) => (
//                             <SelectItem key={category} value={category}>
//                               {category}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <Select value={sortBy} onValueChange={setSortBy}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Sort by" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="name">Name A-Z</SelectItem>
//                           <SelectItem value="price-low">
//                             Price: Low to High
//                           </SelectItem>
//                           <SelectItem value="price-high">
//                             Price: High to Low
//                           </SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <div className="flex gap-2">
//                         <Input
//                           type="number"
//                           placeholder="Min ₹"
//                           value={priceRange.min}
//                           onChange={(e) =>
//                             setPriceRange((prev) => ({
//                               ...prev,
//                               min: e.target.value,
//                             }))
//                           }
//                         />
//                         <Input
//                           type="number"
//                           placeholder="Max ₹"
//                           value={priceRange.max}
//                           onChange={(e) =>
//                             setPriceRange((prev) => ({
//                               ...prev,
//                               max: e.target.value,
//                             }))
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Products Grid */}
//                 <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
//                   {filteredProducts.map((product) => (
//                     <ProductCard key={product._id} product={product} />
//                   ))}
//                 </div>

//                 {filteredProducts.length === 0 && (
//                   <div className="text-center py-12">
//                     <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       No Products Found
//                     </h3>
//                     <p className="text-gray-600">
//                       Try adjusting your filters or search terms.
//                     </p>
//                   </div>
//                 )}
//               </TabsContent>

//               {/* Hamper Tab */}
//               <TabsContent
//                 value="hamper"
//                 className="m-0 p-1 xs:p-2 sm:p-4 w-full"
//               >
//                 <div className="w-full max-w-full overflow-hidden">
//                   {hamperItems.length === 0 ? (
//                     <div className="text-center py-8 sm:py-12 px-2">
//                       <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
//                       <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
//                         Your hamper is empty
//                       </h3>
//                       <p className="text-sm sm:text-base text-gray-600 mb-6">
//                         Start building your custom hamper by adding products
//                       </p>
//                       <Button
//                         onClick={() => setActiveTab("explore")}
//                         className="bg-purple-600 hover:bg-purple-700"
//                       >
//                         <Grid3X3 className="w-4 h-4 mr-2" />
//                         Explore Products
//                       </Button>
//                     </div>
//                   ) : (
//                     <div className="w-full space-y-3 sm:space-y-4">
//                       {/* Hamper Items */}
//                       <div className="space-y-2 sm:space-y-3">
//                         {hamperItems.map((item) => (
//                           <Card
//                             key={item.productId._id}
//                             className="w-full hamper-card p-2 sm:p-3"
//                           >
//                             <div className="flex items-start gap-2 sm:gap-3 w-full">
//                               <img
//                                 src={
//                                   item.productId.Product_image?.[0] ||
//                                   "/placeholder-product.jpg"
//                                 }
//                                 alt={item.productId.Product_name}
//                                 className="hamper-item-image w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
//                                 onError={(e) => {
//                                   e.currentTarget.src =
//                                     "/placeholder-product.jpg";
//                                 }}
//                               />
//                               <div className="flex-1 min-w-0 w-full">
//                                 <h4 className="font-semibold text-xs xs:text-sm sm:text-base line-clamp-2 mb-1 sm:mb-2">
//                                   {item.productId.Product_name}
//                                 </h4>

//                                 {/* Price and Controls Row */}
//                                 <div className="flex items-center justify-between gap-1 sm:gap-2 w-full">
//                                   <div className="flex flex-col min-w-0">
//                                     <span className="text-sm xs:text-base sm:text-lg font-bold text-green-600">
//                                       ₹{getItemUnitPrice(item).toLocaleString()}
//                                     </span>
//                                     <span className="text-xs text-gray-500">
//                                       each
//                                     </span>
//                                   </div>

//                                   {/* Quantity Controls */}
//                                   <div className="flex items-center gap-1 xs:gap-2 flex-shrink-0">
//                                     <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
//                                       <button
//                                         className="quantity-control-btn w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
//                                         onClick={() =>
//                                           updateItemQuantity(
//                                             item.productId._id,
//                                             item.quantity - 1
//                                           )
//                                         }
//                                         disabled={isProcessing}
//                                       >
//                                         <Minus className="w-3 h-3 xs:w-4 xs:h-4 text-gray-600" />
//                                       </button>
//                                       <span className="quantity-display w-8 xs:w-10 sm:w-12 text-center text-xs xs:text-sm font-semibold bg-white border-x border-gray-300 leading-6 xs:leading-8">
//                                         {item.quantity}
//                                       </span>
//                                       <button
//                                         className="quantity-control-btn w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors"
//                                         onClick={() =>
//                                           updateItemQuantity(
//                                             item.productId._id,
//                                             item.quantity + 1
//                                           )
//                                         }
//                                         disabled={isProcessing}
//                                       >
//                                         <Plus className="w-3 h-3 xs:w-4 xs:h-4 text-gray-600" />
//                                       </button>
//                                     </div>

//                                     <Button
//                                       variant="outline"
//                                       size="sm"
//                                       onClick={() =>
//                                         removeItemFromHamper(item.productId._id)
//                                       }
//                                       disabled={isProcessing}
//                                       className="w-6 h-6 xs:w-8 xs:h-8 sm:w-8 sm:h-8 p-0 text-red-600 hover:bg-red-50 hover:border-red-300 flex-shrink-0"
//                                     >
//                                       <Trash2 className="w-3 h-3 xs:w-4 xs:h-4" />
//                                     </Button>
//                                   </div>
//                                 </div>

//                                 {/* Item Total */}
//                                 <div className="text-right mt-1">
//                                   <div className="text-xs xs:text-sm text-gray-600">
//                                     Subtotal
//                                   </div>
//                                   <div className="text-sm xs:text-base sm:text-lg font-bold text-purple-600">
//                                     ₹{getItemTotal(item).toLocaleString()}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </Card>
//                         ))}
//                       </div>

//                       {/* Hamper Summary */}
//                       <Card className="p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 w-full">
//                         <div className="space-y-2 sm:space-y-3">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm xs:text-base sm:text-lg font-semibold">
//                               Hamper Total ({totalItems} items)
//                             </span>
//                             <span className="text-lg xs:text-xl sm:text-2xl font-bold">
//                               ₹{totalAmount.toLocaleString()}
//                             </span>
//                           </div>

//                           <div className="flex items-center justify-between text-xs xs:text-sm">
//                             <span>Delivery Charge</span>
//                             <span
//                               className={
//                                 DELIVERY_CHARGE > 0
//                                   ? "text-orange-600"
//                                   : "text-green-600 font-semibold"
//                               }
//                             >
//                               {DELIVERY_CHARGE > 0
//                                 ? `₹${DELIVERY_CHARGE}`
//                                 : "FREE"}
//                             </span>
//                           </div>

//                           {freeDeliveryGap > 0 && freeDeliveryGap <= 300 && (
//                             <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
//                               Add ₹{freeDeliveryGap} more for free delivery!
//                             </div>
//                           )}

//                           <div className="border-t pt-2 sm:pt-3 flex items-center justify-between">
//                             <span className="text-base xs:text-lg sm:text-xl font-bold">
//                               Total Amount
//                             </span>
//                             <span className="text-xl xs:text-2xl sm:text-3xl font-bold text-purple-600">
//                               ₹
//                               {(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Actions */}
//                         <div className="mt-4 sm:mt-6 flex flex-col xs:flex-row gap-2 xs:gap-3">
//                           <Button
//                             variant="outline"
//                             onClick={clearHamper}
//                             disabled={isProcessing}
//                             className="flex-1 text-xs xs:text-sm h-8 xs:h-9 sm:h-10"
//                           >
//                             <Trash2 className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
//                             Clear All
//                           </Button>
//                           <Button
//                             onClick={startCheckout}
//                             disabled={!hamperValidation.isValid || isProcessing}
//                             className={`flex-1 text-xs xs:text-sm h-8 xs:h-9 sm:h-10 ${
//                               hamperValidation.isValid
//                                 ? "bg-green-600 hover:bg-green-700"
//                                 : "bg-gray-400 cursor-not-allowed"
//                             }`}
//                           >
//                             {hamperValidation.isValid ? (
//                               <>
//                                 <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
//                                 <span className="hidden xs:inline">
//                                   Proceed to{" "}
//                                 </span>
//                                 Checkout
//                               </>
//                             ) : (
//                               `Add ₹${minimumAmountGap} More`
//                             )}
//                           </Button>
//                         </div>
//                       </Card>

//                       {/* Validation Message */}
//                       <div className="text-center">
//                         <div
//                           className={`text-xs xs:text-sm px-3 xs:px-4 py-2 xs:py-3 rounded-xl font-medium ${
//                             hamperValidation.isValid
//                               ? "bg-green-100 text-green-800 border-2 border-green-200"
//                               : "bg-red-100 text-red-800 border-2 border-red-200"
//                           }`}
//                         >
//                           {hamperValidation.message}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </TabsContent>
//             </div>
//           </Tabs>
//         </div>

//         {/* Checkout Modal - KEEPING SECOND CODE STYLING */}
//         <AnimatePresence>
//           {isCheckingOut && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center overflow-hidden p-2"
//               onClick={() => !checkoutLoading && setIsCheckingOut(false)}
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: "100%", scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: "100%", scale: 0.95 }}
//                 transition={{ type: "spring", damping: 25, stiffness: 500 }}
//                 className="bg-white w-full max-w-[95vw] sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-purple-100 sm:border max-h-[95vh] flex flex-col overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Header */}
//                 <div className="relative flex-shrink-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-3">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h2 className="text-base sm:text-lg font-bold">
//                         Checkout Custom Hamper
//                       </h2>
//                       <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
//                         Total: ₹
//                         {(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex-shrink-0"
//                       onClick={() =>
//                         !checkoutLoading && setIsCheckingOut(false)
//                       }
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Scrollable Content */}
//                 <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
//                   {/* Compact Hamper Summary */}
//                   <div className="bg-purple-50 rounded-lg p-3 mb-4">
//                     <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
//                       <Gift className="w-3 h-3" />
//                       Custom Hamper ({totalItems} items)
//                     </h3>
//                     <div className="space-y-1 text-xs">
//                       <div className="flex justify-between font-medium border-b border-purple-200 pb-1">
//                         <span>Hamper Total</span>
//                         <span>₹{totalAmount.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between text-orange-600">
//                         <span>Delivery</span>
//                         <span>
//                           {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
//                         <span>Total Amount</span>
//                         <span>
//                           ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Form */}
//                   <form onSubmit={handleHamperCheckout} className="space-y-3">
//                     <div className="grid grid-cols-1 gap-3">
//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="fullName"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           Full Name *
//                         </Label>
//                         <Input
//                           id="fullName"
//                           name="fullName"
//                           placeholder="Enter your full name"
//                           value={shippingAddress.fullName}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>

//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="phone"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           Phone Number *
//                         </Label>
//                         <Input
//                           id="phone"
//                           name="phone"
//                           type="tel"
//                           placeholder="Enter your phone number"
//                           value={shippingAddress.phone}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>

//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="address"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           Address *
//                         </Label>
//                         <Input
//                           id="address"
//                           name="address"
//                           placeholder="Enter your address"
//                           value={shippingAddress.address}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-2">
//                         <div className="space-y-1">
//                           <Label
//                             htmlFor="city"
//                             className="text-xs font-medium text-gray-700"
//                           >
//                             City *
//                           </Label>
//                           <Input
//                             id="city"
//                             name="city"
//                             placeholder="City"
//                             value={shippingAddress.city}
//                             onChange={handleInputChange}
//                             required
//                             className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                           />
//                         </div>
//                         <div className="space-y-1">
//                           <Label
//                             htmlFor="state"
//                             className="text-xs font-medium text-gray-700"
//                           >
//                             State *
//                           </Label>
//                           <Input
//                             id="state"
//                             name="state"
//                             placeholder="State"
//                             value={shippingAddress.state}
//                             onChange={handleInputChange}
//                             required
//                             className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                           />
//                         </div>
//                       </div>

//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="pinCode"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           PIN Code *
//                         </Label>
//                         <Input
//                           id="pinCode"
//                           name="pinCode"
//                           placeholder="PIN Code"
//                           value={shippingAddress.pinCode}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>
//                     </div>
//                   </form>
//                 </div>

//                 {/* Fixed Bottom - NEW PAYMENT BUTTONS */}
// <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 space-y-3">
//   {/* Payment Buttons */}
//   <div className="space-y-2">
//     {/* Pay Online Button */}
//     <Button
//       onClick={() => {
//         // Form validation
//         const requiredFields = ["fullName", "address", "city", "state", "pinCode", "phone"];
//         const missingFields = requiredFields.filter(
//           (field) => !shippingAddress[field].trim()
//         );

//         if (missingFields.length > 0) {
//           toast({
//             title: "Missing Information",
//             description: "Please fill in all shipping address fields",
//             variant: "destructive",
//           });
//           return;
//         }

//         handlePaymentSelection('online');
//       }}
//       disabled={checkoutLoading}
//       className="w-full h-10 text-sm rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
//     >
//       {checkoutLoading ? (
//         <div className="flex items-center justify-center gap-2">
//           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//           Processing...
//         </div>
//       ) : (
//         <div className="flex items-center justify-center gap-2">
//           <Lock className="w-4 h-4" />
//           Pay Online - ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//         </div>
//       )}
//     </Button>

//     {/* Cash on Delivery Button */}
//     <Button
//       onClick={() => {
//         // Form validation
//         const requiredFields = ["fullName", "address", "city", "state", "pinCode", "phone"];
//         const missingFields = requiredFields.filter(
//           (field) => !shippingAddress[field].trim()
//         );

//         if (missingFields.length > 0) {
//           toast({
//             title: "Missing Information",
//             description: "Please fill in all shipping address fields",
//             variant: "destructive",
//           });
//           return;
//         }

//         handlePaymentSelection('cod');
//       }}
//       disabled={checkoutLoading}
//       variant="outline"
//       className="w-full h-10 text-sm rounded-full border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
//     >
//       {checkoutLoading ? (
//         <div className="flex items-center justify-center gap-2">
//           <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
//           Processing...
//         </div>
//       ) : (
//         <div className="flex items-center justify-center gap-2">
//           <Truck className="w-4 h-4" />
//           Cash on Delivery - ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//         </div>
//       )}
//     </Button>
//   </div>

//   {/* Payment Security Info */}
//   <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
//     <Lock className="w-3 h-3" />
//     <span>UPI • Cards • Net Banking • COD Available</span>
//   </div>
// </div>

//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Phone Verification Modal - PROFESSIONAL VERSION */}
//         <AnimatePresence>
//           {showPhoneVerification && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
//               onClick={() =>
//                 !isVerifyingPhone && !isVerifyingOTP && resetPhoneVerification()
//               }
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 20, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 20, scale: 0.98 }}
//                 transition={{ type: "spring", damping: 30, stiffness: 400 }}
//                 className="bg-white w-full max-w-sm mx-auto rounded-3xl shadow-2xl border border-gray-100 max-h-[96vh] flex flex-col overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Compact Header */}
//                 <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white px-4 py-5 sm:px-6 sm:py-6">
//                   <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
//                   <div className="relative flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
//                         {!showOTPInput ? (
//                           <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
//                         ) : (
//                           <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <h2 className="text-lg sm:text-xl font-bold mb-0.5 tracking-tight leading-tight">
//                           {!showOTPInput ? "Verify Phone" : "Enter Code"}
//                         </h2>
//                         <p className="text-white/80 text-xs sm:text-sm font-medium">
//                           {!showOTPInput ? "Secure checkout" : "Almost done"}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 flex-shrink-0"
//                       onClick={() =>
//                         !isVerifyingPhone &&
//                         !isVerifyingOTP &&
//                         resetPhoneVerification()
//                       }
//                       disabled={isVerifyingPhone || isVerifyingOTP}
//                     >
//                       <X className="h-4 w-4 sm:h-5 sm:w-5" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Optimized Content */}
//                 <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
//                   {!showOTPInput ? (
//                     // Phone Number Input - Mobile Optimized
//                     <div className="space-y-6">
//                       <div className="text-center">
//                         <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
//                           <Phone className="w-8 h-8 sm:w-9 sm:h-9 text-blue-600" />
//                         </div>
//                         <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
//                           Enter Mobile Number
//                         </h3>
//                         <p className="text-gray-600 text-sm leading-relaxed px-2">
//                           We'll verify your number for secure checkout
//                         </p>
//                       </div>

//                       <form
//                         onSubmit={handlePhoneVerification}
//                         className="space-y-5"
//                       >
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="phoneNumber"
//                             className="text-sm font-semibold text-gray-800 flex items-center gap-2"
//                           >
//                             <Phone className="w-4 h-4 text-blue-600" />
//                             Mobile Number *
//                           </Label>
//                           <div className="relative group">
//                             <Input
//                               id="phoneNumber"
//                               type="tel"
//                               placeholder="Enter 10-digit mobile number"
//                               value={phoneNumber}
//                               onChange={(e) => {
//                                 const value = e.target.value
//                                   .replace(/\D/g, "")
//                                   .slice(0, 10);
//                                 setPhoneNumber(value);
//                               }}
//                               required
//                               className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-2xl transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-300 text-center tracking-wide font-medium"
//                               maxLength={10}
//                             />
//                             {phoneNumber.length === 10 && (
//                               <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                 <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//                                   <CheckCircle className="w-3 h-3 text-white" />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                           {phoneNumber && phoneNumber.length !== 10 && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: "auto" }}
//                               className="bg-red-50 border border-red-200 rounded-xl p-3"
//                             >
//                               <p className="text-red-600 text-sm flex items-center gap-2">
//                                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
//                                 <span>Please enter all 10 digits</span>
//                               </p>
//                             </motion.div>
//                           )}
//                         </div>

//                         <Button
//                           type="submit"
//                           disabled={
//                             isVerifyingPhone || phoneNumber.length !== 10
//                           }
//                           className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {isVerifyingPhone ? (
//                             <div className="flex items-center justify-center gap-2">
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                               <span>Verifying...</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center gap-2">
//                               <Shield className="w-5 h-5" />
//                               <span>Send Verification Code</span>
//                             </div>
//                           )}
//                         </Button>

//                         {/* Trust Badges - Mobile Optimized */}
//                         <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100">
//                           <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                             <span>Secure</span>
//                           </div>
//                           <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                             <span>Fast</span>
//                           </div>
//                           <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                             <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                             <span>Private</span>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   ) : (
//                     // OTP Input - Mobile Optimized
//                     <div className="space-y-6">
//                       <div className="text-center">
//                         <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
//                           <MessageSquare className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600" />
//                         </div>
//                         <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
//                           Enter Verification Code
//                         </h3>
//                         <p className="text-gray-600 mb-3 text-sm leading-relaxed px-2">
//                           4-digit code sent to your mobile
//                         </p>
//                         <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-2xl border border-gray-200 inline-block">
//                           <p className="font-bold text-gray-800 text-base">
//                             {phoneNumber.replace(/(\d{5})(\d{5})/, "$1-$2")}
//                           </p>
//                         </div>
//                       </div>

//                       <form
//                         onSubmit={handleOTPVerification}
//                         className="space-y-5"
//                       >
//                         <div className="space-y-3">
//                           <Label
//                             htmlFor="otp"
//                             className="text-sm font-semibold text-gray-800 flex items-center gap-2 justify-center"
//                           >
//                             <MessageSquare className="w-4 h-4 text-emerald-600" />
//                             Verification Code *
//                           </Label>

//                           {/* Mobile-Optimized OTP Input */}
//                           <div className="flex justify-center gap-2 sm:gap-3">
//                             {[...Array(4)].map((_, index) => (
//                               <input
//                                 key={index}
//                                 ref={(el) => {
//                                   otpInputRefs.current[index] = el;
//                                 }}
//                                 type="text"
//                                 value={otp[index] || ""}
//                                 onChange={(e) => {
//                                   const value = e.target.value
//                                     .replace(/\D/g, "")
//                                     .slice(0, 1);
//                                   const newOtp = otp.split("");
//                                   newOtp[index] = value;
//                                   const updatedOtp = newOtp
//                                     .join("")
//                                     .slice(0, 4);
//                                   setOtp(updatedOtp);

//                                   // Auto-focus next input
//                                   if (
//                                     value &&
//                                     index < 3 &&
//                                     otpInputRefs.current[index + 1]
//                                   ) {
//                                     otpInputRefs.current[index + 1]?.focus();
//                                   }
//                                 }}
//                                 onKeyDown={(e) => {
//                                   if (
//                                     e.key === "Backspace" &&
//                                     !otp[index] &&
//                                     index > 0 &&
//                                     otpInputRefs.current[index - 1]
//                                   ) {
//                                     otpInputRefs.current[index - 1]?.focus();
//                                   }
//                                 }}
//                                 className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 rounded-2xl bg-gray-50 focus:bg-white transition-all duration-200"
//                                 maxLength={1}
//                                 inputMode="numeric"
//                               />
//                             ))}
//                           </div>

//                           {otp && otp.length > 0 && otp.length !== 4 && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: "auto" }}
//                               className="bg-amber-50 border border-amber-200 rounded-xl p-3"
//                             >
//                               <p className="text-amber-700 text-sm flex items-center justify-center gap-2">
//                                 <Clock className="w-4 h-4 flex-shrink-0" />
//                                 <span>{4 - otp.length} more digits needed</span>
//                               </p>
//                             </motion.div>
//                           )}
//                         </div>

//                         <Button
//                           type="submit"
//                           disabled={isVerifyingOTP || otp.length !== 4}
//                           className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
//                         >
//                           {isVerifyingOTP ? (
//                             <div className="flex items-center justify-center gap-2">
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                               <span>Verifying...</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center gap-2">
//                               <CheckCircle className="w-5 h-5" />
//                               <span>Complete Verification</span>
//                             </div>
//                           )}
//                         </Button>

//                         {/* Mobile-Optimized Resend Section */}
//                         <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
//                           <div className="text-center space-y-3">
//                             {otpTimer > 0 ? (
//                               <div className="space-y-2">
//                                 <p className="text-sm text-gray-600">
//                                   Didn't receive the code?
//                                 </p>
//                                 <div className="flex items-center justify-center gap-2">
//                                   <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                                   <span className="text-sm font-semibold text-blue-600">
//                                     Resend in {otpTimer}s
//                                   </span>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="space-y-3">
//                                 <p className="text-sm text-gray-600">
//                                   Didn't receive the code?
//                                 </p>
//                                 <div className="flex flex-col sm:flex-row gap-2 justify-center">
//                                   <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={handleResendOTP}
//                                     disabled={isVerifyingPhone}
//                                     className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-semibold rounded-xl"
//                                   >
//                                     {isVerifyingPhone ? (
//                                       <div className="flex items-center gap-1.5">
//                                         <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//                                         <span>Sending...</span>
//                                       </div>
//                                     ) : (
//                                       <div className="flex items-center gap-1.5">
//                                         <RotateCcw className="w-3 h-3" />
//                                         <span>Resend Code</span>
//                                       </div>
//                                     )}
//                                   </Button>
//                                   <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => {
//                                       setShowOTPInput(false);
//                                       setOtp("");
//                                     }}
//                                     className="text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl"
//                                   >
//                                     <ArrowLeft className="w-3 h-3 mr-1" />
//                                     <span>Change Number</span>
//                                   </Button>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   )}
//                 </div>

//                 {/* Compact Footer */}
//                 <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
//                   <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
//                     <Lock className="w-3 h-3" />
//                     <span>Secure & encrypted</span>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export default CustomHamperBuilder;

// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../components/AuthContext";
// import { useToast } from "../components/ui/use-toast";
// import axiosInstance from "../utils/axiosConfig";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { Card, CardContent } from "../components/ui/card";

// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import { Badge } from "../components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Plus,
//   Minus,
//   X,
//   ShoppingCart,
//   Package,
//   Gift,
//   Filter,
//   Search,
//   RefreshCw,
//   AlertCircle,
//   Trash2,
//   Eye,
//   ShoppingBag,
//   Truck,
//   Grid3X3,
//   List,
//   ChevronUp,
//   ChevronDown,
//   Heart,
//   Phone,
//   Shield,
//   Clock,
//   CheckCircle,
//   ArrowRight,
//   MessageSquare,
//   RotateCcw,
//   ArrowLeft,
//   Lock,
//   History, // NEW: Added for past orders icon
// } from "lucide-react";

// // Enhanced TypeScript declaration
// interface CashfreeInstance {
//   checkout: (options: {
//     paymentSessionId: string;
//     redirectTarget?: string;
//   }) => Promise<{
//     error?: { message: string };
//     redirect?: boolean;
//     paymentDetails?: any;
//   }>;
// }

// declare global {
//   interface Window {
//     Cashfree: (config: { mode: string }) => CashfreeInstance;
//   }
// }

// // NEW: Interface for past hamper orders
// interface PastHamperOrder {
//   _id: string;
//   createdAt: string;
//   status: string;
//   paymentStatus: string;
//   totalAmount: number;
//   items: any[];
//   paymentMethod: string;
// }

// export {};

// const CustomHamperBuilder = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const justAddedItem = useRef(false);

//   // Core hamper state
//   const [hamperItems, setHamperItems] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [totalItems, setTotalItems] = useState(0);
//   const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   // Products state
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Filter and search state
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("all");
//   const [priceRange, setPriceRange] = useState({ min: "", max: "" });
//   const [sortBy, setSortBy] = useState("name");

//   // UI state - UPDATED: Changed from "explore" | "hamper" to include "orders"
//   const [activeTab, setActiveTab] = useState<"explore" | "hamper">("explore");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [checkoutLoading, setCheckoutLoading] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // NEW: Past hamper orders state
//   // const [pastHamperOrders, setPastHamperOrders] = useState<PastHamperOrder[]>([]);
//   // const [loadingOrders, setLoadingOrders] = useState(false);

//   // Phone verification state - RESTORED FROM FIRST CODE
//   const [showPhoneVerification, setShowPhoneVerification] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
//   const [showOTPInput, setShowOTPInput] = useState(false);
//   const [otp, setOtp] = useState("");
//   const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
//   const [phoneVerified, setPhoneVerified] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [canResendOTP, setCanResendOTP] = useState(false);
//   const [verificationId, setVerificationId] = useState("");
//   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
//   const [showPaymentModal, setShowPaymentModal] = useState(false);

//   // Checkout form
//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     phone: "",
//   });

//   // Constants
//   const MINIMUM_HAMPER_AMOUNT = 200;
//   const DELIVERY_CHARGE = totalAmount >= 500 ? 0 : 80;
//   const minimumAmountGap = Math.max(0, MINIMUM_HAMPER_AMOUNT - totalAmount);
//   const freeDeliveryGap = Math.max(0, 500 - totalAmount);

//   // NEW: Function to fetch past hamper orders
//   // const fetchPastHamperOrders = useCallback(async () => {
//   //   if (!user?._id) return;

//   //   setLoadingOrders(true);
//   //   try {
//   //     const response = await axiosInstance.get(`/cashfree/my-orders/${user._id}?isCustomHamper=true`);
//   //     if (response.data.success) {
//   //       // Filter only custom hamper orders
//   //       const hamperOrders = response.data.orders.filter(order => order.isCustomHamper === true);
//   //       setPastHamperOrders(hamperOrders);
//   //       console.log('📦 Loaded past hamper orders:', hamperOrders.length);
//   //     }
//   //   } catch (error) {
//   //     console.error('❌ Failed to fetch past hamper orders:', error);
//   //     toast({
//   //       title: "Unable to load order history",
//   //       description: "Failed to fetch past hamper orders",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setLoadingOrders(false);
//   //   }
//   // }, [user?._id, toast]);

//   // // NEW: Load past hamper orders on component mount
//   // useEffect(() => {
//   //   if (user) {
//   //     fetchPastHamperOrders();
//   //   }
//   // }, [user, fetchPastHamperOrders]);

//   // OTP Timer effect - RESTORED FROM FIRST CODE
//   useEffect(() => {
//     let interval = null;
//     if (otpTimer > 0) {
//       interval = setInterval(() => {
//         setOtpTimer((timer) => timer - 1);
//       }, 1000);
//     } else if (otpTimer === 0 && showOTPInput) {
//       setCanResendOTP(true);
//     }
//     return () => clearInterval(interval);
//   }, [otpTimer, showOTPInput]);

//   // Detect mobile screen size
//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.innerWidth <= 768);
//     checkMobile();
//     window.addEventListener("resize", checkMobile);
//     return () => window.removeEventListener("resize", checkMobile);
//   }, []);

//   // Auto-switch to hamper tab when items are added (mobile only)
//   useEffect(() => {
//     if (
//       isMobile &&
//       hamperItems.length > 0 &&
//       activeTab === "explore" &&
//       justAddedItem.current
//     ) {
//       setTimeout(() => {
//         setActiveTab("hamper");
//         justAddedItem.current = false;
//       }, 800);
//     }
//   }, [hamperItems.length, isMobile, activeTab]);

//   // Fetch hamper-eligible products using backend filtering
//   const fetchHamperProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log("🎁 Fetching hamper-eligible products from backend...");

//       const response = await axiosInstance.get(
//         "api/getproducts?type=hamper&limit=100"
//       );

//       console.log("📦 Hamper products response:", response.data);

//       if (response.data && response.data.product) {
//         const hamperProducts = response.data.product;
//         setProducts(hamperProducts);
//         setFilteredProducts(hamperProducts);

//         const uniqueCategories = [
//           ...new Set(
//             hamperProducts
//               .map(
//                 (p) =>
//                   p.Product_category_name ||
//                   p.Product_category?.category ||
//                   "Uncategorized"
//               )
//               .filter(Boolean)
//           ),
//         ];
//         setCategories(uniqueCategories);

//         console.log(
//           `✅ Loaded ${hamperProducts.length} hamper-eligible products`
//         );

//         if (hamperProducts.length === 0) {
//           toast({
//             title: "No Hamper Products",
//             description:
//               "No products are currently available for custom hampers.",
//             variant: "default",
//           });
//         }
//       } else {
//         setProducts([]);
//         setFilteredProducts([]);
//         setCategories([]);
//       }
//     } catch (error) {
//       console.error("❌ Error fetching hamper products:", error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         "Failed to load hamper products";
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]);

//   // Fetch user's hamper from database
//   const fetchUserHamper = useCallback(async () => {
//     if (!user) return;

//     try {
//       const response = await axiosInstance.get("/hamper");
//       const data = response.data;

//       if (data.hamper && data.hamper.length > 0) {
//         setHamperItems(data.hamper);
//         setTotalAmount(data.totalAmount || 0);
//         setTotalItems(data.totalItems || 0);
//         console.log("Hamper loaded from database:", data);
//       } else {
//         setHamperItems([]);
//         setTotalAmount(0);
//         setTotalItems(0);
//       }
//     } catch (error) {
//       console.error("Error fetching hamper from database:", error);
//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);
//     }
//   }, [user]);

//   // Initialize component
//   useEffect(() => {
//     fetchHamperProducts();
//     fetchUserHamper();
//   }, [fetchHamperProducts, fetchUserHamper]);

//   // Filter and search logic
//   useEffect(() => {
//     let filtered = [...products];

//     if (searchQuery) {
//       filtered = filtered.filter((product) =>
//         product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Product_category_name || product.Product_category) ===
//           selectedCategory
//       );
//     }

//     if (priceRange.min) {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Hamper_price || product.Product_price) >=
//           parseFloat(priceRange.min)
//       );
//     }

//     if (priceRange.max) {
//       filtered = filtered.filter(
//         (product) =>
//           (product.Hamper_price || product.Product_price) <=
//           parseFloat(priceRange.max)
//       );
//     }

//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "price-low":
//           return (
//             (a.Hamper_price || a.Product_price) -
//             (b.Hamper_price || b.Product_price)
//           );
//         case "price-high":
//           return (
//             (b.Hamper_price || b.Product_price) -
//             (a.Hamper_price || a.Product_price)
//           );
//         case "name":
//         default:
//           return a.Product_name.localeCompare(b.Product_name);
//       }
//     });

//     setFilteredProducts(filtered);
//   }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

//   // Hamper validation
//   const hamperValidation = useMemo(() => {
//     if (totalAmount < MINIMUM_HAMPER_AMOUNT) {
//       return {
//         isValid: false,
//         message: `Add ₹${minimumAmountGap} more to reach minimum hamper value of ₹${MINIMUM_HAMPER_AMOUNT}`,
//       };
//     }
//     return { isValid: true, message: "Hamper is ready for checkout!" };
//   }, [totalAmount, minimumAmountGap]);

//   // Add item to hamper
//   const addItemToHamper = async (product) => {
//     try {
//       setIsProcessing(true);
//       justAddedItem.current = true;
//       console.log("🎁 Adding product to hamper:", product.Product_name);

//       const response = await axiosInstance.post("/hamper/add", {
//         productId: product._id,
//         quantity: 1,
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         toast({
//           title: "Added to Hamper",
//           description: `${product.Product_name} added to your custom hamper`,
//         });
//       }
//     } catch (error) {
//       console.error("Error adding to hamper:", error);
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message || "Failed to add item to hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Update item quantity in hamper
//   const updateItemQuantity = async (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       return removeItemFromHamper(productId);
//     }

//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.put(`/hamper/update/${productId}`, {
//         quantity: newQuantity,
//       });

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);
//       }
//     } catch (error) {
//       console.error("Error updating hamper quantity:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update quantity",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Remove item from hamper
//   const removeItemFromHamper = async (productId) => {
//     try {
//       setIsProcessing(true);
//       const response = await axiosInstance.delete(
//         `/hamper/remove/${productId}`
//       );

//       if (response.data) {
//         setHamperItems(response.data.hamper);
//         setTotalAmount(response.data.totalAmount);
//         setTotalItems(response.data.totalItems);

//         toast({
//           title: "Item Removed",
//           description: "Item removed from hamper",
//           duration: 2000,
//         });
//       }
//     } catch (error) {
//       console.error("Error removing from hamper:", error);
//       toast({
//         title: "Error",
//         description: "Failed to remove item",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Clear entire hamper
//   const clearHamper = async () => {
//     try {
//       setIsProcessing(true);
//       await axiosInstance.delete("/hamper/clear");

//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);

//       toast({
//         title: "Hamper Cleared",
//         description: "All items removed from hamper",
//         duration: 2000,
//       });
//     } catch (error) {
//       console.error("Error clearing hamper:", error);
//       toast({
//         title: "Error",
//         description: "Failed to clear hamper",
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Handle tab change
//   const handleTabChange = (newTab) => {
//     if (newTab === "explore") justAddedItem.current = false;
//     setActiveTab(newTab);
//   };

//   // Handle checkout form input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // Phone verification functions - RESTORED FROM FIRST CODE
//   const handlePhoneVerification = async (e) => {
//     e.preventDefault();
//     if (!phoneNumber || phoneNumber.length !== 10) {
//       toast({
//         title: "Invalid Phone Number",
//         description: "Please enter a valid 10-digit phone number",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsVerifyingPhone(true);
//       // Check if phone number exists in database with correct endpoint
//       const checkResponse = await axiosInstance.post(
//         "/api/verify/check-phone",
//         {
//           phoneNumber: phoneNumber,
//         }
//       );

//       if (checkResponse.data.success && checkResponse.data.isVerified) {
//         // Phone number exists and is verified, no OTP needed
//         setPhoneVerified(true);
//         setShippingAddress((prev) => ({ ...prev, phone: phoneNumber }));
//         setShowPhoneVerification(false);
//         setIsCheckingOut(true);

//         toast({
//           title: "Phone Verified! 📱",
//           description:
//             "Phone number found in our records. Proceeding to checkout.",
//           variant: "default",
//         });
//       } else {
//         // Phone number doesn't exist or not verified, send OTP
//         const otpResponse = await axiosInstance.post("/api/verify/send", {
//           countryCode: "91",
//           mobileNumber: phoneNumber.replace(/\D/g, ""),
//         });

//         if (otpResponse.data.success) {
//           setVerificationId(otpResponse.data.verificationId); // Store verification ID
//           setShowOTPInput(true);
//           setOtpTimer(otpResponse.data.timeout || 60);
//           setCanResendOTP(false);

//           toast({
//             title: "OTP Sent! 📲",
//             description: `Verification code sent to ${phoneNumber}`,
//             variant: "default",
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Phone verification error:", error);
//       toast({
//         title: "Verification Failed",
//         description:
//           error.response?.data?.message || "Failed to verify phone number",
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifyingPhone(false);
//     }
//   };

//   // OTP verification - RESTORED FROM FIRST CODE
//   const handleOTPVerification = async (e) => {
//     e.preventDefault();
//     if (!otp || otp.length !== 4) {
//       toast({
//         title: "Invalid OTP",
//         description: "Please enter a valid 4-digit OTP",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       setIsVerifyingOTP(true);
//       const response = await axiosInstance.post("/api/verify/verify", {
//         countryCode: "91",
//         mobileNumber: phoneNumber.replace(/\D/g, ""),
//         verificationId: verificationId, // Use stored verification ID
//         code: otp,
//       });

//       if (response.data.success) {
//         setPhoneVerified(true);
//         setShippingAddress((prev) => ({ ...prev, phone: phoneNumber }));
//         setShowPhoneVerification(false);
//         setShowOTPInput(false);
//         setIsCheckingOut(true);

//         toast({
//           title: "Phone Verified Successfully! ✅",
//           description:
//             "Your phone number has been verified. Proceeding to checkout.",
//           variant: "default",
//         });
//       }
//     } catch (error) {
//       console.error("OTP verification error:", error);
//       toast({
//         title: "Invalid OTP",
//         description:
//           error.response?.data?.message || "Please enter the correct OTP",
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifyingOTP(false);
//     }
//   };

//   // Resend OTP - RESTORED FROM FIRST CODE
//   const handleResendOTP = async () => {
//     try {
//       setIsVerifyingPhone(true);
//       const response = await axiosInstance.post("/api/verify/send", {
//         countryCode: "91",
//         mobileNumber: phoneNumber.replace(/\D/g, ""),
//       });

//       if (response.data.success) {
//         setVerificationId(response.data.verificationId); // Update verification ID
//         setOtpTimer(response.data.timeout || 60);
//         setCanResendOTP(false);
//         setOtp("");

//         toast({
//           title: "OTP Resent! 📲",
//           description: `New verification code sent to ${phoneNumber}`,
//           variant: "default",
//         });
//       }
//     } catch (error) {
//       console.error("Resend OTP error:", error);
//       toast({
//         title: "Failed to Resend",
//         description: error.response?.data?.message || "Failed to resend OTP",
//         variant: "destructive",
//       });
//     } finally {
//       setIsVerifyingPhone(false);
//     }
//   };

//   // Reset phone verification state - RESTORED FROM FIRST CODE
//   const resetPhoneVerification = () => {
//     setShowPhoneVerification(false);
//     setShowOTPInput(false);
//     setPhoneNumber("");
//     setOtp("");
//     setPhoneVerified(false);
//     setOtpTimer(0);
//     setCanResendOTP(false);
//   };

//   // Start checkout process - MODIFIED TO USE PHONE VERIFICATION
//   const startCheckout = () => {
//     if (!user) {
//       toast({
//         title: "Please login",
//         description: "You need to be logged in to checkout",
//         variant: "destructive",
//       });
//       navigate("/login");
//       return;
//     }

//     if (!hamperValidation.isValid) {
//       toast({
//         title: "Cannot Proceed",
//         description: hamperValidation.message,
//         variant: "destructive",
//       });
//       return;
//     }

//     // Start with phone verification
//     setShowPhoneVerification(true);
//   };

//   // Updated handlePaymentSelection function
// const handlePaymentSelection = async (paymentMethod: string) => {
//   try {
//     console.log('🎯 Payment method selected:', paymentMethod);

//     // Form validation
//     const requiredFields = ["fullName", "address", "city", "state", "pinCode", "phone"];
//     const missingFields = requiredFields.filter(
//       (field) => !shippingAddress[field].trim()
//     );

//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Calculate totals
//     const itemsTotal = hamperItems.reduce((total, item) => {
//       return total + (item.productId.Hamper_price || item.productId.Product_price) * item.quantity;
//     }, 0);

//     const deliveryCharge = 80;
//     const totalAmount = itemsTotal + deliveryCharge;

//     const orderData = {
//       userId: user._id,
//       items: hamperItems.map(item => ({
//         productId: item.productId._id,
//         quantity: item.quantity,
//         price: item.productId.Hamper_price || item.productId.Product_price,
//         name: item.productId.Product_name,
//         image: item.productId.Product_image?.[0] || null
//       })),
//       shippingAddress: {
//         street: shippingAddress.address,
//         city: shippingAddress.city,
//         state: shippingAddress.state,
//         pincode: shippingAddress.pinCode,
//         country: 'India'
//       },
//       itemsTotal: itemsTotal,
//       deliveryCharge: deliveryCharge,
//       totalAmount: totalAmount,
//       paymentMethod: paymentMethod,
//       Contact_number: shippingAddress.phone,
//       user_email: user.email
//     };

//     console.log('📤 Sending order data:', orderData);
//     setCheckoutLoading(true);

//     const response = await axiosInstance.post('/cashfree/create', orderData);

//     if (response.data.success) {
//       if (paymentMethod === 'cod') {
//         // ✅ Clear BOTH hamper cart AND regular cart after successful COD order
//         await Promise.all([
//           axiosInstance.delete("/hamper/clear")
//         ]);

//         // Clear local state
//         setHamperItems([]);
//         setTotalAmount(0);
//         setTotalItems(0);

//         toast({
//           title: "Order Placed Successfully! 🎉",
//           description: "Your custom hamper order has been placed. Check 'My Orders' to track it."
//         });

//         setIsCheckingOut(false);
//         // ✅ Navigate to orders page instead of staying in hamper builder
//         navigate('/orders');

//       } else {
//         // Online payment flow
//         if (!window.Cashfree) {
//           toast({
//             title: "Payment Error",
//             description: "Payment system is loading. Please try again in a moment.",
//             variant: "destructive"
//           });
//           setCheckoutLoading(false);
//           return;
//         }

//         const cashfree = window.Cashfree({ mode: "sandbox" });
//         const { cashfreeSession, orderId, internalOrderId } = response.data;

//         sessionStorage.setItem("orderId", orderId);
//         sessionStorage.setItem("internalOrderId", internalOrderId);
//         sessionStorage.setItem("paymentMethod", paymentMethod);

//         console.log('🔑 Payment session ID:', cashfreeSession.payment_session_id);

//         cashfree.checkout({
//           paymentSessionId: cashfreeSession.payment_session_id,
//           redirectTarget: "_self"
//         }).then(function(result: any) {
//           if (result.error) {
//             toast({
//               title: "Payment Failed",
//               description: result.error.message,
//               variant: "destructive"
//             });
//           }

//           if (result.redirect) {

//             Promise.all([
//               axiosInstance.delete("/hamper/clear"),
//             ]).then(() => {
//               setHamperItems([]);
//               setTotalAmount(0);
//               setTotalItems(0);
//             });

//             toast({
//               title: "Payment Successful! 🎉",
//               description: "Your payment has been processed."
//             });
//             setIsCheckingOut(false);
//             // Payment callback will handle the rest
//             navigate('/payment/callback');
//           }

//         }).catch(function(error: any) {
//           console.error('❌ Cashfree checkout error:', error);
//           toast({
//             title: "Payment Error",
//             description: "Something went wrong with the payment. Please try again.",
//             variant: "destructive"
//           });
//         });
//       }
//     }
//   } catch (error: any) {
//     console.error('❌ Payment selection error:', error);
//     toast({
//       title: "Payment Error",
//       description: error.response?.data?.message || "Failed to process payment. Please try again.",
//       variant: "destructive"
//     });
//   } finally {
//     setCheckoutLoading(false);
//   }
// };

//   // Handle hamper checkout - MODIFIED TO USE PHONE VERIFICATION
//   const handleHamperCheckout = async (e) => {
//     e.preventDefault();

//     if (!phoneVerified) {
//       toast({
//         title: "Phone Not Verified",
//         description: "Please verify your phone number first",
//         variant: "destructive",
//       });
//       return;
//     }

//     const requiredFields = ["fullName", "address", "city", "state", "pinCode"];
//     const missingFields = requiredFields.filter(
//       (field) => !shippingAddress[field].trim()
//     );

//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     setCheckoutLoading(true);

//     try {
//       const orderItems = hamperItems.map((item) => ({
//         product: item.productId._id,
//         name: item.productId.Product_name,
//         quantity: item.quantity,
//         price: item.productId.Hamper_price || item.productId.Product_price,
//         image: item.productId.Product_image?.[0],
//         isHamperItem: true,
//       }));

//       const response = await axiosInstance.post("/orders/create", {
//         items: orderItems,
//         shippingAddress,
//         paymentMethod: "cod",
//         totalAmount: totalAmount + DELIVERY_CHARGE,
//         isCustomHamper: true,
//       });

//       await axiosInstance.delete("/hamper/clear");

//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);

//       toast({
//         title: "Custom Hamper Ordered Successfully!",
//         description:
//           "Your custom hamper is being prepared. Track your order in your profile.",
//         variant: "default",
//       });

//       navigate("/profile");
//     } catch (err) {
//       console.error("Hamper order creation error:", err);
//       toast({
//         title: "Error",
//         description:
//           err?.response?.data?.message ||
//           "Failed to place hamper order. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setCheckoutLoading(false);
//       setIsCheckingOut(false);
//       resetPhoneVerification();
//     }
//   };

//   const handlePaymentVerification = async (
//     orderId: string,
//     paymentDetails: any,
//     tempOrder: any
//   ) => {
//     try {
//       console.log("🔍 Verifying payment:", { orderId, paymentDetails });

//       // Add loading state for better UX
//       setIsProcessingPayment(true); // Add this state if you don't have it

//       const verifyResponse = await axiosInstance.post("/cashfree/verify", {
//         orderId: orderId,
//         paymentStatus: paymentDetails?.paymentStatus || "SUCCESS",
//         paymentId: paymentDetails?.paymentId,
//         tempOrder: tempOrder,
//       });

//       console.log("✅ Payment verification response:", verifyResponse.data);

//       if (verifyResponse.data.success) {
//         toast({
//           title: "Payment Successful!",
//           description: `Your order has been placed successfully. Order ID: #${verifyResponse.data.order._id
//             .toString()
//             .slice(-6)
//             .toUpperCase()}`,
//         });

//         // Clear hamper items after successful payment
//         setHamperItems([]);

//         // Navigate to the specific order page
//         navigate(`/orders/${verifyResponse.data.order._id}`);
//       } else {
//         console.error("❌ Payment verification failed:", verifyResponse.data);

//         toast({
//           title: "Payment Verification Failed",
//           description:
//             verifyResponse.data.message ||
//             "There was an issue verifying your payment. Please contact support if amount was debited.",
//           variant: "destructive",
//         });
//       }
//     } catch (error: any) {
//       console.error("❌ Payment verification error:", error);

//       // Handle different types of errors
//       let errorMessage = "Failed to verify payment. Please contact support.";

//       if (error.response) {
//         // Server responded with error
//         errorMessage = error.response.data?.message || errorMessage;

//         if (error.response.status === 400) {
//           errorMessage = "Invalid payment data. Please try again.";
//         } else if (error.response.status === 500) {
//           errorMessage =
//             "Server error during verification. Please contact support if amount was debited.";
//         }
//       } else if (error.request) {
//         // Network error
//         errorMessage =
//           "Network error. Please check your connection and try again.";
//       }

//       toast({
//         title: "Verification Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setIsProcessingPayment(false); // Reset loading state
//     }
//   };

//   // Helper functions
//   const getItemTotal = (item) => {
//     const price = item.productId.Hamper_price || item.productId.Product_price;
//     return price * item.quantity;
//   };

//   const getItemUnitPrice = (item) => {
//     return item.productId.Hamper_price || item.productId.Product_price;
//   };

//   const isProductInHamper = (productId) => {
//     return hamperItems.some((item) => item.productId._id === productId);
//   };

//   const getProductQuantityInHamper = (productId) => {
//     const item = hamperItems.find((item) => item.productId._id === productId);
//     return item ? item.quantity : 0;
//   };

//   // NEW: Format date for past orders
//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   // NEW: Get status color and icon
//   const getStatusConfig = (status: string) => {
//     const configs = {
//       pending: { color: 'bg-amber-500', icon: Clock, label: 'Pending' },
//       processing: { color: 'bg-blue-500', icon: Package, label: 'Processing' },
//       shipped: { color: 'bg-purple-500', icon: Truck, label: 'Shipped' },
//       delivered: { color: 'bg-green-500', icon: CheckCircle, label: 'Delivered' },
//       cancelled: { color: 'bg-red-500', icon: X, label: 'Cancelled' },
//       failed: { color: 'bg-red-500', icon: X, label: 'Failed' }
//     };
//     return configs[status] || configs.pending;
//   };

//   // Compact Mobile Filters Component - KEEPING SECOND CODE STYLING
//   const MobileFilters = () => (
//     <motion.div
//       initial={false}
//       animate={{ height: showFilters ? "auto" : 0 }}
//       transition={{ duration: 0.3 }}
//       className="overflow-hidden bg-white border-b border-gray-200"
//     >
//       <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
//           <Input
//             type="text"
//             placeholder="Search..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-7 sm:pl-10 h-7 sm:h-9 text-[11px] xs:text-xs sm:text-sm"
//           />
//         </div>

//         {/* Category and Sort in a row */}
//         <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//           <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//             <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//               <SelectValue placeholder="Category" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all" className="text-[10px] xs:text-xs">
//                 All
//               </SelectItem>
//               {categories.map((category) => (
//                 <SelectItem
//                   key={category}
//                   value={category}
//                   className="text-[10px] xs:text-xs"
//                 >
//                   {category.length > 15
//                     ? category.substring(0, 15) + "..."
//                     : category}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
//               <SelectValue placeholder="Sort" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="name" className="text-[10px] xs:text-xs">
//                 Name
//               </SelectItem>
//               <SelectItem value="price-low" className="text-[10px] xs:text-xs">
//                 Price ↑
//               </SelectItem>
//               <SelectItem value="price-high" className="text-[10px] xs:text-xs">
//                 Price ↓
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Price Range */}
//         <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
//           <Input
//             type="number"
//             placeholder="Min ₹"
//             value={priceRange.min}
//             onChange={(e) =>
//               setPriceRange((prev) => ({ ...prev, min: e.target.value }))
//             }
//             className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//           />
//           <Input
//             type="number"
//             placeholder="Max ₹"
//             value={priceRange.max}
//             onChange={(e) =>
//               setPriceRange((prev) => ({ ...prev, max: e.target.value }))
//             }
//             className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
//           />
//         </div>
//       </div>
//     </motion.div>
//   );

//   // Product Card Component - KEEPING SECOND CODE STYLING
//   // Enhanced Product Card Component - 320px Optimized
// const ProductCard = ({ product }) => {
//   const hamperPrice = product.Hamper_price || product.Product_price;
//   const regularPrice = product.Product_price;
//   const discount =
//     regularPrice > hamperPrice
//       ? ((regularPrice - hamperPrice) / regularPrice) * 100
//       : 0;

//   const inHamper = isProductInHamper(product._id);
//   const hamperQuantity = getProductQuantityInHamper(product._id);

//   // Compact Quantity Control
//   const QuantityControl = () => (
//     <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
//       <button
//         className="w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50"
//         onClick={() => updateItemQuantity(product._id, hamperQuantity - 1)}
//         disabled={isProcessing}
//         aria-label="Decrease quantity"
//       >
//         <Minus className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-gray-600" />
//       </button>
//       <span className="w-5 xs:w-6 text-center text-[10px] xs:text-xs font-semibold bg-white leading-5 xs:leading-6">
//         {hamperQuantity}
//       </span>
//       <button
//         className="w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50"
//         onClick={() => updateItemQuantity(product._id, hamperQuantity + 1)}
//         disabled={isProcessing}
//         aria-label="Increase quantity"
//       >
//         <Plus className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-gray-600" />
//       </button>
//     </div>
//   );

//   return (
//     <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/90 backdrop-blur-sm overflow-hidden h-full">
//       <CardContent className="p-0 flex flex-col h-full">
//         {/* Image Container - 320px Optimized */}
//         <div className="relative overflow-hidden aspect-square">
//           <img
//             src={product.Product_image?.[0] || "/placeholder-product.jpg"}
//             alt={product.Product_name}
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//             onError={(e) => {
//               e.currentTarget.src = "/placeholder-product.jpg";
//             }}
//           />

//           {/* Enhanced Badges */}
//           <div className="absolute top-1 left-1 right-1 flex justify-between items-start gap-1">
//             {discount > 0 && (
//               <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[8px] xs:text-[10px] px-1 py-0.5 leading-tight shadow-sm">
//                 {discount.toFixed(0)}% OFF
//               </Badge>
//             )}
//             {inHamper && (
//               <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[8px] xs:text-[10px] px-1 py-0.5 leading-tight shadow-sm">
//                 <CheckCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5 mr-0.5" />
//                 <span className="hidden xs:inline">In Hamper</span>
//                 <span className="xs:hidden">✓</span>
//               </Badge>
//             )}
//           </div>

//           {/* Hover Overlay */}
//           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
//         </div>

//         {/* Content - 320px Optimized */}
//         <div className="p-1.5 xs:p-2 sm:p-3 space-y-1.5 flex-1 flex flex-col">
//           {/* Product Name */}
//           <h3 className="font-semibold text-[10px] xs:text-xs sm:text-sm line-clamp-2 min-h-[2rem] xs:min-h-[2.5rem] leading-tight text-gray-900">
//             {product.Product_name}
//           </h3>

//           {/* Price Section */}
//           <div className="space-y-1 flex-1">
//             <div className="flex items-start justify-between gap-1">
//               <div className="flex flex-col min-w-0">
//                 <span className="text-xs xs:text-sm sm:text-base font-bold text-green-600">
//                   ₹{hamperPrice.toLocaleString()}
//                 </span>
//                 {discount > 0 && (
//                   <span className="text-[8px] xs:text-xs text-gray-500 line-through">
//                     ₹{regularPrice.toLocaleString()}
//                   </span>
//                 )}
//               </div>

//               {/* Add/Quantity Controls */}
//               <div className="flex-shrink-0">
//                 {inHamper ? (
//                   <QuantityControl />
//                 ) : (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => addItemToHamper(product)}
//                     className="hover:bg-green-50 hover:border-green-500 hover:text-green-600 text-[8px] xs:text-xs px-1.5 py-0.5 h-6 xs:h-7 border-purple-200 transition-all duration-200 group/btn"
//                     disabled={isProcessing}
//                   >
//                     <Plus className="h-2 w-2 xs:h-2.5 xs:w-2.5 mr-0.5 transition-transform group-hover/btn:scale-110" />
//                     <span className="hidden xs:inline">Add</span>
//                     <span className="xs:hidden">+</span>
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Category Badge */}
//           <Badge
//             variant="secondary"
//             className="text-[8px] xs:text-xs w-full justify-center truncate mt-auto bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
//           >
//             {product.Product_category_name || product.Product_category || "Uncategorized"}
//           </Badge>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

//   // Loading state - KEEPING SECOND CODE STYLING
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
//           <p className="text-lg font-medium">Loading hamper products...</p>
//         </motion.div>
//       </div>
//     );
//   }

//   // Error state - KEEPING SECOND CODE STYLING
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center"
//         >
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2">
//             Unable to Load Products
//           </h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Button onClick={fetchHamperProducts}>
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Try Again
//           </Button>
//         </motion.div>
//       </div>
//     );
//   }

//   // Main render - KEEPING SECOND CODE STYLING BUT ADDING PHONE VERIFICATION MODAL
//   return (
//     <>
//       <style>{`
//   body, html {
//     overflow-x: hidden !important;
//     max-width: 100vw !important;
//   }
//   * {
//     box-sizing: border-box;
//   }

//   /* Enhanced 320px support */
//   @media (max-width: 320px) {
//     .container {
//       padding-left: 2px;
//       padding-right: 2px;
//     }
//     .hamper-card {
//       padding: 6px !important;
//     }
//     .hamper-item-image {
//       width: 48px !important;
//       height: 48px !important;
//     }
//     .quantity-control-btn {
//       width: 20px !important;
//       height: 20px !important;
//     }
//     .quantity-display {
//       width: 28px !important;
//       font-size: 10px !important;
//     }
//     /* Product cards ultra-compact */
//     .product-card-content {
//       padding: 4px !important;
//     }
//     .product-card-image {
//       min-height: 120px !important;
//     }
//   }

//   /* Add xs breakpoint support */
//   @media (min-width: 360px) {
//     .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
//     .xs\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
//     .xs\\:p-2 { padding: 0.5rem; }
//     .xs\\:px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
//     .xs\\:gap-2 { gap: 0.5rem; }
//     .xs\\:w-12 { width: 3rem; }
//     .xs\\:h-12 { height: 3rem; }
//     .xs\\:leading-6 { line-height: 1.5rem; }
//   }

//   .xs\\:hidden {
//     @media (max-width: 359px) {
//       display: none;
//     }
//   }

//   /* Line clamp utilities */
//   .line-clamp-2 {
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     overflow: hidden;
//   }
// `}</style>

//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-6 px-1 overflow-x-hidden">
//         <div className="container mx-auto max-w-6xl px-1">
//           {/* Header */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-2 sm:mb-4 px-1"
//           >
//             <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
//               Custom <span className="text-purple-600">Hamper Builder</span>
//             </h1>
//             <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-tight px-2">
//               Create your perfect gift hamper • Min ₹{MINIMUM_HAMPER_AMOUNT}
//             </p>
//           </motion.div>

//           {/* Hamper Status Banner */}
//           {totalItems > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md sm:rounded-lg p-1.5 sm:p-3 mb-2 sm:mb-4 mx-1"
//             >
//               <div className="flex items-center justify-between text-[10px] xs:text-xs sm:text-sm">
//                 <div className="flex items-center gap-1 min-w-0">
//                   <Gift className="w-3 h-3 flex-shrink-0" />
//                   <span className="font-semibold truncate">
//                     Hamper: {totalItems} • ₹{totalAmount.toLocaleString()}
//                   </span>
//                 </div>
//                 <Badge className="bg-white/20 text-white text-[9px] xs:text-xs px-1 py-0.5 ml-1 flex-shrink-0">
//                   {hamperValidation.isValid ? "Ready!" : `₹${minimumAmountGap}`}
//                 </Badge>
//               </div>
//             </motion.div>
//           )}

//           {/* Tab Interface */}
//           <Tabs
//             value={activeTab}
//             onValueChange={handleTabChange}
//             className="w-full mx-1"
//           >
//             {/* Tab Navigation */}
//             <div className="bg-white rounded-t-md sm:rounded-t-xl shadow-lg border border-b-0 border-purple-100">
//               <TabsList className="w-full h-10 sm:h-12 bg-transparent p-0.5 sm:p-1">
//                 <TabsTrigger
//                   value="explore"
//                   className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//                 >
//                   <Grid3X3 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//                   <span className="hidden xs:inline">Explore</span>
//                   <span className="xs:hidden">Shop</span>
//                   <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-purple-100 text-purple-700 px-1 py-0">
//                     {filteredProducts.length}
//                   </Badge>
//                 </TabsTrigger>

//                 <TabsTrigger
//                   value="hamper"
//                   className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
//                 >
//                   <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
//                   <span className="hidden xs:inline">Hamper</span>
//                   <span className="xs:hidden">Cart</span>
//                   {totalItems > 0 && (
//                     <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-orange-500 text-white px-1 py-0">
//                       {totalItems}
//                     </Badge>
//                   )}
//                 </TabsTrigger>
//               </TabsList>

//               {/* Mobile Filter Toggle */}
//               {activeTab === "explore" && isMobile && (
//                 <div className="border-t border-gray-200">
//                   <Button
//                     variant="ghost"
//                     onClick={() => setShowFilters(!showFilters)}
//                     className="w-full h-8 sm:h-10 justify-between text-[11px] xs:text-xs sm:text-sm text-gray-600 hover:bg-purple-50 px-2"
//                   >
//                     <div className="flex items-center gap-1 sm:gap-2">
//                       <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span className="hidden xs:inline">Filters & Search</span>
//                       <span className="xs:hidden">Filters</span>
//                     </div>
//                     {showFilters ? (
//                       <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
//                     ) : (
//                       <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
//                     )}
//                   </Button>
//                 </div>
//               )}

//               {/* Mobile Filters */}
//               {activeTab === "explore" && isMobile && <MobileFilters />}
//             </div>

//             {/* Tab Content */}
//             <div className="bg-white rounded-b-md sm:rounded-b-xl shadow-lg border border-t-0 border-purple-100 min-h-[60vh]">
//               {/* Explore Products Tab */}
//               <TabsContent value="explore" className="m-0 p-0 w-full">
//   {/* Enhanced Explore Tab - Mobile First Design */}
//   <div className="bg-gradient-to-br from-purple-50 to-white p-1 sm:p-3 overflow-x-hidden min-h-[60vh]">
//     <div className="container mx-auto max-w-6xl">

//       {/* Enhanced Desktop Filters */}
//       {!isMobile && (
//         <motion.div
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Search */}
//             <div className="relative group">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
//               <Input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 h-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
//               />
//             </div>

//             {/* Category */}
//             <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//               <SelectTrigger className="h-10 border-purple-200 focus:border-purple-500 rounded-lg">
//                 <SelectValue placeholder="All Categories" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="all">All Categories</SelectItem>
//                 {categories.map((category) => (
//                   <SelectItem key={category} value={category}>
//                     {category}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>

//             {/* Sort */}
//             <Select value={sortBy} onValueChange={setSortBy}>
//               <SelectTrigger className="h-10 border-purple-200 focus:border-purple-500 rounded-lg">
//                 <SelectValue placeholder="Sort by" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="name">Name A-Z</SelectItem>
//                 <SelectItem value="price-low">Price: Low to High</SelectItem>
//                 <SelectItem value="price-high">Price: High to Low</SelectItem>
//               </SelectContent>
//             </Select>

//             {/* Price Range */}
//             <div className="flex gap-2">
//               <Input
//                 type="number"
//                 placeholder="Min ₹"
//                 value={priceRange.min}
//                 onChange={(e) => setPriceRange((prev) => ({ ...prev, min: e.target.value }))}
//                 className="h-10 border-purple-200 focus:border-purple-500 rounded-lg"
//               />
//               <Input
//                 type="number"
//                 placeholder="Max ₹"
//                 value={priceRange.max}
//                 onChange={(e) => setPriceRange((prev) => ({ ...prev, max: e.target.value }))}
//                 className="h-10 border-purple-200 focus:border-purple-500 rounded-lg"
//               />
//             </div>
//           </div>

//           {/* Active Filters Display */}
//           {(searchQuery || selectedCategory !== "all" || priceRange.min || priceRange.max || sortBy !== "name") && (
//             <div className="mt-3 flex flex-wrap gap-2">
//               <span className="text-xs font-medium text-gray-600">Active filters:</span>
//               {searchQuery && (
//                 <Badge variant="secondary" className="text-xs">
//                   Search: {searchQuery}
//                   <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchQuery("")} />
//                 </Badge>
//               )}
//               {selectedCategory !== "all" && (
//                 <Badge variant="secondary" className="text-xs">
//                   {selectedCategory}
//                   <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory("all")} />
//                 </Badge>
//               )}
//               {(priceRange.min || priceRange.max) && (
//                 <Badge variant="secondary" className="text-xs">
//                   ₹{priceRange.min || "0"} - ₹{priceRange.max || "∞"}
//                   <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setPriceRange({ min: "", max: "" })} />
//                 </Badge>
//               )}
//             </div>
//           )}
//         </motion.div>
//       )}

//       {/* Results Header */}
//       <div className="flex items-center justify-between mb-3 px-1">
//         <div className="flex items-center gap-2">
//           <h3 className="text-sm font-semibold text-gray-800">
//             {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
//           </h3>
//           {searchQuery && (
//             <span className="text-xs text-gray-500">for "{searchQuery}"</span>
//           )}
//         </div>

//         {/* Quick Sort on Mobile */}
//         {isMobile && (
//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="w-24 h-8 text-xs border-purple-200">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="name" className="text-xs">A-Z</SelectItem>
//               <SelectItem value="price-low" className="text-xs">₹ ↑</SelectItem>
//               <SelectItem value="price-high" className="text-xs">₹ ↓</SelectItem>
//             </SelectContent>
//           </Select>
//         )}
//       </div>

//       {/* Enhanced Products Grid - 320px Optimized */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2 lg:gap-3">
//         {filteredProducts.map((product, index) => (
//           <motion.div
//             key={product._id}
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: index * 0.05, duration: 0.3 }}
//           >
//             <ProductCard product={product} />
//           </motion.div>
//         ))}
//       </div>

//       {/* Enhanced Empty State */}
//       {filteredProducts.length === 0 && (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center py-8 sm:py-12 px-2"
//         >
//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100 max-w-md mx-auto">
//             <Package className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400 mx-auto mb-4" />
//             <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
//               No Products Found
//             </h3>
//             <p className="text-sm text-gray-600 mb-4">
//               {searchQuery
//                 ? `No products match "${searchQuery}"`
//                 : "Try adjusting your filters to see more products"
//               }
//             </p>

//             {/* Quick Reset Filters */}
//             {(searchQuery || selectedCategory !== "all" || priceRange.min || priceRange.max) && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   setSearchQuery("");
//                   setSelectedCategory("all");
//                   setPriceRange({ min: "", max: "" });
//                   setSortBy("name");
//                 }}
//                 className="border-purple-200 text-purple-600 hover:bg-purple-50"
//               >
//                 <RotateCcw className="w-4 h-4 mr-2" />
//                 Clear All Filters
//               </Button>
//             )}
//           </div>
//         </motion.div>
//       )}

//       {/* Load More Button (if you have pagination) */}
//       {filteredProducts.length > 0 && filteredProducts.length % 20 === 0 && (
//         <div className="text-center mt-6">
//           <Button
//             variant="outline"
//             className="border-purple-200 text-purple-600 hover:bg-purple-50"
//           >
//             <RefreshCw className="w-4 h-4 mr-2" />
//             Load More Products
//           </Button>
//         </div>
//       )}
//     </div>
//   </div>
// </TabsContent>

//               {/* Hamper Tab */}
// <TabsContent value="hamper" className="m-0 p-1 xs:p-2 sm:p-4 w-full">
//   {/* identical global style block to CartPage */}
//   <style>{`
//     body, html { overflow-x: hidden !important; max-width: 100vw !important; }
//     * { box-sizing: border-box; }
//     @media (max-width: 375px) {
//       .container { padding-left: 8px; padding-right: 8px; }
//     }
//   `}</style>

//   <div className="bg-gradient-to-br from-purple-50 to-white p-1 xs:p-2 sm:p-4 overflow-x-hidden min-h-[60vh]">
//     <div className="container mx-auto max-w-6xl">
//       {/* empty-hamper state */}
//       {hamperItems.length === 0 ? (
//         <div className="text-center py-8 sm:py-12 px-2">
//           <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
//             Your hamper is empty
//           </h3>
//           <p className="text-sm sm:text-base text-gray-600 mb-6">
//             Start building your custom hamper by adding products
//           </p>
//           <Button
//             onClick={() => setActiveTab("explore")}
//             className="bg-purple-600 hover:bg-purple-700"
//           >
//             <Grid3X3 className="w-4 h-4 mr-2" />
//             Explore Products
//           </Button>
//         </div>
//       ) : (
//         <>
//           {/* free-delivery banner */}
//           {freeDeliveryGap > 0 && freeDeliveryGap <= 300 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4"
//             >
//               <div className="flex items-center justify-center gap-1 sm:gap-2 text-orange-700 text-xs sm:text-sm">
//                 <Truck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
//                 <span className="font-semibold text-center">
//                   Add ₹{freeDeliveryGap} more for <span className="text-orange-800 font-bold">FREE DELIVERY</span>
//                 </span>
//               </div>
//             </motion.div>
//           )}

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
//             {/* ───── LEFT PANE – item list ───── */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-2 sm:p-3 md:p-4">
//                 <div className="space-y-2 sm:space-y-3">
//                   {hamperItems.map((item, index) => (
//                     <motion.div
//                       key={`${item.productId._id}-${index}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
//                     >
//                       {/* image */}
//                       <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
//                         <img
//                           src={item.productId.Product_image?.[0] || "/placeholder-product.jpg"}
//                           alt={item.productId.Product_name}
//                           className="w-full h-full object-cover rounded-md"
//                           onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder-product.jpg"; }}
//                         />
//                       </div>

//                       {/* info */}
//                       <div className="flex-grow min-w-0">
//                         <div className="space-y-1 sm:space-y-2">
//                           {/* name */}
//                           <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
//                             {item.productId.Product_name}
//                           </h3>

//                           {/* price / qty / total */}
//                           <div className="space-y-1">
//                             {/* unit price */}
//                             <div className="flex items-center gap-2">
//                               <span className="text-[10px] sm:text-xs text-gray-500">Unit Price:</span>
//                               <span className="text-xs sm:text-sm font-medium text-purple-600">
//                                 ₹{getItemUnitPrice(item).toLocaleString()}
//                               </span>
//                             </div>

//                             {/* qty controls + line total */}
//                             <div className="flex items-center justify-between gap-2">
//                               {/* qty controls */}
//                               <div className="flex items-center gap-2">
//                                 <span className="text-[10px] sm:text-xs text-gray-500">Qty:</span>
//                                 <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
//                                   <button
//                                     className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-l-md hover:bg-gray-200"
//                                     onClick={() => updateItemQuantity(item.productId._id, item.quantity - 1)}
//                                     disabled={isProcessing}
//                                   >
//                                     <Minus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                                   </button>
//                                   <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
//                                     {item.quantity}
//                                   </span>
//                                   <button
//                                     className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-r-md hover:bg-gray-200"
//                                     onClick={() => updateItemQuantity(item.productId._id, item.quantity + 1)}
//                                     disabled={isProcessing}
//                                   >
//                                     <Plus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                                   </button>
//                                 </div>
//                               </div>

//                               {/* line total */}
//                               <div className="flex flex-col items-end">
//                                 <span className="text-[10px] sm:text-xs text-gray-500">Total:</span>
//                                 <span className="text-sm sm:text-lg font-bold text-purple-700">
//                                   ₹{getItemTotal(item).toLocaleString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           {/* remove */}
//                           <div className="flex justify-end pt-1">
//                             <button
//                               className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs text-red-500 hover:bg-red-50 rounded-md"
//                               onClick={() => removeItemFromHamper(item.productId._id)}
//                               disabled={isProcessing}
//                             >
//                               <Trash2 className="w-3 h-3" />
//                               <span className="hidden sm:inline">Remove</span>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>

//                 {/* bottom buttons */}
//                 <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 space-y-2">
//                   <Button
//                     variant="outline"
//                     className="w-full rounded-full px-3 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
//                     onClick={() => setActiveTab("explore")}
//                   >
//                     Continue Adding Products
//                   </Button>

//                   <div className="flex flex-col sm:flex-row gap-2">
//                     <Button
//                       variant="destructive"
//                       className="flex-1 rounded-full px-3 py-2 text-xs sm:text-sm"
//                       onClick={clearHamper}
//                       disabled={isProcessing}
//                     >
//                       Clear Hamper
//                     </Button>
//                     <Button
//                       className={`flex-1 rounded-full px-3 py-2 text-xs sm:text-sm font-semibold ${
//                         hamperValidation.isValid
//                           ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
//                           : "bg-gray-400 cursor-not-allowed"
//                       }`}
//                       onClick={startCheckout}
//                       disabled={!hamperValidation.isValid || isProcessing}
//                     >
//                       {hamperValidation.isValid ? "Checkout" : `Add ₹${minimumAmountGap} More`}
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ───── RIGHT PANE – hamper summary ───── */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-3 sm:p-4 sticky top-20">
//                 <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
//                   <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
//                   Hamper Summary
//                 </h2>

//                 {/* item list */}
//                 <div className="space-y-1.5 mb-4 max-h-32 sm:max-h-40 overflow-y-auto">
//                   {hamperItems.map((item, index) => (
//                     <div
//                       key={`summary-${item.productId._id}-${index}`}
//                       className="flex justify-between items-start text-xs sm:text-sm py-1"
//                     >
//                       <div className="flex-1 min-w-0 mr-2">
//                         <div className="font-medium text-gray-700 truncate leading-tight">
//                           {item.productId.Product_name}
//                         </div>
//                         <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
//                           ₹{getItemUnitPrice(item).toLocaleString()} × {item.quantity}
//                         </div>
//                       </div>
//                       <div className="font-semibold text-purple-600 flex-shrink-0">
//                         ₹{getItemTotal(item).toLocaleString()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* calculations */}
//                 <div className="border-t border-gray-200 pt-3 space-y-2">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Subtotal ({totalItems} items)</span>
//                     <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
//                   </div>

//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Delivery Charge</span>
//                     <span className={`font-semibold ${DELIVERY_CHARGE > 0 ? "text-orange-600" : "text-green-600"}`}>
//                       {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
//                     </span>
//                   </div>

//                   {/* free-delivery progress */}
//                   {DELIVERY_CHARGE > 0 && (
//                     <div className="py-2 px-3 bg-orange-50 rounded-lg border border-orange-100">
//                       <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
//                         <span className="font-medium">Free Delivery Progress</span>
//                         <span className="font-bold">₹{freeDeliveryGap} more</span>
//                       </div>
//                       <div className="bg-orange-200 h-2 rounded-full relative overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
//                           style={{ width: `${Math.min((totalAmount / 500) * 100, 100)}%` }}
//                         />
//                       </div>
//                       <div className="text-[10px] text-orange-600 mt-1 text-center">
//                         {Math.round((totalAmount / 500) * 100)}% towards free delivery
//                       </div>
//                     </div>
//                   )}

//                   {/* minimum-amount progress */}
//                   {!hamperValidation.isValid && (
//                     <div className="py-2 px-3 bg-red-50 rounded-lg border border-red-100">
//                       <div className="flex items-center justify-between text-xs text-red-700 mb-1">
//                         <span className="font-medium">Minimum Amount Progress</span>
//                         <span className="font-bold">₹{minimumAmountGap} more</span>
//                       </div>
//                       <div className="bg-red-200 h-2 rounded-full relative overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-500"
//                           style={{ width: `${Math.min((totalAmount / MINIMUM_HAMPER_AMOUNT) * 100, 100)}%` }}
//                         />
//                       </div>
//                       <div className="text-[10px] text-red-600 mt-1 text-center">
//                         {Math.round((totalAmount / MINIMUM_HAMPER_AMOUNT) * 100)}% towards minimum
//                       </div>
//                     </div>
//                   )}

//                   {/* grand total */}
//                   <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-200 bg-purple-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-lg">
//                     <span className="text-gray-900">Total Amount</span>
//                     <span className="text-purple-700">₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}</span>
//                   </div>
//                 </div>

//                 {/* checkout button */}
//                 <Button
//                   className={`w-full mt-4 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
//                     hamperValidation.isValid
//                       ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                       : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                   onClick={startCheckout}
//                   disabled={!hamperValidation.isValid || isProcessing}
//                 >
//                   {hamperValidation.isValid ? "Proceed to Checkout" : `Add ₹${minimumAmountGap} More`}
//                 </Button>

//                 {/* validation message */}
//                 <div className="mt-3 text-center">
//                   <div
//                     className={`text-xs px-3 py-2 rounded-xl font-medium ${
//                       hamperValidation.isValid
//                         ? "bg-green-100 text-green-800 border border-green-200"
//                         : "bg-red-100 text-red-800 border border-red-200"
//                     }`}
//                   >
//                     {hamperValidation.message}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   </div>
// </TabsContent>

//             </div>
//           </Tabs>
//         </div>

//         {/* Rest of your existing modals (Checkout Modal, Phone Verification Modal) remain the same */}
//         {/* Checkout Modal - KEEPING SECOND CODE STYLING */}
//         <AnimatePresence>
//           {isCheckingOut && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center overflow-hidden p-2"
//               onClick={() => !checkoutLoading && setIsCheckingOut(false)}
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: "100%", scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: "100%", scale: 0.95 }}
//                 transition={{ type: "spring", damping: 25, stiffness: 500 }}
//                 className="bg-white w-full max-w-[95vw] sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-purple-100 sm:border max-h-[95vh] flex flex-col overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Header */}
//                 <div className="relative flex-shrink-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-3">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h2 className="text-base sm:text-lg font-bold">
//                         Checkout Custom Hamper
//                       </h2>
//                       <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
//                         Total: ₹
//                         {(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex-shrink-0"
//                       onClick={() =>
//                         !checkoutLoading && setIsCheckingOut(false)
//                       }
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Scrollable Content */}
//                 <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
//                   {/* Compact Hamper Summary */}
//                   <div className="bg-purple-50 rounded-lg p-3 mb-4">
//                     <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
//                       <Gift className="w-3 h-3" />
//                       Custom Hamper ({totalItems} items)
//                     </h3>
//                     <div className="space-y-1 text-xs">
//                       <div className="flex justify-between font-medium border-b border-purple-200 pb-1">
//                         <span>Hamper Total</span>
//                         <span>₹{totalAmount.toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between text-orange-600">
//                         <span>Delivery</span>
//                         <span>
//                           {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
//                         <span>Total Amount</span>
//                         <span>
//                           ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Form */}
//                   <form onSubmit={handleHamperCheckout} className="space-y-3">
//                     <div className="grid grid-cols-1 gap-3">
//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="fullName"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           Full Name *
//                         </Label>
//                         <Input
//                           id="fullName"
//                           name="fullName"
//                           placeholder="Enter your full name"
//                           value={shippingAddress.fullName}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>

//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="phone"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           Phone Number *
//                         </Label>
//                         <Input
//                           id="phone"
//                           name="phone"
//                           type="tel"
//                           placeholder="Enter your phone number"
//                           value={shippingAddress.phone}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>

//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="address"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           Address *
//                         </Label>
//                         <Input
//                           id="address"
//                           name="address"
//                           placeholder="Enter your address"
//                           value={shippingAddress.address}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-2">
//                         <div className="space-y-1">
//                           <Label
//                             htmlFor="city"
//                             className="text-xs font-medium text-gray-700"
//                           >
//                             City *
//                           </Label>
//                           <Input
//                             id="city"
//                             name="city"
//                             placeholder="City"
//                             value={shippingAddress.city}
//                             onChange={handleInputChange}
//                             required
//                             className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                           />
//                         </div>
//                         <div className="space-y-1">
//                           <Label
//                             htmlFor="state"
//                             className="text-xs font-medium text-gray-700"
//                           >
//                             State *
//                           </Label>
//                           <Input
//                             id="state"
//                             name="state"
//                             placeholder="State"
//                             value={shippingAddress.state}
//                             onChange={handleInputChange}
//                             required
//                             className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                           />
//                         </div>
//                       </div>

//                       <div className="space-y-1">
//                         <Label
//                           htmlFor="pinCode"
//                           className="text-xs font-medium text-gray-700"
//                         >
//                           PIN Code *
//                         </Label>
//                         <Input
//                           id="pinCode"
//                           name="pinCode"
//                           placeholder="PIN Code"
//                           value={shippingAddress.pinCode}
//                           onChange={handleInputChange}
//                           required
//                           className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                       </div>
//                     </div>
//                   </form>
//                 </div>

//                 {/* Fixed Bottom - NEW PAYMENT BUTTONS */}
//                 <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 space-y-3">
//                   {/* Payment Buttons */}
//                   <div className="space-y-2">
//                     {/* Pay Online Button */}
//                     <Button
//                       onClick={() => {
//                         // Form validation
//                         const requiredFields = ["fullName", "address", "city", "state", "pinCode", "phone"];
//                         const missingFields = requiredFields.filter(
//                           (field) => !shippingAddress[field].trim()
//                         );
//                         if (missingFields.length > 0) {
//                           toast({
//                             title: "Missing Information",
//                             description: "Please fill in all shipping address fields",
//                             variant: "destructive",
//                           });
//                           return;
//                         }
//                         handlePaymentSelection('online');
//                       }}
//                       disabled={checkoutLoading}
//                       className="w-full h-10 text-sm rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
//                     >
//                       {checkoutLoading ? (
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           Processing...
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center gap-2">
//                           <Lock className="w-4 h-4" />
//                           Pay Online - ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                         </div>
//                       )}
//                     </Button>

//                     {/* Cash on Delivery Button */}
//                     <Button
//                       onClick={() => {
//                         // Form validation
//                         const requiredFields = ["fullName", "address", "city", "state", "pinCode", "phone"];
//                         const missingFields = requiredFields.filter(
//                           (field) => !shippingAddress[field].trim()
//                         );
//                         if (missingFields.length > 0) {
//                           toast({
//                             title: "Missing Information",
//                             description: "Please fill in all shipping address fields",
//                             variant: "destructive",
//                           });
//                           return;
//                         }
//                         handlePaymentSelection('cod');
//                       }}
//                       disabled={checkoutLoading}
//                       variant="outline"
//                       className="w-full h-10 text-sm rounded-full border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
//                     >
//                       {checkoutLoading ? (
//                         <div className="flex items-center justify-center gap-2">
//                           <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
//                           Processing...
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-center gap-2">
//                           <Truck className="w-4 h-4" />
//                           Cash on Delivery - ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
//                         </div>
//                       )}
//                     </Button>
//                   </div>

//                   {/* Payment Security Info */}
//                   <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
//                     <Lock className="w-3 h-3" />
//                     <span>UPI • Cards • Net Banking • COD Available</span>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Phone Verification Modal - PROFESSIONAL VERSION */}
//         <AnimatePresence>
//           {showPhoneVerification && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
//               onClick={() =>
//                 !isVerifyingPhone && !isVerifyingOTP && resetPhoneVerification()
//               }
//             >
//               <motion.div
//                 initial={{ opacity: 0, y: 20, scale: 0.98 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 20, scale: 0.98 }}
//                 transition={{ type: "spring", damping: 30, stiffness: 400 }}
//                 className="bg-white w-full max-w-sm mx-auto rounded-3xl shadow-2xl border border-gray-100 max-h-[96vh] flex flex-col overflow-hidden"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 {/* Compact Header */}
//                 <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white px-4 py-5 sm:px-6 sm:py-6">
//                   <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
//                   <div className="relative flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
//                         {!showOTPInput ? (
//                           <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
//                         ) : (
//                           <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
//                         )}
//                       </div>
//                       <div className="min-w-0">
//                         <h2 className="text-lg sm:text-xl font-bold mb-0.5 tracking-tight leading-tight">
//                           {!showOTPInput ? "Verify Phone" : "Enter Code"}
//                         </h2>
//                         <p className="text-white/80 text-xs sm:text-sm font-medium">
//                           {!showOTPInput ? "Secure checkout" : "Almost done"}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 flex-shrink-0"
//                       onClick={() =>
//                         !isVerifyingPhone &&
//                         !isVerifyingOTP &&
//                         resetPhoneVerification()
//                       }
//                       disabled={isVerifyingPhone || isVerifyingOTP}
//                     >
//                       <X className="h-4 w-4 sm:h-5 sm:w-5" />
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Optimized Content */}
//                 <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
//                   {!showOTPInput ? (
//                     // Phone Number Input - Mobile Optimized
//                     <div className="space-y-6">
//                       <div className="text-center">
//                         <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
//                           <Phone className="w-8 h-8 sm:w-9 sm:h-9 text-blue-600" />
//                         </div>
//                         <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
//                           Enter Mobile Number
//                         </h3>
//                         <p className="text-gray-600 text-sm leading-relaxed px-2">
//                           We'll verify your number for secure checkout
//                         </p>
//                       </div>

//                       <form
//                         onSubmit={handlePhoneVerification}
//                         className="space-y-5"
//                       >
//                         <div className="space-y-2">
//                           <Label
//                             htmlFor="phoneNumber"
//                             className="text-sm font-semibold text-gray-800 flex items-center gap-2"
//                           >
//                             <Phone className="w-4 h-4 text-blue-600" />
//                             Mobile Number *
//                           </Label>
//                           <div className="relative group">
//                             <Input
//                               id="phoneNumber"
//                               type="tel"
//                               placeholder="Enter 10-digit mobile number"
//                               value={phoneNumber}
//                               onChange={(e) => {
//                                 const value = e.target.value
//                                   .replace(/\D/g, "")
//                                   .slice(0, 10);
//                                 setPhoneNumber(value);
//                               }}
//                               required
//                               className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-2xl transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-300 text-center tracking-wide font-medium"
//                               maxLength={10}
//                             />
//                             {phoneNumber.length === 10 && (
//                               <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                 <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//                                   <CheckCircle className="w-3 h-3 text-white" />
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                           {phoneNumber && phoneNumber.length !== 10 && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: "auto" }}
//                               className="bg-red-50 border border-red-200 rounded-xl p-3"
//                             >
//                               <p className="text-red-600 text-sm flex items-center gap-2">
//                                 <AlertCircle className="w-4 h-4 flex-shrink-0" />
//                                 <span>Please enter all 10 digits</span>
//                               </p>
//                             </motion.div>
//                           )}
//                         </div>

//                         <Button
//                           type="submit"
//                           disabled={
//                             isVerifyingPhone || phoneNumber.length !== 10
//                           }
//                           className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                           {isVerifyingPhone ? (
//                             <div className="flex items-center justify-center gap-2">
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                               <span>Verifying...</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center gap-2">
//                               <Shield className="w-5 h-5" />
//                               <span>Send Verification Code</span>
//                             </div>
//                           )}
//                         </Button>

//                         {/* Trust Badges - Mobile Optimized */}
//                         <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100">
//                           <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                             <span>Secure</span>
//                           </div>
//                           <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                             <span>Fast</span>
//                           </div>
//                           <div className="flex items-center gap-1.5 text-xs text-gray-600">
//                             <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                             <span>Private</span>
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   ) : (
//                     // OTP Input - Mobile Optimized
//                     <div className="space-y-6">
//                       <div className="text-center">
//                         <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
//                           <MessageSquare className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600" />
//                         </div>
//                         <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
//                           Enter Verification Code
//                         </h3>
//                         <p className="text-gray-600 mb-3 text-sm leading-relaxed px-2">
//                           4-digit code sent to your mobile
//                         </p>
//                         <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-2xl border border-gray-200 inline-block">
//                           <p className="font-bold text-gray-800 text-base">
//                             {phoneNumber.replace(/(\d{5})(\d{5})/, "$1-$2")}
//                           </p>
//                         </div>
//                       </div>

//                       <form
//                         onSubmit={handleOTPVerification}
//                         className="space-y-5"
//                       >
//                         <div className="space-y-3">
//                           <Label
//                             htmlFor="otp"
//                             className="text-sm font-semibold text-gray-800 flex items-center gap-2 justify-center"
//                           >
//                             <MessageSquare className="w-4 h-4 text-emerald-600" />
//                             Verification Code *
//                           </Label>

//                           {/* Mobile-Optimized OTP Input */}
//                           <div className="flex justify-center gap-2 sm:gap-3">
//                             {[...Array(4)].map((_, index) => (
//                               <input
//                                 key={index}
//                                 ref={(el) => {
//                                   otpInputRefs.current[index] = el;
//                                 }}
//                                 type="text"
//                                 value={otp[index] || ""}
//                                 onChange={(e) => {
//                                   const value = e.target.value
//                                     .replace(/\D/g, "")
//                                     .slice(0, 1);
//                                   const newOtp = otp.split("");
//                                   newOtp[index] = value;
//                                   const updatedOtp = newOtp
//                                     .join("")
//                                     .slice(0, 4);
//                                   setOtp(updatedOtp);

//                                   // Auto-focus next input
//                                   if (
//                                     value &&
//                                     index < 3 &&
//                                     otpInputRefs.current[index + 1]
//                                   ) {
//                                     otpInputRefs.current[index + 1]?.focus();
//                                   }
//                                 }}
//                                 onKeyDown={(e) => {
//                                   if (
//                                     e.key === "Backspace" &&
//                                     !otp[index] &&
//                                     index > 0 &&
//                                     otpInputRefs.current[index - 1]
//                                   ) {
//                                     otpInputRefs.current[index - 1]?.focus();
//                                   }
//                                 }}
//                                 className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 rounded-2xl bg-gray-50 focus:bg-white transition-all duration-200"
//                                 maxLength={1}
//                                 inputMode="numeric"
//                               />
//                             ))}
//                           </div>

//                           {otp && otp.length > 0 && otp.length !== 4 && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: "auto" }}
//                               className="bg-amber-50 border border-amber-200 rounded-xl p-3"
//                             >
//                               <p className="text-amber-700 text-sm flex items-center justify-center gap-2">
//                                 <Clock className="w-4 h-4 flex-shrink-0" />
//                                 <span>{4 - otp.length} more digits needed</span>
//                               </p>
//                             </motion.div>
//                           )}
//                         </div>

//                         <Button
//                           type="submit"
//                           disabled={isVerifyingOTP || otp.length !== 4}
//                           className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
//                         >
//                           {isVerifyingOTP ? (
//                             <div className="flex items-center justify-center gap-2">
//                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                               <span>Verifying...</span>
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center gap-2">
//                               <CheckCircle className="w-5 h-5" />
//                               <span>Complete Verification</span>
//                             </div>
//                           )}
//                         </Button>

//                         {/* Mobile-Optimized Resend Section */}
//                         <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
//                           <div className="text-center space-y-3">
//                             {otpTimer > 0 ? (
//                               <div className="space-y-2">
//                                 <p className="text-sm text-gray-600">
//                                   Didn't receive the code?
//                                 </p>
//                                 <div className="flex items-center justify-center gap-2">
//                                   <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
//                                   <span className="text-sm font-semibold text-blue-600">
//                                     Resend in {otpTimer}s
//                                   </span>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="space-y-3">
//                                 <p className="text-sm text-gray-600">
//                                   Didn't receive the code?
//                                 </p>
//                                 <div className="flex flex-col sm:flex-row gap-2 justify-center">
//                                   <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={handleResendOTP}
//                                     disabled={isVerifyingPhone}
//                                     className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-semibold rounded-xl"
//                                   >
//                                     {isVerifyingPhone ? (
//                                       <div className="flex items-center gap-1.5">
//                                         <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
//                                         <span>Sending...</span>
//                                       </div>
//                                     ) : (
//                                       <div className="flex items-center gap-1.5">
//                                         <RotateCcw className="w-3 h-3" />
//                                         <span>Resend Code</span>
//                                       </div>
//                                     )}
//                                   </Button>
//                                   <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={() => {
//                                       setShowOTPInput(false);
//                                       setOtp("");
//                                     }}
//                                     className="text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl"
//                                   >
//                                     <ArrowLeft className="w-3 h-3 mr-1" />
//                                     <span>Change Number</span>
//                                   </Button>
//                                 </div>
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </form>
//                     </div>
//                   )}
//                 </div>

//                 {/* Compact Footer */}
//                 <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
//                   <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
//                     <Lock className="w-3 h-3" />
//                     <span>Secure & encrypted</span>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export default CustomHamperBuilder;

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useToast } from "../components/ui/use-toast";
import axiosInstance from "../utils/axiosConfig";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import  PhoneVerificationModal  from "../components/PhoneVerificationModal";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  X,
  ShoppingCart,
  Package,
  Gift,
  Filter,
  Search,
  RefreshCw,
  AlertCircle,
  Trash2,
  Eye,
  ShoppingBag,
  Truck,
  Grid3X3,
  List,
  ChevronUp,
  ChevronDown,
  Heart,
  Phone,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  MessageSquare,
  RotateCcw,
  ArrowLeft,
  Lock,
  History, // NEW: Added for past orders icon
} from "lucide-react";

// Enhanced TypeScript declaration
interface CashfreeInstance {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: string;
  }) => Promise<{
    error?: { message: string };
    redirect?: boolean;
    paymentDetails?: any;
  }>;
}

declare global {
  interface Window {
    Cashfree: (config: { mode: string }) => CashfreeInstance;
  }
}

// NEW: Interface for past hamper orders
interface PastHamperOrder {
  _id: string;
  createdAt: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  items: any[];
  paymentMethod: string;
}

export {};

const CustomHamperBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const justAddedItem = useRef(false);

  // Core hamper state
  const [hamperItems, setHamperItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("name");

  // UI state - UPDATED: Changed from "explore" | "hamper" to include "orders"
  const [activeTab, setActiveTab] = useState<"explore" | "hamper">("explore");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { checkoutLoading, processPayment } = usePaymentProcessing();
  const phoneVerification = usePhoneVerification();

  // Checkout form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
  });

  // Constants
  const MINIMUM_HAMPER_AMOUNT = 200;
  const DELIVERY_CHARGE = totalAmount >= 500 ? 0 : 80;
  const minimumAmountGap = Math.max(0, MINIMUM_HAMPER_AMOUNT - totalAmount);
  const freeDeliveryGap = Math.max(0, 500 - totalAmount);


  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-switch to hamper tab when items are added (mobile only)
  useEffect(() => {
    if (
      isMobile &&
      hamperItems.length > 0 &&
      activeTab === "explore" &&
      justAddedItem.current
    ) {
      setTimeout(() => {
        setActiveTab("hamper");
        justAddedItem.current = false;
      }, 800);
    }
  }, [hamperItems.length, isMobile, activeTab]);

  // Fetch hamper-eligible products using backend filtering
  const fetchHamperProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🎁 Fetching hamper-eligible products from backend...");

      const response = await axiosInstance.get(
        "api/getproducts?type=hamper&limit=100"
      );

      console.log("📦 Hamper products response:", response.data);

      if (response.data && response.data.product) {
        const hamperProducts = response.data.product;
        setProducts(hamperProducts);
        setFilteredProducts(hamperProducts);

        const uniqueCategories = [
          ...new Set(
            hamperProducts
              .map(
                (p) =>
                  p.Product_category_name ||
                  p.Product_category?.category ||
                  "Uncategorized"
              )
              .filter(Boolean)
          ),
        ];
        setCategories(uniqueCategories);

        console.log(
          `✅ Loaded ${hamperProducts.length} hamper-eligible products`
        );

        if (hamperProducts.length === 0) {
          toast({
            title: "No Hamper Products",
            description:
              "No products are currently available for custom hampers.",
            variant: "default",
          });
        }
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setCategories([]);
      }
    } catch (error) {
      console.error("❌ Error fetching hamper products:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load hamper products";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch user's hamper from database
  const fetchUserHamper = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axiosInstance.get("/hamper");
      const data = response.data;

      if (data.hamper && data.hamper.length > 0) {
        setHamperItems(data.hamper);
        setTotalAmount(data.totalAmount || 0);
        setTotalItems(data.totalItems || 0);
        console.log("Hamper loaded from database:", data);
      } else {
        setHamperItems([]);
        setTotalAmount(0);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error fetching hamper from database:", error);
      setHamperItems([]);
      setTotalAmount(0);
      setTotalItems(0);
    }
  }, [user]);

  // Initialize component
  useEffect(() => {
    fetchHamperProducts();
    fetchUserHamper();
  }, [fetchHamperProducts, fetchUserHamper]);

  // Add this effect after your existing useEffect hooks
useEffect(() => {
  if (phoneVerification.phoneVerified) {
    setShippingAddress(prev => ({
      ...prev,
      phone: phoneVerification.phoneNumber
    }));
    setIsCheckingOut(true);
  }
}, [phoneVerification.phoneVerified, phoneVerification.phoneNumber]);


  // Filter and search logic
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) =>
          (product.Product_category_name || product.Product_category) ===
          selectedCategory
      );
    }

    if (priceRange.min) {
      filtered = filtered.filter(
        (product) =>
          (product.Hamper_price || product.Product_price) >=
          parseFloat(priceRange.min)
      );
    }

    if (priceRange.max) {
      filtered = filtered.filter(
        (product) =>
          (product.Hamper_price || product.Product_price) <=
          parseFloat(priceRange.max)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            (a.Hamper_price || a.Product_price) -
            (b.Hamper_price || b.Product_price)
          );
        case "price-high":
          return (
            (b.Hamper_price || b.Product_price) -
            (a.Hamper_price || a.Product_price)
          );
        case "name":
        default:
          return a.Product_name.localeCompare(b.Product_name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  // Hamper validation
  const hamperValidation = useMemo(() => {
    if (totalAmount < MINIMUM_HAMPER_AMOUNT) {
      return {
        isValid: false,
        message: `Add ₹${minimumAmountGap} more to reach minimum hamper value of ₹${MINIMUM_HAMPER_AMOUNT}`,
      };
    }
    return { isValid: true, message: "Hamper is ready for checkout!" };
  }, [totalAmount, minimumAmountGap]);

  // Add item to hamper
  const addItemToHamper = async (product) => {
    try {
      setIsProcessing(true);
      justAddedItem.current = true;
      console.log("🎁 Adding product to hamper:", product.Product_name);

      const response = await axiosInstance.post("/hamper/add", {
        productId: product._id,
        quantity: 1,
      });

      if (response.data) {
        setHamperItems(response.data.hamper);
        setTotalAmount(response.data.totalAmount);
        setTotalItems(response.data.totalItems);

        toast({
          title: "Added to Hamper",
          description: `${product.Product_name} added to your custom hamper`,
        });
      }
    } catch (error) {
      console.error("Error adding to hamper:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to add item to hamper",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Update item quantity in hamper
  const updateItemQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeItemFromHamper(productId);
    }

    try {
      setIsProcessing(true);
      const response = await axiosInstance.put(`/hamper/update/${productId}`, {
        quantity: newQuantity,
      });

      if (response.data) {
        setHamperItems(response.data.hamper);
        setTotalAmount(response.data.totalAmount);
        setTotalItems(response.data.totalItems);
      }
    } catch (error) {
      console.error("Error updating hamper quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Remove item from hamper
  const removeItemFromHamper = async (productId) => {
    try {
      setIsProcessing(true);
      const response = await axiosInstance.delete(
        `/hamper/remove/${productId}`
      );

      if (response.data) {
        setHamperItems(response.data.hamper);
        setTotalAmount(response.data.totalAmount);
        setTotalItems(response.data.totalItems);

        toast({
          title: "Item Removed",
          description: "Item removed from hamper",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error removing from hamper:", error);
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear entire hamper
  const clearHamper = async () => {
    try {
      setIsProcessing(true);
      await axiosInstance.delete("/hamper/clear");

      setHamperItems([]);
      setTotalAmount(0);
      setTotalItems(0);

      toast({
        title: "Hamper Cleared",
        description: "All items removed from hamper",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error clearing hamper:", error);
      toast({
        title: "Error",
        description: "Failed to clear hamper",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle tab change
  const handleTabChange = (newTab) => {
    if (newTab === "explore") justAddedItem.current = false;
    setActiveTab(newTab);
  };

  // Handle checkout form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Start checkout process - MODIFIED TO USE PHONE VERIFICATION
  const startCheckout = () => {
  if (!user) {
    toast({
      title: "Please login",
      description: "You need to be logged in to checkout",
      variant: "destructive",
    });
    navigate("/login");
    return;
  }
  
  if (!hamperValidation.isValid) {
    toast({
      title: "Cannot Proceed",
      description: hamperValidation.message,
      variant: "destructive",
    });
    return;
  }
  
  // ✅ Use hook method instead of inline state
  phoneVerification.setShowPhoneVerification(true);
};


  // ✅ Replace handlePaymentSelection with this
  const handlePaymentSelection = async (paymentMethod: "cod" | "online") => {
  try {
    // ✅ Add phone verification check
    if (!phoneVerification.phoneVerified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first",
        variant: "destructive",
      });
      return;
    }

    // Form validation
    const requiredFields = ["fullName", "address", "city", "state", "pinCode", "phone"];
    const missingFields = requiredFields.filter(
      (field) => !shippingAddress[field].trim()
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all shipping address fields",
        variant: "destructive",
      });
      return;
    }

    // Prepare items for payment processing
    const orderItems = hamperItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.Hamper_price || item.productId.Product_price,
      name: item.productId.Product_name,
      image: item.productId.Product_image?.[0] || null,
    }));

    // Calculate totals
    const itemsTotal = hamperItems.reduce((total, item) => {
      return total + (item.productId.Hamper_price || item.productId.Product_price) * item.quantity;
    }, 0);

    const totals = {
      itemsTotal: itemsTotal,
      deliveryCharge: DELIVERY_CHARGE,
      totalAmount: itemsTotal + DELIVERY_CHARGE,
    };

    // ✅ Use the standardized payment processing with cartType: "hamper"
    const success = await processPayment(
      orderItems,
      shippingAddress,
      paymentMethod,
      totals,
      "hamper" // ✅ This is crucial for hamper orders
    );

    if (success) {
      // Reset local state since payment processing handles cart clearing
      setHamperItems([]);
      setTotalAmount(0);
      setTotalItems(0);
      setIsCheckingOut(false);
      phoneVerification.resetPhoneVerification(); // ✅ Use hook method
    }

  } catch (error: any) {
    console.error("❌ Hamper payment error:", error);
    toast({
      title: "Payment Error",
      description: error.message || "Failed to process hamper payment",
      variant: "destructive",
    });
  }
};

  // Helper functions
  const getItemTotal = (item) => {
    const price = item.productId.Hamper_price || item.productId.Product_price;
    return price * item.quantity;
  };

  const getItemUnitPrice = (item) => {
    return item.productId.Hamper_price || item.productId.Product_price;
  };

  const isProductInHamper = (productId) => {
    return hamperItems.some((item) => item.productId._id === productId);
  };

  const getProductQuantityInHamper = (productId) => {
    const item = hamperItems.find((item) => item.productId._id === productId);
    return item ? item.quantity : 0;
  };

  // NEW: Format date for past orders
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // NEW: Get status color and icon
  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: "bg-amber-500", icon: Clock, label: "Pending" },
      processing: { color: "bg-blue-500", icon: Package, label: "Processing" },
      shipped: { color: "bg-purple-500", icon: Truck, label: "Shipped" },
      delivered: {
        color: "bg-green-500",
        icon: CheckCircle,
        label: "Delivered",
      },
      cancelled: { color: "bg-red-500", icon: X, label: "Cancelled" },
      failed: { color: "bg-red-500", icon: X, label: "Failed" },
    };
    return configs[status] || configs.pending;
  };

  // Compact Mobile Filters Component - KEEPING SECOND CODE STYLING
  const MobileFilters = () => (
    <motion.div
      initial={false}
      animate={{ height: showFilters ? "auto" : 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-white border-b border-gray-200"
    >
      <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 sm:pl-10 h-7 sm:h-9 text-[11px] xs:text-xs sm:text-sm"
          />
        </div>

        {/* Category and Sort in a row */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-[10px] xs:text-xs">
                All
              </SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-[10px] xs:text-xs"
                >
                  {category.length > 15
                    ? category.substring(0, 15) + "..."
                    : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name" className="text-[10px] xs:text-xs">
                Name
              </SelectItem>
              <SelectItem value="price-low" className="text-[10px] xs:text-xs">
                Price ↑
              </SelectItem>
              <SelectItem value="price-high" className="text-[10px] xs:text-xs">
                Price ↓
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <Input
            type="number"
            placeholder="Min ₹"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, min: e.target.value }))
            }
            className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
          />
          <Input
            type="number"
            placeholder="Max ₹"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, max: e.target.value }))
            }
            className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
          />
        </div>
      </div>
    </motion.div>
  );

  // Product Card Component - KEEPING SECOND CODE STYLING
  // Enhanced Product Card Component - 320px Optimized
  const ProductCard = ({ product }) => {
    const hamperPrice = product.Hamper_price || product.Product_price;
    const regularPrice = product.Product_price;
    const discount =
      regularPrice > hamperPrice
        ? ((regularPrice - hamperPrice) / regularPrice) * 100
        : 0;

    const inHamper = isProductInHamper(product._id);
    const hamperQuantity = getProductQuantityInHamper(product._id);

    // Compact Quantity Control
    const QuantityControl = () => (
      <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
        <button
          className="w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50"
          onClick={() => updateItemQuantity(product._id, hamperQuantity - 1)}
          disabled={isProcessing}
          aria-label="Decrease quantity"
        >
          <Minus className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-gray-600" />
        </button>
        <span className="w-5 xs:w-6 text-center text-[10px] xs:text-xs font-semibold bg-white leading-5 xs:leading-6">
          {hamperQuantity}
        </span>
        <button
          className="w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50"
          onClick={() => updateItemQuantity(product._id, hamperQuantity + 1)}
          disabled={isProcessing}
          aria-label="Increase quantity"
        >
          <Plus className="w-2 h-2 xs:w-2.5 xs:h-2.5 text-gray-600" />
        </button>
      </div>
    );

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/90 backdrop-blur-sm overflow-hidden h-full">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image Container - 320px Optimized */}
          <div className="relative overflow-hidden aspect-square">
            <img
              src={product.Product_image?.[0] || "/placeholder-product.jpg"}
              alt={product.Product_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-product.jpg";
              }}
            />

            {/* Enhanced Badges */}
            <div className="absolute top-1 left-1 right-1 flex justify-between items-start gap-1">
              {discount > 0 && (
                <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-[8px] xs:text-[10px] px-1 py-0.5 leading-tight shadow-sm">
                  {discount.toFixed(0)}% OFF
                </Badge>
              )}
              {inHamper && (
                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-[8px] xs:text-[10px] px-1 py-0.5 leading-tight shadow-sm">
                  <CheckCircle className="w-2 h-2 xs:w-2.5 xs:h-2.5 mr-0.5" />
                  <span className="hidden xs:inline">In Hamper</span>
                  <span className="xs:hidden">✓</span>
                </Badge>
              )}
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Content - 320px Optimized */}
          <div className="p-1.5 xs:p-2 sm:p-3 space-y-1.5 flex-1 flex flex-col">
            {/* Product Name */}
            <h3 className="font-semibold text-[10px] xs:text-xs sm:text-sm line-clamp-2 min-h-[2rem] xs:min-h-[2.5rem] leading-tight text-gray-900">
              {product.Product_name}
            </h3>

            {/* Price Section */}
            <div className="space-y-1 flex-1">
              <div className="flex items-start justify-between gap-1">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs xs:text-sm sm:text-base font-bold text-green-600">
                    ₹{hamperPrice.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className="text-[8px] xs:text-xs text-gray-500 line-through">
                      ₹{regularPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Add/Quantity Controls */}
                <div className="flex-shrink-0">
                  {inHamper ? (
                    <QuantityControl />
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addItemToHamper(product)}
                      className="hover:bg-green-50 hover:border-green-500 hover:text-green-600 text-[8px] xs:text-xs px-1.5 py-0.5 h-6 xs:h-7 border-purple-200 transition-all duration-200 group/btn"
                      disabled={isProcessing}
                    >
                      <Plus className="h-2 w-2 xs:h-2.5 xs:w-2.5 mr-0.5 transition-transform group-hover/btn:scale-110" />
                      <span className="xs:inline">Add</span>
                      <span className="hidden xs:hidden">+</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Badge */}
            <Badge
              variant="secondary"
              className="text-[8px] xs:text-xs w-full justify-center truncate mt-auto bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors"
            >
              {product.Product_category_name ||
                product.Product_category ||
                "Uncategorized"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading state - KEEPING SECOND CODE STYLING
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-500" />
          <p className="text-lg font-medium">Loading hamper products...</p>
        </motion.div>
      </div>
    );
  }

  // Error state - KEEPING SECOND CODE STYLING
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Unable to Load Products
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchHamperProducts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main render - KEEPING SECOND CODE STYLING BUT ADDING PHONE VERIFICATION MODAL
  return (
    <>
      <style>{`
  body, html {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
  * {
    box-sizing: border-box;
  }
  
  /* Enhanced 320px support */
  @media (max-width: 320px) {
    .container {
      padding-left: 2px;
      padding-right: 2px;
    }
    .hamper-card {
      padding: 6px !important;
    }
    .hamper-item-image {
      width: 48px !important;
      height: 48px !important;
    }
    .quantity-control-btn {
      width: 20px !important;
      height: 20px !important;
    }
    .quantity-display {
      width: 28px !important;
      font-size: 10px !important;
    }
    /* Product cards ultra-compact */
    .product-card-content {
      padding: 4px !important;
    }
    .product-card-image {
      min-height: 120px !important;
    }
  }
  
  /* Add xs breakpoint support */
  @media (min-width: 360px) {
    .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
    .xs\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
    .xs\\:p-2 { padding: 0.5rem; }
    .xs\\:px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .xs\\:gap-2 { gap: 0.5rem; }
    .xs\\:w-12 { width: 3rem; }
    .xs\\:h-12 { height: 3rem; }
    .xs\\:leading-6 { line-height: 1.5rem; }
  }
  
  .xs\\:hidden {
    @media (max-width: 359px) {
      display: none;
    }
  }
  
  /* Line clamp utilities */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`}</style>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-6 px-1 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl px-1">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-2 sm:mb-4 px-1"
          >
            <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 leading-tight">
              Custom <span className="text-purple-600">Hamper Builder</span>
            </h1>
            <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600 leading-tight px-2">
              Create your perfect gift hamper • Min ₹{MINIMUM_HAMPER_AMOUNT}
            </p>
          </motion.div>

          {/* Hamper Status Banner */}
          {totalItems > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md sm:rounded-lg p-1.5 sm:p-3 mb-2 sm:mb-4 mx-1"
            >
              <div className="flex items-center justify-between text-[10px] xs:text-xs sm:text-sm">
                <div className="flex items-center gap-1 min-w-0">
                  <Gift className="w-3 h-3 flex-shrink-0" />
                  <span className="font-semibold truncate">
                    Hamper: {totalItems} • ₹{totalAmount.toLocaleString()}
                  </span>
                </div>
                <Badge className="bg-white/20 text-white text-[9px] xs:text-xs px-1 py-0.5 ml-1 flex-shrink-0">
                  {hamperValidation.isValid ? "Ready!" : `₹${minimumAmountGap}`}
                </Badge>
              </div>
            </motion.div>
          )}

          {/* Tab Interface */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full mx-1"
          >
            {/* Tab Navigation */}
            <div className="bg-white rounded-t-md sm:rounded-t-xl shadow-lg border border-b-0 border-purple-100">
              <TabsList className="w-full h-10 sm:h-12 bg-transparent p-0.5 sm:p-1">
                <TabsTrigger
                  value="explore"
                  className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
                >
                  <Grid3X3 className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden xs:inline">Explore</span>
                  <span className="xs:hidden">Shop</span>
                  <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-purple-100 text-purple-700 px-1 py-0">
                    {filteredProducts.length}
                  </Badge>
                </TabsTrigger>

                <TabsTrigger
                  value="hamper"
                  className="flex-1 h-9 sm:h-10 text-[10px] xs:text-xs sm:text-sm font-medium data-[state=active]:bg-purple-600 data-[state=active]:text-white px-1 sm:px-2"
                >
                  <ShoppingBag className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 mr-0.5 xs:mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="hidden xs:inline">Hamper</span>
                  <span className="xs:hidden">Cart</span>
                  {totalItems > 0 && (
                    <Badge className="ml-0.5 xs:ml-1 sm:ml-2 text-[8px] xs:text-xs bg-orange-500 text-white px-1 py-0">
                      {totalItems}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Mobile Filter Toggle */}
              {activeTab === "explore" && isMobile && (
                <div className="border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full h-8 sm:h-10 justify-between text-[11px] xs:text-xs sm:text-sm text-gray-600 hover:bg-purple-50 px-2"
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden xs:inline">Filters & Search</span>
                      <span className="xs:hidden">Filters</span>
                    </div>
                    {showFilters ? (
                      <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    ) : (
                      <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    )}
                  </Button>
                </div>
              )}

              {/* Mobile Filters */}
              {activeTab === "explore" && isMobile && <MobileFilters />}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-md sm:rounded-b-xl shadow-lg border border-t-0 border-purple-100 min-h-[60vh]">
              {/* Explore Products Tab */}
              <TabsContent value="explore" className="m-0 p-0 w-full">
                {/* Enhanced Explore Tab - Mobile First Design */}
                <div className="bg-gradient-to-br from-purple-50 to-white p-1 sm:p-3 overflow-x-hidden min-h-[60vh]">
                  <div className="container mx-auto max-w-6xl">
                    {/* Enhanced Desktop Filters */}
                    {!isMobile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-100"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Search */}
                          <div className="relative group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                            <Input
                              type="text"
                              placeholder="Search products..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 h-10 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                            />
                          </div>

                          {/* Category */}
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                          >
                            <SelectTrigger className="h-10 border-purple-200 focus:border-purple-500 rounded-lg">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Categories
                              </SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Sort */}
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-10 border-purple-200 focus:border-purple-500 rounded-lg">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="name">Name A-Z</SelectItem>
                              <SelectItem value="price-low">
                                Price: Low to High
                              </SelectItem>
                              <SelectItem value="price-high">
                                Price: High to Low
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Price Range */}
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Min ₹"
                              value={priceRange.min}
                              onChange={(e) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  min: e.target.value,
                                }))
                              }
                              className="h-10 border-purple-200 focus:border-purple-500 rounded-lg"
                            />
                            <Input
                              type="number"
                              placeholder="Max ₹"
                              value={priceRange.max}
                              onChange={(e) =>
                                setPriceRange((prev) => ({
                                  ...prev,
                                  max: e.target.value,
                                }))
                              }
                              className="h-10 border-purple-200 focus:border-purple-500 rounded-lg"
                            />
                          </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchQuery ||
                          selectedCategory !== "all" ||
                          priceRange.min ||
                          priceRange.max ||
                          sortBy !== "name") && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs font-medium text-gray-600">
                              Active filters:
                            </span>
                            {searchQuery && (
                              <Badge variant="secondary" className="text-xs">
                                Search: {searchQuery}
                                <X
                                  className="w-3 h-3 ml-1 cursor-pointer"
                                  onClick={() => setSearchQuery("")}
                                />
                              </Badge>
                            )}
                            {selectedCategory !== "all" && (
                              <Badge variant="secondary" className="text-xs">
                                {selectedCategory}
                                <X
                                  className="w-3 h-3 ml-1 cursor-pointer"
                                  onClick={() => setSelectedCategory("all")}
                                />
                              </Badge>
                            )}
                            {(priceRange.min || priceRange.max) && (
                              <Badge variant="secondary" className="text-xs">
                                ₹{priceRange.min || "0"} - ₹
                                {priceRange.max || "∞"}
                                <X
                                  className="w-3 h-3 ml-1 cursor-pointer"
                                  onClick={() =>
                                    setPriceRange({ min: "", max: "" })
                                  }
                                />
                              </Badge>
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {filteredProducts.length} Product
                          {filteredProducts.length !== 1 ? "s" : ""}
                        </h3>
                        {searchQuery && (
                          <span className="text-xs text-gray-500">
                            for "{searchQuery}"
                          </span>
                        )}
                      </div>

                      {/* Quick Sort on Mobile */}
                      {isMobile && (
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-24 h-8 text-xs border-purple-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name" className="text-xs">
                              A-Z
                            </SelectItem>
                            <SelectItem value="price-low" className="text-xs">
                              ₹ ↑
                            </SelectItem>
                            <SelectItem value="price-high" className="text-xs">
                              ₹ ↓
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Enhanced Products Grid - 320px Optimized */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-2 lg:gap-3">
                      {filteredProducts.map((product, index) => (
                        <motion.div
                          key={product._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                          <ProductCard product={product} />
                        </motion.div>
                      ))}
                    </div>

                    {/* Enhanced Empty State */}
                    {filteredProducts.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8 sm:py-12 px-2"
                      >
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-purple-100 max-w-md mx-auto">
                          <Package className="h-12 w-12 sm:h-16 sm:w-16 text-purple-400 mx-auto mb-4" />
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                            No Products Found
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {searchQuery
                              ? `No products match "${searchQuery}"`
                              : "Try adjusting your filters to see more products"}
                          </p>

                          {/* Quick Reset Filters */}
                          {(searchQuery ||
                            selectedCategory !== "all" ||
                            priceRange.min ||
                            priceRange.max) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                                setPriceRange({ min: "", max: "" });
                                setSortBy("name");
                              }}
                              className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Clear All Filters
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Load More Button (if you have pagination) */}
                    {filteredProducts.length > 0 &&
                      filteredProducts.length % 20 === 0 && (
                        <div className="text-center mt-6">
                          <Button
                            variant="outline"
                            className="border-purple-200 text-purple-600 hover:bg-purple-50"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Load More Products
                          </Button>
                        </div>
                      )}
                  </div>
                </div>
              </TabsContent>

              {/* Hamper Tab */}
              <TabsContent
                value="hamper"
                className="m-0 p-1 xs:p-2 sm:p-4 w-full"
              >
                {/* identical global style block to CartPage */}
                <style>{`
    body, html { overflow-x: hidden !important; max-width: 100vw !important; }
    * { box-sizing: border-box; }
    @media (max-width: 375px) {
      .container { padding-left: 8px; padding-right: 8px; }
    }
  `}</style>

                <div className="bg-gradient-to-br from-purple-50 to-white p-1 xs:p-2 sm:p-4 overflow-x-hidden min-h-[60vh]">
                  <div className="container mx-auto max-w-6xl">
                    {/* empty-hamper state */}
                    {hamperItems.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 px-2">
                        <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                          Your hamper is empty
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6">
                          Start building your custom hamper by adding products
                        </p>
                        <Button
                          onClick={() => setActiveTab("explore")}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Grid3X3 className="w-4 h-4 mr-2" />
                          Explore Products
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* free-delivery banner */}
                        {freeDeliveryGap > 0 && freeDeliveryGap <= 300 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4"
                          >
                            <div className="flex items-center justify-center gap-1 sm:gap-2 text-orange-700 text-xs sm:text-sm">
                              <Truck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="font-semibold text-center">
                                Add ₹{freeDeliveryGap} more for{" "}
                                <span className="text-orange-800 font-bold">
                                  FREE DELIVERY
                                </span>
                              </span>
                            </div>
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                          {/* ───── LEFT PANE – item list ───── */}
                          <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-2 sm:p-3 md:p-4">
                              <div className="space-y-2 sm:space-y-3">
                                {hamperItems.map((item, index) => (
                                  <motion.div
                                    key={`${item.productId._id}-${index}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
                                  >
                                    {/* image */}
                                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
                                      <img
                                        src={
                                          item.productId.Product_image?.[0] ||
                                          "/placeholder-product.jpg"
                                        }
                                        alt={item.productId.Product_name}
                                        className="w-full h-full object-cover rounded-md"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src =
                                            "/placeholder-product.jpg";
                                        }}
                                      />
                                    </div>

                                    {/* info */}
                                    <div className="flex-grow min-w-0">
                                      <div className="space-y-1 sm:space-y-2">
                                        {/* name */}
                                        <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                                          {item.productId.Product_name}
                                        </h3>

                                        {/* price / qty / total */}
                                        <div className="space-y-1">
                                          {/* unit price */}
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] sm:text-xs text-gray-500">
                                              Unit Price:
                                            </span>
                                            <span className="text-xs sm:text-sm font-medium text-purple-600">
                                              ₹
                                              {getItemUnitPrice(
                                                item
                                              ).toLocaleString()}
                                            </span>
                                          </div>

                                          {/* qty controls + line total */}
                                          <div className="flex items-center justify-between gap-2">
                                            {/* qty controls */}
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] sm:text-xs text-gray-500">
                                                Qty:
                                              </span>
                                              <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                                                <button
                                                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-l-md hover:bg-gray-200"
                                                  onClick={() =>
                                                    updateItemQuantity(
                                                      item.productId._id,
                                                      item.quantity - 1
                                                    )
                                                  }
                                                  disabled={isProcessing}
                                                >
                                                  <Minus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                                </button>
                                                <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium">
                                                  {item.quantity}
                                                </span>
                                                <button
                                                  className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-r-md hover:bg-gray-200"
                                                  onClick={() =>
                                                    updateItemQuantity(
                                                      item.productId._id,
                                                      item.quantity + 1
                                                    )
                                                  }
                                                  disabled={isProcessing}
                                                >
                                                  <Plus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                                </button>
                                              </div>
                                            </div>

                                            {/* line total */}
                                            <div className="flex flex-col items-end">
                                              <span className="text-[10px] sm:text-xs text-gray-500">
                                                Total:
                                              </span>
                                              <span className="text-sm sm:text-lg font-bold text-purple-700">
                                                ₹
                                                {getItemTotal(
                                                  item
                                                ).toLocaleString()}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* remove */}
                                        <div className="flex justify-end pt-1">
                                          <button
                                            className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs text-red-500 hover:bg-red-50 rounded-md"
                                            onClick={() =>
                                              removeItemFromHamper(
                                                item.productId._id
                                              )
                                            }
                                            disabled={isProcessing}
                                          >
                                            <Trash2 className="w-3 h-3" />
                                            <span className="hidden sm:inline">
                                              Remove
                                            </span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>

                              {/* bottom buttons */}
                              <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full rounded-full px-3 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
                                  onClick={() => setActiveTab("explore")}
                                >
                                  Continue Adding Products
                                </Button>

                                <div className="flex flex-col sm:flex-row gap-2">
                                  <Button
                                    variant="destructive"
                                    className="flex-1 rounded-full px-3 py-2 text-xs sm:text-sm"
                                    onClick={clearHamper}
                                    disabled={isProcessing}
                                  >
                                    Clear Hamper
                                  </Button>
                                  <Button
                                    className={`flex-1 rounded-full px-3 py-2 text-xs sm:text-sm font-semibold ${
                                      hamperValidation.isValid
                                        ? "bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    onClick={startCheckout}
                                    disabled={
                                      !hamperValidation.isValid || isProcessing
                                    }
                                  >
                                    {hamperValidation.isValid
                                      ? "Checkout"
                                      : `Add ₹${minimumAmountGap} More`}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ───── RIGHT PANE – hamper summary ───── */}
                          <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-3 sm:p-4 sticky top-20">
                              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                                Hamper Summary
                              </h2>

                              {/* item list */}
                              <div className="space-y-1.5 mb-4 max-h-32 sm:max-h-40 overflow-y-auto">
                                {hamperItems.map((item, index) => (
                                  <div
                                    key={`summary-${item.productId._id}-${index}`}
                                    className="flex justify-between items-start text-xs sm:text-sm py-1"
                                  >
                                    <div className="flex-1 min-w-0 mr-2">
                                      <div className="font-medium text-gray-700 truncate leading-tight">
                                        {item.productId.Product_name}
                                      </div>
                                      <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                                        ₹
                                        {getItemUnitPrice(
                                          item
                                        ).toLocaleString()}{" "}
                                        × {item.quantity}
                                      </div>
                                    </div>
                                    <div className="font-semibold text-purple-600 flex-shrink-0">
                                      ₹{getItemTotal(item).toLocaleString()}
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* calculations */}
                              <div className="border-t border-gray-200 pt-3 space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">
                                    Subtotal ({totalItems} items)
                                  </span>
                                  <span className="font-semibold">
                                    ₹{totalAmount.toLocaleString()}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-gray-600">
                                    Delivery Charge
                                  </span>
                                  <span
                                    className={`font-semibold ${
                                      DELIVERY_CHARGE > 0
                                        ? "text-orange-600"
                                        : "text-green-600"
                                    }`}
                                  >
                                    {DELIVERY_CHARGE > 0
                                      ? `₹${DELIVERY_CHARGE}`
                                      : "FREE"}
                                  </span>
                                </div>

                                {/* free-delivery progress */}
                                {DELIVERY_CHARGE > 0 && (
                                  <div className="py-2 px-3 bg-orange-50 rounded-lg border border-orange-100">
                                    <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
                                      <span className="font-medium">
                                        Free Delivery Progress
                                      </span>
                                      <span className="font-bold">
                                        ₹{freeDeliveryGap} more
                                      </span>
                                    </div>
                                    <div className="bg-orange-200 h-2 rounded-full relative overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                                        style={{
                                          width: `${Math.min(
                                            (totalAmount / 500) * 100,
                                            100
                                          )}%`,
                                        }}
                                      />
                                    </div>
                                    <div className="text-[10px] text-orange-600 mt-1 text-center">
                                      {Math.round((totalAmount / 500) * 100)}%
                                      towards free delivery
                                    </div>
                                  </div>
                                )}

                                {/* minimum-amount progress */}
                                {!hamperValidation.isValid && (
                                  <div className="py-2 px-3 bg-red-50 rounded-lg border border-red-100">
                                    <div className="flex items-center justify-between text-xs text-red-700 mb-1">
                                      <span className="font-medium">
                                        Minimum Amount Progress
                                      </span>
                                      <span className="font-bold">
                                        ₹{minimumAmountGap} more
                                      </span>
                                    </div>
                                    <div className="bg-red-200 h-2 rounded-full relative overflow-hidden">
                                      <div
                                        className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-500"
                                        style={{
                                          width: `${Math.min(
                                            (totalAmount /
                                              MINIMUM_HAMPER_AMOUNT) *
                                              100,
                                            100
                                          )}%`,
                                        }}
                                      />
                                    </div>
                                    <div className="text-[10px] text-red-600 mt-1 text-center">
                                      {Math.round(
                                        (totalAmount / MINIMUM_HAMPER_AMOUNT) *
                                          100
                                      )}
                                      % towards minimum
                                    </div>
                                  </div>
                                )}

                                {/* grand total */}
                                <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-200 bg-purple-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-lg">
                                  <span className="text-gray-900">
                                    Total Amount
                                  </span>
                                  <span className="text-purple-700">
                                    ₹
                                    {(
                                      totalAmount + DELIVERY_CHARGE
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              {/* checkout button */}
                              <Button
                                className={`w-full mt-4 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                                  hamperValidation.isValid
                                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                                onClick={startCheckout}
                                disabled={
                                  !hamperValidation.isValid || isProcessing
                                }
                              >
                                {hamperValidation.isValid
                                  ? "Proceed to Checkout"
                                  : `Add ₹${minimumAmountGap} More`}
                              </Button>

                              {/* validation message */}
                              <div className="mt-3 text-center">
                                <div
                                  className={`text-xs px-3 py-2 rounded-xl font-medium ${
                                    hamperValidation.isValid
                                      ? "bg-green-100 text-green-800 border border-green-200"
                                      : "bg-red-100 text-red-800 border border-red-200"
                                  }`}
                                >
                                  {hamperValidation.message}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Rest of your existing modals (Checkout Modal, Phone Verification Modal) remain the same */}
        {/* Checkout Modal - KEEPING SECOND CODE STYLING */}
        <AnimatePresence>
          {isCheckingOut && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center overflow-hidden p-2"
              onClick={() => !checkoutLoading && setIsCheckingOut(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: "100%", scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: "100%", scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 500 }}
                className="bg-white w-full max-w-[95vw] sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-purple-100 sm:border max-h-[95vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="relative flex-shrink-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold">
                        Checkout Custom Hamper
                      </h2>
                      <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
                        Total: ₹
                        {(totalAmount + DELIVERY_CHARGE).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex-shrink-0"
                      onClick={() =>
                        !checkoutLoading && setIsCheckingOut(false)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
                  {/* Compact Hamper Summary */}
                  <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
                      <Gift className="w-3 h-3" />
                      Custom Hamper ({totalItems} items)
                    </h3>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium border-b border-purple-200 pb-1">
                        <span>Hamper Total</span>
                        <span>₹{totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-orange-600">
                        <span>Delivery</span>
                        <span>
                          {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
                        <span>Total Amount</span>
                        <span>
                          ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  {/* <form onSubmit={handleHamperCheckout} className="space-y-3"> */}
                   
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <Label
                          htmlFor="fullName"
                          className="text-xs font-medium text-gray-700"
                        >
                          Full Name *
                        </Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Enter your full name"
                          value={shippingAddress.fullName}
                          onChange={handleInputChange}
                          required
                          className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="phone"
                          className="text-xs font-medium text-gray-700"
                        >
                          Phone Number *
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={shippingAddress.phone}
                          onChange={handleInputChange}
                          required
                          className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="address"
                          className="text-xs font-medium text-gray-700"
                        >
                          Address *
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="Enter your address"
                          value={shippingAddress.address}
                          onChange={handleInputChange}
                          required
                          className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label
                            htmlFor="city"
                            className="text-xs font-medium text-gray-700"
                          >
                            City *
                          </Label>
                          <Input
                            id="city"
                            name="city"
                            placeholder="City"
                            value={shippingAddress.city}
                            onChange={handleInputChange}
                            required
                            className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label
                            htmlFor="state"
                            className="text-xs font-medium text-gray-700"
                          >
                            State *
                          </Label>
                          <Input
                            id="state"
                            name="state"
                            placeholder="State"
                            value={shippingAddress.state}
                            onChange={handleInputChange}
                            required
                            className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label
                          htmlFor="pinCode"
                          className="text-xs font-medium text-gray-700"
                        >
                          PIN Code *
                        </Label>
                        <Input
                          id="pinCode"
                          name="pinCode"
                          placeholder="PIN Code"
                          value={shippingAddress.pinCode}
                          onChange={handleInputChange}
                          required
                          className="h-9 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  {/* </form> */}
                </div>

                {/* Fixed Bottom - NEW PAYMENT BUTTONS */}
                <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 space-y-3">
                  {/* Payment Buttons */}
                  <div className="space-y-2">
                    {/* Pay Online Button */}
                    <Button
                      onClick={() => handlePaymentSelection("online")}
                      disabled={checkoutLoading}
                      className="w-full h-10 text-sm rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {checkoutLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" />
                          Pay Online - ₹
                          {(totalAmount + DELIVERY_CHARGE).toLocaleString()}
                        </div>
                      )}
                    </Button>

                    {/* Cash on Delivery Button */}
                    <Button
                      onClick={() => handlePaymentSelection("cod")}
                      disabled={checkoutLoading}
                      variant="outline"
                      className="w-full h-10 text-sm rounded-full border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {checkoutLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Truck className="w-4 h-4" />
                          Cash on Delivery - ₹
                          {(totalAmount + DELIVERY_CHARGE).toLocaleString()}
                        </div>
                      )}
                    </Button>
                  </div>

                  {/* Payment Security Info */}
                  <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" />
                    <span>UPI • Cards • Net Banking • COD Available</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phone Verification Modal - PROFESSIONAL VERSION */}
        <AnimatePresence>
          {phoneVerification.showPhoneVerification && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
              onClick={() =>
                !phoneVerification.isVerifyingPhone && !phoneVerification.isVerifyingOTP && phoneVerification.resetPhoneVerification()
              }
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className="bg-white w-full max-w-sm mx-auto rounded-3xl shadow-2xl border border-gray-100 max-h-[96vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Compact Header */}
                <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white px-4 py-5 sm:px-6 sm:py-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                        {!phoneVerification.showOTPInput ? (
                          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold mb-0.5 tracking-tight leading-tight">
                          {!phoneVerification.showOTPInput ? "Verify Phone" : "Enter Code"}
                        </h2>
                        <p className="text-white/80 text-xs sm:text-sm font-medium">
                          {!phoneVerification.showOTPInput ? "Secure checkout" : "Almost done"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-white/10 text-white border border-white/20 backdrop-blur-sm transition-all duration-200 flex-shrink-0"
                      onClick={() =>
                        !phoneVerification.isVerifyingPhone &&
                        !phoneVerification.isVerifyingOTP &&
                        phoneVerification.resetPhoneVerification()
                      }
                      disabled={phoneVerification.isVerifyingPhone || phoneVerification.isVerifyingOTP}
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>
                </div>

                {/* Optimized Content */}
                <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
                  {!phoneVerification.showOTPInput ? (
                    // Phone Number Input - Mobile Optimized
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-200">
                          <Phone className="w-8 h-8 sm:w-9 sm:h-9 text-blue-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                          Enter Mobile Number
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed px-2">
                          We'll verify your number for secure checkout
                        </p>
                      </div>

                      <form
                        onSubmit={phoneVerification.handlePhoneVerification}
                        className="space-y-5"
                      >
                        <div className="space-y-2">
                          <Label
                            htmlFor="phoneVerification.phoneNumber"
                            className="text-sm font-semibold text-gray-800 flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4 text-blue-600" />
                            Mobile Number *
                          </Label>
                          <div className="relative group">
                            <Input
                              id="phoneVerification.phoneNumber"
                              type="tel"
                              placeholder="Enter 10-digit mobile number"
                              value={phoneVerification.phoneNumber}
                              onChange={(e) => {
                                const value = e.target.value
                                  .replace(/\D/g, "")
                                  .slice(0, 10);
                                phoneVerification.setPhoneNumber(value);
                              }}
                              required
                              className="h-12 sm:h-14 text-base sm:text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-2xl transition-all duration-200 bg-gray-50 focus:bg-white group-hover:border-gray-300 text-center tracking-wide font-medium"
                              maxLength={10}
                            />
                            {phoneVerification.phoneNumber.length === 10 && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              </div>
                            )}
                          </div>
                          {phoneVerification.phoneNumber && phoneVerification.phoneNumber.length !== 10 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="bg-red-50 border border-red-200 rounded-xl p-3"
                            >
                              <p className="text-red-600 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Please enter all 10 digits</span>
                              </p>
                            </motion.div>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={
                            phoneVerification.isVerifyingPhone || phoneVerification.phoneNumber.length !== 10
                          }
                          className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {phoneVerification.isVerifyingPhone ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Verifying...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Shield className="w-5 h-5" />
                              <span>Send Verification Code</span>
                            </div>
                          )}
                        </Button>

                        {/* Trust Badges - Mobile Optimized */}
                        <div className="flex items-center justify-center gap-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Secure</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Fast</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>Private</span>
                          </div>
                        </div>
                      </form>
                    </div>
                  ) : (
                    // OTP Input - Mobile Optimized
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                          <MessageSquare className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                          Enter Verification Code
                        </h3>
                        <p className="text-gray-600 mb-3 text-sm leading-relaxed px-2">
                          4-digit code sent to your mobile
                        </p>
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-2 rounded-2xl border border-gray-200 inline-block">
                          <p className="font-bold text-gray-800 text-base">
                            {phoneVerification.phoneNumber.replace(/(\d{5})(\d{5})/, "$1-$2")}
                          </p>
                        </div>
                      </div>

                      <form
                        onSubmit={phoneVerification.handleOTPVerification}
                        className="space-y-5"
                      >
                        <div className="space-y-3">
                          <Label
                            htmlFor="phoneVerification.otp"
                            className="text-sm font-semibold text-gray-800 flex items-center gap-2 justify-center"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            Verification Code *
                          </Label>

                          {/* Mobile-Optimized OTP Input */}
                          <div className="flex justify-center gap-2 sm:gap-3">
                            {[...Array(4)].map((_, index) => (
                              <input
                                key={index}
                                ref={(el) => {
                                  otpInputRefs.current[index] = el;
                                }}
                                type="text"
                                value={phoneVerification.otp[index] || ""}
                                onChange={(e) => {
                                  const value = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 1);
                                  const newOtp = phoneVerification.otp.split("");
                                  newOtp[index] = value;
                                  const updatedOtp = newOtp
                                    .join("")
                                    .slice(0, 4);
                                  phoneVerification.setOtp(updatedOtp);

                                  // Auto-focus next input
                                  if (
                                    value &&
                                    index < 3 &&
                                    otpInputRefs.current[index + 1]
                                  ) {
                                    otpInputRefs.current[index + 1]?.focus();
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Backspace" &&
                                    !phoneVerification.otp[index] &&
                                    index > 0 &&
                                    otpInputRefs.current[index - 1]
                                  ) {
                                    otpInputRefs.current[index - 1]?.focus();
                                  }
                                }}
                                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold border-2 border-gray-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 rounded-2xl bg-gray-50 focus:bg-white transition-all duration-200"
                                maxLength={1}
                                inputMode="numeric"
                              />
                            ))}
                          </div>

                          {phoneVerification.otp && phoneVerification.otp.length > 0 && phoneVerification.otp.length !== 4 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="bg-amber-50 border border-amber-200 rounded-xl p-3"
                            >
                              <p className="text-amber-700 text-sm flex items-center justify-center gap-2">
                                <Clock className="w-4 h-4 flex-shrink-0" />
                                <span>{4 - phoneVerification.otp.length} more digits needed</span>
                              </p>
                            </motion.div>
                          )}
                        </div>

                        <Button
                          type="submit"
                          disabled={phoneVerification.isVerifyingOTP || phoneVerification.otp.length !== 4}
                          className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                        >
                          {phoneVerification.isVerifyingOTP ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Verifying...</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <CheckCircle className="w-5 h-5" />
                              <span>Complete Verification</span>
                            </div>
                          )}
                        </Button>

                        {/* Mobile-Optimized Resend Section */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                          <div className="text-center space-y-3">
                            {phoneVerification.otpTimer > 0 ? (
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                  Didn't receive the code?
                                </p>
                                <div className="flex items-center justify-center gap-2">
                                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                  <span className="text-sm font-semibold text-blue-600">
                                    Resend in {phoneVerification.otpTimer}s
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <p className="text-sm text-gray-600">
                                  Didn't receive the code?
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={phoneVerification.handleResendOTP}
                                    disabled={phoneVerification.isVerifyingPhone}
                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 font-semibold rounded-xl"
                                  >
                                    {phoneVerification.isVerifyingPhone ? (
                                      <div className="flex items-center gap-1.5">
                                        <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-1.5">
                                        <RotateCcw className="w-3 h-3" />
                                        <span>Resend Code</span>
                                      </div>
                                    )}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      phoneVerification.setShowOTPInput(false);
                                      phoneVerification.setOtp("");
                                    }}
                                    className="text-gray-600 border-gray-200 hover:bg-gray-50 rounded-xl"
                                  >
                                    <ArrowLeft className="w-3 h-3 mr-1" />
                                    <span>Change Number</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Compact Footer */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                    <Lock className="w-3 h-3" />
                    <span>Secure & encrypted</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* // Add this before your closing fragment (</>) at the end of your JSX */}
<PhoneVerificationModal
  showPhoneVerification={phoneVerification.showPhoneVerification}
  phoneNumber={phoneVerification.phoneNumber}
  setPhoneNumber={phoneVerification.setPhoneNumber}
  otp={phoneVerification.otp}
  setOtp={phoneVerification.setOtp}
  otpInputRefs={phoneVerification.otpInputRefs}
  otpTimer={phoneVerification.otpTimer}
  showOTPInput={phoneVerification.showOTPInput}
  setShowOTPInput={phoneVerification.setShowOTPInput}
  isVerifyingPhone={phoneVerification.isVerifyingPhone}
  isVerifyingOTP={phoneVerification.isVerifyingOTP}
  handlePhoneVerification={phoneVerification.handlePhoneVerification}
  handleOTPVerification={phoneVerification.handleOTPVerification}
  handleResendOTP={phoneVerification.handleResendOTP}
  resetPhoneVerification={phoneVerification.resetPhoneVerification}
/>
    </>
  );
};

export default CustomHamperBuilder;
