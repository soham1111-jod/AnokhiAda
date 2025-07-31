import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getproducts?limit=8`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error loading featured products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  const calculateDiscount = (price: number, originalPrice: number) => {
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return discount;
  };

  if (loading) {
    return <p className="text-center py-20 text-gray-600">Loading products...</p>;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our latest collection of handcrafted jewelry pieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <img
                  src={product.Product_image[0]}
                  alt={product.Product_name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {product.isNew && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                    New
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-3 right-3 rounded-full z-10 transition-all ${
                    isInWishlist(product._id)
                      ? "text-rose-500 hover:bg-rose-50/80"
                      : "text-gray-400 hover:bg-white/80"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (user) {
                      toggleWishlist(product);
                      toast({ title: "Added to wishlist", duration: 2000 });
                    } else navigate("/login");
                  }}
                >
                  <Heart
                    size={20}
                    fill={isInWishlist(product._id) ? "currentColor" : "none"}
                  />
                </Button>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <div className="mb-3 flex justify-between items-start">
                  <h3
                    className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    {product.Product_name}
                  </h3>
                  <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded">
                    <Star size={16} className="fill-amber-400 stroke-none" />
                    <span className="text-sm font-semibold ml-1">
                      {product.Product_rating || 4.5}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{product.Product_price}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{Math.round(product.Product_price * 1.2)}
                    </span>
                    <span className="ml-auto text-sm font-semibold text-rose-500">
                      {calculateDiscount(
                        product.Product_price,
                        Math.round(product.Product_price * 1.2)
                      )}
                      % off
                    </span>
                  </div>

                  <Button
                    className="w-full rounded-lg py-5 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-[1.02] shadow-md"
                    onClick={() => {
                      if (user) {
                        addToCart(product);
                        toast({ title: "Added to cart", duration: 3000 });
                      } else navigate("/login");
                    }}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 py-5 border-2 border-gray-900 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors"
            onClick={() => navigate("/products")}
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
