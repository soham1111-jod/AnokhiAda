// import { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useToast } from "@/hooks/use-toast";
// import axiosInstance from '@/utils/axiosConfig';

// const PaymentCallback = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const [processing, setProcessing] = useState(true);
//   const { toast } = useToast();

//   useEffect(() => {
//     const handlePaymentCallback = async () => {
//       try {
//         console.log('🔍 PaymentCallback Analysis:', {
//           fullUrl: window.location.href,
//           pathname: window.location.pathname,
//           search: window.location.search,
//           hash: window.location.hash,
//           urlParams: Object.fromEntries(searchParams.entries())
//         });

//         // ✅ Try multiple ways to get order ID
//         let orderId = null;
//         let paymentId = null;

//         // Method 1: URL parameters (multiple formats)
//         const urlOrderId = searchParams.get('order_id') || 
//                           searchParams.get('order-id') || 
//                           searchParams.get('orderId') ||
//                           searchParams.get('cf_order_id');
        
//         const urlPaymentId = searchParams.get('cf_payment_id') || 
//                             searchParams.get('cf-payment-id') || 
//                             searchParams.get('payment_id') ||
//                             searchParams.get('paymentId');

//         // Method 2: SessionStorage (our backup)
//         const storedOrderId = sessionStorage.getItem('orderId');
//         const tempOrderString = sessionStorage.getItem('tempOrder');
//         const tempOrder = tempOrderString ? JSON.parse(tempOrderString) : null;

//         console.log('📋 Order ID Sources:', {
//           fromUrl: urlOrderId,
//           fromStorage: storedOrderId,
//           hasTempOrder: !!tempOrder,
//           paymentIdFromUrl: urlPaymentId
//         });

//         // Determine final order ID to use
//         console.log(orderId);
//         orderId = urlOrderId || storedOrderId;

//         if (!orderId) {
//           console.error('❌ No order ID found from any source');
          
//           // If we have tempOrder but no orderId, try to extract from tempOrder
//           if (tempOrder && tempOrder.cashfreeOrderId) {
//             orderId = tempOrder.cashfreeOrderId;
//             console.log('🔄 Using orderId from tempOrder:', orderId);
//           }
//         }

//         if (!orderId) {
//           toast({
//             title: "Order ID Missing",
//             description: "Cannot verify payment without Order ID. Please contact support.",
//             variant: "destructive"
//           });
          
//           setTimeout(() => navigate('/orders'), 3000);
//           return;
//         }

//         if (!tempOrder) {
//           console.error('❌ No tempOrder found');
//           toast({
//             title: "Order Data Missing",
//             description: `Order ${orderId.slice(-6)} data not found. Please contact support if payment was deducted.`,
//             variant: "destructive"
//           });
          
//           setTimeout(() => navigate('/orders'), 3000);
//           return;
//         }

//         console.log('✅ Proceeding with verification:', {
//           orderId: orderId,
//           paymentId: urlPaymentId,
//           tempOrderTotal: tempOrder.totalAmount
//         });

//         // ✅ Call verification endpoint
//         const response = await axiosInstance.post('/cashfree/verify', {
//           orderId: orderId,
//           cf_payment_id: urlPaymentId,
//           paymentId: urlPaymentId,
//           paymentStatus: 'SUCCESS', // Assume success if we reach callback
//           tempOrder: tempOrder,
//           sourceInfo: {
//             orderIdSource: urlOrderId ? 'url' : 'sessionStorage',
//             paymentIdSource: urlPaymentId ? 'url' : 'none',
//             urlPresent: !!window.location.search
//           }
//         });

//         console.log('🎉 Verification response:', response.data);

//         if (response.data.success && response.data.order) {
//           toast({
//             title: "Payment Successful! 🎉",
//             description: `Your payment of ₹${response.data.order.totalAmount} has been processed. Order #${response.data.order._id.slice(-6).toUpperCase()}`,
//           });

//           // Clear session storage
//           sessionStorage.removeItem('tempOrder');
//           sessionStorage.removeItem('orderId');
          
//           setTimeout(() => navigate('/orders'), 2000);
//         } else {
//           throw new Error(response.data.message || 'Payment verification failed');
//         }

//       } catch (error) {
//         console.error('❌ Payment callback error:', error);
        
//         const errorMessage = error.response?.data?.message || error.message;
//         toast({
//           title: "Payment Processing Error",
//           description: `${errorMessage}. Please check your orders or contact support.`,
//           variant: "destructive"
//         });
        
//         setTimeout(() => navigate('/orders'), 3000);
//       } finally {
//         setProcessing(false);
//       }
//     };

//     // Small delay to ensure URL is fully loaded
//     setTimeout(handlePaymentCallback, 1000);
//   }, [searchParams, navigate, toast]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white">
//       <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 p-8 text-center">
//         {processing ? (
//           <>
//             <div className="relative mb-6">
//               <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin mx-auto"></div>
//               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
//             </div>
//             <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//               Processing Payment...
//             </h2>
//             <p className="text-gray-600 text-sm">
//               Verifying order and payment details...
//             </p>
//           </>
//         ) : (
//           <>
//             <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//               </svg>
//             </div>
//             <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//               Payment Processed
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Redirecting you to your orders...
//             </p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentCallback;


// import { useEffect, useState, useCallback } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useToast } from "@/hooks/use-toast";
// import axiosInstance from '@/utils/axiosConfig';
// import { useAuth } from "@/components/AuthContext";
// import { CheckCircle, XCircle, AlertCircle, RefreshCw, Package } from 'lucide-react';

// const PaymentCallback = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { user } = useAuth();
//   const [state, setState] = useState({
//     processing: true,
//     success: null,
//     error: null,
//     orderData: null,
//     debugInfo: null
//   });
//   const { toast } = useToast();

//   // ✅ Enhanced parameter extraction with extensive debugging
//   const extractAllAvailableData = useCallback(() => {
//     // Get ALL URL parameters
//     const allUrlParams = {};
//     searchParams.forEach((value, key) => {
//       allUrlParams[key] = value;
//     });

//     // Also check hash parameters
//     const hashParams = {};
//     if (window.location.hash) {
//       const hashString = window.location.hash.substring(1);
//       const pairs = hashString.split('&');
//       pairs.forEach(pair => {
//         const [key, value] = pair.split('=');
//         if (key && value) {
//           hashParams[decodeURIComponent(key)] = decodeURIComponent(value);
//         }
//       });
//     }

//     // Try multiple order ID variations
//     const possibleOrderIds = [
//       allUrlParams['order_id'],
//       allUrlParams['order-id'],
//       allUrlParams['orderId'],
//       allUrlParams['cf_order_id'],
//       allUrlParams['cashfree_order_id'],
//       hashParams['order_id'],
//       hashParams['orderId']
//     ].filter(Boolean);

//     // Try multiple payment ID variations
//     const possiblePaymentIds = [
//       allUrlParams['cf_payment_id'],
//       allUrlParams['payment_id'],
//       allUrlParams['paymentId'],
//       allUrlParams['cf-payment-id'],
//       hashParams['cf_payment_id'],
//       hashParams['payment_id']
//     ].filter(Boolean);

//     // Get all possible storage data
//     const storageData = {
//       sessionStorage: {
//         orderId: sessionStorage.getItem('orderId'),
//         tempOrder: null,
//         paymentMethod: sessionStorage.getItem('paymentMethod')
//       },
//       localStorage: {
//         orderId: localStorage.getItem('orderId'),
//         tempOrder: null,
//         paymentMethod: localStorage.getItem('paymentMethod')
//       }
//     };

//     // Parse tempOrder from both storages
//     try {
//       const sessionTempOrder = sessionStorage.getItem('tempOrder');
//       if (sessionTempOrder) {
//         storageData.sessionStorage.tempOrder = JSON.parse(sessionTempOrder);
//       }
//     } catch (e) {
//       console.error('Failed to parse sessionStorage tempOrder:', e);
//     }

//     try {
//       const localTempOrder = localStorage.getItem('tempOrder');
//       if (localTempOrder) {
//         storageData.localStorage.tempOrder = JSON.parse(localTempOrder);
//       }
//     } catch (e) {
//       console.error('Failed to parse localStorage tempOrder:', e);
//     }

//     return {
//       allUrlParams,
//       hashParams,
//       possibleOrderIds,
//       possiblePaymentIds,
//       storageData,
//       fullUrl: window.location.href,
//       userId: user?._id || user?.id
//     };
//   }, [searchParams, user]);

//   // ✅ Multiple methods to find order
//   const findOrderByAlternativeMethods = useCallback(async (extractedData) => {
//     const { possiblePaymentIds, storageData, userId } = extractedData;

//     // Method 1: Use tempOrder from any storage
//     const tempOrder = storageData.sessionStorage.tempOrder || storageData.localStorage.tempOrder;
//     if (tempOrder && tempOrder.cashfreeOrderId) {
//       console.log('✅ Found tempOrder with cashfreeOrderId');
//       return {
//         method: 'tempOrder',
//         orderId: tempOrder.cashfreeOrderId,
//         tempOrder,
//         paymentId: possiblePaymentIds[0] || null
//       };
//     }

//     // Method 2: Find by payment ID if available
//     if (possiblePaymentIds.length > 0) {
//       try {
//         console.log('🔍 Searching by payment ID:', possiblePaymentIds[0]);
//         const response = await axiosInstance.get(`/cashfree/order-by-payment/${possiblePaymentIds[0]}`);
        
//         if (response.data.success && response.data.order) {
//           return {
//             method: 'paymentId',
//             orderId: response.data.order.cashfreeOrderId || response.data.order._id,
//             tempOrder: response.data.order,
//             paymentId: possiblePaymentIds[0]
//           };
//         }
//       } catch (error) {
//         console.log('❌ Could not find by payment ID:', error.message);
//       }
//     }

//     // Method 3: Find recent pending order for user
//     if (userId) {
//       try {
//         console.log('🔍 Searching for recent pending order for user:', userId);
//         const response = await axiosInstance.get('/cashfree/recent-pending-order', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('userToken') || sessionStorage.getItem('userToken')}`
//           }
//         });
        
//         if (response.data.success && response.data.order) {
//           return {
//             method: 'recentOrder',
//             orderId: response.data.order.cashfreeOrderId || response.data.order._id,
//             tempOrder: response.data.order,
//             paymentId: possiblePaymentIds[0] || null
//           };
//         }
//       } catch (error) {
//         console.log('❌ Could not find recent order:', error.message);
//       }
//     }

//     // Method 4: Try to get all user's recent orders and find the latest pending one
//     if (userId) {
//       try {
//         console.log('🔍 Getting all recent orders to find pending payment...');
//         const response = await axiosInstance.get(`/cashfree/my-orders/${userId}?limit=5`);
        
//         if (response.data.success && response.data.orders) {
//           const recentPendingOrder = response.data.orders.find(order => 
//             order.paymentMethod === 'online' && 
//             order.paymentStatus === 'pending' &&
//             new Date(order.createdAt) > new Date(Date.now() - 60 * 60 * 1000) // Within last hour
//           );
          
//           if (recentPendingOrder) {
//             return {
//               method: 'recentOrdersList',
//               orderId: recentPendingOrder.cashfreeOrderId || recentPendingOrder._id,
//               tempOrder: recentPendingOrder,
//               paymentId: possiblePaymentIds[0] || null
//             };
//           }
//         }
//       } catch (error) {
//         console.log('❌ Could not get recent orders:', error.message);
//       }
//     }

//     return null;
//   }, []);

//   // ✅ Main callback handler
//   const handlePaymentCallback = useCallback(async () => {
//     try {
//       setState(prev => ({ ...prev, processing: true, error: null }));

//       const extractedData = extractAllAvailableData();
      
//       console.log('🔍 Complete payment callback analysis:', {
//         urlParams: extractedData.allUrlParams,
//         hashParams: extractedData.hashParams,
//         foundOrderIds: extractedData.possibleOrderIds.length,
//         foundPaymentIds: extractedData.possiblePaymentIds.length,
//         hasSessionTempOrder: !!extractedData.storageData.sessionStorage.tempOrder,
//         hasLocalTempOrder: !!extractedData.storageData.localStorage.tempOrder,
//         userId: extractedData.userId
//       });

//       // Set debug info for display
//       setState(prev => ({ 
//         ...prev, 
//         debugInfo: {
//           hasUrlOrderId: extractedData.possibleOrderIds.length > 0,
//           hasPaymentId: extractedData.possiblePaymentIds.length > 0,
//           hasSessionData: !!extractedData.storageData.sessionStorage.tempOrder,
//           hasLocalData: !!extractedData.storageData.localStorage.tempOrder,
//           hasUserId: !!extractedData.userId
//         }
//       }));

//       let orderInfo = null;

//       // First, try to get order ID directly from URL
//       if (extractedData.possibleOrderIds.length > 0) {
//         const urlOrderId = extractedData.possibleOrderIds[0];
//         const tempOrder = extractedData.storageData.sessionStorage.tempOrder || 
//                          extractedData.storageData.localStorage.tempOrder;
        
//         if (tempOrder) {
//           orderInfo = {
//             method: 'urlAndStorage',
//             orderId: urlOrderId,
//             tempOrder,
//             paymentId: extractedData.possiblePaymentIds[0] || null
//           };
//         } else {
//           // We have order ID but no tempOrder, try to fetch it
//           try {
//             console.log('🔍 Fetching order details for URL order ID:', urlOrderId);
//             const response = await axiosInstance.get(`/cashfree/order-details/${urlOrderId}`);
//             if (response.data.success) {
//               orderInfo = {
//                 method: 'urlAndFetch',
//                 orderId: urlOrderId,
//                 tempOrder: response.data.order,
//                 paymentId: extractedData.possiblePaymentIds[0] || null
//               };
//             }
//           } catch (error) {
//             console.log('❌ Could not fetch order by URL order ID');
//           }
//         }
//       }

//       // If no order found yet, try alternative methods
//       if (!orderInfo) {
//         console.log('⚠️ No order ID found in URL, trying alternative methods...');
//         orderInfo = await findOrderByAlternativeMethods(extractedData);
//       }

//       if (!orderInfo) {
//         throw new Error(
//           'Unable to identify your order. This could happen if:\n' +
//           '• The payment session expired\n' +
//           '• Browser data was cleared\n' +
//           '• You have no recent pending orders\n\n' +
//           'Please check your orders page. If payment was deducted, contact support with your transaction details.'
//         );
//       }

//       console.log('✅ Order found using method:', orderInfo.method, 'Order ID:', orderInfo.orderId);

//       // Verify payment
//       const verificationData = {
//         orderId: orderInfo.orderId,
//         cf_payment_id: orderInfo.paymentId,
//         paymentId: orderInfo.paymentId,
//         paymentStatus: 'SUCCESS',
//         tempOrder: orderInfo.tempOrder,
//         metadata: {
//           discoveryMethod: orderInfo.method,
//           callbackUrl: window.location.href,
//           timestamp: new Date().toISOString()
//         }
//       };

//       console.log('🔄 Verifying payment...');
//       const response = await axiosInstance.post('/cashfree/verify', verificationData);

//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Payment verification failed');
//       }

//       // Success!
//       setState({
//         processing: false,
//         success: true,
//         error: null,
//         orderData: response.data.order,
//         debugInfo: null
//       });

//       toast({
//         title: "Payment Successful! 🎉",
//         description: `Order #${response.data.order._id.slice(-6).toUpperCase()} confirmed. Amount: ₹${response.data.order.totalAmount}`,
//         duration: 5000
//       });

//       // Clear all stored data
//       ['tempOrder', 'orderId', 'paymentMethod'].forEach(key => {
//         sessionStorage.removeItem(key);
//         localStorage.removeItem(key);
//       });

//       setTimeout(() => navigate('/orders'), 3000);

//     } catch (error) {
//       console.error('❌ Payment callback error:', error);
      
//       setState({
//         processing: false,
//         success: false,
//         error: error.message || 'Payment verification failed',
//         orderData: null,
//         debugInfo: null
//       });

//       toast({
//         title: "Order Identification Issue",
//         description: "We couldn't identify your order automatically. Please check your orders page.",
//         variant: "destructive",
//         duration: 10000
//       });

//       setTimeout(() => navigate('/orders'), 8000);
//     }
//   }, [extractAllAvailableData, findOrderByAlternativeMethods, navigate, toast]);

//   useEffect(() => {
//     const timer = setTimeout(handlePaymentCallback, 1500); // Slightly longer delay
//     return () => clearTimeout(timer);
//   }, [handlePaymentCallback]);

//   const handleRetry = useCallback(() => {
//     handlePaymentCallback();
//   }, [handlePaymentCallback]);

//   const handleGoToOrders = useCallback(() => {
//     navigate('/orders');
//   }, [navigate]);

//   const handleContactSupport = useCallback(() => {
//     // You can implement this based on your support system
//     window.location.href = 'mailto:support@yourstore.com?subject=Payment%20Issue&body=I%20completed%20a%20payment%20but%20the%20order%20was%20not%20found%20automatically.';
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white p-4">
//       <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 p-6 sm:p-8 text-center">
        
//         {/* Processing State */}
//         {state.processing && (
//           <>
//             <div className="relative mb-6">
//               <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin mx-auto"></div>
//               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
//             </div>
//             <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//               Finding Your Order
//             </h2>
//             <p className="text-gray-600 text-sm mb-4">
//               We're identifying your order and verifying the payment...
//             </p>
            
//             {/* Debug info during processing */}
//             {state.debugInfo && (
//               <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left">
//                 <div className="text-xs font-medium text-blue-800 mb-2">Detection Status:</div>
//                 <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
//                   <div className="flex items-center justify-between">
//                     <span>URL Order ID:</span>
//                     <span>{state.debugInfo.hasUrlOrderId ? '✅' : '❌'}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span>Payment ID:</span>
//                     <span>{state.debugInfo.hasPaymentId ? '✅' : '❌'}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span>Session Data:</span>
//                     <span>{state.debugInfo.hasSessionData ? '✅' : '❌'}</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span>Local Data:</span>
//                     <span>{state.debugInfo.hasLocalData ? '✅' : '❌'}</span>
//                   </div>
//                   <div className="flex items-center justify-between col-span-2">
//                     <span>User Logged In:</span>
//                     <span>{state.debugInfo.hasUserId ? '✅' : '❌'}</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div className="text-xs text-gray-500">
//               Please don't close this window while we process your payment
//             </div>
//           </>
//         )}

//         {/* Success State */}
//         {!state.processing && state.success && (
//           <>
//             <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
//               Payment Successful!
//             </h2>
//             <p className="text-gray-600 mb-4">
//               Your order has been confirmed and is being processed.
//             </p>
//             {state.orderData && (
//               <div className="bg-green-50 rounded-lg p-4 mb-4">
//                 <p className="font-medium text-green-800 mb-1">
//                   Order #{state.orderData._id?.slice(-6).toUpperCase()}
//                 </p>
//                 <p className="text-green-700 text-sm">
//                   Amount: ₹{state.orderData.totalAmount}
//                 </p>
//               </div>
//             )}
//             <p className="text-sm text-gray-500">
//               Redirecting to your orders...
//             </p>
//           </>
//         )}

//         {/* Error State */}
//         {!state.processing && state.success === false && (
//           <>
//             <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Package className="w-8 h-8 text-white" />
//             </div>
//             <h2 className="text-xl font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
//               Order Not Found Automatically
//             </h2>
//             <div className="bg-amber-50 rounded-lg p-4 mb-6 text-left">
//               <p className="text-sm text-amber-800 mb-3">
//                 We couldn't automatically identify your order, but this doesn't mean your payment failed.
//               </p>
//               <div className="text-xs text-amber-700 space-y-1">
//                 <div className="font-medium mb-2">Possible reasons:</div>
//                 <div>• Browser data was cleared during payment</div>
//                 <div>• Payment session expired</div>
//                 <div>• Network connectivity issues</div>
//               </div>
//             </div>
//             <div className="space-y-3">
//               <button
//                 onClick={handleGoToOrders}
//                 className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
//               >
//                 <Package className="w-4 h-4 inline mr-2" />
//                 Check My Orders
//               </button>
//               <div className="flex gap-3">
//                 <button
//                   onClick={handleRetry}
//                   className="flex-1 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm"
//                 >
//                   <RefreshCw className="w-4 h-4 inline mr-1" />
//                   Try Again
//                 </button>
//                 <button
//                   onClick={handleContactSupport}
//                   className="flex-1 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm"
//                 >
//                   Get Help
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentCallback;




import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/utils/axiosConfig";
import { CheckCircle, Package, RefreshCw } from "lucide-react";

interface CallbackState {
  processing: boolean;
  success: boolean | null;
  error: string | null;
  orderData: any;
}

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [state, setState] = useState<CallbackState>({
    processing: true,
    success: null,
    error: null,
    orderData: null,
  });

  /* -------------------------------------------
     Extract IDs from URL or storage
  ------------------------------------------- */
  const getIds = () => {
    const urlOrderId =
      searchParams.get("order_id") ||
      searchParams.get("orderId") ||
      searchParams.get("cf_order_id");

    const storedOrderId =
      sessionStorage.getItem("orderId") || localStorage.getItem("orderId");

    const orderId = urlOrderId || storedOrderId;

    const paymentId =
      searchParams.get("cf_payment_id") ||
      searchParams.get("payment_id") ||
      searchParams.get("paymentId");

    return { orderId, paymentId };
  };

  /* -------------------------------------------
     Main verifier
  ------------------------------------------- */
  const verifyPayment = useCallback(async () => {
    const { orderId, paymentId } = getIds();

    if (!orderId) {
      setState({
        processing: false,
        success: false,
        error: "Order ID not found in callback.",
        orderData: null,
      });
      toast({
        title: "Order Not Detected",
        description:
          "We could not identify your order automatically. Please check your orders page.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/orders"), 4000);
      return;
    }

    try {
      const res = await axiosInstance.post("/cashfree/verify", {
        orderId,
        paymentId,          // optional – backend will ignore if null
        paymentStatus: "SUCCESS",
      });

      if (!res.data.success) throw new Error(res.data.message);

      setState({
        processing: false,
        success: true,
        error: null,
        orderData: res.data.order,
      });

      

      toast({
        title: "Payment Successful 🎉",
        description: `Order #${res.data.order._id
          .slice(-6)
          .toUpperCase()} confirmed.`,
        duration: 5000,
      });

      // cleanup
      ["orderId", "paymentMethod"].forEach((k) => {
        sessionStorage.removeItem(k);
        localStorage.removeItem(k);
      });

      setTimeout(() => navigate("/orders"), 3000);
    } catch (err: any) {
      console.error("Payment verification error:", err);
      setState({
        processing: false,
        success: false,
        error: err.message || "Verification failed",
        orderData: null,
      });

      toast({
        title: "Verification Failed",
        description:
          "We couldn't verify your payment automatically. If amount was debited, contact support.",
        variant: "destructive",
        duration: 8000,
      });

      setTimeout(() => navigate("/orders"), 6000);
    }
  }, [navigate, toast, searchParams]);

  /* -------------------------------------------
     Run verifier once
  ------------------------------------------- */
  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  /* -------------------------------------------
     UI
  ------------------------------------------- */
  const retry = () => {
    setState((s) => ({ ...s, processing: true, error: null }));
    verifyPayment();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white p-4">
      <div className="max-w-lg w-full bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center">
        {/* Processing */}
        {state.processing && (
          <>
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin mx-auto"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Verifying Payment…
            </h2>
            <p className="text-gray-600 text-sm">
              Please don’t close or refresh this page.
            </p>
          </>
        )}

        {/* Success */}
        {!state.processing && state.success && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Payment Successful!
            </h2>
            {state.orderData && (
              <p className="text-gray-700 mb-2">
                Order #
                {state.orderData._id?.slice(-6).toUpperCase()} – Amount ₹
                {state.orderData.totalAmount}
              </p>
            )}
            <p className="text-sm text-gray-500">
              Redirecting you to “My Orders”…
            </p>
          </>
        )}

        {/* Error */}
        {!state.processing && state.success === false && (
          <>
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
              Order Not Found
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              {state.error || "We couldn’t match your payment to an order."}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/orders")}
                className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Go to My Orders
              </button>
              <button
                onClick={retry}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
