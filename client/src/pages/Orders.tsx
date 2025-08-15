// import { useEffect, useState, useCallback, useMemo, useRef } from "react";
// import Header from "@/components/Header";
// import { useAuth } from "@/components/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import axiosInstance from '@/utils/axiosConfig';
// import { TokenManager } from '@/utils/tokenManager';
// import { format, isValid } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Package, 
//   Truck, 
//   CheckCircle, 
//   Clock, 
//   XCircle, 
//   MapPin, 
//   CreditCard,
//   Sparkles,
//   ArrowLeft,
//   RefreshCw,
//   Phone,
//   Mail,
//   Receipt,
//   Gift
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// // ✅ Enhanced interfaces for user orders
// interface ShippingAddress {
//   fullName?: string;
//   address?: string;
//   street?: string;
//   city?: string;
//   state?: string;
//   pinCode?: string;
//   pincode?: string;
//   phone?: string;
//   country?: string;
// }

// interface OrderItem {
//   productId: string | any;
//   product?: string;
//   name?: string;
//   quantity: number;
//   price: number;
//   image?: string;
//   _id?: string;
// }

// interface BackendOrder {
//   _id: string;
//   createdAt: string;
//   updatedAt?: string;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   paymentMethod: string;
//   totalAmount: number;
//   items: OrderItem[];
//   shippingAddress: ShippingAddress;
//   Contact_number?: string;
//   user_email?: string;
//   estimatedDelivery?: string;
//   trackingNumber?: string;
//   shiprocketOrderId?: string;
//   isCustomHamper?: boolean;
//   notes?: string;
// }

// interface DisplayOrder {
//   _id: string;
//   createdAt: string;
//   updatedAt?: string;
//   orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   paymentMethod: string;
//   totalAmount: number;
//   items: {
//     _id: string;
//     name: string;
//     image: string;
//     price: number;
//     quantity: number;
//   }[];
//   shippingAddress: {
//     fullName: string;
//     address: string;
//     city: string;
//     state: string;
//     pinCode: string;
//     phone: string;
//     email?: string;
//   };
//   isCustomHamper?: boolean;
//   estimatedDelivery?: string;
//   trackingNumber?: string;
//   shiprocketOrderId?: string;
// }

// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   _id?: string;
//   id?: string; 
// }

// // Enhanced status configurations with better mobile support
// const orderStatusConfig = {
//   pending: {
//     icon: Clock,
//     color: "bg-amber-500",
//     textColor: "text-amber-700",
//     bgColor: "bg-amber-50",
//     borderColor: "border-amber-200",
//     label: "Order Placed",
//     description: "Your order has been received and is being prepared"
//   },
//   processing: {
//     icon: Package,
//     color: "bg-blue-500",
//     textColor: "text-blue-700",
//     bgColor: "bg-blue-50",
//     borderColor: "border-blue-200",
//     label: "Processing",
//     description: "Your order is being prepared for shipment"
//   },
//   shipped: {
//     icon: Truck,
//     color: "bg-purple-500",
//     textColor: "text-purple-700",
//     bgColor: "bg-purple-50",
//     borderColor: "border-purple-200",
//     label: "Shipped",
//     description: "Your order is on its way to you"
//   },
//   delivered: {
//     icon: CheckCircle,
//     color: "bg-green-500",
//     textColor: "text-green-700",
//     bgColor: "bg-green-50",
//     borderColor: "border-green-200",
//     label: "Delivered",
//     description: "Your order has been successfully delivered"
//   },
//   cancelled: {
//     icon: XCircle,
//     color: "bg-red-500",
//     textColor: "text-red-700",
//     bgColor: "bg-red-50",
//     borderColor: "border-red-200",
//     label: "Cancelled",
//     description: "Your order has been cancelled"
//   }
// };

// const paymentStatusConfig = {
//   pending: { 
//     color: "bg-amber-500", 
//     label: "Payment Pending",
//     textColor: "text-amber-700",
//     bgColor: "bg-amber-50"
//   },
//   paid: { 
//     color: "bg-green-500", 
//     label: "Paid",
//     textColor: "text-green-700",
//     bgColor: "bg-green-50"
//   },
//   failed: { 
//     color: "bg-red-500", 
//     label: "Payment Failed",
//     textColor: "text-red-700",
//     bgColor: "bg-red-50"
//   }
// };

// // ✅ Reliable placeholder image data URL to prevent continuous requests
// const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMS4zMzMzIDQyLjY2NjdMMzIgMzJMNDIuNjY2NyA0Mi42NjY3SDIxLjMzMzNaIiBmaWxsPSIjOUI5QjlCIi8+CjxjaXJjbGUgY3g9IjI2LjY2NjciIGN5PSIyMy4zMzMzIiByPSI0IiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';

// const Orders = () => {
//   // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONALS
//   const { user }: { user: User | null } = useAuth();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState<DisplayOrder[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // ✅ Add refs to track component state
//   const isMountedRef = useRef(true);
//   const fetchingRef = useRef(false);
//   const hasInitialFetch = useRef(false);

//   // ✅ Memoize userId to prevent unnecessary re-renders
//   const userId = useMemo(() => {
//     return user?._id || user?.id;
//   }, [user?._id, user?.id]);

//   // ✅ Setup and cleanup effect
//   useEffect(() => {
//     isMountedRef.current = true;
//     return () => {
//       isMountedRef.current = false;
//       fetchingRef.current = false;
//     };
//   }, []);

//   // ✅ Safe date formatting function
//   const formatDate = useCallback((dateString: string | undefined, formatString: string): string => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (!isValid(date)) return 'N/A';
//       return format(date, formatString);
//     } catch (error) {
//       return 'N/A';
//     }
//   }, []);

//   // ✅ Enhanced transformer with proper image handling and debugging
//   const transformOrderForDisplay = useCallback((backendOrder: BackendOrder): DisplayOrder => {
//     const transformedItems = backendOrder.items.map((item) => {
//       let productName = 'Product Name';
//       let productImage = null;
      
//       // Debug each item transformation
//       console.log('🔄 Transforming item:', {
//         itemId: item._id,
//         productId: item.productId,
//         productIdType: typeof item.productId,
//         itemName: item.name,
//         itemImage: item.image
//       });
      
//       if (typeof item.productId === 'object' && item.productId) {
//         // Product details are populated from backend
//         productName = item.productId.Product_name || item.productId.name || 'Product Name';
//         productImage = item.productId.Product_image?.[0] || item.productId.image || null;
        
//         console.log('✅ Product populated:', {
//           name: productName,
//           image: productImage,
//           fullProductObject: item.productId
//         });
//       } else if (item.name) {
//         // Fallback to item-level data
//         productName = item.name;
//         productImage = item.image;
        
//         console.log('⚠️ Using item-level data:', { name: productName, image: productImage });
//       } else {
//         console.log('❌ No product data available for item');
//       }
      
//       // Validate and set final image - prevent placeholder loops
//       const finalImage = productImage && 
//                          productImage !== '/placeholder-product.jpg' && 
//                          productImage.trim() !== '' && 
//                          !productImage.includes('placeholder') ? 
//                          productImage : 
//                          PLACEHOLDER_IMAGE;
      
//       return {
//         _id: item._id || (typeof item.productId === 'string' ? item.productId : item.productId?._id) || '',
//         name: productName,
//         image: finalImage,
//         price: item.price,
//         quantity: item.quantity
//       };
//     });

//     return {
//       _id: backendOrder._id,
//       createdAt: backendOrder.createdAt,
//       updatedAt: backendOrder.updatedAt,
//       orderStatus: backendOrder.status,
//       paymentStatus: backendOrder.paymentStatus,
//       paymentMethod: backendOrder.paymentMethod,
//       totalAmount: backendOrder.totalAmount,
//       items: transformedItems,
//       shippingAddress: {
//         fullName: backendOrder.shippingAddress?.fullName || 
//                   backendOrder.shippingAddress?.street || 'N/A',
//         address: backendOrder.shippingAddress?.address || 
//                  backendOrder.shippingAddress?.street || 'N/A',
//         city: backendOrder.shippingAddress?.city || 'N/A',
//         state: backendOrder.shippingAddress?.state || 'N/A',
//         pinCode: backendOrder.shippingAddress?.pinCode || 
//                  backendOrder.shippingAddress?.pincode || 'N/A',
//         phone: backendOrder.shippingAddress?.phone || 
//                backendOrder.Contact_number || 'N/A',
//         email: backendOrder.user_email
//       },
//       isCustomHamper: backendOrder.isCustomHamper,
//       estimatedDelivery: backendOrder.estimatedDelivery,
//       trackingNumber: backendOrder.trackingNumber,
//       shiprocketOrderId: backendOrder.shiprocketOrderId
//     };
//   }, []);

//   // ✅ SINGLE EFFECT FOR FETCHING - WITH DEBUGGING
//   useEffect(() => {
//     // Only fetch if we have user and haven't fetched before
//     if (!user || !userId || hasInitialFetch.current || fetchingRef.current) {
//       return;
//     }

//     const fetchOrders = async () => {
//       const token = TokenManager.getToken('user');
//       if (!token) {
//         console.log("❌ No valid user token found");
//         toast({
//           title: "Authentication Required",
//           description: "Please log in to view your orders.",
//           variant: "destructive"
//         });
//         navigate('/login');
//         return;
//       }
      
//       fetchingRef.current = true;
//       hasInitialFetch.current = true;
//       setLoading(true);
      
//       try {
//         console.log('🔄 Fetching user orders for userId:', userId);
        
//         const res = await axiosInstance.get(`/cashfree/my-orders/${userId}`);
        
//         if (!isMountedRef.current) return;
        
//         const backendOrders: BackendOrder[] = res.data.orders || [];
//         console.log('📦 Raw backend orders:', backendOrders.length);
        
//         // ✅ Enhanced debugging for backend population
//         if (backendOrders.length > 0 && backendOrders[0].items.length > 0) {
//           const firstItem = backendOrders[0].items[0];
//           console.log('🔍 First item productId:', firstItem.productId);
//           console.log('🔍 ProductId type:', typeof firstItem.productId);
          
//           if (typeof firstItem.productId === 'object') {
//             console.log('✅ Product details populated:', {
//               name: firstItem.productId.Product_name,
//               image: firstItem.productId.Product_image,
//               hasImage: !!firstItem.productId.Product_image?.[0]
//             });
//           } else {
//             console.log('❌ Product not populated - only ID:', firstItem.productId);
//           }
//         }
        
//         // Transform orders for display
//         const transformedOrders = backendOrders.map(order => transformOrderForDisplay(order));
        
//         if (!isMountedRef.current) return;
        
//         // Sort by creation date (newest first)
//         const sortedOrders = transformedOrders.sort((a, b) => 
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
        
//         setOrders(sortedOrders);
//         console.log(`✨ Successfully loaded ${sortedOrders.length} orders`);
        
//       } catch (err: any) {
//         if (!isMountedRef.current) return;
        
//         console.error("❌ Error fetching orders:", err);
        
//         if (err?.response?.status === 401) {
//           TokenManager.clearTokens('user');
//           toast({
//             title: "Session Expired",
//             description: "Please log in again to view your orders.",
//             variant: "destructive"
//           });
//           navigate('/login');
//         } else {
//           toast({
//             title: "Error Loading Orders",
//             description: "Failed to fetch your orders",
//             variant: "destructive"
//           });
//         }
//       } finally {
//         fetchingRef.current = false;
//         if (isMountedRef.current) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchOrders();
//   }, [user, userId]); // ✅ ONLY user and userId as dependencies

//   // ✅ Manual refresh function
//   const handleRefresh = useCallback(() => {
//     if (!user || !userId) {
//       toast({
//         title: "Please Login",
//         description: "You need to log in to refresh orders.",
//         variant: "destructive"
//       });
//       navigate('/login');
//       return;
//     }

//     // Reset fetch flag and trigger refetch
//     hasInitialFetch.current = false;
//     fetchingRef.current = false;
    
//     // Force re-fetch by clearing orders temporarily
//     setOrders([]);
//     setLoading(true);
    
//     // The useEffect will run again because we reset hasInitialFetch
//     setTimeout(() => {
//       hasInitialFetch.current = false;
//     }, 100);
//   }, [user, userId, toast, navigate]);

//   // ✅ Get order status progress
//   const getOrderProgress = useCallback((status: string) => {
//     const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
//     const currentIndex = statusOrder.indexOf(status);
//     return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
//   }, []);

//   // ✅ Enhanced image error handler to prevent infinite loops
//   const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//     const target = e.target as HTMLImageElement;
//     const currentSrc = target.src;
    
//     // Prevent infinite loops by checking if we've already set a fallback
//     if (currentSrc.includes('data:image') || currentSrc.includes('placeholder.com')) {
//       return;
//     }
    
//     console.log('🖼️ Image failed to load:', currentSrc);
    
//     // Set reliable fallback
//     target.src = PLACEHOLDER_IMAGE;
//     target.onerror = null; // Prevent further error events
//   }, []);

//   // ✅ Mobile-optimized Loading component
//   const LoadingSpinner = useCallback(() => (
//     <div className="flex flex-col justify-center items-center py-12 sm:py-20">
//       <div className="relative mb-4 sm:mb-6">
//         <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-200 rounded-full animate-spin"></div>
//         <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
//       </div>
//       <p className="text-gray-600 text-sm sm:text-lg font-medium px-4 text-center">Loading your orders...</p>
//     </div>
//   ), []);

//   // ✅ Mobile-optimized Empty state
//   const EmptyOrders = useCallback(() => (
//     <motion.div 
//       className="text-center py-12 sm:py-20 px-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 max-w-sm sm:max-w-md mx-auto shadow-xl border border-purple-100/50">
//         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
//           <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
//         </div>
//         <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
//           No Orders Yet
//         </h3>
//         <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
//           Your jewelry collection is waiting! Explore our beautiful pieces and place your first order.
//         </p>
//         <div className="flex flex-col gap-3 sm:gap-4 justify-center">
//           <button 
//             onClick={() => navigate('/')}
//             className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
//           >
//             <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
//             Start Shopping
//           </button>
//           <button 
//             onClick={handleRefresh}
//             className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold transition-all duration-300 text-sm sm:text-base"
//           >
//             <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
//             Refresh
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   ), [navigate, handleRefresh]);

//   // ✅ Ultra-responsive Order Details Component
//   const OrderDetails = useCallback(({ order }: { order: DisplayOrder }) => {
//     const statusConfig = orderStatusConfig[order.orderStatus];
//     const paymentConfig = paymentStatusConfig[order.paymentStatus];
//     const StatusIcon = statusConfig.icon;

//     return (
//       <motion.div 
//         className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-3 sm:p-6 md:p-8 mb-4 sm:mb-6 overflow-hidden"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* ✅ Mobile-first Order Header */}
//         <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-purple-100">
//           <div className="flex items-center gap-3">
//             <div className={`w-10 h-10 sm:w-12 sm:h-12 ${statusConfig.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
//               <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${statusConfig.textColor}`} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
//                   Order #{order._id.slice(-6).toUpperCase()}
//                 </h3>
//                 {order.isCustomHamper && (
//                   <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                     <Gift className="w-3 h-3 mr-1" />
//                     Custom Hamper
//                   </Badge>
//                 )}
//               </div>
//               <p className="text-xs sm:text-sm text-gray-600 truncate">
//                 {formatDate(order.createdAt, 'MMM d, yyyy - h:mm a')}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end sm:gap-2">
//             <Badge className={`${statusConfig.color} text-white px-3 py-2 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap`}>
//               {statusConfig.label}
//             </Badge>
//             <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               ₹{order.totalAmount?.toFixed(2) || '0.00'}
//             </div>
//           </div>
//         </div>

//         {/* ✅ Compact Order Progress for Mobile */}
//         {order.orderStatus !== 'cancelled' && (
//           <div className="mb-4 sm:mb-8">
//             <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-600 mb-2">
//               <span>Order Progress</span>
//               <span>{Math.round(getOrderProgress(order.orderStatus))}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${getOrderProgress(order.orderStatus)}%` }}
//               ></div>
//             </div>
//             <div className="flex justify-between mt-2 text-xs text-gray-500">
//               <span>Placed</span>
//               <span className="hidden xs:inline">Processing</span>
//               <span className="xs:hidden">Process</span>
//               <span>Shipped</span>
//               <span className="hidden xs:inline">Delivered</span>
//               <span className="xs:hidden">Done</span>
//             </div>
//           </div>
//         )}

//         {/* ✅ Compact Tracking Information */}
//         {(order.trackingNumber || order.shiprocketOrderId) && (
//           <div className={`${statusConfig.bgColor} p-3 sm:p-4 rounded-xl sm:rounded-2xl ${statusConfig.borderColor} border mb-4 sm:mb-6`}>
//             <div className="flex items-center gap-2 sm:gap-3 mb-2">
//               <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//               <span className="font-semibold text-sm sm:text-base text-gray-900">Tracking Info</span>
//             </div>
//             {order.trackingNumber && (
//               <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                 <span className="font-medium">Tracking:</span> 
//                 <span className="font-mono font-semibold ml-2 break-all">{order.trackingNumber}</span>
//               </p>
//             )}
//             {order.shiprocketOrderId && (
//               <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                 <span className="font-medium">Shiprocket ID:</span>
//                 <span className="font-mono font-semibold ml-2">{order.shiprocketOrderId}</span>
//               </p>
//             )}
//             {order.estimatedDelivery && (
//               <p className="text-xs sm:text-sm text-gray-600">
//                 <span className="font-medium">Est. Delivery:</span>
//                 <span className="ml-2">{formatDate(order.estimatedDelivery, 'MMM d, yyyy')}</span>
//               </p>
//             )}
//           </div>
//         )}

//         {/* ✅ Mobile-optimized Order Items with fixed image handling */}
//         <div className="mb-4 sm:mb-6">
//           <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
//             <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//             Items ({order.items?.length || 0})
//           </h4>
//           <div className="space-y-3 sm:space-y-4">
//             {order.items?.map((item, index) => (
//               <motion.div 
//                 key={item._id || index}
//                 className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-white/60 to-purple-50/30 rounded-xl sm:rounded-2xl border border-purple-100/50"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 <div className="flex-shrink-0">
//                   <img
//                     src={item.image}
//                     alt={item.name || 'Product'}
//                     className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl border border-purple-100 shadow-md"
//                     onError={handleImageError}
//                   />
//                 </div>
//                 <div className="flex-grow min-w-0">
//                   <h5 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">
//                     {item.name || 'Product Name'}
//                   </h5>
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
//                     <span className="text-xs sm:text-sm text-gray-600">
//                       Qty: {item.quantity || 0} × ₹{(item.price || 0).toFixed(2)}
//                     </span>
//                     <span className="font-bold text-sm sm:text-base text-purple-700 self-start sm:self-auto">
//                       ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-4 text-sm">No items found</p>
//             )}
//           </div>
//         </div>

//         {/* ✅ Mobile-stacked Shipping & Payment Info */}
//         <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
//           {/* Shipping Address */}
//           <div className={`${statusConfig.bgColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl ${statusConfig.borderColor} border`}>
//             <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//               <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//               <h4 className="font-bold text-sm sm:text-base text-gray-900">Shipping Address</h4>
//             </div>
//             <div className="text-gray-700 space-y-1 text-xs sm:text-sm">
//               <p className="font-semibold">{order.shippingAddress.fullName}</p>
//               <p className="break-words">{order.shippingAddress.address}</p>
//               <p>
//                 {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
//               </p>
//               {order.shippingAddress.phone !== 'N/A' && (
//                 <p className="mt-2 flex items-center gap-1">
//                   <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
//                   <span className="font-medium">{order.shippingAddress.phone}</span>
//                 </p>
//               )}
//               {order.shippingAddress.email && (
//                 <p className="flex items-center gap-1">
//                   <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
//                   <span className="font-medium break-all">{order.shippingAddress.email}</span>
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Payment Information */}
//           <div className={`${paymentConfig.bgColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-opacity-50`}>
//             <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//               <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//               <h4 className="font-bold text-sm sm:text-base text-gray-900">Payment Details</h4>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs sm:text-sm text-gray-600">Method:</span>
//                 <span className="bg-white px-2 sm:px-3 py-1 rounded-full border border-purple-200 text-xs sm:text-sm font-semibold">
//                   {(order.paymentMethod || 'COD').toUpperCase()}
//                 </span>
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <span className="text-xs sm:text-sm text-gray-600">Status:</span>
//                 <Badge className={`${paymentConfig.color} text-white px-2 sm:px-3 py-1 rounded-full text-xs`}>
//                   {paymentConfig.label}
//                 </Badge>
//               </div>
              
//               <div className="pt-3 border-t border-purple-100">
//                 <div className="flex justify-between font-bold text-sm sm:text-lg">
//                   <span>Total:</span>
//                   <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                     ₹{(order.totalAmount || 0).toFixed(2)}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }, [formatDate, getOrderProgress, handleImageError]);

//   // ✅ Conditional rendering AFTER all hooks
//   if (!user) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white px-4">
//           <div className="text-center max-w-sm sm:max-w-md p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100/50">
//             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
//               <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
//               Please Login
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
//               You need to be logged in to view your orders.
//             </p>
//             <button 
//               onClick={() => navigate('/login')}
//               className="inline-flex items-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
//             >
//               Go to Login
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       {/* ✅ Add responsive CSS */}
//       <style>{`
//         @media (max-width: 360px) {
//           .container {
//             padding-left: 8px;
//             padding-right: 8px;
//           }
//         }
        
//         .xs\\:hidden {
//           @media (max-width: 479px) {
//             display: none;
//           }
//         }
        
//         .xs\\:inline {
//           @media (min-width: 480px) {
//             display: inline;
//           }
//         }

//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>

//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-12 sm:py-16 px-2 sm:px-4 lg:px-8 pt-16 sm:pt-20 lg:pt-24">
//         {/* Background Decorations - Scaled for mobile */}
//         <div className="fixed top-16 left-4 sm:top-20 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-purple-200/20 blur-2xl sm:blur-3xl animate-pulse" />
//         <div className="fixed bottom-32 right-4 sm:bottom-40 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-pink-200/20 blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
//         <div className="max-w-4xl xl:max-w-6xl mx-auto relative z-10">
//           {/* ✅ Mobile-optimized Header */}
//           <motion.div 
//             className="text-center mb-8 sm:mb-12"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
//               <Package className="w-3 h-3 sm:w-4 sm:h-4" />
//               My Orders
//             </div>
//             <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
//               Your Orders
//             </h1>
//             <p className="text-sm sm:text-lg text-gray-600 max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-4">
//               Track your jewelry orders and view order history
//             </p>
            
//             {/* Navigation & Refresh */}
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-4 sm:mt-6 px-4">
//               <button
//                 onClick={() => navigate('/profile')}
//                 className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors text-sm sm:text-base"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Profile
//               </button>
//               <button
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
//               >
//                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                 Refresh Orders
//               </button>
//             </div>
//           </motion.div>

//           {/* ✅ Mobile-optimized Orders Summary */}
//           {!loading && orders.length > 0 && (
//             <motion.div 
//               className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
//                   <p className="text-sm sm:text-base text-gray-600">
//                     You have {orders.length} order{orders.length !== 1 ? 's' : ''} in total
//                   </p>
//                 </div>
                
//                 <div className="flex gap-3 sm:gap-4 text-center w-full sm:w-auto justify-around sm:justify-end">
//                   {Object.entries(
//                     orders.reduce((acc, order) => {
//                       acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
//                       return acc;
//                     }, {} as Record<string, number>)
//                   ).map(([status, count]) => {
//                     const statusConfig = orderStatusConfig[status as keyof typeof orderStatusConfig];
//                     return (
//                       <div key={status} className="text-center">
//                         <div className={`w-6 h-6 sm:w-8 sm:h-8 ${statusConfig.bgColor} rounded-lg flex items-center justify-center mx-auto mb-1`}>
//                           <statusConfig.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${statusConfig.textColor}`} />
//                         </div>
//                         <div className="text-sm sm:text-lg font-bold text-gray-900">{count}</div>
//                         <div className="text-xs text-gray-600 capitalize hidden sm:block">{status}</div>
//                         <div className="text-xs text-gray-600 capitalize sm:hidden">
//                           {status === 'processing' ? 'Process' : status}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Orders List */}
//           {loading ? (
//             <LoadingSpinner />
//           ) : orders.length === 0 ? (
//             <EmptyOrders />
//           ) : (
//             <div className="space-y-4 sm:space-y-6">
//               {orders.map((order, index) => (
//                 <motion.div
//                   key={order._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                   <OrderDetails order={order} />
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Orders;






























// import { useEffect, useState, useCallback, useMemo, useRef } from "react";
// import Header from "@/components/Header";
// import { useAuth } from "@/components/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import axiosInstance from '@/utils/axiosConfig';
// import { TokenManager } from '@/utils/tokenManager';
// import { format, isValid } from "date-fns";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Package, 
//   Truck, 
//   CheckCircle, 
//   Clock, 
//   XCircle, 
//   MapPin, 
//   CreditCard,
//   Sparkles,
//   ArrowLeft,
//   RefreshCw,
//   Phone,
//   Mail,
//   Receipt,
//   Gift
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";

// // ✅ Enhanced interfaces for user orders with delivery breakdown
// interface ShippingAddress {
//   fullName?: string;
//   address?: string;
//   street?: string;
//   city?: string;
//   state?: string;
//   pinCode?: string;
//   pincode?: string;
//   phone?: string;
//   country?: string;
// }

// interface OrderItem {
//   productId: string | any;
//   product?: string;
//   name?: string;
//   quantity: number;
//   price: number;
//   image?: string;
//   _id?: string;
// }

// interface BackendOrder {
//   _id: string;
//   createdAt: string;
//   updatedAt?: string;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   paymentMethod: string;
//   totalAmount: number;
//   // ✅ Add delivery breakdown fields
//   itemsTotal?: number;
//   deliveryCharge?: number;
//   items: OrderItem[];
//   shippingAddress: ShippingAddress;
//   Contact_number?: string;
//   user_email?: string;
//   estimatedDelivery?: string;
//   trackingNumber?: string;
//   shiprocketOrderId?: string;
//   isCustomHamper?: boolean;
//   notes?: string;
// }

// interface DisplayOrder {
//   _id: string;
//   createdAt: string;
//   updatedAt?: string;
//   orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   paymentStatus: 'pending' | 'paid' | 'failed';
//   paymentMethod: string;
//   totalAmount: number;
//   // ✅ Add delivery breakdown fields
//   itemsTotal?: number;
//   deliveryCharge?: number;
//   items: {
//     _id: string;
//     name: string;
//     image: string;
//     price: number;
//     quantity: number;
//   }[];
//   shippingAddress: {
//     fullName: string;
//     address: string;
//     city: string;
//     state: string;
//     pinCode: string;
//     phone: string;
//     email?: string;
//   };
//   isCustomHamper?: boolean;
//   estimatedDelivery?: string;
//   trackingNumber?: string;
//   shiprocketOrderId?: string;
// }

// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   _id?: string;
//   id?: string; 
// }

// // Enhanced status configurations with better mobile support
// const orderStatusConfig = {
//   pending: {
//     icon: Clock,
//     color: "bg-amber-500",
//     textColor: "text-amber-700",
//     bgColor: "bg-amber-50",
//     borderColor: "border-amber-200",
//     label: "Order Placed",
//     description: "Your order has been received and is being prepared"
//   },
//   processing: {
//     icon: Package,
//     color: "bg-blue-500",
//     textColor: "text-blue-700",
//     bgColor: "bg-blue-50",
//     borderColor: "border-blue-200",
//     label: "Processing",
//     description: "Your order is being prepared for shipment"
//   },
//   shipped: {
//     icon: Truck,
//     color: "bg-purple-500",
//     textColor: "text-purple-700",
//     bgColor: "bg-purple-50",
//     borderColor: "border-purple-200",
//     label: "Shipped",
//     description: "Your order is on its way to you"
//   },
//   delivered: {
//     icon: CheckCircle,
//     color: "bg-green-500",
//     textColor: "text-green-700",
//     bgColor: "bg-green-50",
//     borderColor: "border-green-200",
//     label: "Delivered",
//     description: "Your order has been successfully delivered"
//   },
//   cancelled: {
//     icon: XCircle,
//     color: "bg-red-500",
//     textColor: "text-red-700",
//     bgColor: "bg-red-50",
//     borderColor: "border-red-200",
//     label: "Cancelled",
//     description: "Your order has been cancelled"
//   }
// };

// const paymentStatusConfig = {
//   pending: { 
//     color: "bg-amber-500", 
//     label: "Payment Pending",
//     textColor: "text-amber-700",
//     bgColor: "bg-amber-50"
//   },
//   paid: { 
//     color: "bg-green-500", 
//     label: "Paid",
//     textColor: "text-green-700",
//     bgColor: "bg-green-50"
//   },
//   failed: { 
//     color: "bg-red-500", 
//     label: "Payment Failed",
//     textColor: "text-red-700",
//     bgColor: "bg-red-50"
//   }
// };

// // ✅ Reliable placeholder image data URL to prevent continuous requests
// const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMS4zMzMzIDQyLjY2NjdMMzIgMzJMNDIuNjY2NyA0Mi42NjY3SDIxLjMzMzNaIiBmaWxsPSIjOUI5QjlCIi8+CjxjaXJjbGUgY3g9IjI2LjY2NjciIGN5PSIyMy4zMzMzIiByPSI0IiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';

// const Orders = () => {
//   // ✅ ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONALS
//   const { user }: { user: User | null } = useAuth();
//   const { toast } = useToast();
//   const navigate = useNavigate();
//   const [orders, setOrders] = useState<DisplayOrder[]>([]);
//   const [loading, setLoading] = useState(false);
  
//   // ✅ Add refs to track component state
//   const isMountedRef = useRef(true);
//   const fetchingRef = useRef(false);
//   const hasInitialFetch = useRef(false);

//   // ✅ Memoize userId to prevent unnecessary re-renders
//   const userId = useMemo(() => {
//     return user?._id || user?.id;
//   }, [user?._id, user?.id]);

//   // ✅ Setup and cleanup effect
//   useEffect(() => {
//     isMountedRef.current = true;
//     return () => {
//       isMountedRef.current = false;
//       fetchingRef.current = false;
//     };
//   }, []);

//   // ✅ Safe date formatting function
//   const formatDate = useCallback((dateString: string | undefined, formatString: string): string => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       if (!isValid(date)) return 'N/A';
//       return format(date, formatString);
//     } catch (error) {
//       return 'N/A';
//     }
//   }, []);

//   // ✅ Enhanced transformer to include delivery breakdown
//   const transformOrderForDisplay = useCallback((backendOrder: BackendOrder): DisplayOrder => {
//     const transformedItems = backendOrder.items.map((item) => {
//       let productName = 'Product Name';
//       let productImage = null;
      
//       // Debug each item transformation
//       console.log('🔄 Transforming item:', {
//         itemId: item._id,
//         productId: item.productId,
//         productIdType: typeof item.productId,
//         itemName: item.name,
//         itemImage: item.image
//       });
      
//       if (typeof item.productId === 'object' && item.productId) {
//         // Product details are populated from backend
//         productName = item.productId.Product_name || item.productId.name || 'Product Name';
//         productImage = item.productId.Product_image?.[0] || item.productId.image || null;
        
//         console.log('✅ Product populated:', {
//           name: productName,
//           image: productImage,
//           fullProductObject: item.productId
//         });
//       } else if (item.name) {
//         // Fallback to item-level data
//         productName = item.name;
//         productImage = item.image;
        
//         console.log('⚠️ Using item-level data:', { name: productName, image: productImage });
//       } else {
//         console.log('❌ No product data available for item');
//       }
      
//       // Validate and set final image - prevent placeholder loops
//       const finalImage = productImage && 
//                          productImage !== '/placeholder-product.jpg' && 
//                          productImage.trim() !== '' && 
//                          !productImage.includes('placeholder') ? 
//                          productImage : 
//                          PLACEHOLDER_IMAGE;
      
//       return {
//         _id: item._id || (typeof item.productId === 'string' ? item.productId : item.productId?._id) || '',
//         name: productName,
//         image: finalImage,
//         price: item.price,
//         quantity: item.quantity
//       };
//     });

//     // ✅ Calculate delivery breakdown if not provided
//     const deliveryCharge = backendOrder.deliveryCharge || 80; // Default delivery charge
//     const itemsTotal = backendOrder.itemsTotal || (backendOrder.totalAmount - deliveryCharge);

//     return {
//       _id: backendOrder._id,
//       createdAt: backendOrder.createdAt,
//       updatedAt: backendOrder.updatedAt,
//       orderStatus: backendOrder.status,
//       paymentStatus: backendOrder.paymentStatus,
//       paymentMethod: backendOrder.paymentMethod,
//       totalAmount: backendOrder.totalAmount,
//       // ✅ Include delivery breakdown
//       itemsTotal: itemsTotal,
//       deliveryCharge: deliveryCharge,
//       items: transformedItems,
//       shippingAddress: {
//         fullName: backendOrder.shippingAddress?.fullName || 
//                   backendOrder.shippingAddress?.street || 'N/A',
//         address: backendOrder.shippingAddress?.address || 
//                  backendOrder.shippingAddress?.street || 'N/A',
//         city: backendOrder.shippingAddress?.city || 'N/A',
//         state: backendOrder.shippingAddress?.state || 'N/A',
//         pinCode: backendOrder.shippingAddress?.pinCode || 
//                  backendOrder.shippingAddress?.pincode || 'N/A',
//         phone: backendOrder.shippingAddress?.phone || 
//                backendOrder.Contact_number || 'N/A',
//         email: backendOrder.user_email
//       },
//       isCustomHamper: backendOrder.isCustomHamper,
//       estimatedDelivery: backendOrder.estimatedDelivery,
//       trackingNumber: backendOrder.trackingNumber,
//       shiprocketOrderId: backendOrder.shiprocketOrderId
//     };
//   }, []);

//   // ✅ SINGLE EFFECT FOR FETCHING - WITH ENHANCED DEBUGGING
//   useEffect(() => {
//     // Only fetch if we have user and haven't fetched before
//     if (!user || !userId || hasInitialFetch.current || fetchingRef.current) {
//       return;
//     }

//     const fetchOrders = async () => {
//       const token = TokenManager.getToken('user');
//       if (!token) {
//         console.log("❌ No valid user token found");
//         toast({
//           title: "Authentication Required",
//           description: "Please log in to view your orders.",
//           variant: "destructive"
//         });
//         navigate('/login');
//         return;
//       }
      
//       fetchingRef.current = true;
//       hasInitialFetch.current = true;
//       setLoading(true);
      
//       try {
//         console.log('🔄 Fetching user orders for userId:', userId);
        
//         const res = await axiosInstance.get(`/cashfree/my-orders/${userId}`);
        
//         if (!isMountedRef.current) return;
        
//         const backendOrders: BackendOrder[] = res.data.orders || [];
//         console.log('📦 Raw backend orders:', backendOrders.length);
        
//         // ✅ Enhanced debugging for backend population and delivery charges
//         if (backendOrders.length > 0 && backendOrders[0].items.length > 0) {
//           const firstOrder = backendOrders[0];
//           const firstItem = firstOrder.items[0];
          
//           console.log('🔍 First order details:', {
//             orderId: firstOrder._id,
//             totalAmount: firstOrder.totalAmount,
//             itemsTotal: firstOrder.itemsTotal,
//             deliveryCharge: firstOrder.deliveryCharge,
//             paymentMethod: firstOrder.paymentMethod
//           });
          
//           console.log('🔍 First item productId:', firstItem.productId);
//           console.log('🔍 ProductId type:', typeof firstItem.productId);
          
//           if (typeof firstItem.productId === 'object') {
//             console.log('✅ Product details populated:', {
//               name: firstItem.productId.Product_name,
//               image: firstItem.productId.Product_image,
//               hasImage: !!firstItem.productId.Product_image?.[0]
//             });
//           } else {
//             console.log('❌ Product not populated - only ID:', firstItem.productId);
//           }
//         }
        
//         // Transform orders for display
//         const transformedOrders = backendOrders.map(order => transformOrderForDisplay(order));
        
//         if (!isMountedRef.current) return;
        
//         // Sort by creation date (newest first)
//         const sortedOrders = transformedOrders.sort((a, b) => 
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
        
//         setOrders(sortedOrders);
//         console.log(`✨ Successfully loaded ${sortedOrders.length} orders`);
        
//       } catch (err: any) {
//         if (!isMountedRef.current) return;
        
//         console.error("❌ Error fetching orders:", err);
        
//         if (err?.response?.status === 401) {
//           TokenManager.clearTokens('user');
//           toast({
//             title: "Session Expired",
//             description: "Please log in again to view your orders.",
//             variant: "destructive"
//           });
//           navigate('/login');
//         } else {
//           toast({
//             title: "Error Loading Orders",
//             description: "Failed to fetch your orders",
//             variant: "destructive"
//           });
//         }
//       } finally {
//         fetchingRef.current = false;
//         if (isMountedRef.current) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchOrders();
//   }, [user, userId]); // ✅ ONLY user and userId as dependencies

//   // ✅ Manual refresh function
//   const handleRefresh = useCallback(() => {
//     if (!user || !userId) {
//       toast({
//         title: "Please Login",
//         description: "You need to log in to refresh orders.",
//         variant: "destructive"
//       });
//       navigate('/login');
//       return;
//     }

//     // Reset fetch flag and trigger refetch
//     hasInitialFetch.current = false;
//     fetchingRef.current = false;
    
//     // Force re-fetch by clearing orders temporarily
//     setOrders([]);
//     setLoading(true);
    
//     // The useEffect will run again because we reset hasInitialFetch
//     setTimeout(() => {
//       hasInitialFetch.current = false;
//     }, 100);
//   }, [user, userId, toast, navigate]);

//   // ✅ Get order status progress
//   const getOrderProgress = useCallback((status: string) => {
//     const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
//     const currentIndex = statusOrder.indexOf(status);
//     return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
//   }, []);

//   // ✅ Helper function to calculate delivery breakdown
//   const getDeliveryBreakdown = useCallback((order: DisplayOrder) => {
//     const deliveryCharge = order.deliveryCharge || 80;
//     const itemsTotal = order.itemsTotal || (order.totalAmount - deliveryCharge);
    
//     return {
//       itemsTotal,
//       deliveryCharge,
//       total: order.totalAmount
//     };
//   }, []);

//   // ✅ Enhanced image error handler to prevent infinite loops
//   const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//     const target = e.target as HTMLImageElement;
//     const currentSrc = target.src;
    
//     // Prevent infinite loops by checking if we've already set a fallback
//     if (currentSrc.includes('data:image') || currentSrc.includes('placeholder.com')) {
//       return;
//     }
    
//     console.log('🖼️ Image failed to load:', currentSrc);
    
//     // Set reliable fallback
//     target.src = PLACEHOLDER_IMAGE;
//     target.onerror = null; // Prevent further error events
//   }, []);

//   // ✅ Mobile-optimized Loading component
//   const LoadingSpinner = useCallback(() => (
//     <div className="flex flex-col justify-center items-center py-12 sm:py-20">
//       <div className="relative mb-4 sm:mb-6">
//         <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-200 rounded-full animate-spin"></div>
//         <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
//       </div>
//       <p className="text-gray-600 text-sm sm:text-lg font-medium px-4 text-center">Loading your orders...</p>
//     </div>
//   ), []);

//   // ✅ Mobile-optimized Empty state
//   const EmptyOrders = useCallback(() => (
//     <motion.div 
//       className="text-center py-12 sm:py-20 px-4"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 max-w-sm sm:max-w-md mx-auto shadow-xl border border-purple-100/50">
//         <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
//           <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
//         </div>
//         <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
//           No Orders Yet
//         </h3>
//         <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
//           Your jewelry collection is waiting! Explore our beautiful pieces and place your first order.
//         </p>
//         <div className="flex flex-col gap-3 sm:gap-4 justify-center">
//           <button 
//             onClick={() => navigate('/')}
//             className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
//           >
//             <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
//             Start Shopping
//           </button>
//           <button 
//             onClick={handleRefresh}
//             className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold transition-all duration-300 text-sm sm:text-base"
//           >
//             <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
//             Refresh
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   ), [navigate, handleRefresh]);

//   // ✅ Ultra-responsive Order Details Component with delivery breakdown
//   const OrderDetails = useCallback(({ order }: { order: DisplayOrder }) => {
//     const statusConfig = orderStatusConfig[order.orderStatus];
//     const paymentConfig = paymentStatusConfig[order.paymentStatus];
//     const StatusIcon = statusConfig.icon;
//     const breakdown = getDeliveryBreakdown(order);

//     return (
//       <motion.div 
//         className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-3 sm:p-6 md:p-8 mb-4 sm:mb-6 overflow-hidden"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {/* ✅ Mobile-first Order Header */}
//         <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-purple-100">
//           <div className="flex items-center gap-3">
//             <div className={`w-10 h-10 sm:w-12 sm:h-12 ${statusConfig.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
//               <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${statusConfig.textColor}`} />
//             </div>
//             <div className="min-w-0 flex-1">
//               <div className="flex items-center gap-2 flex-wrap">
//                 <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
//                   Order #{order._id.slice(-6).toUpperCase()}
//                 </h3>
//                 {order.isCustomHamper && (
//                   <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                     <Gift className="w-3 h-3 mr-1" />
//                     Custom Hamper
//                   </Badge>
//                 )}
//                 {/* ✅ Add delivery info badge */}
//                 {order.deliveryCharge && order.deliveryCharge > 0 && (
//                   <Badge className="bg-gradient-to-r from-green-500 to-teal-500 text-white text-xs px-2 py-1 rounded-full">
//                     <Truck className="w-3 h-3 mr-1" />
//                     ₹{order.deliveryCharge} Delivery
//                   </Badge>
//                 )}
//               </div>
//               <p className="text-xs sm:text-sm text-gray-600 truncate">
//                 {formatDate(order.createdAt, 'MMM d, yyyy - h:mm a')}
//               </p>
//             </div>
//           </div>
          
//           <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end sm:gap-2">
//             <Badge className={`${statusConfig.color} text-white px-3 py-2 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap`}>
//               {statusConfig.label}
//             </Badge>
//             <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//               ₹{order.totalAmount?.toFixed(2) || '0.00'}
//             </div>
//           </div>
//         </div>

//         {/* ✅ Compact Order Progress for Mobile */}
//         {order.orderStatus !== 'cancelled' && (
//           <div className="mb-4 sm:mb-8">
//             <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-600 mb-2">
//               <span>Order Progress</span>
//               <span>{Math.round(getOrderProgress(order.orderStatus))}%</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${getOrderProgress(order.orderStatus)}%` }}
//               ></div>
//             </div>
//             <div className="flex justify-between mt-2 text-xs text-gray-500">
//               <span>Placed</span>
//               <span className="hidden xs:inline">Processing</span>
//               <span className="xs:hidden">Process</span>
//               <span>Shipped</span>
//               <span className="hidden xs:inline">Delivered</span>
//               <span className="xs:hidden">Done</span>
//             </div>
//           </div>
//         )}

//         {/* ✅ Compact Tracking Information */}
//         {(order.trackingNumber || order.shiprocketOrderId) && (
//           <div className={`${statusConfig.bgColor} p-3 sm:p-4 rounded-xl sm:rounded-2xl ${statusConfig.borderColor} border mb-4 sm:mb-6`}>
//             <div className="flex items-center gap-2 sm:gap-3 mb-2">
//               <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//               <span className="font-semibold text-sm sm:text-base text-gray-900">Tracking Info</span>
//             </div>
//             {order.trackingNumber && (
//               <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                 <span className="font-medium">Tracking:</span> 
//                 <span className="font-mono font-semibold ml-2 break-all">{order.trackingNumber}</span>
//               </p>
//             )}
//             {order.shiprocketOrderId && (
//               <p className="text-xs sm:text-sm text-gray-600 mb-1">
//                 <span className="font-medium">Shiprocket ID:</span>
//                 <span className="font-mono font-semibold ml-2">{order.shiprocketOrderId}</span>
//               </p>
//             )}
//             {order.estimatedDelivery && (
//               <p className="text-xs sm:text-sm text-gray-600">
//                 <span className="font-medium">Est. Delivery:</span>
//                 <span className="ml-2">{formatDate(order.estimatedDelivery, 'MMM d, yyyy')}</span>
//               </p>
//             )}
//           </div>
//         )}

//         {/* ✅ Mobile-optimized Order Items with fixed image handling */}
//         <div className="mb-4 sm:mb-6">
//           <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
//             <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//             Items ({order.items?.length || 0})
//           </h4>
//           <div className="space-y-3 sm:space-y-4">
//             {order.items?.map((item, index) => (
//               <motion.div 
//                 key={item._id || index}
//                 className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-white/60 to-purple-50/30 rounded-xl sm:rounded-2xl border border-purple-100/50"
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//               >
//                 <div className="flex-shrink-0">
//                   <img
//                     src={item.image}
//                     alt={item.name || 'Product'}
//                     className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl border border-purple-100 shadow-md"
//                     onError={handleImageError}
//                   />
//                 </div>
//                 <div className="flex-grow min-w-0">
//                   <h5 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">
//                     {item.name || 'Product Name'}
//                   </h5>
//                   <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
//                     <span className="text-xs sm:text-sm text-gray-600">
//                       Qty: {item.quantity || 0} × ₹{(item.price || 0).toFixed(2)}
//                     </span>
//                     <span className="font-bold text-sm sm:text-base text-purple-700 self-start sm:self-auto">
//                       ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </motion.div>
//             )) || (
//               <p className="text-gray-500 text-center py-4 text-sm">No items found</p>
//             )}
//           </div>
//         </div>

//         {/* ✅ Mobile-stacked Shipping & Payment Info */}
//         <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
//           {/* Shipping Address */}
//           <div className={`${statusConfig.bgColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl ${statusConfig.borderColor} border`}>
//             <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//               <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//               <h4 className="font-bold text-sm sm:text-base text-gray-900">Shipping Address</h4>
//             </div>
//             <div className="text-gray-700 space-y-1 text-xs sm:text-sm">
//               <p className="font-semibold">{order.shippingAddress.fullName}</p>
//               <p className="break-words">{order.shippingAddress.address}</p>
//               <p>
//                 {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
//               </p>
//               {order.shippingAddress.phone !== 'N/A' && (
//                 <p className="mt-2 flex items-center gap-1">
//                   <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
//                   <span className="font-medium">{order.shippingAddress.phone}</span>
//                 </p>
//               )}
//               {order.shippingAddress.email && (
//                 <p className="flex items-center gap-1">
//                   <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
//                   <span className="font-medium break-all">{order.shippingAddress.email}</span>
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* ✅ Enhanced Payment Information with Delivery Breakdown */}
//           <div className={`${paymentConfig.bgColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-opacity-50`}>
//             <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//               <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
//               <h4 className="font-bold text-sm sm:text-base text-gray-900">Payment Details</h4>
//             </div>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-xs sm:text-sm text-gray-600">Method:</span>
//                 <span className="bg-white px-2 sm:px-3 py-1 rounded-full border border-purple-200 text-xs sm:text-sm font-semibold">
//                   {(order.paymentMethod || 'COD').toUpperCase()}
//                 </span>
//               </div>
              
//               <div className="flex items-center justify-between">
//                 <span className="text-xs sm:text-sm text-gray-600">Status:</span>
//                 <Badge className={`${paymentConfig.color} text-white px-2 sm:px-3 py-1 rounded-full text-xs`}>
//                   {paymentConfig.label}
//                 </Badge>
//               </div>
              
//               {/* ✅ Order Breakdown Section */}
//               <div className="pt-3 border-t border-purple-100">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-xs sm:text-sm">
//                     <span className="text-gray-600">Items Total:</span>
//                     <span className="font-medium">₹{breakdown.itemsTotal.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between text-xs sm:text-sm">
//                     <span className="text-gray-600">Delivery Charge:</span>
//                     <span className="font-medium">₹{breakdown.deliveryCharge.toFixed(2)}</span>
//                   </div>
//                   <div className="flex justify-between font-bold text-sm sm:text-lg border-t border-purple-100 pt-2">
//                     <span>Final Total:</span>
//                     <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//                       ₹{breakdown.total.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     );
//   }, [formatDate, getOrderProgress, handleImageError, getDeliveryBreakdown]);

//   // ✅ Conditional rendering AFTER all hooks
//   if (!user) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white px-4">
//           <div className="text-center max-w-sm sm:max-w-md p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100/50">
//             <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
//               <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
//               Please Login
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
//               You need to be logged in to view your orders.
//             </p>
//             <button 
//               onClick={() => navigate('/login')}
//               className="inline-flex items-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
//             >
//               Go to Login
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       {/* ✅ Add responsive CSS */}
//       <style>{`
//         @media (max-width: 360px) {
//           .container {
//             padding-left: 8px;
//             padding-right: 8px;
//           }
//         }
        
//         .xs\\:hidden {
//           @media (max-width: 479px) {
//             display: none;
//           }
//         }
        
//         .xs\\:inline {
//           @media (min-width: 480px) {
//             display: inline;
//           }
//         }

//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>

//       <Header />
//       <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-12 sm:py-16 px-2 sm:px-4 lg:px-8 pt-16 sm:pt-20 lg:pt-24">
//         {/* Background Decorations - Scaled for mobile */}
//         <div className="fixed top-16 left-4 sm:top-20 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-purple-200/20 blur-2xl sm:blur-3xl animate-pulse" />
//         <div className="fixed bottom-32 right-4 sm:bottom-40 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-pink-200/20 blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
//         <div className="max-w-4xl xl:max-w-6xl mx-auto relative z-10">
//           {/* ✅ Mobile-optimized Header */}
//           <motion.div 
//             className="text-center mb-8 sm:mb-12"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
//               <Package className="w-3 h-3 sm:w-4 sm:h-4" />
//               My Orders
//             </div>
//             <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
//               Your Orders
//             </h1>
//             <p className="text-sm sm:text-lg text-gray-600 max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-4">
//               Track your jewelry orders and view order history
//             </p>
            
//             {/* Navigation & Refresh */}
//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-4 sm:mt-6 px-4">
//               <button
//                 onClick={() => navigate('/profile')}
//                 className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors text-sm sm:text-base"
//               >
//                 <ArrowLeft className="w-4 h-4" />
//                 Back to Profile
//               </button>
//               <button
//                 onClick={handleRefresh}
//                 disabled={loading}
//                 className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
//               >
//                 <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//                 Refresh Orders
//               </button>
//             </div>
//           </motion.div>

//           {/* ✅ Mobile-optimized Orders Summary */}
//           {!loading && orders.length > 0 && (
//             <motion.div 
//               className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
//               initial={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <div>
//                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
//                   <p className="text-sm sm:text-base text-gray-600">
//                     You have {orders.length} order{orders.length !== 1 ? 's' : ''} in total
//                   </p>
//                 </div>
                
//                 <div className="flex gap-3 sm:gap-4 text-center w-full sm:w-auto justify-around sm:justify-end">
//                   {Object.entries(
//                     orders.reduce((acc, order) => {
//                       acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
//                       return acc;
//                     }, {} as Record<string, number>)
//                   ).map(([status, count]) => {
//                     const statusConfig = orderStatusConfig[status as keyof typeof orderStatusConfig];
//                     return (
//                       <div key={status} className="text-center">
//                         <div className={`w-6 h-6 sm:w-8 sm:h-8 ${statusConfig.bgColor} rounded-lg flex items-center justify-center mx-auto mb-1`}>
//                           <statusConfig.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${statusConfig.textColor}`} />
//                         </div>
//                         <div className="text-sm sm:text-lg font-bold text-gray-900">{count}</div>
//                         <div className="text-xs text-gray-600 capitalize hidden sm:block">{status}</div>
//                         <div className="text-xs text-gray-600 capitalize sm:hidden">
//                           {status === 'processing' ? 'Process' : status}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </motion.div>
//           )}

//           {/* Orders List */}
//           {loading ? (
//             <LoadingSpinner />
//           ) : orders.length === 0 ? (
//             <EmptyOrders />
//           ) : (
//             <div className="space-y-4 sm:space-y-6">
//               {orders.map((order, index) => (
//                 <motion.div
//                   key={order._id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.1 }}
//                 >
//                   <OrderDetails order={order} />
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Orders;













import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosConfig";
import { TokenManager } from "@/utils/tokenManager";
import { format, isValid } from "date-fns";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  CreditCard,
  Gift,
  User,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* Types */
type OrderState = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
type PayState = "initiated" | "pending" | "paid" | "failed";

interface OrderItem {
  _id?: string;
  productId: string | {
    _id?: string;
    Product_name?: string;
    name?: string;
    Product_image?: string[];
    image?: string;
  };
  name?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface BackendOrder {
  _id: string;
  createdAt: string;
  status: OrderState;
  paymentStatus: PayState;
  paymentMethod: string;
  totalAmount: number;
  itemsTotal?: number;
  deliveryCharge?: number;
  items: OrderItem[];
  shippingAddress: Record<string, string>;
  isCustomHamper?: boolean;
  trackingNumber?: string;
}

interface DisplayOrder {
  _id: string;
  createdAt: string;
  orderStatus: OrderState;
  paymentStatus: PayState;
  paymentMethod: string;
  totalAmount: number;
  itemsTotal: number;
  deliveryCharge: number;
  itemThumb: string;
  itemCount: number;
  isCustomHamper?: boolean;
  trackingNumber?: string;
}

/* Updated pastel theme configs */
const orderStatus = {
  pending: { 
    icon: Clock, 
    variant: "secondary" as const, 
    label: "Order Placed", 
    progress: 25,
    bgColor: "bg-purple-50/80",
    textColor: "text-purple-700",
    borderColor: "border-purple-200"
  },
  processing: { 
    icon: Package, 
    variant: "default" as const, 
    label: "Processing", 
    progress: 50,
    bgColor: "bg-blue-50/80",
    textColor: "text-blue-700", 
    borderColor: "border-blue-200"
  },
  shipped: { 
    icon: Truck, 
    variant: "outline" as const, 
    label: "Shipped", 
    progress: 75,
    bgColor: "bg-pink-50/80",
    textColor: "text-pink-700",
    borderColor: "border-pink-200"
  },
  delivered: { 
    icon: CheckCircle, 
    variant: "default" as const, 
    label: "Delivered", 
    progress: 100,
    bgColor: "bg-green-50/80",
    textColor: "text-green-700",
    borderColor: "border-green-200"
  },
  cancelled: { 
    icon: XCircle, 
    variant: "destructive" as const, 
    label: "Cancelled", 
    progress: 0,
    bgColor: "bg-red-50/80",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  },
  failed: { 
    icon: XCircle, 
    variant: "destructive" as const, 
    label: "Failed", 
    progress: 0,
    bgColor: "bg-red-50/80",
    textColor: "text-red-700",
    borderColor: "border-red-200"
  },
};

const payStatus = {
  initiated: { variant: "secondary" as const, label: "Initiated", color: "bg-purple-500" },
  pending: { variant: "outline" as const, label: "Pending", color: "bg-amber-500" },
  paid: { variant: "default" as const, label: "Paid", color: "bg-green-500" },
  failed: { variant: "destructive" as const, label: "Failed", color: "bg-red-500" },
};

const PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjgiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";

const Orders = () => {
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const { toast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return isValid(d) ? format(d, "MMM dd") : "—";
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return isValid(d) ? format(d, "h:mm a") : "";
  };

  /* Transform backend order to display format */
  const transformOrder = (o: BackendOrder): DisplayOrder => {
    const delivery = o.deliveryCharge ?? 80;
    const itemsTotal = o.itemsTotal ?? Math.max(0, o.totalAmount - delivery);
    
    const firstItem = o.items[0];
    let thumb = PLACEHOLDER;
    
    if (firstItem) {
      if (typeof firstItem.productId === "object" && firstItem.productId) {
        thumb = firstItem.productId.Product_image?.[0] || firstItem.productId.image || PLACEHOLDER;
      } else if (firstItem.image) {
        thumb = firstItem.image;
      }
    }

    return {
      _id: o._id,
      createdAt: o.createdAt,
      orderStatus: o.status,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      totalAmount: o.totalAmount,
      itemsTotal,
      deliveryCharge: delivery,
      itemThumb: thumb,
      itemCount: o.items.length,
      isCustomHamper: o.isCustomHamper,
      trackingNumber: o.trackingNumber,
    };
  };

  /* Fetch orders */
  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        if (!TokenManager.getToken("user")) throw new Error("Authentication required");
        
        const res = await axiosInstance.get(`/cashfree/my-orders/${userId}`);
        const list = res.data.orders as BackendOrder[];
        
        setOrders(
          list.map(transformOrder).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );
      } catch (error: any) {
        toast({
          title: "Failed to load orders",
          description: error.message || "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, toast]);

  /* Loading state */
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-white">
          <div className="px-2 pt-20 pb-8">
            <div className="max-w-sm mx-auto space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="animate-pulse border-purple-100/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 bg-purple-100 rounded w-20" />
                        <div className="h-2 bg-purple-50 rounded w-24" />
                      </div>
                      <div className="h-5 bg-purple-100 rounded w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-12 bg-purple-50 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  /* Not authenticated */
  if (!userId) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-white">
          <div className="px-2 pt-20 pb-8">
            <Card className="max-w-xs mx-auto text-center border-purple-100/50 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-4 px-4">
                <User className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                <h2 className="text-lg font-semibold mb-2 text-purple-900">Login Required</h2>
                <p className="text-purple-600 mb-4 text-sm">
                  Please log in to view orders.
                </p>
                <Button 
                  onClick={() => navigate("/login")} 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {/* Pastel gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-white">
        <div className="px-2 pt-20 pb-8">
          <div className="max-w-sm mx-auto">
            {/* Header - optimized for 320px */}
            <div className="mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile")}
                className="mb-3 -ml-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Profile
              </Button>
              
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                    My Orders
                  </h1>
                  <p className="text-sm text-purple-600">
                    {orders.length} order{orders.length !== 1 ? "s" : ""}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  disabled={loading}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Empty state */}
            {orders.length === 0 ? (
              <Card className="text-center py-8 border-purple-100/50 bg-white/80 backdrop-blur-sm">
                <CardContent>
                  <Package className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                  <h3 className="text-base font-semibold mb-2 text-purple-900">No Orders Yet</h3>
                  <p className="text-purple-600 mb-4 text-sm">
                    Start shopping to see orders here.
                  </p>
                  <Button 
                    onClick={() => navigate("/")} 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Orders list - Mobile optimized */
              <div className="space-y-4">
                {orders.map((order, index) => {
                  const status = orderStatus[order.orderStatus];
                  const payment = payStatus[order.paymentStatus];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className={`overflow-hidden border-purple-100/50 bg-white/90 backdrop-blur-sm ${status.borderColor}`}>
                        <CardHeader className="pb-2 px-3 pt-3">
                          <div className="flex items-center gap-2">
                            <div className={`flex-shrink-0 w-8 h-8 ${status.bgColor} rounded-lg flex items-center justify-center ${status.borderColor} border`}>
                              <StatusIcon className={`w-4 h-4 ${status.textColor}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1 mb-0.5">
                                <span className="font-semibold text-xs text-purple-900">
                                  #{order._id.slice(-6).toUpperCase()}
                                </span>
                                {order.isCustomHamper && (
                                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] px-1 py-0">
                                    <Gift className="w-2 h-2 mr-0.5" />
                                    Hamper
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-purple-500">
                                <span>{formatDate(order.createdAt)}</span>
                                <span>•</span>
                                <span>{formatTime(order.createdAt)}</span>
                              </div>
                            </div>
                            
                            <Badge 
                              variant={status.variant} 
                              className="text-[10px] px-2 py-0.5"
                            >
                              {status.label}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="px-3 pb-3 space-y-3">
                          {/* Order items preview */}
                          <div className="flex items-center gap-2">
                            <Avatar className="w-10 h-10 rounded-md border border-purple-100">
                              <AvatarImage 
                                src={order.itemThumb} 
                                className="object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.src = PLACEHOLDER;
                                }}
                              />
                              <AvatarFallback className="rounded-md bg-purple-50">
                                <Package className="w-4 h-4 text-purple-400" />
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-purple-900">
                                {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                              </p>
                              <div className="text-[10px] text-purple-500">
                                Items ₹{order.itemsTotal.toFixed(2)} + Delivery ₹{order.deliveryCharge.toFixed(2)}
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="font-bold text-sm bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                                ₹{order.totalAmount.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <Separator className="bg-purple-100/50" />

                          {/* Progress bar for active orders */}
                          {order.orderStatus !== "cancelled" && order.orderStatus !== "failed" && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] text-purple-600">
                                <span>Progress</span>
                                <span>{status.progress}%</span>
                              </div>
                              <Progress 
                                value={status.progress} 
                                className="h-1.5 bg-purple-100/50"
                              />
                            </div>
                          )}

                          {/* Payment info */}
                          <div className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1 text-purple-600">
                              <CreditCard className="w-3 h-3" />
                              <span className="uppercase font-medium">
                                {order.paymentMethod}
                              </span>
                            </div>
                            
                            <Badge 
                              variant={payment.variant} 
                              className="text-[9px] px-1.5 py-0"
                            >
                              {payment.label}
                            </Badge>
                          </div>

                          {/* Tracking number */}
                          {order.trackingNumber && (
                            <div className="bg-purple-50/50 rounded-lg p-2 border border-purple-100/50">
                              <div className="flex items-center gap-1 text-[10px] text-purple-700">
                                <Truck className="w-3 h-3" />
                                <span className="font-medium">Tracking:</span>
                                <span className="font-mono text-[9px]">{order.trackingNumber}</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;



