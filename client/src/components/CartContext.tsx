// import React, {
//   createContext,
//   useContext,
//   useState,
//   ReactNode,
//   useEffect,
// } from "react";
// import { useAuth } from "./AuthContext";
// import { useToast } from "@/hooks/use-toast";

// const API_URL =
//   import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// interface Product {
//   id: number;
//   name: string;
//   price: string;
//   originalPrice: string;
//   image: string;
//   isNew: boolean;
//   quantity?: number;
//   _id?: string;
//   Product_name?: string;
//   Product_price?: number;
//   Product_image?: string[];
// }

// // Backend cart item structure
// interface BackendCartItem {
//   _id: string;
//   productId: {
//     _id: string;
//     Product_name: string;
//     Product_price: number;
//     Product_image: string[];
//     Product_category: {
//       category: string;
//     };
//     Product_available: boolean;
//   };
//   quantity: number;
// }

// interface CartContextType {
//   cart: Product[];
//   addToCart: (product: Product) => void;
//   removeCart: (productId: number | string) => void;
//   clearCart: () => void;
//   updateQuantity: (productId: number | string, quantity: number) => void;
//   getCartCount: () => number;
//   getCartTotal: () => number;
//   loading: boolean;
//   syncCart: () => Promise<void>;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// // Helper: get cart from localStorage safely
// const getStoredCart = (): Product[] => {
//   try {
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("cart");
//       return stored ? JSON.parse(stored) : [];
//     }
//     return [];
//   } catch (error) {
//     console.error("Error loading cart from localStorage:", error);
//     return [];
//   }
// };

// // Helper: save cart to localStorage
// const storeCart = (cart: Product[]) => {
//   try {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   } catch (error) {
//     console.error("Error saving cart to localStorage:", error);
//   }
// };

// // Helper: parse number from price string
// const extractPrice = (price: any): number => {
//   if (!price) return 0;
//   const priceString = typeof price === "string" ? price : String(price);
//   const numeric = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
//   return isNaN(numeric) ? 0 : numeric;
// };

// // Helper: Convert backend cart item to frontend product format
// const convertBackendItemToProduct = (item: BackendCartItem): Product => {
//   return {
//     id: item.productId._id
//       ? parseInt(item.productId._id, 16) % 1000000
//       : Math.random() * 1000000,
//     _id: item.productId._id,
//     name: item.productId.Product_name,
//     Product_name: item.productId.Product_name,
//     price: item.productId.Product_price?.toString() || "0",
//     Product_price: item.productId.Product_price,
//     originalPrice: item.productId.Product_price?.toString() || "0",
//     image: item.productId.Product_image?.[0] || "",
//     Product_image: item.productId.Product_image,
//     isNew: false,
//     quantity: item.quantity,
//   };
// };

// // Helper: Convert frontend product to backend format
// const convertProductToBackendFormat = (product: Product) => {
//   return {
//     id: product._id || product.id.toString(),
//     quantity: product.quantity || 1,
//     productId: product._id,
//   };
// };

// export const CartProvider = ({ children }: { children: ReactNode }) => {
//   const [cart, setCart] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [initialized, setInitialized] = useState(false);
//   const [previousAuthState, setPreviousAuthState] = useState<boolean | null>(null);
//   const { user, isAuthenticated } = useAuth();
//   const { toast } = useToast();

//   // Load cart on component mount and handle authentication changes
//   useEffect(() => {
//     loadCart();
//   }, [user, isAuthenticated]);

//   // ✅ Handle logout scenario - preserve cart in localStorage
//   useEffect(() => {
//     // Skip on first render
//     if (previousAuthState === null) {
//       setPreviousAuthState(isAuthenticated);
//       return;
//     }

//     // User logged out (was authenticated, now not)
//     if (previousAuthState && !isAuthenticated) {
//       console.log('User logged out - preserving cart in localStorage');

//       // Save current cart to localStorage before it gets cleared
//       if (cart.length > 0) {
//         storeCart(cart);
//         toast({
//           title: "Cart Preserved",
//           description: "Your cart items have been saved for your next visit.",
//         });
//       }

//       // Load cart from localStorage (in case there was already data there)
//       loadCartFromLocalStorage();
//     }
//     // User logged in (was not authenticated, now is)
//     else if (!previousAuthState && isAuthenticated) {
//       console.log('User logged in - syncing cart with backend');
//       syncCartOnLogin();
//     }

//     setPreviousAuthState(isAuthenticated);
//   }, [isAuthenticated, cart.length, previousAuthState]);

//   const loadCart = async () => {
//     setLoading(true);
//     try {
//       if (isAuthenticated && user && user.token) {
//         // Load from backend
//         await loadCartFromBackend();
//       } else {
//         // Load from localStorage
//         loadCartFromLocalStorage();
//       }
//     } catch (error) {
//       console.error("Error loading cart:", error);
//       loadCartFromLocalStorage(); // Fallback to localStorage
//     } finally {
//       setLoading(false);
//       setInitialized(true);
//     }
//   };

//   const loadCartFromLocalStorage = () => {
//     try {
//       const storedCart = getStoredCart();
//       const validCart = storedCart.filter(
//         (item) => item && item.price && (item.id || item._id) && item.name
//       );

//       console.log('Loading cart from localStorage:', validCart.length, 'items');
//       setCart(validCart);
//     } catch (error) {
//       console.error("Error loading cart from localStorage:", error);
//       setCart([]);
//     }
//   };

//   const loadCartFromBackend = async () => {
//     if (!user || !user.token) return;

//     console.log("Loading cart from backend for user:", user.email);

//     try {
//       const response = await fetch(`${API_URL}/cart`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.cart && Array.isArray(data.cart)) {
//         const frontendCart = data.cart.map(convertBackendItemToProduct);
//         console.log('Loaded cart from backend:', frontendCart.length, 'items');
//         setCart(frontendCart);
//       } else {
//         setCart([]);
//       }
//     } catch (error) {
//       console.error("Error loading cart from backend:", error);
//       throw error;
//     }
//   };

//   // ✅ New function to handle cart sync when user logs in
//   const syncCartOnLogin = async () => {
//     if (!isAuthenticated || !user || !user.token) return;

//     const localCart = getStoredCart();
//     if (localCart.length === 0) {
//       // No local cart, just load from backend
//       await loadCartFromBackend();
//       return;
//     }

//     setLoading(true);
//     try {
//       console.log('Syncing local cart with backend on login');

//       // First, load backend cart
//       const backendResponse = await fetch(`${API_URL}/cart`, {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       let backendCart: Product[] = [];
//       if (backendResponse.ok) {
//         const backendData = await backendResponse.json();
//         if (backendData.cart && Array.isArray(backendData.cart)) {
//           backendCart = backendData.cart.map(convertBackendItemToProduct);
//         }
//       }

//       // Merge local cart with backend cart
//       const mergedCart = mergeCartItems(localCart, backendCart);

//       // Sync merged cart to backend
//       if (mergedCart.length > 0) {
//         const backendItems = mergedCart.map(convertProductToBackendFormat);

//         const syncResponse = await fetch(`${API_URL}/cart/sync`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ items: backendItems }),
//         });

//         if (syncResponse.ok) {
//           const syncData = await syncResponse.json();
//           if (syncData.cart) {
//             const finalCart = syncData.cart.map(convertBackendItemToProduct);
//             setCart(finalCart);

//             // Clear localStorage after successful sync
//             localStorage.removeItem("cart");

//             toast({
//               title: "Cart Synced",
//               description: `${finalCart.length} items restored to your cart.`,
//             });
//           }
//         }
//       } else {
//         setCart([]);
//       }
//     } catch (error) {
//       console.error("Error syncing cart on login:", error);
//       // Fallback to local cart
//       setCart(localCart);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Helper function to merge cart items (combine quantities for same products)
//   const mergeCartItems = (localCart: Product[], backendCart: Product[]): Product[] => {
//     const mergedMap = new Map<string, Product>();

//     // Add backend items first
//     backendCart.forEach(item => {
//       const key = item._id || item.id.toString();
//       mergedMap.set(key, { ...item });
//     });

//     // Add local items, merging quantities if product already exists
//     localCart.forEach(item => {
//       const key = item._id || item.id.toString();
//       const existing = mergedMap.get(key);

//       if (existing) {
//         // Merge quantities
//         mergedMap.set(key, {
//           ...existing,
//           quantity: (existing.quantity || 1) + (item.quantity || 1)
//         });
//       } else {
//         // Add new item
//         mergedMap.set(key, { ...item });
//       }
//     });

//     return Array.from(mergedMap.values());
//   };

//   // ✅ Always save to localStorage when cart changes (for guest users and as backup)
//   useEffect(() => {
//     if (initialized) {
//       storeCart(cart);
//     }
//   }, [cart, initialized]);

//   const addToCart = async (product: Product) => {
//     if (!product || !product.price || !(product.id || product._id)) {
//       toast({
//         title: "Error",
//         description: "Invalid product data",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       if (isAuthenticated && user && user.token) {
//         // Add to backend
//         const response = await fetch(`${API_URL}/cart/add`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             productId: product._id || product.id,
//             quantity: 1,
//           }),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.cart) {
//           const frontendCart = data.cart.map(convertBackendItemToProduct);
//           setCart(frontendCart);
//         }
//       } else {
//         // Add to localStorage
//         setCart((prevCart) => {
//           const existingIndex = prevCart.findIndex(
//             (p) => p.id === product.id || p._id === product._id
//           );

//           if (existingIndex !== -1) {
//             return prevCart.map((item, index) =>
//               index === existingIndex
//                 ? { ...item, quantity: (item.quantity || 1) + 1 }
//                 : item
//             );
//           } else {
//             return [...prevCart, { ...product, quantity: 1 }];
//           }
//         });
//       }

//       toast({
//         title: "Added to cart",
//         description: `${product.name || product.Product_name} added to cart`,
//       });
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast({
//         title: "Error",
//         description: "Failed to add item to cart",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const removeCart = async (productId: number | string) => {
//     setLoading(true);
//     try {
//       if (isAuthenticated && user && user.token) {
//         // Remove from backend
//         const response = await fetch(`${API_URL}/cart/remove/${productId}`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.cart) {
//           const frontendCart = data.cart.map(convertBackendItemToProduct);
//           setCart(frontendCart);
//         }
//       } else {
//         // Remove from localStorage
//         setCart((prevCart) =>
//           prevCart.filter((p) => p.id !== productId && p._id !== productId)
//         );
//       }

//       toast({
//         title: "Item removed",
//         description: "Item removed from cart",
//       });
//     } catch (error) {
//       console.error("Error removing from cart:", error);
//       toast({
//         title: "Error",
//         description: "Failed to remove item from cart",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearCart = async () => {
//     setLoading(true);
//     try {
//       if (isAuthenticated && user && user.token) {
//         // Clear backend cart
//         const response = await fetch(`${API_URL}/cart/clear`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//       }

//       // Clear local cart
//       setCart([]);
//       localStorage.removeItem("cart");

//       toast({
//         title: "Cart cleared",
//         description: "All items removed from cart",
//       });
//     } catch (error) {
//       console.error("Error clearing cart:", error);
//       toast({
//         title: "Error",
//         description: "Failed to clear cart",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateQuantity = async (
//     productId: number | string,
//     quantity: number
//   ) => {
//     const qty = Math.max(1, Math.floor(quantity));

//     setLoading(true);
//     try {
//       if (isAuthenticated && user && user.token) {
//         // Update in backend
//         const response = await fetch(`${API_URL}/cart/update/${productId}`, {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${user.token}`,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({ quantity: qty }),
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         if (data.cart) {
//           const frontendCart = data.cart.map(convertBackendItemToProduct);
//           setCart(frontendCart);
//         }
//       } else {
//         // Update in localStorage
//         setCart((prevCart) =>
//           prevCart.map((p) =>
//             p.id === productId || p._id === productId
//               ? { ...p, quantity: qty }
//               : p
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error updating quantity:", error);
//       toast({
//         title: "Error",
//         description: "Failed to update quantity",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const syncCart = async () => {
//     if (!isAuthenticated || !user || !user.token || cart.length === 0) {
//       return Promise.resolve();
//     }

//     setLoading(true);
//     try {
//       // Convert localStorage cart to backend format
//       const backendItems = cart.map(convertProductToBackendFormat);

//       const response = await fetch(`${API_URL}/cart/sync`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ items: backendItems }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       if (data.cart) {
//         const frontendCart = data.cart.map(convertBackendItemToProduct);
//         setCart(frontendCart);

//         // Clear localStorage after successful sync
//         localStorage.removeItem("cart");
//       }
//     } catch (error) {
//       console.error("Error syncing cart:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getCartCount = () =>
//     cart.reduce((acc, p) => acc + (p.quantity || 1), 0);

//   const getCartTotal = () =>
//     cart.reduce((acc, p) => acc + extractPrice(p.price) * (p.quantity || 1), 0);

//   const contextValue: CartContextType = {
//     cart,
//     addToCart,
//     removeCart,
//     clearCart,
//     updateQuantity,
//     getCartCount,
//     getCartTotal,
//     loading,
//     syncCart,
//   };

//   return (
//     <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
//   );
// };

// export const useCart = (): CartContextType => {
//   const ctx = useContext(CartContext);
//   if (!ctx) {
//     throw new Error("useCart must be used inside CartProvider");
//   }
//   return ctx;
// };

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";

const API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  isNew: boolean;
  quantity?: number;
  _id?: string;
  Product_name?: string;
  Product_price?: number;
  Product_image?: string[];
}

interface BackendCartItem {
  _id: string;
  productId: {
    _id: string;
    Product_name: string;
    Product_price: number;
    Product_image: string[];
    Product_category: {
      category: string;
    };
    Product_available: boolean;
  };
  quantity: number;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeCart: (productId: number | string) => void;
  clearCart: () => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  loading: boolean;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper functions remain the same
const getStoredCart = (): Product[] => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

const storeCart = (cart: Product[]) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const extractPrice = (price: any): number => {
  if (!price) return 0;
  const priceString = typeof price === "string" ? price : String(price);
  const numeric = parseFloat(priceString.replace(/[^0-9.-]+/g, ""));
  return isNaN(numeric) ? 0 : numeric;
};

const convertBackendItemToProduct = (item: BackendCartItem): Product => {
  return {
    id: item.productId._id
      ? parseInt(item.productId._id, 16) % 1000000
      : Math.random() * 1000000,
    _id: item.productId._id,
    name: item.productId.Product_name,
    Product_name: item.productId.Product_name,
    price: item.productId.Product_price?.toString() || "0",
    Product_price: item.productId.Product_price,
    originalPrice: item.productId.Product_price?.toString() || "0",
    image: item.productId.Product_image?.[0] || "",
    Product_image: item.productId.Product_image,
    isNew: false,
    quantity: item.quantity,
  };
};

const convertProductToBackendFormat = (product: Product) => {
  return {
    id: product._id || product.id.toString(),
    quantity: product.quantity || 1,
    productId: product._id,
  };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [previousAuthState, setPreviousAuthState] = useState<boolean | null>(
    null
  );
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Load cart on component mount and handle authentication changes
  useEffect(() => {
    loadCart();
  }, [user, isAuthenticated]);

  // ✅ Handle logout and login scenarios properly
  useEffect(() => {
    // Skip on first render
    if (previousAuthState === null) {
      setPreviousAuthState(isAuthenticated);
      return;
    }

    // User logged out (was authenticated, now not)
    if (previousAuthState && !isAuthenticated) {
      console.log("User logged out - clearing cart and saving to localStorage");
      setHasLoggedOut(true);

      // Save current cart to localStorage for guest browsing
      if (cart.length > 0) {
        storeCart(cart);
      }
    }
    // User logged in (was not authenticated, now is)
    else if (!previousAuthState && isAuthenticated) {
      console.log("User logged in - syncing with backend");
      setHasLoggedOut(false);
      syncCartOnLogin();
    }

    setPreviousAuthState(isAuthenticated);
  }, [isAuthenticated, previousAuthState]);

  const loadCart = async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user && user.token && !hasLoggedOut) {
        // Load from backend only if not in post-logout state
        await loadCartFromBackend();
      } else {
        // Load from localStorage for guests or after logout
        loadCartFromLocalStorage();
      }
    } catch (error) {
      console.error("Error loading cart:", error);
      loadCartFromLocalStorage();
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  };

  const loadCartFromLocalStorage = () => {
    try {
      const storedCart = getStoredCart();
      const validCart = storedCart.filter(
        (item) => item && item.price && (item.id || item._id) && item.name
      );

      console.log("Loading cart from localStorage:", validCart.length, "items");
      setCart(validCart);
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
      setCart([]);
    }
  };

  const loadCartFromBackend = async () => {
    if (!user || !user.token) return;

    console.log("Loading cart from backend for user:", user.email);

    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.cart && Array.isArray(data.cart)) {
        const frontendCart = data.cart.map(convertBackendItemToProduct);
        console.log("Loaded cart from backend:", frontendCart.length, "items");
        setCart(frontendCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Error loading cart from backend:", error);
      throw error;
    }
  };

  // ✅ Fixed cart sync on login - prevents duplication
  const syncCartOnLogin = async () => {
    if (!isAuthenticated || !user || !user.token) return;

    const localCart = getStoredCart();

    setLoading(true);
    try {
      if (localCart.length === 0) {
        // No local cart, just load from backend
        console.log("No local cart found, loading from backend");
        await loadCartFromBackend();
        return;
      }

      console.log("Syncing local cart with backend on login");

      // ✅ FIXED: Replace backend cart with local cart instead of merging
      // This prevents duplication issues
      const backendItems = localCart.map(convertProductToBackendFormat);

      const syncResponse = await fetch(`${API_URL}/cart/sync`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: backendItems }),
      });

      if (syncResponse.ok) {
        const syncData = await syncResponse.json();
        if (syncData.cart) {
          const finalCart = syncData.cart.map(convertBackendItemToProduct);
          setCart(finalCart);

          // Clear localStorage after successful sync
          localStorage.removeItem("cart");

          console.log(`Cart synced: ${finalCart.length} items`);
        }
      } else {
        // Fallback: use local cart
        console.log("Sync failed, using local cart");
        setCart(localCart);
      }
    } catch (error) {
      console.error("Error syncing cart on login:", error);
      // Fallback to local cart
      setCart(localCart);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save to localStorage only when not authenticated or after logout
  useEffect(() => {
    if (initialized && (!isAuthenticated || hasLoggedOut)) {
      storeCart(cart);
    }
  }, [cart, initialized, isAuthenticated, hasLoggedOut]);

  // Rest of your functions remain the same...
  const addToCart = async (product: Product) => {
    if (!product || !product.price || !(product.id || product._id)) {
      toast({
        title: "Error",
        description: "Invalid product data",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isAuthenticated && user && user.token && !hasLoggedOut) {

          const backendProductId = product._id || product.id;
  
  console.log('🔍 Adding to backend with ID:', backendProductId);
        // Add to backend
        const response = await fetch(`${API_URL}/cart/add`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: backendProductId,
            quantity: product.quantity || 1,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.cart) {
          const frontendCart = data.cart.map(convertBackendItemToProduct);
          setCart(frontendCart);
        }
      } else {
        // Add to localStorage for guests
        setCart((prevCart) => {
          const existingIndex = prevCart.findIndex(
            (p) => p.id === product.id || p._id === product._id
          );

          if (existingIndex !== -1) {
            return prevCart.map((item, index) =>
              index === existingIndex
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            );
          } else {
            return [...prevCart, { ...product, quantity: 1 }];
          }
        });
      }

      toast({
        title: "Added to cart",
        description: `${product.name || product.Product_name} added to cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeCart = async (productId: number | string) => {
  setLoading(true);
  try {
    if (isAuthenticated && user && user.token && !hasLoggedOut) {
      // ✅ FIXED: Use MongoDB _id for backend requests
      const product = cart.find(p => p.id == productId || p._id == productId);
      const backendProductId = product?._id || productId;
      
      console.log('🔍 Removing product - Frontend ID:', productId);
      console.log('🔍 Removing product - Backend ID:', backendProductId);
      
      // ❌ You were still using productId here, should use backendProductId
      const response = await fetch(`${API_URL}/cart/remove/${backendProductId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.cart) {
        const frontendCart = data.cart.map(convertBackendItemToProduct);
        setCart(frontendCart);
      }
    } else {
      // Remove from localStorage
      setCart((prevCart) =>
        prevCart.filter((p) => p.id !== productId && p._id !== productId)
      );
    }

    toast({
      title: "Item removed",
      description: "Item removed from cart",
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    toast({
      title: "Error",
      description: "Failed to remove item from cart",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  const clearCart = async () => {
    setLoading(true);
    try {
      if (isAuthenticated && user && user.token && !hasLoggedOut) {
        // Clear backend cart
        const response = await fetch(`${API_URL}/cart/clear`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Clear local cart
      setCart([]);
      localStorage.removeItem("cart");

      toast({
        title: "Cart cleared",
        description: "All items removed from cart",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (
    productId: number | string,
    quantity: number
  ) => {
  
    const qty = Math.max(1, Math.floor(quantity));

      console.log("🔍 Attempting to update quantity for product:", productId);
    setLoading(true);
    try {
      if (isAuthenticated && user && user.token && !hasLoggedOut) {

         // ✅ FIXED: Find the product and use its MongoDB _id
      const product = cart.find(p => p.id == productId || p._id == productId);
      
      if (!product) {
        console.error('❌ Product not found in cart:', productId);
        throw new Error('Product not found in cart');
      }

      // Use the MongoDB ObjectId (_id) for backend requests
      const backendProductId = product._id;
      
      console.log('🔍 Frontend ID:', productId);
      console.log('🔍 Backend ID (_id):', backendProductId);
      console.log('🔍 Making backend request to:', `${API_URL}/cart/update/${backendProductId}`);

        // Update in backend
        const response = await fetch(`${API_URL}/cart/update/${backendProductId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: qty }),
        });

        console.log('🔍 Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.cart) {
          const frontendCart = data.cart.map(convertBackendItemToProduct);
          setCart(frontendCart);
        }
      } else {
        // Update in localStorage
        setCart((prevCart) =>
          prevCart.map((p) =>
            p.id === productId || p._id === productId
              ? { ...p, quantity: qty }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncCart = async () => {
    return syncCartOnLogin();
  };

  const getCartCount = () =>
    cart.reduce((acc, p) => acc + (p.quantity || 1), 0);
  const getCartTotal = () =>
    cart.reduce((acc, p) => acc + extractPrice(p.price) * (p.quantity || 1), 0);

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeCart,
    clearCart,
    updateQuantity,
    getCartCount,
    getCartTotal,
    loading,
    syncCart,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};
