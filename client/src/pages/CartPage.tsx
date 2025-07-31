import React, { useState } from "react";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    phone: ""
  });

  const totalPrice = cart.reduce((sum, item) => {
    const priceNumber = Number(item.price.replace(/[^0-9.-]+/g, ""));
    return sum + priceNumber * (item.quantity || 1);
  }, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
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

    setLoading(true);
    try {
      const orderItems = cart.map(item => ({
        product: item.id,
        name: item.name,
        quantity: item.quantity || 1,
        price: Number(item.price.replace(/[^0-9.-]+/g, "")),
        image: item.image
      }));

      const orderData = {
        items: orderItems,
        shippingAddress,
        paymentMethod: "cod",
        totalAmount: totalPrice
      };

      await axios.post(`${API_URL}/orders/create`, orderData, {
        withCredentials: true
      });

      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Your jewelry is on its way. Track your order in your profile.",
        variant: "default"
      });
      navigate("/profile");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to place order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-white px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-purple-100">
            <div className="mx-auto w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">Your Jewelry Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any beautiful pieces to your cart yet. Discover our collection of handcrafted jewelry.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => navigate("/category")}
                className="rounded-full px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-lg font-semibold"
              >
                Explore Collection
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-purple-200/30 blur-3xl"></div>
        <div className="absolute bottom-40 right-10 w-36 h-36 rounded-full bg-pink-200/30 blur-3xl"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-purple-50 to-white pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your <span className="text-purple-600">Jewelry</span> Cart
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Review your selected pieces before checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6">
              <div className="space-y-6">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col sm:flex-row gap-6 py-4 border-b border-purple-100 last:border-0"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-32 h-32 rounded-xl overflow-hidden border border-purple-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-purple-600 font-medium mt-1">{item.price}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-gray-500 hover:text-red-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center border border-purple-200 rounded-full">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            disabled={item.quantity === 1}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </Button>
                          <span className="px-3 font-medium">{item.quantity || 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </Button>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Total:</span> ₹
                          {(Number(item.price.replace(/[^0-9.-]+/g, "")) * (item.quantity || 1)).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-purple-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-full px-6 py-3 border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => navigate("/category")}
                >
                  Continue Shopping
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    variant="destructive" 
                    className="rounded-full px-6 py-3"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                  <Button 
                    className="rounded-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                    onClick={() => setIsCheckingOut(true)}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Checkout Summary */}
          <AnimatePresence>
            {isCheckingOut && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                  
                  <form onSubmit={handleCheckout} className="space-y-5">
                    <div>
                      <Label htmlFor="fullName" className="mb-2 block font-medium text-gray-700">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        required
                        className="py-3 px-4 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="mb-2 block font-medium text-gray-700">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                        className="py-3 px-4 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address" className="mb-2 block font-medium text-gray-700">
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        required
                        className="py-3 px-4 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <Label htmlFor="city" className="mb-2 block font-medium text-gray-700">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleInputChange}
                          required
                          className="py-3 px-4 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state" className="mb-2 block font-medium text-gray-700">
                          State
                        </Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleInputChange}
                          required
                          className="py-3 px-4 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="pinCode" className="mb-2 block font-medium text-gray-700">
                        PIN Code
                      </Label>
                      <Input
                        id="pinCode"
                        name="pinCode"
                        value={shippingAddress.pinCode}
                        onChange={handleInputChange}
                        required
                        className="py-3 px-4 rounded-xl border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-purple-100 mt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold mt-6 pt-4 border-t border-purple-100">
                        <span>Total</span>
                        <span className="text-purple-600">₹{totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full py-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-lg font-semibold mt-6"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Place Order"}
                    </Button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Cash on Delivery • Secure Payment
                    </p>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-purple-200/30 blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-36 h-36 rounded-full bg-pink-200/30 blur-3xl"></div>
    </div>
  );
};

export default CartPage;