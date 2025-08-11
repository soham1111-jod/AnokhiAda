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
  Shield,
  Phone,
  Mail,
  Calendar,
  Receipt,
  Gift
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Enhanced interfaces for user orders
interface ShippingAddress {
  fullName?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  pincode?: string;
  phone?: string;
  country?: string;
}

interface OrderItem {
  productId: string | any;
  product?: string;
  name?: string;
  quantity: number;
  price: number;
  image?: string;
  _id?: string;
}

interface BackendOrder {
  _id: string;
  createdAt: string;
  updatedAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  Contact_number?: string;
  user_email?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shiprocketOrderId?: string;
  isCustomHamper?: boolean;
  notes?: string;
}

interface DisplayOrder {
  _id: string;
  createdAt: string;
  updatedAt?: string;
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
    email?: string;
  };
  isCustomHamper?: boolean;
  estimatedDelivery?: string;
  trackingNumber?: string;
  shiprocketOrderId?: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

// ✅ Enhanced transformer for user orders
const transformOrderForDisplay = async (backendOrder: BackendOrder): Promise<DisplayOrder> => {
  const transformedItems = await Promise.all(
    backendOrder.items.map(async (item) => {
      let productName = item.name || 'Product Name';
      let productImage = item.image || '/placeholder-product.jpg';
      
      // Try to get product details if not available
      if (typeof item.productId === 'object' && item.productId?.Product_name) {
        productName = item.productId.Product_name;
        productImage = item.productId.Product_image?.[0] || productImage;
      } else if (typeof item.productId === 'string' && !item.name) {
        try {
          const response = await axiosInstance.get(`/api/getproductbyid?id=${item.productId}`);
          const product = response.data.product;
          if (product) {
            productName = product.Product_name;
            productImage = product.Product_image?.[0] || productImage;
          }
        } catch (error) {
          console.warn(`Could not fetch product details for ${item.productId}`);
        }
      }
      
      return {
        _id: item._id || (typeof item.productId === 'string' ? item.productId : item.productId?._id) || '',
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
    updatedAt: backendOrder.updatedAt,
    orderStatus: backendOrder.status,
    paymentStatus: backendOrder.paymentStatus,
    paymentMethod: backendOrder.paymentMethod,
    totalAmount: backendOrder.totalAmount,
    items: transformedItems,
    shippingAddress: {
      fullName: backendOrder.shippingAddress?.fullName || 
                backendOrder.shippingAddress?.street || 'N/A',
      address: backendOrder.shippingAddress?.address || 
               backendOrder.shippingAddress?.street || 'N/A',
      city: backendOrder.shippingAddress?.city || 'N/A',
      state: backendOrder.shippingAddress?.state || 'N/A',
      pinCode: backendOrder.shippingAddress?.pinCode || 
               backendOrder.shippingAddress?.pincode || 'N/A',
      phone: backendOrder.shippingAddress?.phone || 
             backendOrder.Contact_number || 'N/A',
      email: backendOrder.user_email
    },
    isCustomHamper: backendOrder.isCustomHamper,
    estimatedDelivery: backendOrder.estimatedDelivery,
    trackingNumber: backendOrder.trackingNumber,
    shiprocketOrderId: backendOrder.shiprocketOrderId
  };
};

// Enhanced status configurations with better mobile support
const orderStatusConfig = {
  pending: {
    icon: Clock,
    color: "bg-amber-500",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Order Placed",
    description: "Your order has been received and is being prepared"
  },
  processing: {
    icon: Package,
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Processing",
    description: "Your order is being prepared for shipment"
  },
  shipped: {
    icon: Truck,
    color: "bg-purple-500",
    textColor: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    label: "Shipped",
    description: "Your order is on its way to you"
  },
  delivered: {
    icon: CheckCircle,
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Delivered",
    description: "Your order has been successfully delivered"
  },
  cancelled: {
    icon: XCircle,
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Cancelled",
    description: "Your order has been cancelled"
  }
};

const paymentStatusConfig = {
  pending: { 
    color: "bg-amber-500", 
    label: "Payment Pending",
    textColor: "text-amber-700",
    bgColor: "bg-amber-50"
  },
  paid: { 
    color: "bg-green-500", 
    label: "Paid",
    textColor: "text-green-700",
    bgColor: "bg-green-50"
  },
  failed: { 
    color: "bg-red-500", 
    label: "Payment Failed",
    textColor: "text-red-700",
    bgColor: "bg-red-50"
  }
};

const Orders = () => {
  const { user }: { user: User | null } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loading, setLoading] = useState(false);

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

  // ✅ Fetch user orders only
  const fetchUserOrders = useCallback(async () => {
    if (!user) {
      console.log("❌ No user found, skipping order fetch");
      return;
    }

    const token = TokenManager.getToken('user');
    if (!token) {
      console.log("❌ No valid user token found");
      toast({
        title: "Authentication Required",
        description: "Please log in to view your orders.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      console.log('🔄 Fetching user orders...');
      
      // ✅ Use the correct endpoint for user orders based on your backend
      const res = await axiosInstance.get(`/api/cashfree/my-orders/${user.id || user._id}`);
      
      console.log("✅ Orders API Response:", res.data);
      
      const backendOrders: BackendOrder[] = res.data.orders || [];
      console.log(`📦 Received ${backendOrders.length} orders from backend`);
      
      // Transform orders for display
      const transformedOrders = await Promise.all(
        backendOrders.map(order => transformOrderForDisplay(order))
      );
      
      console.log(`✨ Transformed ${transformedOrders.length} orders for display`);
      
      // Sort by creation date (newest first)
      const sortedOrders = transformedOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
      
      if (sortedOrders.length === 0) {
        console.log('📋 No orders found for user');
      }
      
    } catch (err: any) {
      console.error("❌ Error fetching orders:", err);
      
      if (err?.response?.status === 401) {
        console.log('🔑 Authentication failed - clearing user tokens');
        TokenManager.clearTokens('user');
        
        toast({
          title: "Session Expired",
          description: "Please log in again to view your orders.",
          variant: "destructive"
        });
        navigate('/login');
      } else {
        const errorMessage = err?.response?.data?.message || 
                            err?.response?.data?.error || 
                            "Failed to fetch your orders";
        
        toast({
          title: "Error Loading Orders",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user, toast, navigate]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Enhanced manual refresh
  const handleRefresh = useCallback(() => {
    if (user) {
      fetchUserOrders();
    } else {
      toast({
        title: "Please Login",
        description: "You need to log in to refresh orders.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [fetchUserOrders, user, toast, navigate]);

  // Get order status progress
  const getOrderProgress = (status: string) => {
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);
    return currentIndex >= 0 ? ((currentIndex + 1) / statusOrder.length) * 100 : 0;
  };

  // ✅ Mobile-optimized Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-12 sm:py-20">
      <div className="relative mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-gray-600 text-sm sm:text-lg font-medium px-4 text-center">Loading your orders...</p>
    </div>
  );

  // ✅ Mobile-optimized Empty state
  const EmptyOrders = () => (
    <motion.div 
      className="text-center py-12 sm:py-20 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-12 max-w-sm sm:max-w-md mx-auto shadow-xl border border-purple-100/50">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
        </div>
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
          No Orders Yet
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
          Your jewelry collection is waiting! Explore our beautiful pieces and place your first order.
        </p>
        <div className="flex flex-col gap-3 sm:gap-4 justify-center">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            Start Shopping
          </button>
          <button 
            onClick={handleRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 sm:px-8 py-3 border-2 border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold transition-all duration-300 text-sm sm:text-base"
          >
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            Refresh
          </button>
        </div>
      </div>
    </motion.div>
  );

  // ✅ Ultra-responsive Order Details Component
  const OrderDetails = ({ order }: { order: DisplayOrder }) => {
    const statusConfig = orderStatusConfig[order.orderStatus];
    const paymentConfig = paymentStatusConfig[order.paymentStatus];
    const StatusIcon = statusConfig.icon;

    return (
      <motion.div 
        className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-3 sm:p-6 md:p-8 mb-4 sm:mb-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* ✅ Mobile-first Order Header */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-purple-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${statusConfig.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${statusConfig.textColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h3>
                {order.isCustomHamper && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    <Gift className="w-3 h-3 mr-1" />
                    Custom Hamper
                  </Badge>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {formatDate(order.createdAt, 'MMM d, yyyy - h:mm a')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-col sm:items-end sm:gap-2">
            <Badge className={`${statusConfig.color} text-white px-3 py-2 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap`}>
              {statusConfig.label}
            </Badge>
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ₹{order.totalAmount?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* ✅ Compact Order Progress for Mobile */}
        {order.orderStatus !== 'cancelled' && (
          <div className="mb-4 sm:mb-8">
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium text-gray-600 mb-2">
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
              <span className="hidden xs:inline">Processing</span>
              <span className="xs:hidden">Process</span>
              <span>Shipped</span>
              <span className="hidden xs:inline">Delivered</span>
              <span className="xs:hidden">Done</span>
            </div>
          </div>
        )}

        {/* ✅ Compact Tracking Information */}
        {(order.trackingNumber || order.shiprocketOrderId) && (
          <div className={`${statusConfig.bgColor} p-3 sm:p-4 rounded-xl sm:rounded-2xl ${statusConfig.borderColor} border mb-4 sm:mb-6`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <span className="font-semibold text-sm sm:text-base text-gray-900">Tracking Info</span>
            </div>
            {order.trackingNumber && (
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                <span className="font-medium">Tracking:</span> 
                <span className="font-mono font-semibold ml-2 break-all">{order.trackingNumber}</span>
              </p>
            )}
            {order.shiprocketOrderId && (
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                <span className="font-medium">Shiprocket ID:</span>
                <span className="font-mono font-semibold ml-2">{order.shiprocketOrderId}</span>
              </p>
            )}
            {order.estimatedDelivery && (
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">Est. Delivery:</span>
                <span className="ml-2">{formatDate(order.estimatedDelivery, 'MMM d, yyyy')}</span>
              </p>
            )}
          </div>
        )}

        {/* ✅ Mobile-optimized Order Items */}
        <div className="mb-4 sm:mb-6">
          <h4 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            Items ({order.items?.length || 0})
          </h4>
          <div className="space-y-3 sm:space-y-4">
            {order.items?.map((item, index) => (
              <motion.div 
                key={item._id || index}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-white/60 to-purple-50/30 rounded-xl sm:rounded-2xl border border-purple-100/50"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  <img
                    src={item.image || '/placeholder-product.jpg'}
                    alt={item.name || 'Product'}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg sm:rounded-xl border border-purple-100 shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <h5 className="font-semibold text-sm sm:text-base text-gray-900 mb-1 line-clamp-2">
                    {item.name || 'Product Name'}
                  </h5>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Qty: {item.quantity || 0} × ₹{(item.price || 0).toFixed(2)}
                    </span>
                    <span className="font-bold text-sm sm:text-base text-purple-700 self-start sm:self-auto">
                      ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )) || (
              <p className="text-gray-500 text-center py-4 text-sm">No items found</p>
            )}
          </div>
        </div>

        {/* ✅ Mobile-stacked Shipping & Payment Info */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
          {/* Shipping Address */}
          <div className={`${statusConfig.bgColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl ${statusConfig.borderColor} border`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <h4 className="font-bold text-sm sm:text-base text-gray-900">Shipping Address</h4>
            </div>
            <div className="text-gray-700 space-y-1 text-xs sm:text-sm">
              <p className="font-semibold">{order.shippingAddress.fullName}</p>
              <p className="break-words">{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pinCode}
              </p>
              {order.shippingAddress.phone !== 'N/A' && (
                <p className="mt-2 flex items-center gap-1">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium">{order.shippingAddress.phone}</span>
                </p>
              )}
              {order.shippingAddress.email && (
                <p className="flex items-center gap-1">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-medium break-all">{order.shippingAddress.email}</span>
                </p>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className={`${paymentConfig.bgColor} p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-opacity-50`}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              <h4 className="font-bold text-sm sm:text-base text-gray-900">Payment Details</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Method:</span>
                <span className="bg-white px-2 sm:px-3 py-1 rounded-full border border-purple-200 text-xs sm:text-sm font-semibold">
                  {(order.paymentMethod || 'COD').toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-600">Status:</span>
                <Badge className={`${paymentConfig.color} text-white px-2 sm:px-3 py-1 rounded-full text-xs`}>
                  {paymentConfig.label}
                </Badge>
              </div>
              
              <div className="pt-3 border-t border-purple-100">
                <div className="flex justify-between font-bold text-sm sm:text-lg">
                  <span>Total:</span>
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white px-4">
          <div className="text-center max-w-sm sm:max-w-md p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100/50">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Please Login
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              You need to be logged in to view your orders.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
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
      {/* ✅ Add responsive CSS */}
      <style>{`
        @media (max-width: 360px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
        
        .xs\\:hidden {
          @media (max-width: 479px) {
            display: none;
          }
        }
        
        .xs\\:inline {
          @media (min-width: 480px) {
            display: inline;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-12 sm:py-16 px-2 sm:px-4 lg:px-8 pt-16 sm:pt-20 lg:pt-24">
        {/* Background Decorations - Scaled for mobile */}
        <div className="fixed top-16 left-4 sm:top-20 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-purple-200/20 blur-2xl sm:blur-3xl animate-pulse" />
        <div className="fixed bottom-32 right-4 sm:bottom-40 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-pink-200/20 blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-4xl xl:max-w-6xl mx-auto relative z-10">
          {/* ✅ Mobile-optimized Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <Package className="w-3 h-3 sm:w-4 sm:h-4" />
              My Orders
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
              Your Orders
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-4">
              Track your jewelry orders and view order history
            </p>
            
            {/* Navigation & Refresh */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-4 sm:mt-6 px-4">
              <button
                onClick={() => navigate('/profile')}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </button>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors disabled:opacity-50 text-sm sm:text-base"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh Orders
              </button>
            </div>
          </motion.div>

          {/* ✅ Mobile-optimized Orders Summary */}
          {!loading && orders.length > 0 && (
            <motion.div 
              className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    You have {orders.length} order{orders.length !== 1 ? 's' : ''} in total
                  </p>
                </div>
                
                <div className="flex gap-3 sm:gap-4 text-center w-full sm:w-auto justify-around sm:justify-end">
                  {Object.entries(
                    orders.reduce((acc, order) => {
                      acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([status, count]) => {
                    const statusConfig = orderStatusConfig[status as keyof typeof orderStatusConfig];
                    return (
                      <div key={status} className="text-center">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 ${statusConfig.bgColor} rounded-lg flex items-center justify-center mx-auto mb-1`}>
                          <statusConfig.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${statusConfig.textColor}`} />
                        </div>
                        <div className="text-sm sm:text-lg font-bold text-gray-900">{count}</div>
                        <div className="text-xs text-gray-600 capitalize hidden sm:block">{status}</div>
                        <div className="text-xs text-gray-600 capitalize sm:hidden">
                          {status === 'processing' ? 'Process' : status}
                        </div>
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
            <div className="space-y-4 sm:space-y-6">
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
