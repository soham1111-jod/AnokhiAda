import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  isNew: boolean;
  quantity?: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to safely parse stored cart data
const getStoredCart = (): Product[] => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
    return [];
  }
};

// Helper function to safely store cart data
const storeCart = (cart: Product[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  } catch (error) {
    console.error('Error storing cart to localStorage:', error);
  }
};

// Helper function to safely extract price from string
const extractPrice = (price: any): number => {
  if (!price) return 0;
  
  // Convert to string if it's not already
  const priceString = typeof price === 'string' ? price : String(price);
  
  // Extract numeric value from price string (handles ₹, $, etc.)
  const numericPrice = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  
  // Return 0 if parsing failed or result is NaN
  return isNaN(numericPrice) ? 0 : numericPrice;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const storedCart = getStoredCart();
    // Filter out any items with invalid or missing price
    const validCart = storedCart.filter(item => item && item.price);
    setCart(validCart);
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever cart changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      storeCart(cart);
    }
  }, [cart, isInitialized]);

  const addToCart = (product: Product) => {
    // Validate product has required fields before adding
    if (!product || !product.price || !product.id) {
      console.error('Invalid product data:', product);
      return;
    }

    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      
      if (existingProductIndex !== -1) {
        // Product exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: (updatedCart[existingProductIndex].quantity || 1) + 1
        };
        return updatedCart;
      } else {
        // New product, add to cart
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    // Ensure quantity is at least 1
    const newQuantity = Math.max(1, Math.floor(quantity));
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCartCount = (): number => {
    return cart.reduce((total, item) => {
      // Ensure item exists and has valid quantity
      if (!item) return total;
      return total + (item.quantity || 1);
    }, 0);
  };

  const getCartTotal = (): number => {
    return cart.reduce((sum, item) => {
      // Check if item exists and has a price
      if (!item || !item.price) {
        console.warn('Cart item missing price:', item);
        return sum;
      }
      
      const priceNumber = extractPrice(item.price);
      const quantity = item.quantity || 1;
      
      return sum + (priceNumber * quantity);
    }, 0);
  };

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    getCartCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};