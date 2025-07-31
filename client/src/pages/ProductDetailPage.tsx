import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthContext";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getproductbyid?id=${productId}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast({ title: "Failed to load product", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return <p className="text-center py-16 text-gray-500">Loading product...</p>;
  }

  if (!product) {
    return <p className="text-center py-16 text-red-500">Product not found.</p>;
  }

  return (
    <motion.div
      className="min-h-screen bg-white py-16 px-4 md:px-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-2xl border">
          <img
            src={product.Product_image[0]}
            alt={product.Product_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {product.Product_name}
          </h1>
          <p className="text-gray-700 mb-4 leading-relaxed">
            {product.Product_discription}
          </p>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.Product_price}
            </span>
            <span className="line-through text-gray-400 text-lg">
              ₹{Math.round(product.Product_price * 1.2)}
            </span>
            <span className="text-rose-500 font-semibold">
              {Math.round(100 - (product.Product_price / (product.Product_price * 1.2)) * 100)}% OFF
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Star className="fill-amber-400 text-amber-500" size={18} />
            <span className="text-sm text-gray-600">
              {product.Product_rating || 4.5} / 5
            </span>
          </div>

          <div className="flex gap-4">
            <Button
              className="rounded-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] transition-all shadow-md"
              onClick={() => {
                if (user) {
                  addToCart(product);
                  toast({ title: "Added to cart", duration: 2000 });
                } else {
                  toast({ title: "Please login to add to cart", variant: "destructive" });
                }
              }}
            >
              <ShoppingCart className="mr-2" size={18} />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              className={`rounded-full px-6 py-4 border-2 ${
                isInWishlist(product._id)
                  ? "border-rose-500 text-rose-500"
                  : "border-gray-300 text-gray-600"
              } hover:bg-rose-50/30`}
              onClick={() => {
                if (user) {
                  toggleWishlist(product);
                  toast({ title: "Wishlist updated", duration: 2000 });
                } else {
                  toast({ title: "Please login to add to wishlist", variant: "destructive" });
                }
              }}
            >
              <Heart className="mr-2" size={18} />
              {isInWishlist(product._id) ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;
