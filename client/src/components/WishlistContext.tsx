import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Updated interface to match your API product structure
interface Product {
  _id: string;  // Changed from 'id: number' to '_id: string'
  Product_name: string;
  Product_price: number;
  Product_image: string[];
  Product_rating?: number;
  isNew?: boolean;
  category?: string;
  description?: string;
}

// Legacy product interface for backward compatibility (WishlistPage)
interface LegacyProduct {
  id: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  rating: number;
  isNew: boolean;
}

interface WishlistContextType {
  wishlist: Product[];
  legacyWishlist: LegacyProduct[];  // For backward compatibility
  toggleWishlist: (product: Product | LegacyProduct) => void;
  isInWishlist: (productId: string | number) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [legacyWishlist, setLegacyWishlist] = useState<LegacyProduct[]>([]);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('wishlist');
      const savedLegacyWishlist = localStorage.getItem('legacyWishlist');
      
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
      if (savedLegacyWishlist) {
        setLegacyWishlist(JSON.parse(savedLegacyWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('legacyWishlist', JSON.stringify(legacyWishlist));
    } catch (error) {
      console.error('Error saving legacy wishlist to localStorage:', error);
    }
  }, [legacyWishlist]);

  // Helper function to check if product is new API format
  const isNewProduct = (product: Product | LegacyProduct): product is Product => {
    return '_id' in product;
  };

  const toggleWishlist = (product: Product | LegacyProduct) => {
    if (isNewProduct(product)) {
      // Handle new API format
      setWishlist((prevWishlist) => {
        const exists = prevWishlist.find((item) => item._id === product._id);
        if (exists) {
          return prevWishlist.filter((item) => item._id !== product._id);
        } else {
          return [...prevWishlist, product];
        }
      });
    } else {
      // Handle legacy format
      setLegacyWishlist((prevWishlist) => {
        const exists = prevWishlist.find((item) => item.id === product.id);
        if (exists) {
          return prevWishlist.filter((item) => item.id !== product.id);
        } else {
          return [...prevWishlist, product];
        }
      });
    }
  };

  const isInWishlist = (productId: string | number): boolean => {
    if (typeof productId === 'string') {
      // Check new API format
      return wishlist.some((item) => item._id === productId);
    } else {
      // Check legacy format
      return legacyWishlist.some((item) => item.id === productId);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    setLegacyWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      legacyWishlist,
      toggleWishlist, 
      isInWishlist, 
      clearWishlist 
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};