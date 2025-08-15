import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthContext";
import axiosInstance from "@/utils/axiosConfig";

// Extend Window interface for Cashfree
declare global {
  interface Window {
    Cashfree: (config: { mode: string }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: string;
      }) => Promise<{
        error?: { message: string };
        redirect?: boolean;
        paymentDetails?: any;
      }>;
    };
  }
}

export const usePaymentProcessing = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const processPayment = async (
    items: any[],
    shippingAddress: any,
    paymentMethod: "cod" | "online",
    totals: { itemsTotal: number; deliveryCharge: number; totalAmount: number },
     cartType: "cart" | "hamper" = "cart"
  ) => {
    try {
      setCheckoutLoading(true);

      const orderData = {
        userId: user._id,
        items: items,
        shippingAddress: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pinCode,
          country: 'India'
        },
        itemsTotal: totals.itemsTotal,
        deliveryCharge: totals.deliveryCharge,
        totalAmount: totals.totalAmount,
        paymentMethod: paymentMethod,
        Contact_number: shippingAddress.phone,
        user_email: user.email
      };

      console.log('📤 Sending order data:', orderData);
      const response = await axiosInstance.post('/cashfree/create', orderData);

      if (response.data.success) {
        if (paymentMethod === 'cod') {
          // ✅ CHANGE: Clear specific cart based on cartType
          if (cartType === "cart") {
            await axiosInstance.delete("/cart/clear");
          } else if (cartType === "hamper") {
            await axiosInstance.delete("/hamper/clear");
          }

          toast({
            title: "Order Placed Successfully! 🎉",
            description: "Your order has been placed. Check 'My Orders' to track it."
          });
          navigate('/orders');
          return true;
        } else {
          // Handle online payment with Cashfree
          if (!window.Cashfree) {
            toast({
              title: "Payment Error",
              description: "Payment system is loading. Please try again.",
              variant: "destructive"
            });
            return false;
          }

          const cashfree = window.Cashfree({ mode: "sandbox" });
          const { cashfreeSession, orderId, internalOrderId } = response.data;

          sessionStorage.setItem("orderId", orderId);
          sessionStorage.setItem("internalOrderId", internalOrderId);
          sessionStorage.setItem("paymentMethod", paymentMethod);

          console.log('🔑 Payment session ID:', cashfreeSession.payment_session_id);

          const result = await cashfree.checkout({
            paymentSessionId: cashfreeSession.payment_session_id,
            redirectTarget: "_self"
          });

          if (result.redirect) {
            
            if (cartType === "cart") {
              await axiosInstance.delete("/cart/clear");
            } else if (cartType === "hamper") {
              await axiosInstance.delete("/hamper/clear");
            }
            
            toast({
              title: "Payment Successful! 🎉",
              description: "Your payment has been processed."
            });
            navigate('/payment/callback');
            return true;
          }
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.response?.data?.message || "Failed to process payment.",
        variant: "destructive"
      });
    } finally {
      setCheckoutLoading(false);
    }
    return false;
  };

  return {
    checkoutLoading,
    processPayment
  };
};
