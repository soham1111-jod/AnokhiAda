import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

const orderStatusColors: { [key: string]: string } = {
  pending: "bg-yellow-500",
  processing: "bg-blue-500",
  shipped: "bg-gradient-to-r from-purple-500 to-purple-700",
  delivered: "bg-green-500",
  cancelled: "bg-red-500",
};

const paymentStatusColors: { [key: string]: string } = {
  pending: "bg-yellow-500",
  paid: "bg-green-500",
  failed: "bg-red-500",
};

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/orders/user`, {
        withCredentials: true
      });
      setOrders(res.data.orders || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to fetch orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
          <div className="text-center max-w-md p-8 bg-white rounded-3xl shadow-lg border border-purple-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Please Login</h1>
            <p className="text-gray-700 mb-6">You need to be logged in to view your profile.</p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="rounded-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium shadow-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="fixed top-20 left-10 w-24 h-24 rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="fixed bottom-40 right-10 w-36 h-36 rounded-full bg-pink-200/30 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* User Info Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-purple-100 p-6 md:p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                Profile <span className="text-purple-600">Information</span>
              </h2>
              <button className="rounded-full px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white text-sm font-medium shadow-md">
                Edit Profile
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                <label className="block text-sm font-medium text-purple-800 mb-1">Full Name</label>
                <p className="text-lg font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
              
              <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                <label className="block text-sm font-medium text-purple-800 mb-1">Email Address</label>
                <p className="text-lg font-medium text-gray-900">{user.email}</p>
              </div>
              
              <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                <label className="block text-sm font-medium text-purple-800 mb-1">Account Type</label>
                <p className="text-lg font-medium text-gray-900 capitalize">{user.role}</p>
              </div>
              
              <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                <label className="block text-sm font-medium text-purple-800 mb-1">Member Since</label>
                <p className="text-lg font-medium text-gray-900">
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="bg-white rounded-3xl shadow-lg border border-purple-100 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Order <span className="text-purple-600">History</span>
              </h2>
              <div className="text-purple-700 font-medium">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-gray-700">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-purple-200 rounded-2xl">
                <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-700 max-w-md mx-auto mb-4">Your jewelry collection is waiting! Explore our beautiful pieces.</p>
                <button 
                  onClick={() => window.location.href = '/category'}
                  className="rounded-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-medium shadow-lg"
                >
                  Browse Collections
                </button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {orders.map((order) => (
                  <AccordionItem 
                    key={order._id} 
                    value={order._id}
                    className="border-2 border-purple-100 rounded-2xl overflow-hidden hover:border-purple-300 transition-colors"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline bg-purple-50/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-3">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-2 rounded-lg border border-purple-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">Order #{order._id.slice(-6).toUpperCase()}</div>
                            <div className="text-sm text-gray-600">{format(new Date(order.createdAt), 'MMM d, yyyy - h:mm a')}</div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                          <Badge className={`${orderStatusColors[order.orderStatus]} text-white px-3 py-1 rounded-full`}>
                            {order.orderStatus}
                          </Badge>
                          <div className="font-bold text-lg">₹{order.totalAmount.toFixed(2)}</div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="px-5 py-4 bg-white">
                      <div className="space-y-6">
                        {/* Order Items */}
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 mb-3 pb-2 border-b border-purple-100">Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item: any) => (
                              <div key={item._id} className="flex items-center gap-4 pb-3 border-b border-purple-50">
                                <div className="flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-lg border border-purple-100"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  <div className="flex justify-between mt-1">
                                    <div className="text-sm text-gray-600">
                                      Quantity: {item.quantity} × ₹{item.price.toFixed(2)}
                                    </div>
                                    <div className="font-medium">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Shipping Address */}
                          <div className="bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                            <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              Shipping Address
                            </h4>
                            <div className="text-gray-700 space-y-1">
                              <p className="font-medium">{order.shippingAddress.fullName}</p>
                              <p>{order.shippingAddress.address}</p>
                              <p>
                                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                                {order.shippingAddress.pinCode}
                              </p>
                              <p className="mt-2">
                                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                              </p>
                            </div>
                          </div>

                          {/* Payment Info */}
                          <div className="bg-purple-50/30 p-4 rounded-xl border border-purple-100">
                            <h4 className="font-bold text-lg text-gray-900 mb-3 flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                              Payment Information
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <span className="font-medium">Method:</span>
                                <span className="bg-white px-3 py-1 rounded-full border border-purple-200 text-sm">
                                  {order.paymentMethod.toUpperCase()}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <span className="font-medium">Status:</span>
                                <Badge className={`${paymentStatusColors[order.paymentStatus]} px-3 py-1 rounded-full text-white`}>
                                  {order.paymentStatus}
                                </Badge>
                              </div>
                              
                              <div className="pt-3 border-t border-purple-100">
                                <div className="flex justify-between font-medium">
                                  <span>Total Amount:</span>
                                  <span>₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;