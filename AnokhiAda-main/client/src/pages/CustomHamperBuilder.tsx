// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../components/CartContext";
// import { useAuth } from "../components/AuthContext";
// import { useToast } from "../components/ui/use-toast";
// import axiosInstance from "../utils/axiosConfig";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../components/ui/card";
// import { Button } from "../components/ui/button";
// import { Badge } from "../components/ui/badge";
// import { Separator } from "../components/ui/separator";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/tabs";
// import { ScrollArea } from "../components/ui/scroll-area";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../components/ui/alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../components/ui/select";
// import { Checkbox } from "../components/ui/checkbox";
// import {
//   Plus,
//   Minus,
//   X,
//   ShoppingCart,
//   Package,
//   Gift,
//   Star,
//   Filter,
//   Search,
//   RefreshCw,
//   AlertCircle,
//   CheckCircle,
//   Trash2,
//   Eye,
//   Heart,
// } from "lucide-react";

// const CustomHamperBuilder = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const { addToCart } = useCart();

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
//   const [showFilters, setShowFilters] = useState(false);

//   // UI state
//   const [isAddingToCart, setIsAddingToCart] = useState(false);
//   const [showPreview, setShowPreview] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   // Constants
//   const MINIMUM_HAMPER_AMOUNT = 200;
//   const MINIMUM_ITEMS = 1;
//   const MAXIMUM_ITEMS = 15;

//   // ✅ UPDATED: localStorage management functions
//   const saveHamperToLocalStorage = useCallback(() => {
//     if (!user) return;

//     const hamperData = {
//       items: hamperItems,
//       totalAmount,
//       totalItems,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       localStorage.setItem(`hamper_${user._id}`, JSON.stringify(hamperData));
//       console.log("Hamper saved to localStorage:", hamperData);
//     } catch (error) {
//       console.error("Error saving hamper to localStorage:", error);
//     }
//   }, [hamperItems, totalAmount, totalItems, user]);

//   const loadHamperFromLocalStorage = useCallback(() => {
//     if (!user) return null;

//     try {
//       const savedData = localStorage.getItem(`hamper_${user._id}`);
//       if (savedData) {
//         const parsed = JSON.parse(savedData);
//         console.log("Hamper loaded from localStorage:", parsed);
//         return parsed;
//       }
//     } catch (error) {
//       console.error("Error loading hamper from localStorage:", error);
//     }
//     return null;
//   }, [user]);

//   // ✅ UPDATED: Fetch products for hamper
//   const fetchHamperProducts = useCallback(async () => {
//     try {
//       setLoading(true);
//       const response = await axiosInstance.get("api/products/hamper-eligible");

//       if (response.data && response.data.products) {
//         const hamperProducts = response.data.products.filter(
//           (product) =>
//             product.Product_available &&
//             product.isHamper_product &&
//             product.Hamper_price &&
//             product.Hamper_price > 0
//         );

//         setProducts(hamperProducts);
//         setFilteredProducts(hamperProducts);

//         // Extract unique categories
//         const uniqueCategories = [
//           ...new Set(hamperProducts.map((p) => p.Product_category)),
//         ].filter(Boolean);
//         setCategories(uniqueCategories);

//         console.log(`Loaded ${hamperProducts.length} hamper-eligible products`);
//       }
//     } catch (error) {
//       console.error("Error fetching hamper products:", error);
//       setError("Failed to load products. Please try again.");
//       toast({
//         title: "Error",
//         description: "Failed to load products for hamper building",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [toast]);

//   // ✅ UPDATED: Fetch user's hamper from database or localStorage
//   const fetchUserHamper = useCallback(async () => {
//     if (!user) return;

//     try {
//       // Try to fetch from your existing hamper endpoint first
//       const response = await axiosInstance.get("/hamper");
//       const data = response.data;

//       if (data.hamper && data.hamper.length > 0) {
//         setHamperItems(data.hamper);
//         setTotalAmount(data.totalAmount || 0);
//         setTotalItems(data.totalItems || 0);
//         console.log("Hamper loaded from database:", data);
//         return;
//       }
//     } catch (error) {
//       console.error("Error fetching hamper from database:", error);
//     }

//     // Fallback to localStorage
//     const localData = loadHamperFromLocalStorage();
//     if (localData) {
//       setHamperItems(localData.items);
//       setTotalAmount(localData.totalAmount);
//       setTotalItems(localData.totalItems);
//     } else {
//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);
//     }
//   }, [user, loadHamperFromLocalStorage]);

//   // ✅ Initialize component
//   useEffect(() => {
//     fetchHamperProducts();
//     fetchUserHamper();
//   }, [fetchHamperProducts, fetchUserHamper]);

//   // ✅ Save to localStorage whenever hamper changes
//   useEffect(() => {
//     if (hamperItems.length > 0) {
//       saveHamperToLocalStorage();
//     }
//   }, [hamperItems, saveHamperToLocalStorage]);

//   // ✅ Filter and search logic
//   useEffect(() => {
//     let filtered = [...products];

//     // Search filter
//     if (searchQuery) {
//       filtered = filtered.filter((product) =>
//         product.Product_name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     // Category filter
//     if (selectedCategory !== "all") {
//       filtered = filtered.filter(
//         (product) => product.Product_category === selectedCategory
//       );
//     }

//     // Price range filter
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

//     // Sort
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

//   // ✅ Calculate hamper totals
//   const calculateHamperTotal = useMemo(() => {
//     return hamperItems.reduce((total, item) => {
//       const price = item.productId.Hamper_price || item.productId.Product_price;
//       return total + price * item.quantity;
//     }, 0);
//   }, [hamperItems]);

//   useEffect(() => {
//     setTotalAmount(calculateHamperTotal);
//     setTotalItems(hamperItems.reduce((sum, item) => sum + item.quantity, 0));
//   }, [calculateHamperTotal, hamperItems]);

//   // ✅ Hamper validation
//   const hamperValidation = useMemo(() => {
//     const itemCount = hamperItems.reduce((sum, item) => sum + item.quantity, 0);
//     const totalValue = calculateHamperTotal;

//     if (itemCount < MINIMUM_ITEMS) {
//       return {
//         isValid: false,
//         message: `Add at least ${MINIMUM_ITEMS} items to create a hamper`,
//       };
//     }

//     if (itemCount > MAXIMUM_ITEMS) {
//       return {
//         isValid: false,
//         message: `Maximum ${MAXIMUM_ITEMS} items allowed in a hamper`,
//       };
//     }

//     if (totalValue < MINIMUM_HAMPER_AMOUNT) {
//       return {
//         isValid: false,
//         message: `Minimum hamper value is ₹${MINIMUM_HAMPER_AMOUNT}`,
//       };
//     }

//     return { isValid: true, message: "Hamper is ready!" };
//   }, [hamperItems, calculateHamperTotal]);

//   // ✅ UPDATED: Add item to hamper
//   // In CustomHamperBuilder.jsx - Replace addItemToHamper function
// const addItemToHamper = async (product) => {
//   try {
//     console.log('🎁 Adding product to hamper:', product.Product_name);

//     const response = await axiosInstance.post('/hamper/add', {
//       productId: product._id,
//       quantity: 1
//     });

//     if (response.data) {
//       // Update local hamper state
//       setHamperItems(response.data.hamper);
//       setHamperTotal(response.data.totalAmount);

//       toast({
//         title: "Added to Hamper",
//         description: `${product.Product_name} added to your custom hamper`,
//       });
//     }
//   } catch (error) {
//     console.error('Error adding to hamper:', error);
//     toast({
//       title: "Error",
//       description: error.response?.data?.message || "Failed to add item to hamper",
//       variant: "destructive",
//     });
//   }
// };

// // Update removeItemFromHamper function
// const removeItemFromHamper = async (hamperItemId) => {
//   try {
//     const response = await axiosInstance.delete(`/hamper/remove/${hamperItemId}`);

//     if (response.data) {
//       setHamperItems(response.data.hamper);
//       setHamperTotal(response.data.totalAmount);
//     }
//   } catch (error) {
//     console.error('Error removing from hamper:', error);
//   }
// };

// // Update updateItemQuantity function
// const updateItemQuantity = async (hamperItemId, newQuantity) => {
//   try {
//     const response = await axiosInstance.put(`/hamper/update/${hamperItemId}`, {
//       quantity: newQuantity
//     });

//     if (response.data) {
//       setHamperItems(response.data.hamper);
//       setHamperTotal(response.data.totalAmount);
//     }
//   } catch (error) {
//     console.error('Error updating hamper quantity:', error);
//   }
// };

// // Add a new checkout function for direct checkout from hamper
// const checkoutFromHamper = async () => {
//   if (hamperItems.length === 0) {
//     toast({
//       title: "Empty Hamper",
//       description: "Please add items to your hamper before checkout",
//       variant: "destructive",
//     });
//     return;
//   }

//   try {
//     // Navigate to hamper checkout page
//     navigate('/hamper-checkout');
//   } catch (error) {
//     console.error('Error initiating hamper checkout:', error);
//   }
// };

//   // ✅ Update item quantity
//   const updateItemQuantity = async (itemId, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeItemFromHamper(itemId);
//       return;
//     }

//     const updatedItems = hamperItems.map((item) =>
//       item._id === itemId ? { ...item, quantity: newQuantity } : item
//     );

//     setHamperItems(updatedItems);
//     await syncHamperWithDatabase(updatedItems);
//   };

//   // ✅ Remove item from hamper
//   const removeItemFromHamper = async (itemId) => {
//     const updatedItems = hamperItems.filter((item) => item._id !== itemId);
//     setHamperItems(updatedItems);

//     if (updatedItems.length === 0) {
//       if (user) {
//         localStorage.removeItem(`hamper_${user._id}`);
//       }
//       try {
//         await axiosInstance.delete("/hamper/clear");
//       } catch (error) {
//         console.error("Error clearing hamper:", error);
//       }
//     } else {
//       await syncHamperWithDatabase(updatedItems);
//     }

//     toast({
//       title: "Item Removed",
//       description: "Item removed from hamper",
//       duration: 2000,
//     });
//   };

//   // ✅ Clear entire hamper
//   const clearHamper = async () => {
//     setHamperItems([]);
//     setTotalAmount(0);
//     setTotalItems(0);

//     if (user) {
//       localStorage.removeItem(`hamper_${user._id}`);
//     }

//     try {
//       await axiosInstance.delete("/hamper/clear");
//     } catch (error) {
//       console.error("Error clearing hamper:", error);
//     }

//     setShowClearConfirm(false);
//     toast({
//       title: "Hamper Cleared",
//       description: "All items removed from hamper",
//       duration: 2000,
//     });
//   };

//   // ✅ Sync hamper with database
//   const syncHamperWithDatabase = async (items = hamperItems) => {
//     if (!user || items.length === 0) return;

//     try {
//       const response = await axiosInstance.post("/hamper/sync", {
//         items: items.map((item) => ({
//           id: item.productId._id,
//           quantity: item.quantity,
//         })),
//       });

//       console.log("Hamper synced with database:", response.data);
//     } catch (error) {
//       console.error("Error syncing hamper with database:", error);
//       // Continue with localStorage as fallback
//     }
//   };

//   // ✅ UPDATED: Add hamper to cart - KEY CHANGE FOR UNIFIED CART
//   const addHamperToCart = async () => {
//     if (!hamperValidation.isValid) {
//       toast({
//         title: "Cannot Add to Cart",
//         description: hamperValidation.message,
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsAddingToCart(true);
//     try {
//       // ✅ NEW: Create unified hamper data with both new and legacy format
//       const unifiedHamperData = {
//         type: "hamper",
//         productId: `HAMPER_${Date.now()}`, // Unique hamper identifier
//         quantity: 1,
//         price: calculateHamperTotal,
//         hamperItems: hamperItems.map((item) => ({
//           productId: item.productId._id,
//           quantity: item.quantity,
//         })),

//         // ✅ LEGACY SUPPORT: Include your existing hamper structure for backward compatibility
//         isHamperItem: true,
//         hamperDetails: {
//           totalHamperItems: totalItems,
//           hamperMinimum: MINIMUM_HAMPER_AMOUNT,
//           originalHamperData: hamperItems.map((item) => ({
//             productId: item.productId._id,
//             quantity: item.quantity,
//             hamperPrice:
//               item.productId.Hamper_price || item.productId.Product_price,
//             productName: item.productId.Product_name,
//             productImage: item.productId.Product_image[0],
//           })),
//         },
//       };

//       console.log("🎁 Adding hamper to unified cart:", unifiedHamperData);

//       // ✅ Use unified cart endpoint
//       const response = await axiosInstance.post("/cart/add", unifiedHamperData);

//       console.log("✅ Hamper added to cart:", response.data);

//       // ✅ Clear separate hamper collection (optional cleanup)
//       try {
//         await axiosInstance.delete("/hamper/clear");
//       } catch (hamperClearError) {
//         console.log(
//           "Note: Hamper collection clear failed (might not exist):",
//           hamperClearError.message
//         );
//       }

//       // ✅ Clear local state and localStorage immediately
//       setHamperItems([]);
//       setTotalAmount(0);
//       setTotalItems(0);
//       if (user) {
//         localStorage.removeItem(`hamper_${user._id}`);
//       }

//       // ✅ Update global cart context if you're using it
//       if (addToCart) {
//         // This will trigger a cart refresh in your context
//         await addToCart({ id: "refresh" }); // Trigger refresh
//       }

//       toast({
//         title: "Hamper Added to Cart! 🎁",
//         description: `Your custom hamper (₹${calculateHamperTotal.toLocaleString()}) is ready for checkout`,
//         duration: 3000,
//       });

//       navigate("/cart");
//     } catch (error) {
//       console.error("Error adding hamper to cart:", error);
//       toast({
//         title: "Error",
//         description:
//           error.response?.data?.message ||
//           "Failed to add hamper to cart. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsAddingToCart(false);
//     }
//   };

//   // ✅ Product card component
//   const ProductCard = ({ product }) => {
//     const isInHamper = hamperItems.some(
//       (item) => item.productId._id === product._id
//     );
//     const hamperPrice = product.Hamper_price || product.Product_price;
//     const regularPrice = product.Product_price;
//     const discount =
//       regularPrice > hamperPrice
//         ? ((regularPrice - hamperPrice) / regularPrice) * 100
//         : 0;

//     return (
//       <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
//         <CardHeader className="p-0">
//           <div className="relative overflow-hidden rounded-t-lg">
//             <img
//               src={product.Product_image?.[0] || "/placeholder-product.jpg"}
//               alt={product.Product_name}
//               className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
//               onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//                 e.currentTarget.src = "/placeholder-product.jpg";
//               }}
//             />
//             {discount > 0 && (
//               <Badge className="absolute top-2 left-2 bg-green-500 text-white">
//                 {discount.toFixed(0)}% OFF
//               </Badge>
//             )}
//             <div className="absolute top-2 right-2 flex gap-1">
//               <Button
//                 variant="secondary"
//                 size="sm"
//                 className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
//                 onClick={() => setSelectedProduct(product)}
//               >
//                 <Eye className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="p-4">
//           <div className="space-y-2">
//             <h3 className="font-semibold text-sm line-clamp-2 min-h-[2.5rem]">
//               {product.Product_name}
//             </h3>

//             <div className="flex items-center justify-between">
//               <div className="flex flex-col">
//                 <span className="text-lg font-bold text-green-600">
//                   ₹{hamperPrice.toLocaleString()}
//                 </span>
//                 {discount > 0 && (
//                   <span className="text-sm text-gray-500 line-through">
//                     ₹{regularPrice.toLocaleString()}
//                   </span>
//                 )}
//               </div>

//               {isInHamper ? (
//                 <div className="flex items-center gap-1">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-8 w-8 p-0"
//                     onClick={() => {
//                       const item = hamperItems.find(
//                         (item) => item.productId._id === product._id
//                       );
//                       updateItemQuantity(item._id, item.quantity - 1);
//                     }}
//                   >
//                     <Minus className="h-3 w-3" />
//                   </Button>

//                   <span className="w-8 text-center font-medium">
//                     {hamperItems.find(
//                       (item) => item.productId._id === product._id
//                     )?.quantity || 0}
//                   </span>

//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="h-8 w-8 p-0"
//                     onClick={() => {
//                       const item = hamperItems.find(
//                         (item) => item.productId._id === product._id
//                       );
//                       updateItemQuantity(item._id, item.quantity + 1);
//                     }}
//                   >
//                     <Plus className="h-3 w-3" />
//                   </Button>
//                 </div>
//               ) : (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => addItemToHamper(product)}
//                   className="hover:bg-green-50 hover:border-green-500 hover:text-green-600"
//                 >
//                   <Plus className="h-4 w-4 mr-1" />
//                   Add
//                 </Button>
//               )}
//             </div>

//             <Badge variant="secondary" className="text-xs">
//               {product.Product_category}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   };

//   // ✅ Hamper summary component
//   const HamperSummary = () => (
//     <Card className="sticky top-4">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Gift className="h-5 w-5 text-amber-500" />
//           Your Custom Hamper
//           <Badge variant={hamperValidation.isValid ? "default" : "destructive"}>
//             {totalItems} items
//           </Badge>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {hamperItems.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
//             <p className="text-sm">
//               Start building your hamper by adding products
//             </p>
//             <p className="text-xs mt-1">
//               Minimum {MINIMUM_ITEMS} items required
//             </p>
//           </div>
//         ) : (
//           <>
//             <ScrollArea className="h-64">
//               <div className="space-y-2">
//                 {hamperItems.map((item) => (
//                   <div
//                     key={item._id}
//                     className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
//                   >
//                     <img
//                       src={
//                         item.productId.Product_image?.[0] ||
//                         "/placeholder-product.jpg"
//                       }
//                       alt={item.productId.Product_name}
//                       className="h-12 w-12 object-cover rounded"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium truncate">
//                         {item.productId.Product_name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         ₹
//                         {(
//                           item.productId.Hamper_price ||
//                           item.productId.Product_price
//                         ).toLocaleString()}{" "}
//                         × {item.quantity}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-6 w-6 p-0"
//                         onClick={() =>
//                           updateItemQuantity(item._id, item.quantity - 1)
//                         }
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-6 text-center text-sm">
//                         {item.quantity}
//                       </span>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-6 w-6 p-0"
//                         onClick={() =>
//                           updateItemQuantity(item._id, item.quantity + 1)
//                         }
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
//                         onClick={() => removeItemFromHamper(item._id)}
//                       >
//                         <X className="h-3 w-3" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>

//             <Separator />

//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Items ({totalItems})</span>
//                 <span>₹{calculateHamperTotal.toLocaleString()}</span>
//               </div>

//               <div className="flex justify-between font-semibold text-lg">
//                 <span>Total</span>
//                 <span className="text-green-600">
//                   ₹{calculateHamperTotal.toLocaleString()}
//                 </span>
//               </div>

//               {calculateHamperTotal < MINIMUM_HAMPER_AMOUNT && (
//                 <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
//                   Add ₹
//                   {(
//                     MINIMUM_HAMPER_AMOUNT - calculateHamperTotal
//                   ).toLocaleString()}{" "}
//                   more for minimum hamper value
//                 </p>
//               )}
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 onClick={() => setShowPreview(true)}
//                 variant="outline"
//                 className="flex-1"
//                 disabled={!hamperValidation.isValid}
//               >
//                 Preview
//               </Button>
//               <Button
//                 onClick={() => setShowClearConfirm(true)}
//                 variant="ghost"
//                 size="sm"
//                 className="text-red-500 hover:text-red-700"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>

//             <Button
//               onClick={addHamperToCart}
//               disabled={!hamperValidation.isValid || isAddingToCart}
//               className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//             >
//               {isAddingToCart ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                   Adding to Cart...
//                 </>
//               ) : (
//                 <>
//                   <ShoppingCart className="h-4 w-4 mr-2" />
//                   Add Hamper to Cart
//                 </>
//               )}
//             </Button>

//             <div className="text-center">
//               <Badge
//                 variant={hamperValidation.isValid ? "default" : "destructive"}
//                 className="text-xs"
//               >
//                 {hamperValidation.message}
//               </Badge>
//             </div>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );

//   // ✅ Loading and error states
//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-center">
//             <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-green-500" />
//             <p className="text-lg font-medium">Loading hamper products...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="text-center py-12">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold mb-2">
//             Unable to Load Products
//           </h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <Button onClick={fetchHamperProducts}>
//             <RefreshCw className="h-4 w-4 mr-2" />
//             Try Again
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Main render
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent mb-2">
//             Custom Hamper Builder
//           </h1>
//           <p className="text-gray-600 max-w-2xl mx-auto">
//             Create your perfect gift hamper by selecting from our premium
//             products. Mix and match to create something truly special.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Filters Sidebar */}
//           <div className="lg:col-span-1">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <Filter className="h-5 w-5" />
//                   Filters
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {/* Search */}
//                 <div>
//                   <Label htmlFor="search">Search Products</Label>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                     <Input
//                       id="search"
//                       type="text"
//                       placeholder="Search..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className="pl-10"
//                     />
//                   </div>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <Label htmlFor="category">Category</Label>
//                   <Select
//                     value={selectedCategory}
//                     onValueChange={setSelectedCategory}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="All Categories" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Categories</SelectItem>
//                       {categories.map((category) => (
//                         <SelectItem key={category} value={category}>
//                           {category}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Price Range */}
//                 <div>
//                   <Label>Price Range</Label>
//                   <div className="grid grid-cols-2 gap-2">
//                     <Input
//                       type="number"
//                       placeholder="Min"
//                       value={priceRange.min}
//                       onChange={(e) =>
//                         setPriceRange((prev) => ({
//                           ...prev,
//                           min: e.target.value,
//                         }))
//                       }
//                     />
//                     <Input
//                       type="number"
//                       placeholder="Max"
//                       value={priceRange.max}
//                       onChange={(e) =>
//                         setPriceRange((prev) => ({
//                           ...prev,
//                           max: e.target.value,
//                         }))
//                       }
//                     />
//                   </div>
//                 </div>

//                 {/* Sort */}
//                 <div>
//                   <Label htmlFor="sort">Sort By</Label>
//                   <Select value={sortBy} onValueChange={setSortBy}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="name">Name (A-Z)</SelectItem>
//                       <SelectItem value="price-low">
//                         Price (Low to High)
//                       </SelectItem>
//                       <SelectItem value="price-high">
//                         Price (High to Low)
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Clear Filters */}
//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setSelectedCategory("all");
//                     setPriceRange({ min: "", max: "" });
//                     setSortBy("name");
//                   }}
//                   className="w-full"
//                 >
//                   Clear Filters
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Products Grid */}
//           <div className="lg:col-span-2">
//             <div className="mb-4 flex items-center justify-between">
//               <p className="text-sm text-gray-600">
//                 {filteredProducts.length} products available
//               </p>
//             </div>

//             {filteredProducts.length === 0 ? (
//               <div className="text-center py-12">
//                 <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No products found
//                 </h3>
//                 <p className="text-gray-500">Try adjusting your filters</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {filteredProducts.map((product) => (
//                   <ProductCard key={product._id} product={product} />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Hamper Summary */}
//           <div className="lg:col-span-1">
//             <HamperSummary />
//           </div>
//         </div>
//       </div>

//       {/* Product Preview Dialog */}
//       <Dialog
//         open={!!selectedProduct}
//         onOpenChange={() => setSelectedProduct(null)}
//       >
//         <DialogContent className="max-w-2xl">
//           {selectedProduct && (
//             <>
//               <DialogHeader>
//                 <DialogTitle>{selectedProduct.Product_name}</DialogTitle>
//                 <DialogDescription>
//                   {selectedProduct.Product_category}
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <img
//                     src={
//                       selectedProduct.Product_image?.[0] ||
//                       "/placeholder-product.jpg"
//                     }
//                     alt={selectedProduct.Product_name}
//                     className="w-full h-64 object-cover rounded-lg"
//                   />
//                 </div>
//                 <div className="space-y-4">
//                   <div>
//                     <p className="text-2xl font-bold text-green-600">
//                       ₹
//                       {(
//                         selectedProduct.Hamper_price ||
//                         selectedProduct.Product_price
//                       ).toLocaleString()}
//                     </p>
//                     {selectedProduct.Hamper_price &&
//                       selectedProduct.Product_price >
//                         selectedProduct.Hamper_price && (
//                         <p className="text-sm text-gray-500 line-through">
//                           ₹{selectedProduct.Product_price.toLocaleString()}
//                         </p>
//                       )}
//                   </div>

//                   <Button
//                     onClick={() => {
//                       addItemToHamper(selectedProduct);
//                       setSelectedProduct(null);
//                     }}
//                     className="w-full"
//                   >
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add to Hamper
//                   </Button>
//                 </div>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Hamper Preview Dialog */}
//       <Dialog open={showPreview} onOpenChange={setShowPreview}>
//         <DialogContent className="max-w-4xl max-h-[80vh]">
//           <DialogHeader>
//             <DialogTitle>Hamper Preview</DialogTitle>
//             <DialogDescription>
//               Review your custom hamper before adding to cart
//             </DialogDescription>
//           </DialogHeader>
//           <ScrollArea className="max-h-96">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {hamperItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex gap-4 p-4 border rounded-lg"
//                 >
//                   <img
//                     src={
//                       item.productId.Product_image?.[0] ||
//                       "/placeholder-product.jpg"
//                     }
//                     alt={item.productId.Product_name}
//                     className="h-20 w-20 object-cover rounded"
//                   />
//                   <div className="flex-1">
//                     <h4 className="font-medium">
//                       {item.productId.Product_name}
//                     </h4>
//                     <p className="text-sm text-gray-500">
//                       {item.productId.Product_category}
//                     </p>
//                     <p className="text-sm">
//                       ₹
//                       {(
//                         item.productId.Hamper_price ||
//                         item.productId.Product_price
//                       ).toLocaleString()}{" "}
//                       × {item.quantity}
//                     </p>
//                     <p className="font-medium text-green-600">
//                       ₹
//                       {(
//                         (item.productId.Hamper_price ||
//                           item.productId.Product_price) * item.quantity
//                       ).toLocaleString()}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//           <div className="border-t pt-4">
//             <div className="flex justify-between items-center text-lg font-bold">
//               <span>Total ({totalItems} items)</span>
//               <span className="text-green-600">
//                 ₹{calculateHamperTotal.toLocaleString()}
//               </span>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setShowPreview(false)}>
//               Continue Shopping
//             </Button>
//             <Button
//               onClick={() => {
//                 setShowPreview(false);
//                 addHamperToCart();
//               }}
//               disabled={!hamperValidation.isValid}
//             >
//               <ShoppingCart className="h-4 w-4 mr-2" />
//               Add to Cart
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Clear Confirmation Dialog */}
//       <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Clear Hamper?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will remove all items from your hamper. This action cannot be
//               undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={clearHamper}
//               className="bg-red-600 hover:bg-red-700"
//             >
//               Clear Hamper
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default CustomHamperBuilder;

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










import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { useToast } from "../components/ui/use-toast";
import axiosInstance from "../utils/axiosConfig";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
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
  Heart
} from "lucide-react";

const CustomHamperBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const justAddedItem = useRef(false);

  // Core hamper state
  const [hamperItems, setHamperItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

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

  // UI state
  const [activeTab, setActiveTab] = useState("explore");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Checkout form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-switch to hamper tab when items are added (mobile only)
  useEffect(() => {
    if (isMobile && hamperItems.length > 0 && activeTab === "explore" && justAddedItem.current) {
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
      
      console.log('🎁 Fetching hamper-eligible products from backend...');
      
      const response = await axiosInstance.get('api/getproducts?type=hamper&limit=100');
      
      console.log('📦 Hamper products response:', response.data);
      
      if (response.data && response.data.product) {
        const hamperProducts = response.data.product;
        
        setProducts(hamperProducts);
        setFilteredProducts(hamperProducts);
        
        const uniqueCategories = [
          ...new Set(hamperProducts
            .map((p) => p.Product_category_name || p.Product_category?.category || 'Uncategorized')
            .filter(Boolean)
          )
        ];
        setCategories(uniqueCategories);
        
        console.log(`✅ Loaded ${hamperProducts.length} hamper-eligible products`);
        
        if (hamperProducts.length === 0) {
          toast({
            title: "No Hamper Products",
            description: "No products are currently available for custom hampers.",
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
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load hamper products';
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
        (product) => (product.Product_category_name || product.Product_category) === selectedCategory
      );
    }

    if (priceRange.min) {
      filtered = filtered.filter(
        (product) => (product.Hamper_price || product.Product_price) >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max) {
      filtered = filtered.filter(
        (product) => (product.Hamper_price || product.Product_price) <= parseFloat(priceRange.max)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.Hamper_price || a.Product_price) - (b.Hamper_price || b.Product_price);
        case "price-high":
          return (b.Hamper_price || b.Product_price) - (a.Hamper_price || a.Product_price);
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
      console.log('🎁 Adding product to hamper:', product.Product_name);
      
      const response = await axiosInstance.post('/hamper/add', {
        productId: product._id,
        quantity: 1
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
      console.error('Error adding to hamper:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add item to hamper",
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
        quantity: newQuantity
      });
      
      if (response.data) {
        setHamperItems(response.data.hamper);
        setTotalAmount(response.data.totalAmount);
        setTotalItems(response.data.totalItems);
      }
    } catch (error) {
      console.error('Error updating hamper quantity:', error);
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
      const response = await axiosInstance.delete(`/hamper/remove/${productId}`);
      
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
      console.error('Error removing from hamper:', error);
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
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle hamper checkout
  const handleHamperCheckout = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout",
        variant: "destructive"
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

    const requiredFields = ['fullName', 'address', 'city', 'state', 'pinCode', 'phone'];
    const missingFields = requiredFields.filter(field => 
      !shippingAddress[field].trim()
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all shipping address fields",
        variant: "destructive"
      });
      return;
    }

    setCheckoutLoading(true);
    try {
      const orderItems = hamperItems.map(item => ({
        product: item.productId._id,
        name: item.productId.Product_name,
        quantity: item.quantity,
        price: item.productId.Hamper_price || item.productId.Product_price,
        image: item.productId.Product_image?.[0],
        isHamperItem: true
      }));

      const response = await axiosInstance.post('/orders/create', {
        items: orderItems,
        shippingAddress,
        paymentMethod: "cod",
        totalAmount: totalAmount + DELIVERY_CHARGE,
        isCustomHamper: true
      });

      await axiosInstance.delete("/hamper/clear");
      setHamperItems([]);
      setTotalAmount(0);
      setTotalItems(0);
      
      toast({
        title: "Custom Hamper Ordered Successfully!",
        description: "Your custom hamper is being prepared. Track your order in your profile.",
        variant: "default"
      });

      navigate("/profile");
    } catch (err) {
      console.error('Hamper order creation error:', err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to place hamper order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setCheckoutLoading(false);
      setIsCheckingOut(false);
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
    return hamperItems.some(item => item.productId._id === productId);
  };

  const getProductQuantityInHamper = (productId) => {
    const item = hamperItems.find(item => item.productId._id === productId);
    return item ? item.quantity : 0;
  };

  // Compact Mobile Filters Component
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
              <SelectItem value="all" className="text-[10px] xs:text-xs">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-[10px] xs:text-xs">
                  {category.length > 15 ? category.substring(0, 15) + '...' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name" className="text-[10px] xs:text-xs">Name</SelectItem>
              <SelectItem value="price-low" className="text-[10px] xs:text-xs">Price ↑</SelectItem>
              <SelectItem value="price-high" className="text-[10px] xs:text-xs">Price ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <Input
            type="number"
            placeholder="Min ₹"
            value={priceRange.min}
            onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
            className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
          />
          <Input
            type="number"
            placeholder="Max ₹"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
            className="h-7 sm:h-9 text-[10px] xs:text-xs sm:text-sm px-1.5 sm:px-3"
          />
        </div>
      </div>
    </motion.div>
  );

  // Product Card Component
  const ProductCard = ({ product }) => {
    const hamperPrice = product.Hamper_price || product.Product_price;
    const regularPrice = product.Product_price;
    const discount = regularPrice > hamperPrice ? ((regularPrice - hamperPrice) / regularPrice * 100) : 0;
    const inHamper = isProductInHamper(product._id);
    const hamperQuantity = getProductQuantityInHamper(product._id);

    // Compact Quantity Control
    const QuantityControl = () => (
      <div className="flex items-center gap-1">
        <span className="text-[10px] xs:text-xs text-gray-500">Qty:</span>
        <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
          <button
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => updateItemQuantity(product._id, hamperQuantity - 1)}
            disabled={isProcessing}
            aria-label="Decrease quantity"
          >
            <Minus className="w-3 h-3 text-gray-600" />
          </button>
          
          <span className="w-7 text-center text-sm font-semibold bg-white border-x border-gray-300 leading-6">
            {hamperQuantity}
          </span>
          
          <button
            className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => updateItemQuantity(product._id, hamperQuantity + 1)}
            disabled={isProcessing}
            aria-label="Increase quantity"
          >
            <Plus className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>
    );

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={product.Product_image?.[0] || "/placeholder-product.jpg"}
              alt={product.Product_name}
              className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-product.jpg";
              }}
            />
            {discount > 0 && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                {discount.toFixed(0)}% OFF
              </Badge>
            )}
            {inHamper && (
              <Badge className="absolute top-2 right-2 bg-purple-500 text-white text-xs">
                In Hamper
              </Badge>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-2">
              {product.Product_name}
            </h3>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg font-bold text-green-600">
                  ₹{hamperPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-xs text-gray-500 line-through">
                    ₹{regularPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              {inHamper ? (
                <QuantityControl />
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addItemToHamper(product)}
                  className="hover:bg-green-50 hover:border-green-500 hover:text-green-600 text-xs px-2 py-1 h-7"
                  disabled={isProcessing}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add
                </Button>
              )}
            </div>

            <Badge variant="secondary" className="text-xs">
              {product.Product_category_name || product.Product_category || 'Uncategorized'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to Load Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchHamperProducts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main render
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
        @media (max-width: 320px) {
          .container {
            padding-left: 4px;
            padding-right: 4px;
          }
        }
        /* Add xs breakpoint support */
        @media (min-width: 360px) {
          .xs\\:text-xs { font-size: 0.75rem; line-height: 1rem; }
          .xs\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
          .xs\\:w-3 { width: 0.75rem; }
          .xs\\:h-3 { height: 0.75rem; }
          .xs\\:w-4 { width: 1rem; }
          .xs\\:h-4 { height: 1rem; }
          .xs\\:mr-1 { margin-right: 0.25rem; }
          .xs\\:ml-1 { margin-left: 0.25rem; }
          .xs\\:mr-2 { margin-right: 0.5rem; }
          .xs\\:ml-2 { margin-left: 0.5rem; }
          .xs\\:p-2 { padding: 0.5rem; }
          .xs\\:px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
          .xs\\:gap-2 { gap: 0.5rem; }
          .xs\\:inline { display: inline; }
        }
        .xs\\:hidden { 
          @media (max-width: 359px) {
            display: none;
          }
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
                    {showFilters ? <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </Button>
                </div>
              )}

              {/* Mobile Filters */}
              {activeTab === "explore" && isMobile && <MobileFilters />}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-b-md sm:rounded-b-xl shadow-lg border border-t-0 border-purple-100 min-h-[60vh]">
              {/* Explore Products Tab */}
              <TabsContent value="explore" className="m-0 p-1 xs:p-2 sm:p-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 sm:gap-4">
                  {/* Desktop Filters Sidebar */}
                  {!isMobile && (
                    <div className="lg:col-span-1">
                      <Card>
                        <CardContent className="p-3 sm:p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                          </h3>
                          
                          {/* Search */}
                          <div className="space-y-2 mb-4">
                            <Label className="text-xs">Search Products</Label>
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-8 text-sm"
                              />
                            </div>
                          </div>

                          {/* Category */}
                          <div className="space-y-2 mb-4">
                            <Label className="text-xs">Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Price Range */}
                          <div className="space-y-2 mb-4">
                            <Label className="text-xs">Price Range</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                placeholder="Min"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                className="h-8 text-sm"
                              />
                              <Input
                                type="number"
                                placeholder="Max"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>

                          {/* Sort */}
                          <div className="space-y-2">
                            <Label className="text-xs">Sort By</Label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="name">Name (A-Z)</SelectItem>
                                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className={isMobile ? "col-span-1" : "lg:col-span-3"}>
                    <div className="mb-2 sm:mb-4 flex items-center justify-between px-1">
                      <p className="text-[10px] xs:text-xs sm:text-sm text-gray-600">
                        {filteredProducts.length} products
                      </p>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-8 sm:py-12 px-2">
                        <Package className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-2 sm:mb-4" />
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No products found</h3>
                        <p className="text-[11px] xs:text-xs sm:text-sm text-gray-500">Try adjusting your filters</p>
                      </div>
                    ) : (
                      <div className={`grid gap-1.5 xs:gap-2 sm:gap-3 ${
                        isMobile 
                          ? 'grid-cols-2' 
                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      } px-0.5 sm:px-0`}>
                        {filteredProducts.map((product) => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* My Hamper Tab */}
              <TabsContent value="hamper" className="m-0 p-2 sm:p-4">
                {hamperItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your hamper is empty</h3>
                    <p className="text-gray-500 mb-4">Start building your custom hamper by exploring products</p>
                    <Button 
                      onClick={() => setActiveTab("explore")}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      Explore Products
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                    {/* Hamper Items */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2 sm:space-y-3">
                        {hamperItems.map((item, index) => (
                          <motion.div
                            key={`${item.productId._id}-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
                          >
                            {/* Product Image */}
                            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
                              <img
                                src={item.productId.Product_image?.[0] || "/placeholder-product.jpg"}
                                alt={item.productId.Product_name}
                                className="w-full h-full object-cover rounded-md"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-jewelry.jpg';
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-grow min-w-0">
                              <div className="space-y-1 sm:space-y-2">
                                {/* Product Name */}
                                <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 leading-tight">
                                  {item.productId.Product_name}
                                </h3>

                                {/* Price Display */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] sm:text-xs text-gray-500">Hamper Price:</span>
                                    <span className="text-xs sm:text-sm font-medium text-purple-600">
                                      ₹{getItemUnitPrice(item).toLocaleString()}
                                    </span>
                                  </div>

                                  {/* Quantity and Total */}
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] xs:text-xs text-gray-500">Qty:</span>
                                      <div className="flex items-center border border-gray-300 rounded-md bg-gray-50 overflow-hidden">
                                        <button
                                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                          onClick={() => updateItemQuantity(item.productId._id, item.quantity - 1)}
                                          disabled={isProcessing}
                                          aria-label="Decrease quantity"
                                        >
                                          <Minus className="w-3 h-3 text-gray-600" />
                                        </button>
                                        
                                        <span className="w-7 text-center text-sm font-semibold bg-white border-x border-gray-300 leading-6">
                                          {item.quantity}
                                        </span>
                                        
                                        <button
                                          className="w-6 h-6 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                          onClick={() => updateItemQuantity(item.productId._id, item.quantity + 1)}
                                          disabled={isProcessing}
                                          aria-label="Increase quantity"
                                        >
                                          <Plus className="w-3 h-3 text-gray-600" />
                                        </button>
                                      </div>
                                    </div>

                                    {/* Item Total Price */}
                                    <div className="flex flex-col items-end">
                                      <span className="text-[10px] sm:text-xs text-gray-500">Total:</span>
                                      <span className="text-sm sm:text-lg font-bold text-purple-700">
                                        ₹{getItemTotal(item).toLocaleString()}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Remove Button */}
                                <div className="flex justify-end pt-1">
                                  <button
                                    className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                    onClick={() => removeItemFromHamper(item.productId._id)}
                                    disabled={isProcessing}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span className="hidden sm:inline">Remove</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 space-y-2">
                        <Button
                          variant="outline"
                          className="w-full rounded-full px-3 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
                          onClick={() => setActiveTab("explore")}
                        >
                          Add More Products
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
                                ? 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900' 
                                : 'bg-gray-400 cursor-not-allowed'
                            }`}
                            onClick={() => setIsCheckingOut(true)}
                            disabled={!hamperValidation.isValid || isProcessing}
                          >
                            Checkout Hamper
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Hamper Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sticky top-20">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                          Hamper Summary
                        </h2>

                        {/* Items List */}
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
                                  ₹{getItemUnitPrice(item).toLocaleString()} × {item.quantity}
                                </div>
                              </div>
                              <div className="font-semibold text-purple-600 flex-shrink-0">
                                ₹{getItemTotal(item).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Calculation Section */}
                        <div className="border-t border-gray-200 pt-3 space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Hamper Total ({totalItems} items)</span>
                            <span className="font-semibold">₹{totalAmount.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Delivery Charge</span>
                            <span className={`font-semibold ${DELIVERY_CHARGE > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
                            </span>
                          </div>

                          {/* Minimum Amount Progress */}
                          {!hamperValidation.isValid && (
                            <div className="py-2 px-3 bg-red-50 rounded-lg border border-red-100">
                              <div className="flex items-center justify-between text-xs text-red-700 mb-1">
                                <span className="font-medium">Minimum Amount Progress</span>
                                <span className="font-bold">₹{minimumAmountGap} more</span>
                              </div>
                              <div className="bg-red-200 h-2 rounded-full relative overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-red-400 to-red-500 h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min((totalAmount / MINIMUM_HAMPER_AMOUNT) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                              <div className="text-[10px] text-red-600 mt-1 text-center">
                                {Math.round((totalAmount / MINIMUM_HAMPER_AMOUNT) * 100)}% of minimum amount
                              </div>
                            </div>
                          )}

                          {/* Free Delivery Progress */}
                          {hamperValidation.isValid && DELIVERY_CHARGE > 0 && (
                            <div className="py-2 px-3 bg-orange-50 rounded-lg border border-orange-100">
                              <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
                                <span className="font-medium">Free Delivery Progress</span>
                                <span className="font-bold">₹{freeDeliveryGap} more</span>
                              </div>
                              <div className="bg-orange-200 h-2 rounded-full relative overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min((totalAmount / 500) * 100, 100)}%`,
                                  }}
                                />
                              </div>
                              <div className="text-[10px] text-orange-600 mt-1 text-center">
                                {Math.round((totalAmount / 500) * 100)}% towards free delivery
                              </div>
                            </div>
                          )}

                          {/* Total */}
                          <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-200 bg-purple-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-lg">
                            <span className="text-gray-900">Total Amount</span>
                            <span className="text-purple-700">₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Validation Message */}
                        <div className="mt-3 text-center">
                          <div className={`text-xs px-3 py-2 rounded-full ${
                            hamperValidation.isValid 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {hamperValidation.message}
                          </div>
                        </div>

                        {/* Checkout Button */}
                        <Button
                          className={`w-full mt-4 rounded-full py-2 sm:py-3 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ${
                            hamperValidation.isValid 
                              ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => setIsCheckingOut(true)}
                          disabled={!hamperValidation.isValid || isProcessing}
                        >
                          {hamperValidation.isValid ? 'Proceed to Checkout' : `Add ₹${minimumAmountGap} More`}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Checkout Modal */}
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
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative flex-shrink-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 sm:px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold">Checkout Custom Hamper</h2>
                    <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
                      Total: ₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex-shrink-0"
                    onClick={() => !checkoutLoading && setIsCheckingOut(false)}
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
                      <span>{DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
                      <span>Total Amount</span>
                      <span>₹{(totalAmount + DELIVERY_CHARGE).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleHamperCheckout} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="fullName" className="text-xs font-medium text-gray-700">
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
                      <Label htmlFor="phone" className="text-xs font-medium text-gray-700">
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
                      <Label htmlFor="address" className="text-xs font-medium text-gray-700">
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
                        <Label htmlFor="city" className="text-xs font-medium text-gray-700">
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
                        <Label htmlFor="state" className="text-xs font-medium text-gray-700">
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
                      <Label htmlFor="pinCode" className="text-xs font-medium text-gray-700">
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
                </form>
              </div>

              {/* Fixed Bottom */}
              <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 space-y-2">
                <Button
                  type="submit"
                  onClick={handleHamperCheckout}
                  className="w-full h-10 text-sm rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Placing Order...
                    </div>
                  ) : (
                    `Place Hamper Order - ₹${(totalAmount + DELIVERY_CHARGE).toLocaleString()}`
                  )}
                </Button>
                <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Cash on Delivery • Secure Payment</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomHamperBuilder;




