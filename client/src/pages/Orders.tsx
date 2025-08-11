import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from '@/utils/axiosConfig';
import { TokenManager } from '@/utils/tokenManager';
import { format, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin, 
  CreditCard,
  Eye,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// ✅ ADAPTED: Type definitions to match your current backend
interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
}

interface OrderItem {
  productId: string | any; // Can be populated or just ID
  quantity: number;
  price: number;
  _id?: string;
}

interface BackendOrder {
  _id: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

// Frontend display interface
interface DisplayOrder {
  _id: string;
  createdAt: string;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  totalAmount: number;
  items: {
    _id: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
    phone: string;
  };
  estimatedDelivery?: string;
  trackingNumber?: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// ✅ FRONTEND TRANSFORMER: Convert backend order to display format
const transformOrderForDisplay = async (backendOrder: BackendOrder): Promise<DisplayOrder> => {
  // Transform items - fetch product details if not populated
  const transformedItems = await Promise.all(
    backendOrder.items.map(async (item) => {
      let productName = 'Product Name';
      let productImage = '/placeholder-image.jpg';
      
      // Check if productId is populated (has Product_name field)
      if (typeof item.productId === 'object' && item.productId?.Product_name) {
        productName = item.productId.Product_name;
        productImage = item.productId.Product_image?.[0] || '/placeholder-image.jpg';
      } else if (typeof item.productId === 'string') {
        // If it's just an ID, try to fetch product details
        try {
          const response = await axiosInstance.get(`/api/getproductbyid?id=${item.productId}`);
          const product = response.data.product;
          if (product) {
            productName = product.Product_name;
            productImage = product.Product_image?.[0] || '/placeholder-image.jpg';
          }
        } catch (error) {
          console.warn(`Could not fetch product details for ${item.productId}:`, error);
          // Keep default values
        }
      }
      
      return {
        _id: typeof item.productId === 'object' ? item.productId._id : item.productId,
        name: productName,
        image: productImage,
        price: item.price,
        quantity: item.quantity
      };
    })
  );

  return {
    _id: backendOrder._id,
    createdAt: backendOrder.createdAt,
    orderStatus: backendOrder.status, // Map 'status' to 'orderStatus'
    paymentStatus: backendOrder.paymentStatus,
    paymentMethod: backendOrder.paymentMethod,
    totalAmount: backendOrder.totalAmount,
    items: transformedItems,
    shippingAddress: {
      fullName: backendOrder.shippingAddress?.street || 'N/A',
      address: backendOrder.shippingAddress?.street || 'N/A',
      city: backendOrder.shippingAddress?.city || 'N/A',
      state: backendOrder.shippingAddress?.state || 'N/A',
      pinCode: backendOrder.shippingAddress?.pincode || 'N/A',
      phone: 'N/A' // Not available in current backend model
    },
    estimatedDelivery: backendOrder.estimatedDelivery,
    trackingNumber: backendOrder.trackingNumber
  };
};

// Status configurations
const orderStatusConfig = {
  pending: {
    icon: Clock,
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    label: "Order Placed"
  },
  processing: {
    icon: Package,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    label: "Processing"
  },
  shipped: {
    icon: Truck,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    label: "Shipped"
  },
  delivered: {
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    label: "Delivered"
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    label: "Cancelled"
  }
};

const paymentStatusConfig = {
  pending: { color: "bg-yellow-500", label: "Payment Pending" },
  paid: { color: "bg-green-500", label: "Paid" },
  failed: { color: "bg-red-500", label: "Payment Failed" }
};

const Orders = () => {
  const { user }: { user: User | null } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ ENHANCED: Detect if current user is admin
  const isAdminUser = useCallback(() => {
    // Check multiple ways to determine if user is admin
    const adminUser = localStorage.getItem('admin_user');
    const isAdminPath = window.location.pathname.includes('/admin');
    const hasAdminToken = TokenManager.hasValidToken('admin');
    
    return !!(adminUser || isAdminPath || hasAdminToken || user?.role === 'admin');
  }, [user]);

  // ✅ SMART: Check for appropriate token based on user type
  const hasValidToken = useCallback(() => {
    const isAdmin = isAdminUser();
    const context = isAdmin ? 'admin' : 'user';
    const token = TokenManager.getToken(context);
    
    console.log(`🔑 ${context} token check:`, !!token);
    return !!token;
  }, [isAdminUser]);

  // Safe date formatting function
  const formatDate = useCallback((dateString: string | undefined, formatString: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  }, []);

  // ✅ ENHANCED: Smart fetch orders based on user type
  const fetchOrders = useCallback(async () => {
    if (!user) {
      console.log("❌ No user found, skipping order fetch");
      return;
    }

    if (!hasValidToken()) {
      const isAdmin = isAdminUser();
      const userType = isAdmin ? 'admin' : 'user';
      const loginPath = isAdmin ? '/admin/login' : '/login';
      
      console.log(`❌ No valid ${userType} token found`);
      toast({
        title: "Authentication Required",
        description: `Please log in as ${userType} to view orders.`,
        variant: "destructive"
      });
      navigate(loginPath);
      return;
    }
    
    setLoading(true);
    try {
      const isAdmin = isAdminUser();
      const endpoint = isAdmin ? '/orders/admin/all' : '/orders/user';
      
      console.log(`🔄 Fetching ${isAdmin ? 'admin' : 'user'} orders from: ${endpoint}`);
      
      // ✅ Use axiosInstance which automatically adds the correct token via interceptor
      const res = await axiosInstance.get(endpoint);
      
      console.log("✅ Orders API Response:", res.data);
      
      const backendOrders: BackendOrder[] = res.data.orders || [];
      console.log(`📦 Received ${backendOrders.length} orders from backend`);
      
      // Transform orders logic
      const transformedOrders = await Promise.all(
        backendOrders.map(order => transformOrderForDisplay(order))
      );
      
      console.log(`✨ Transformed ${transformedOrders.length} orders for display`);
      setOrders(transformedOrders);
      
      if (transformedOrders.length === 0) {
        console.log(`📋 No orders found for ${isAdmin ? 'admin view' : 'user'}`);
      }
      
    } catch (err: any) {
      console.error("❌ Error fetching orders:", err);
      
      // Check if it's a token issue
      if (err?.response?.status === 401) {
        const isAdmin = isAdminUser();
        const context = isAdmin ? 'admin' : 'user';
        const loginPath = isAdmin ? '/admin/login' : '/login';
        
        console.log(`🔑 Authentication failed - clearing ${context} tokens`);
        TokenManager.clearTokens(context);
        
        toast({
          title: "Session Expired",
          description: `Please log in again as ${context} to view orders.`,
          variant: "destructive"
        });
        navigate(loginPath);
      } else {
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.error || 
                            "Failed to fetch orders";
        
        toast({
          title: "Error Loading Orders",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, hasValidToken, isAdminUser, toast, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ✅ Enhanced manual refresh capability
  const handleRefresh = useCallback(() => {
    if (hasValidToken()) {
      fetchOrders();
    } else {
      const isAdmin = isAdminUser();
      const userType = isAdmin ? 'admin' : 'user';
      const loginPath = isAdmin ? '/admin/login' : '/login';
      
      toast({
        title: "Please Login",
        description: `You need to log in as ${userType} to refresh orders.`,
        variant: "destructive"
      });
      navigate(loginPath);
    }
  }, [fetchOrders, hasValidToken, isAdminUser, toast, navigate]);

  // Get order status progress
  const getOrderProgress = (status: string) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-20">
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-gray-600 text-lg font-medium">Loading your orders...</p>
    </div>
  );

  // ✅ ENHANCED: Empty state component with context awareness
  const EmptyOrders = () => {
    const isAdmin = isAdminUser();
    
    return (
      <motion.div 
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 max-w-md mx-auto shadow-xl border border-purple-100/50">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
            {isAdmin ? (
              <Shield className="w-10 h-10 text-purple-600" />
            ) : (
              <Package className="w-10 h-10 text-purple-600" />
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            {isAdmin ? 'No Orders in System' : 'No Orders Yet'}
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {isAdmin 
              ? 'No customer orders have been placed yet. Orders will appear here when customers start purchasing.' 
              : 'Your jewelry collection is waiting! Explore our beautiful pieces and place your first order.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAdmin && (
              <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                Start Shopping
              </button>
            )}
            <button 
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold transition-all duration-300"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Order Details Component
  const OrderDetails = ({ order }: { order: DisplayOrder }) => {
    const statusConfig = orderStatusConfig[order.orderStatus];
    const StatusIcon = statusConfig.icon;

    return (
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-6 md:p-8 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Order Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-purple-100">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className={`w-12 h-12 ${statusConfig.bgColor} rounded-xl flex items-center justify-center`}>
              <StatusIcon className={`w-6 h-6 ${statusConfig.textColor}`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Order #{order._id.slice(-6).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(order.createdAt, 'MMM d, yyyy - h:mm a')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${statusConfig.color} text-white px-4 py-2 rounded-full font-semibold`}>
              {statusConfig.label}
            </Badge>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{order.totalAmount?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* Order Progress */}
        {order.orderStatus !== 'cancelled' && (
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-2">
              <span>Order Progress</span>
              <span>{Math.round(getOrderProgress(order.orderStatus))}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${getOrderProgress(order.orderStatus)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Placed</span>
              <span>Processing</span>
              <span>Shipped</span>
              <span>Delivered</span>
            </div>
          </div>
        )}

        {/* Tracking Information */}
        {order.trackingNumber && (
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 rounded-2xl border border-purple-100/50 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Truck className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">Tracking Information</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Tracking Number: <span className="font-mono font-semibold">{order.trackingNumber}</span>
            </p>
            {order.estimatedDelivery && (
              <p className="text-sm text-gray-600">
                Estimated Delivery: {formatDate(order.estimatedDelivery, 'MMM d, yyyy')}
              </p>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="mb-6">
          <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Items ({order.items?.length || 0})
          </h4>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <motion.div 
                key={item._id || index}
                className="flex items-center gap-4 p-4 bg-gradient-to-br from-white/60 to-purple-50/30 rounded-2xl border border-purple-100/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <img
                    src={item.image || '/placeholder-image.jpg'}
                    alt={item.name || 'Product'}
                    className="w-16 h-16 object-cover rounded-xl border border-purple-100 shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <h5 className="font-semibold text-gray-900 mb-1">{item.name || 'Product Name'}</h5>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Qty: {item.quantity || 0} × ₹{(item.price || 0).toFixed(2)}
                    </span>
                    <span className="font-bold text-purple-700">
                      ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-4">No items found</p>
            )}
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-gray-900">Shipping Address</h4>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
              </p>
              {order.shippingAddress.phone !== 'N/A' && (
                <p className="mt-2">
                  <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                </p>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-purple-600" />
              <h4 className="font-bold text-gray-900">Payment Details</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Method:</span>
                <span className="bg-white px-3 py-1 rounded-full border border-purple-200 text-sm font-semibold">
                  {(order.paymentMethod || 'COD').toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge className={`${paymentStatusConfig[order.paymentStatus]?.color || 'bg-gray-500'} text-white px-3 py-1 rounded-full`}>
                  {paymentStatusConfig[order.paymentStatus]?.label || order.paymentStatus}
                </Badge>
              </div>
              
              <div className="pt-3 border-t border-purple-100">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ₹{(order.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white">
          <div className="text-center max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Please Login
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You need to be logged in to view orders.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-16 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32">
        {/* Background Decorations */}
        <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />
        <div className="fixed bottom-40 right-10 w-48 h-48 rounded-full bg-pink-200/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="fixed top-1/2 right-1/4 w-24 h-24 rounded-full bg-purple-300/15 blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full text-sm font-semibold mb-6">
              {isAdminUser() ? (
                <>
                  <Shield className="w-4 h-4" />
                  Admin Order Management
                </>
              ) : (
                <>
                  <Package className="w-4 h-4" />
                  Order Management
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4">
              {isAdminUser() ? 'All Orders' : 'My Orders'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {isAdminUser() 
                ? 'View and manage all customer orders in the system'
                : 'Track your jewelry orders and view order history'
              }
            </p>
            
            {/* Navigation & Refresh */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
              <button
                onClick={() => navigate(isAdminUser() ? '/admin' : '/profile')}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to {isAdminUser() ? 'Admin Dashboard' : 'Profile'}
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Orders
              </button>
            </div>
          </motion.div>

          {/* Orders Summary */}
          {!loading && orders.length > 0 && (
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-6 md:p-8 mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
                  <p className="text-gray-600">
                    {isAdminUser() ? 'Total' : 'You have'} {orders.length} order{orders.length !== 1 ? 's' : ''} {!isAdminUser() && 'in total'}
                  </p>
                </div>
                
                <div className="flex gap-4 text-center">
                  {Object.entries(
                    orders.reduce((acc, order) => {
                      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([status, count]) => {
                    const statusConfig = orderStatusConfig[status as keyof typeof orderStatusConfig];
                    return (
                      <div key={status} className="text-center">
                        <div className={`w-8 h-8 ${statusConfig.bgColor} rounded-lg flex items-center justify-center mx-auto mb-1`}>
                          <statusConfig.icon className={`w-4 h-4 ${statusConfig.textColor}`} />
                        </div>
                        <div className="text-lg font-bold text-gray-900">{count}</div>
                        <div className="text-xs text-gray-600 capitalize">{status}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders List */}
          {loading ? (
            <LoadingSpinner />
          ) : orders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <OrderDetails order={order} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
