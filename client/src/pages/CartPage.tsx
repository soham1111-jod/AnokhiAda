// import React, { useState } from "react";
// import { useCart } from "../components/CartContext";
// import { Button } from "../components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/components/AuthContext";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Minus, Plus, Trash2 } from "lucide-react";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// const CartPage = () => {
//   const { cart, removeCart, clearCart, updateQuantity, getCartTotal } = useCart();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     phone: ""
//   });

//   // ✅ Add the helper function we discussed
//   const getProductId = (item: any) => item._id || item.id;

//   const totalPrice = getCartTotal();
//   const DELIVERY_CHARGE = totalPrice >= 500 ? 0 : 80;
//   const freeDeliveryGap = Math.max(0, 500 - totalPrice);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setShippingAddress(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleQuantityChange = (productId: number | string, newQuantity: number) => {
//     if (newQuantity < 1) {
//       removeCart(productId);
//       toast({
//         title: "Item removed",
//         description: "Item has been removed from your cart",
//         variant: "default"
//       });
//     } else {
//       updateQuantity(productId, newQuantity);
//     }
//   };

//   const handleProductClick = (productId: number | string) => {
//     // Use the MongoDB _id for navigation if available
//     const id = typeof productId === 'string' ? productId : productId.toString();
//     navigate(`/product/${id}`);
//   };

//   const handleCheckout = async (e: React.FormEvent) => {
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

//     const requiredFields = ['fullName', 'address', 'city', 'state', 'pinCode', 'phone'];
//     const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof typeof shippingAddress].trim());
    
//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive"
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       // ✅ Fixed: Use MongoDB ObjectId for backend orders
//       const orderItems = cart.map(item => ({
//         product: item._id || item.id, // Use MongoDB ObjectId
//         name: item.name || item.Product_name, // Handle both formats
//         quantity: item.quantity || 1,
//         price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0,
//         image: item.image || (item.Product_image && item.Product_image[0]) // Handle both formats
//       }));

//       console.log('🔍 Order items being sent:', orderItems); // Debug log

//       await axios.post(`${API_URL}/orders/create`, {
//         items: orderItems,
//         shippingAddress,
//         paymentMethod: "cod",
//         totalAmount: totalPrice + DELIVERY_CHARGE
//       }, { withCredentials: true });

//       clearCart();
//       toast({
//         title: "Order placed successfully!",
//         description: "Your jewelry is on its way. Track your order in your profile.",
//         variant: "default"
//       });
//       navigate("/profile");
//     } catch (err: any) {
//       console.error('Order creation error:', err);
//       toast({
//         title: "Error",
//         description: err?.response?.data?.message || "Failed to place order. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//       setIsCheckingOut(false);
//     }
//   };

//   const getItemTotal = (item: any) => {
//     if (!item || !item.price) return 0;
//     const priceString = typeof item.price === 'string' ? item.price : String(item.price);
//     const priceNumber = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
//     if (isNaN(priceNumber)) return 0;
//     const quantity = item.quantity || 1;
//     return priceNumber * quantity;
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-3 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center w-full max-w-sm"
//         >
//           <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-purple-100">
//             <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//             </div>
//             <h1 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Your Jewellery Cart is Empty</h1>
//             <p className="text-gray-600 mb-4 text-sm">
//               Looks like you haven't added any beautiful pieces to your cart yet.
//             </p>
//             <Button
//               onClick={() => navigate("/")}
//               className="w-full rounded-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-sm font-semibold"
//             >
//               Explore Collection
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

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
//       `}</style>
      
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-8 px-3 overflow-x-hidden">
//         <div className="container mx-auto max-w-6xl">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-6"
//           >
//             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//               Your <span className="text-purple-600">Jewellery</span> Cart
//             </h1>
//             <p className="text-gray-600 text-sm">
//               Review your selected pieces before checkout
//             </p>
//           </motion.div>

//           {/* Free delivery banner */}
//           {freeDeliveryGap > 0 && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-3 mb-4"
//             >
//               <div className="flex items-center justify-center gap-2 text-orange-700 text-sm">
//                 <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span className="font-semibold">
//                   Add ₹{freeDeliveryGap} more for <span className="text-orange-800 font-bold">FREE DELIVERY</span>
//                 </span>
//               </div>
//             </motion.div>
//           )}

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             {/* Cart Items */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-xl shadow-xl border border-purple-100 p-3 sm:p-4">
//                 <div className="space-y-3">
//                   {cart.map((item, index) => (
//                     <motion.div
//                       key={`${getProductId(item)}-${index}`} // ✅ Fixed: Use helper function
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex items-center gap-2 p-2 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
//                     >
//                       {/* Product Image */}
//                       <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
//                         <img 
//                           src={item.image} 
//                           alt={item.name} 
//                           className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
//                           onClick={() => handleProductClick(getProductId(item))} // ✅ Fixed
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.src = '/placeholder-jewelry.jpg';
//                           }}
//                         />
//                       </div>
                      
//                       {/* Product Info */}
//                       <div className="flex-grow min-w-0">
//                         <div className="flex flex-col gap-1">
//                           {/* Name and Price */}
//                           <div className="min-w-0">
//                             <h3 
//                               className="text-xs sm:text-sm font-semibold text-gray-900 truncate cursor-pointer hover:text-purple-600 transition-colors"
//                               onClick={() => handleProductClick(getProductId(item))} // ✅ Fixed
//                             >
//                               {item.name || item.Product_name}
//                             </h3>
//                             <p className="text-xs text-purple-600 font-medium">{item.price}</p>
//                           </div>
                          
//                           {/* Controls Row */}
//                           <div className="flex items-center justify-between gap-1">
//                             {/* Quantity Controls */}
//                             <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
//                               <button
//                                 className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
//                                 onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) - 1)} // ✅ Fixed
//                                 aria-label="Decrease quantity"
//                               >
//                                 <Minus className="w-2.5 h-2.5" />
//                               </button>
//                               <span className="w-6 text-center text-xs font-medium">{item.quantity || 1}</span>
//                               <button
//                                 className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
//                                 onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) + 1)} // ✅ Fixed
//                                 aria-label="Increase quantity"
//                               >
//                                 <Plus className="w-2.5 h-2.5" />
//                               </button>
//                             </div>
                            
//                             {/* Total Price */}
//                             <div className="text-xs font-semibold text-purple-700">
//                               ₹{getItemTotal(item).toFixed(0)}
//                             </div>
                            
//                             {/* Delete Button */}
//                             <button
//                               className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
//                               onClick={() => removeCart(getProductId(item))} // ✅ Fixed
//                               aria-label="Remove item"
//                             >
//                               <Trash2 className="w-3 h-3" />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </motion.div>
//                   ))}
//                 </div>
                
//                 {/* Action Buttons - Rest remains the same */}
//                 <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2">
//                   <Button 
//                     variant="outline" 
//                     className="w-full rounded-full px-4 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs"
//                     onClick={() => navigate("/")}
//                   >
//                     Continue Shopping
//                   </Button>
                  
//                   <div className="flex gap-2">
//                     <Button 
//                       variant="destructive" 
//                       className="flex-1 rounded-full px-4 py-2 text-xs"
//                       onClick={() => {
//                         clearCart();
//                         toast({
//                           title: "Cart cleared",
//                           description: "All items have been removed from your cart",
//                           variant: "default"
//                         });
//                       }}
//                     >
//                       Clear Cart
//                     </Button>
//                     <Button 
//                       className="flex-1 rounded-full px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-xs font-semibold"
//                       onClick={() => setIsCheckingOut(true)}
//                       disabled={cart.length === 0}
//                     >
//                       Proceed to Checkout
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-xl shadow-xl border border-purple-100 p-3 sm:p-4 sticky top-4">
//                 <h2 className="text-lg font-bold text-gray-900 mb-3">Order Summary</h2>
                
//                 <div className="space-y-1 mb-3">
//                   {cart.map((item) => (
//                     <div key={`summary-${getProductId(item)}`} className="flex justify-between text-xs"> {/* ✅ Fixed */}
//                       <span className="text-gray-600 truncate mr-1">
//                         {item.name || item.Product_name} × {item.quantity || 1}
//                       </span>
//                       <span className="font-medium flex-shrink-0">₹{getItemTotal(item).toFixed(0)}</span>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="pt-2 border-t border-gray-100 space-y-2">
//                   <div className="flex justify-between items-center text-xs">
//                     <span className="text-gray-600">Subtotal</span>
//                     <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-xs">
//                     <span className="text-gray-600">Delivery</span>
//                     <span className="font-medium text-orange-500">{DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "Free"}</span>
//                   </div>
//                   {DELIVERY_CHARGE > 0 && (
//                     <div className="pt-1">
//                       <div className="text-xs text-orange-700 mb-1 flex items-center justify-between">
//                         <span>Free Delivery Progress</span>
//                         <span className="font-bold">₹{freeDeliveryGap} to go</span>
//                       </div>
//                       <div className="bg-orange-100 h-1.5 rounded-full relative overflow-hidden">
//                         <div
//                           className="bg-orange-400 h-full rounded-full transition-all duration-500"
//                           style={{
//                             width: `${Math.min((totalPrice / 500) * 100, 100)}%`,
//                           }}
//                         />
//                       </div>
//                     </div>
//                   )}
//                   <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-gray-100">
//                     <span>Total</span>
//                     <span className="text-purple-600">₹{(totalPrice + DELIVERY_CHARGE).toFixed(0)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Checkout Modal */}
//       <AnimatePresence>
//         {isCheckingOut && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center overflow-hidden"
//             onClick={() => !loading && setIsCheckingOut(false)}
//           >
//             <motion.div
//               initial={{ opacity: 0, y: "100%", scale: 1 }}
//               animate={{ opacity: 1, y: 0, scale: 1 }}
//               exit={{ opacity: 0, y: "100%", scale: 1 }}
//               transition={{ type: "spring", damping: 25, stiffness: 500 }}
//               className="bg-white w-full max-w-[95vw] sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl shadow-2xl border-t border-purple-100 sm:border max-h-[95vh] flex flex-col overflow-hidden"
//               onClick={e => e.stopPropagation()}
//             >
//               {/* Header - Compact for small screens */}
//               <div className="relative flex-shrink-0 bg-white border-b border-gray-100 px-3 sm:px-4 py-3">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h2 className="text-lg sm:text-xl font-bold text-gray-900">Checkout</h2>
//                     <p className="text-xs text-gray-600 mt-0.5">Complete your order</p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 rounded-full hover:bg-gray-100 flex-shrink-0"
//                     onClick={() => !loading && setIsCheckingOut(false)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Scrollable Content */}
//               <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
//                 {/* Order Summary - Compact */}
//                 <div className="bg-purple-50 rounded-lg p-3 mb-4">
//                   <h3 className="font-semibold text-gray-900 mb-2 text-sm">Order Summary</h3>
//                   <div className="space-y-1 text-xs">
//                     {cart.map(item => (
//                       <div key={`checkout-${getProductId(item)}`} className="flex justify-between"> {/* ✅ Fixed */}
//                         <span className="text-gray-600 truncate mr-2">{item.name || item.Product_name} × {item.quantity || 1}</span>
//                         <span className="font-medium flex-shrink-0">₹{getItemTotal(item).toFixed(0)}</span>
//                       </div>
//                     ))}
//                     <div className="border-t border-purple-200 pt-2 mt-2 space-y-1">
//                       <div className="flex justify-between font-medium">
//                         <span>Subtotal</span>
//                         <span>₹{totalPrice.toFixed(0)}</span>
//                       </div>
//                       <div className="flex justify-between text-orange-600">
//                         <span>Delivery</span>
//                         <span>{DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "Free"}</span>
//                       </div>
//                       <div className="flex justify-between font-bold text-sm text-purple-600 pt-1">
//                         <span>Total</span>
//                         <span>₹{(totalPrice + DELIVERY_CHARGE).toFixed(0)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Form */}
//                 <form onSubmit={handleCheckout} className="space-y-3">
//                   <div className="space-y-1">
//                     <Label htmlFor="fullName" className="text-xs font-medium text-gray-700">
//                       Full Name *
//                     </Label>
//                     <Input
//                       id="fullName"
//                       name="fullName"
//                       placeholder="Enter your full name"
//                       value={shippingAddress.fullName}
//                       onChange={handleInputChange}
//                       required
//                       className="h-10 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
                  
//                   <div className="space-y-1">
//                     <Label htmlFor="phone" className="text-xs font-medium text-gray-700">
//                       Phone Number *
//                     </Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       placeholder="Enter your phone number"
//                       value={shippingAddress.phone}
//                       onChange={handleInputChange}
//                       required
//                       className="h-10 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
                  
//                   <div className="space-y-1">
//                     <Label htmlFor="address" className="text-xs font-medium text-gray-700">
//                       Address *
//                     </Label>
//                     <Input
//                       id="address"
//                       name="address"
//                       placeholder="Enter your address"
//                       value={shippingAddress.address}
//                       onChange={handleInputChange}
//                       required
//                       className="h-10 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-2">
//                     <div className="space-y-1">
//                       <Label htmlFor="city" className="text-xs font-medium text-gray-700">
//                         City *
//                       </Label>
//                       <Input
//                         id="city"
//                         name="city"
//                         placeholder="City"
//                         value={shippingAddress.city}
//                         onChange={handleInputChange}
//                         required
//                         className="h-10 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>
                    
//                     <div className="space-y-1">
//                       <Label htmlFor="state" className="text-xs font-medium text-gray-700">
//                         State *
//                       </Label>
//                       <Input
//                         id="state"
//                         name="state"
//                         placeholder="State"
//                         value={shippingAddress.state}
//                         onChange={handleInputChange}
//                         required
//                         className="h-10 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                       />
//                     </div>
//                   </div>
                  
//                   <div className="space-y-1">
//                     <Label htmlFor="pinCode" className="text-xs font-medium text-gray-700">
//                       PIN Code *
//                     </Label>
//                     <Input
//                       id="pinCode"
//                       name="pinCode"
//                       placeholder="PIN Code"
//                       value={shippingAddress.pinCode}
//                       onChange={handleInputChange}
//                       required
//                       className="h-10 text-sm border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                     />
//                   </div>
//                 </form>
//               </div>

//               {/* Fixed Bottom */}
//               <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 space-y-2">
//                 <Button
//                   type="submit"
//                   onClick={handleCheckout}
//                   className="w-full h-10 text-sm rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Placing Order...
//                     </div>
//                   ) : (
//                     `Place Order - ₹${(totalPrice + DELIVERY_CHARGE).toFixed(0)}`
//                   )}
//                 </Button>
                
//                 <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                   <span>Cash on Delivery • Secure Payment</span>
//                 </div>
//                 {DELIVERY_CHARGE > 0 && (
//                   <div className="text-center text-xs text-orange-600">
//                     Delivery charge: ₹{DELIVERY_CHARGE}
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default CartPage;



// WORKING CODE DOWN
// WORKING CODE DOWN
// WORKING CODE 
// WORKING CODE 
// WORKING CODE 
// WORKING CODE 
// WORKING CODE 
// WORKING CODE 


// import React, { useState } from "react";
// import { useCart } from "../components/CartContext";
// import { Button } from "../components/ui/button";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/components/AuthContext";
// import { Input } from "../components/ui/input";
// import { Label } from "../components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import axios from "axios";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Minus, Plus, Trash2, ShoppingBag, Truck } from "lucide-react";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// const CartPage = () => {
//   const { cart, removeCart, clearCart, updateQuantity, getCartTotal } = useCart();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [isCheckingOut, setIsCheckingOut] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: "",
//     address: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     phone: ""
//   });

//   const getProductId = (item: any) => item._id || item.id;

//   const totalPrice = getCartTotal();
//   const DELIVERY_CHARGE = totalPrice >= 500 ? 0 : 80;
//   const freeDeliveryGap = Math.max(0, 500 - totalPrice);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setShippingAddress(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleQuantityChange = (productId: number | string, newQuantity: number) => {
//     if (newQuantity < 1) {
//       removeCart(productId);
//       toast({
//         title: "Item removed",
//         description: "Item has been removed from your cart",
//         variant: "default"
//       });
//     } else {
//       updateQuantity(productId, newQuantity);
//     }
//   };

//   const handleProductClick = (productId: number | string) => {
//     const id = typeof productId === 'string' ? productId : productId.toString();
//     navigate(`/product/${id}`);
//   };

//   const handleCheckout = async (e: React.FormEvent) => {
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

//     const requiredFields = ['fullName', 'address', 'city', 'state', 'pinCode', 'phone'];
//     const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof typeof shippingAddress].trim());
    
//     if (missingFields.length > 0) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all shipping address fields",
//         variant: "destructive"
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const orderItems = cart.map(item => ({
//         product: item._id || item.id,
//         name: item.name || item.Product_name,
//         quantity: item.quantity || 1,
//         price: parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0,
//         image: item.image || (item.Product_image && item.Product_image[0])
//       }));

//       await axios.post(`${API_URL}/orders/create`, {
//         items: orderItems,
//         shippingAddress,
//         paymentMethod: "cod",
//         totalAmount: totalPrice + DELIVERY_CHARGE
//       }, { withCredentials: true });

//       clearCart();
//       toast({
//         title: "Order placed successfully!",
//         description: "Your jewelry is on its way. Track your order in your profile.",
//         variant: "default"
//       });
//       navigate("/profile");
//     } catch (err: any) {
//       console.error('Order creation error:', err);
//       toast({
//         title: "Error",
//         description: err?.response?.data?.message || "Failed to place order. Please try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//       setIsCheckingOut(false);
//     }
//   };

//   const getItemTotal = (item: any) => {
//     if (!item || !item.price) return 0;
//     const priceString = typeof item.price === 'string' ? item.price : String(item.price);
//     const priceNumber = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
//     if (isNaN(priceNumber)) return 0;
//     const quantity = item.quantity || 1;
//     return priceNumber * quantity;
//   };

//   const getItemUnitPrice = (item: any) => {
//     if (!item || !item.price) return 0;
//     const priceString = typeof item.price === 'string' ? item.price : String(item.price);
//     const priceNumber = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
//     return isNaN(priceNumber) ? 0 : priceNumber;
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center w-full max-w-xs"
//         >
//           <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-purple-100">
//             <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 sm:mb-4">
//               <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
//             </div>
//             <h1 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">Your Cart is Empty</h1>
//             <p className="text-gray-600 mb-4 text-xs sm:text-sm">
//               Discover our beautiful jewelry collection.
//             </p>
//             <Button
//               onClick={() => navigate("/")}
//               className="w-full rounded-full px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-xs sm:text-sm font-semibold"
//             >
//               Explore Collection
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

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
//         @media (max-width: 375px) {
//           .container {
//             padding-left: 8px;
//             padding-right: 8px;
//           }
//         }
//       `}</style>
      
//       <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-6 px-2 xs:px-3 overflow-x-hidden">
//         <div className="container mx-auto max-w-6xl">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="text-center mb-4 sm:mb-6"
//           >
//             <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
//               Your <span className="text-purple-600">Cart</span>
//             </h1>
//             <p className="text-gray-600 text-xs sm:text-sm">
//               {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for checkout
//             </p>
//           </motion.div>

//           {/* Free delivery banner */}
//           {freeDeliveryGap > 0 && (
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
//             {/* Cart Items */}
//             <div className="lg:col-span-2">
//               <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-2 sm:p-3 md:p-4">
//                 <div className="space-y-2 sm:space-y-3">
//                   {cart.map((item, index) => (
//                     <motion.div
//                       key={`${getProductId(item)}-${index}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.1 }}
//                       className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
//                     >
//                       {/* Product Image */}
//                       <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
//                         <img 
//                           src={item.image} 
//                           alt={item.name || item.Product_name} 
//                           className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
//                           onClick={() => handleProductClick(getProductId(item))}
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.src = '/placeholder-jewelry.jpg';
//                           }}
//                         />
//                       </div>
                      
//                       {/* Product Info */}
//                       <div className="flex-grow min-w-0">
//                         <div className="space-y-1 sm:space-y-2">
//                           {/* Product Name */}
//                           <div className="min-w-0">
//                             <h3 
//                               className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors leading-tight"
//                               onClick={() => handleProductClick(getProductId(item))}
//                             >
//                               {item.name || item.Product_name}
//                             </h3>
//                           </div>
                          
//                           {/* ✅ Enhanced Price Display */}
//                           <div className="space-y-1">
//                             {/* Unit Price */}
//                             <div className="flex items-center gap-2">
//                               <span className="text-[10px] sm:text-xs text-gray-500">Unit Price:</span>
//                               <span className="text-xs sm:text-sm font-medium text-purple-600">
//                                 ₹{getItemUnitPrice(item).toLocaleString()}
//                               </span>
//                             </div>
                            
//                             {/* Quantity and Total */}
//                             <div className="flex items-center justify-between gap-2">
//                               <div className="flex items-center gap-2">
//                                 <span className="text-[10px] sm:text-xs text-gray-500">Qty:</span>
//                                 <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
//                                   <button
//                                     className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-l-md hover:bg-gray-200 transition-colors"
//                                     onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) - 1)}
//                                     aria-label="Decrease quantity"
//                                   >
//                                     <Minus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                                   </button>
//                                   <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium py-0.5">
//                                     {item.quantity || 1}
//                                   </span>
//                                   <button
//                                     className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-r-md hover:bg-gray-200 transition-colors"
//                                     onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) + 1)}
//                                     aria-label="Increase quantity"
//                                   >
//                                     <Plus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
//                                   </button>
//                                 </div>
//                               </div>
                              
//                               {/* Item Total Price - More Prominent */}
//                               <div className="flex flex-col items-end">
//                                 <span className="text-[10px] sm:text-xs text-gray-500">Total:</span>
//                                 <span className="text-sm sm:text-lg font-bold text-purple-700">
//                                   ₹{getItemTotal(item).toLocaleString()}
//                                 </span>
//                               </div>
//                             </div>
//                           </div>
                          
//                           {/* Remove Button */}
//                           <div className="flex justify-end pt-1">
//                             <button
//                               className="flex items-center gap-1 px-2 py-1 text-[10px] sm:text-xs text-red-500 hover:bg-red-50 rounded-md transition-colors"
//                               onClick={() => {
//                                 removeCart(getProductId(item));
//                                 toast({
//                                   title: "Removed",
//                                   description: "Item removed from cart",
//                                   variant: "default"
//                                 });
//                               }}
//                               aria-label="Remove item"
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
                
//                 {/* Action Buttons */}
//                 <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 space-y-2">
//                   <Button 
//                     variant="outline" 
//                     className="w-full rounded-full px-3 py-2 border-purple-600 text-purple-600 hover:bg-purple-50 text-xs sm:text-sm"
//                     onClick={() => navigate("/")}
//                   >
//                     Continue Shopping
//                   </Button>
                  
//                   <div className="flex flex-col sm:flex-row gap-2">
//                     <Button 
//                       variant="destructive" 
//                       className="flex-1 rounded-full px-3 py-2 text-xs sm:text-sm"
//                       onClick={() => {
//                         clearCart();
//                         toast({
//                           title: "Cart cleared",
//                           description: "All items have been removed from your cart",
//                           variant: "default"
//                         });
//                       }}
//                     >
//                       Clear Cart
//                     </Button>
//                     <Button 
//                       className="flex-1 rounded-full px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-xs sm:text-sm font-semibold"
//                       onClick={() => setIsCheckingOut(true)}
//                       disabled={cart.length === 0}
//                     >
//                       Checkout
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* ✅ Enhanced Order Summary */}
//             <div className="lg:col-span-1">
//               <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-3 sm:p-4 sticky top-20">
//                 <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
//                   <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
//                   Order Summary
//                 </h2>
                
//                 {/* ✅ Enhanced Items List */}
//                 <div className="space-y-1.5 mb-4 max-h-32 sm:max-h-40 overflow-y-auto">
//                   {cart.map((item, index) => (
//                     <div 
//                       key={`summary-${getProductId(item)}-${index}`} 
//                       className="flex justify-between items-start text-xs sm:text-sm py-1"
//                     >
//                       <div className="flex-1 min-w-0 mr-2">
//                         <div className="font-medium text-gray-700 truncate leading-tight">
//                           {item.name || item.Product_name}
//                         </div>
//                         <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
//                           ₹{getItemUnitPrice(item).toLocaleString()} × {item.quantity || 1}
//                         </div>
//                       </div>
//                       <div className="font-semibold text-purple-600 flex-shrink-0">
//                         ₹{getItemTotal(item).toLocaleString()}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 {/* ✅ Enhanced Calculation Section */}
//                 <div className="border-t border-gray-200 pt-3 space-y-2">
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
//                     <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
//                   </div>
                  
//                   <div className="flex justify-between items-center text-sm">
//                     <span className="text-gray-600">Delivery Charge</span>
//                     <span className={`font-semibold ${DELIVERY_CHARGE > 0 ? 'text-orange-600' : 'text-green-600'}`}>
//                       {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
//                     </span>
//                   </div>
                  
//                   {/* Free Delivery Progress */}
//                   {DELIVERY_CHARGE > 0 && (
//                     <div className="py-2 px-3 bg-orange-50 rounded-lg border border-orange-100">
//                       <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
//                         <span className="font-medium">Free Delivery Progress</span>
//                         <span className="font-bold">₹{freeDeliveryGap} more</span>
//                       </div>
//                       <div className="bg-orange-200 h-2 rounded-full relative overflow-hidden">
//                         <div
//                           className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
//                           style={{
//                             width: `${Math.min((totalPrice / 500) * 100, 100)}%`,
//                           }}
//                         />
//                       </div>
//                       <div className="text-[10px] text-orange-600 mt-1 text-center">
//                         {Math.round((totalPrice / 500) * 100)}% towards free delivery
//                       </div>
//                     </div>
//                   )}
                  
//                   {/* Total */}
//                   <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-200 bg-purple-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-lg">
//                     <span className="text-gray-900">Total Amount</span>
//                     <span className="text-purple-700">₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}</span>
//                   </div>
//                 </div>
                
//                 {/* Quick Checkout Button */}
//                 <Button
//                   className="w-full mt-4 rounded-full py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
//                   onClick={() => setIsCheckingOut(true)}
//                   disabled={cart.length === 0}
//                 >
//                   Proceed to Checkout
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ✅ Enhanced Checkout Modal */}
//       <AnimatePresence>
//         {isCheckingOut && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center overflow-hidden p-2"
//             onClick={() => !loading && setIsCheckingOut(false)}
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
//                     <h2 className="text-base sm:text-lg font-bold">Checkout</h2>
//                     <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
//                       Total: ₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}
//                     </p>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8 rounded-full hover:bg-white/20 text-white flex-shrink-0"
//                     onClick={() => !loading && setIsCheckingOut(false)}
//                   >
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>

//               {/* Scrollable Content */}
//               <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3">
//                 {/* Compact Order Summary */}
//                 <div className="bg-purple-50 rounded-lg p-3 mb-4">
//                   <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
//                     <ShoppingBag className="w-3 h-3" />
//                     Order Summary ({cart.length} items)
//                   </h3>
//                   <div className="space-y-1 text-xs">
//                     <div className="flex justify-between font-medium border-b border-purple-200 pb-1">
//                       <span>Subtotal</span>
//                       <span>₹{totalPrice.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between text-orange-600">
//                       <span>Delivery</span>
//                       <span>{DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}</span>
//                     </div>
//                     <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
//                       <span>Total Amount</span>
//                       <span>₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Form */}
//                 <form onSubmit={handleCheckout} className="space-y-3">
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
//                   onClick={handleCheckout}
//                   className="w-full h-10 text-sm rounded-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Placing Order...
//                     </div>
//                   ) : (
//                     `Place Order - ₹${(totalPrice + DELIVERY_CHARGE).toLocaleString()}`
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

// export default CartPage;





import React, { useState, useEffect } from "react";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosConfig";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, Lock } from "lucide-react";

// New imports for phone verification and payment processing
import { usePhoneVerification } from "@/hooks/usePhoneVerification";
import { usePaymentProcessing } from "@/hooks/usePaymentProcessing";
import PhoneVerificationModal from "@/components/PhoneVerificationModal";

const CartPage = () => {
  const { cart, removeCart, clearCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Add phone verification and payment processing hooks
  const phoneVerification = usePhoneVerification();
  const { checkoutLoading, processPayment } = usePaymentProcessing();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  const getProductId = (item: any) => item._id || item.id;

  const totalPrice = getCartTotal();
  const DELIVERY_CHARGE = totalPrice >= 500 ? 0 : 80;
  const freeDeliveryGap = Math.max(0, 500 - totalPrice);

  // Phone verification success handler
  useEffect(() => {
    if (phoneVerification.phoneVerified) {
      setShippingAddress(prev => ({
        ...prev,
        phone: phoneVerification.phoneNumber
      }));
      setIsCheckingOut(true);
    }
  }, [phoneVerification.phoneVerified, phoneVerification.phoneNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuantityChange = (productId: number | string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeCart(productId);
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
        variant: "default"
      });
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleProductClick = (productId: number | string) => {
    const id = typeof productId === 'string' ? productId : productId.toString();
    navigate(`/product/${id}`);
  };

  // Updated checkout initiation
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
    
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    phoneVerification.setShowPhoneVerification(true);
  };

  // New payment selection handler
  const handlePaymentSelection = async (paymentMethod: "cod" | "online") => {
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

    if (!phoneVerification.phoneVerified) {
      toast({
        title: "Phone Not Verified",
        description: "Please verify your phone number first",
        variant: "destructive",
      });
      return;
    }

    const orderItems = cart.map(item => ({
      productId: item._id || item.id,
      quantity: item.quantity || 1,
      price: parseFloat(String(item.price).replace(/[^0-9.-]+/g, "")),
      name: item.name || item.Product_name,
      image: item.image || (item.Product_image && item.Product_image[0])
    }));

    const success = await processPayment(
      orderItems,
      shippingAddress,
      paymentMethod,
      {
        itemsTotal: totalPrice,
        deliveryCharge: DELIVERY_CHARGE,
        totalAmount: totalPrice + DELIVERY_CHARGE
      },
      "cart"
    );

    if (success) {
      clearCart();
      setIsCheckingOut(false);
      phoneVerification.resetPhoneVerification();
    }
  };

  const getItemTotal = (item: any) => {
    if (!item || !item.price) return 0;
    const priceString = typeof item.price === 'string' ? item.price : String(item.price);
    const priceNumber = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
    if (isNaN(priceNumber)) return 0;
    const quantity = item.quantity || 1;
    return priceNumber * quantity;
  };

  const getItemUnitPrice = (item: any) => {
    if (!item || !item.price) return 0;
    const priceString = typeof item.price === 'string' ? item.price : String(item.price);
    const priceNumber = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
    return isNaN(priceNumber) ? 0 : priceNumber;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-2 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center w-full max-w-xs"
        >
          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-purple-100">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3 sm:mb-4">
              <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-4 text-xs sm:text-sm">
              Discover our beautiful jewelry collection.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="w-full rounded-full px-4 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-xs sm:text-sm font-semibold"
            >
              Explore Collection
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

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
        @media (max-width: 375px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-16 pb-6 px-2 xs:px-3 overflow-x-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
              Your <span className="text-purple-600">Cart</span>
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              {cart.length} {cart.length === 1 ? 'item' : 'items'} ready for checkout
            </p>
          </motion.div>

          {/* Free delivery banner */}
          {freeDeliveryGap > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 sm:mb-4"
            >
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-orange-700 text-xs sm:text-sm">
                <Truck className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-semibold text-center">
                  Add ₹{freeDeliveryGap} more for <span className="text-orange-800 font-bold">FREE DELIVERY</span>
                </span>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-2 sm:p-3 md:p-4">
                <div className="space-y-2 sm:space-y-3">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${getProductId(item)}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 border border-gray-100 rounded-lg hover:shadow-sm transition-all duration-200"
                    >
                      {/* Product Image */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name || item.Product_name} 
                          className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleProductClick(getProductId(item))}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-jewelry.jpg';
                          }}
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-grow min-w-0">
                        <div className="space-y-1 sm:space-y-2">
                          {/* Product Name */}
                          <div className="min-w-0">
                            <h3 
                              className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-purple-600 transition-colors leading-tight"
                              onClick={() => handleProductClick(getProductId(item))}
                            >
                              {item.name || item.Product_name}
                            </h3>
                          </div>
                          
                          {/* Enhanced Price Display */}
                          <div className="space-y-1">
                            {/* Unit Price */}
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] sm:text-xs text-gray-500">Unit Price:</span>
                              <span className="text-xs sm:text-sm font-medium text-purple-600">
                                ₹{getItemUnitPrice(item).toLocaleString()}
                              </span>
                            </div>
                            
                            {/* Quantity and Total */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] sm:text-xs text-gray-500">Qty:</span>
                                <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                                  <button
                                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-l-md hover:bg-gray-200 transition-colors"
                                    onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) - 1)}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                  </button>
                                  <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-medium py-0.5">
                                    {item.quantity || 1}
                                  </span>
                                  <button
                                    className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-r-md hover:bg-gray-200 transition-colors"
                                    onClick={() => handleQuantityChange(getProductId(item), (item.quantity || 1) + 1)}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                                  </button>
                                </div>
                              </div>
                              
                              {/* Item Total Price - More Prominent */}
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
                              onClick={() => {
                                removeCart(getProductId(item));
                                toast({
                                  title: "Removed",
                                  description: "Item removed from cart",
                                  variant: "default"
                                });
                              }}
                              aria-label="Remove item"
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
                    onClick={() => navigate("/")}
                  >
                    Continue Shopping
                  </Button>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="destructive" 
                      className="flex-1 rounded-full px-3 py-2 text-xs sm:text-sm"
                      onClick={() => {
                        clearCart();
                        toast({
                          title: "Cart cleared",
                          description: "All items have been removed from your cart",
                          variant: "default"
                        });
                      }}
                    >
                      Clear Cart
                    </Button>
                    <Button 
                      className="flex-1 rounded-full px-3 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-xs sm:text-sm font-semibold"
                      onClick={() => startCheckout()}
                      disabled={cart.length === 0}
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg sm:rounded-xl shadow-xl border border-purple-100 p-3 sm:p-4 sticky top-20">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  Order Summary
                </h2>
                
                {/* Enhanced Items List */}
                <div className="space-y-1.5 mb-4 max-h-32 sm:max-h-40 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div 
                      key={`summary-${getProductId(item)}-${index}`} 
                      className="flex justify-between items-start text-xs sm:text-sm py-1"
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="font-medium text-gray-700 truncate leading-tight">
                          {item.name || item.Product_name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                          ₹{getItemUnitPrice(item).toLocaleString()} × {item.quantity || 1}
                        </div>
                      </div>
                      <div className="font-semibold text-purple-600 flex-shrink-0">
                        ₹{getItemTotal(item).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Calculation Section */}
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Subtotal ({cart.reduce((sum, item) => sum + (item.quantity || 1), 0)} items)</span>
                    <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className={`font-semibold ${DELIVERY_CHARGE > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                      {DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}
                    </span>
                  </div>
                  
                  {/* Free Delivery Progress */}
                  {DELIVERY_CHARGE > 0 && (
                    <div className="py-2 px-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
                        <span className="font-medium">Free Delivery Progress</span>
                        <span className="font-bold">₹{freeDeliveryGap} more</span>
                      </div>
                      <div className="bg-orange-200 h-2 rounded-full relative overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min((totalPrice / 500) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <div className="text-[10px] text-orange-600 mt-1 text-center">
                        {Math.round((totalPrice / 500) * 100)}% towards free delivery
                      </div>
                    </div>
                  )}
                  
                  {/* Total */}
                  <div className="flex justify-between items-center text-base sm:text-lg font-bold pt-2 border-t border-gray-200 bg-purple-50 -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 rounded-b-lg">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-purple-700">₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Quick Checkout Button */}
                <Button
                  className="w-full mt-4 rounded-full py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => startCheckout()}
                  disabled={cart.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Checkout Modal */}
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
                    <h2 className="text-base sm:text-lg font-bold">Checkout</h2>
                    <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
                      Total: ₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}
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
                {/* Compact Order Summary */}
                <div className="bg-purple-50 rounded-lg p-3 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm flex items-center gap-1">
                    <ShoppingBag className="w-3 h-3" />
                    Order Summary ({cart.length} items)
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium border-b border-purple-200 pb-1">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-orange-600">
                      <span>Delivery</span>
                      <span>{DELIVERY_CHARGE > 0 ? `₹${DELIVERY_CHARGE}` : "FREE"}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-purple-700 pt-1">
                      <span>Total Amount</span>
                      <span>₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Form */}
                <form className="space-y-3">
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
                {/* Online Payment Button */}
                <Button
                  onClick={() => handlePaymentSelection('online')}
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
                      Pay Online - ₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}
                    </div>
                  )}
                </Button>
                
                {/* Cash on Delivery Button */}
                <Button
                  onClick={() => handlePaymentSelection('cod')}
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
                      Cash on Delivery - ₹{(totalPrice + DELIVERY_CHARGE).toLocaleString()}
                    </div>
                  )}
                </Button>

                <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>UPI • Cards • Net Banking • COD Available</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone Verification Modal */}
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

export default CartPage;
