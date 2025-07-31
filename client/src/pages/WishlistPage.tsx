import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const WishlistPage = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Function to calculate discount percentage
  const calculateDiscount = (priceStr: string, originalPriceStr: string) => {
    const price = parseInt(priceStr.replace(/[^\d]/g, ""));
    const originalPrice = parseInt(originalPriceStr.replace(/[^\d]/g, ""));
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return discount;
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gradient-hero text-center px-6">
        <h2 className="text-4xl font-heading font-semibold mb-6">Your Wishlist is Empty</h2>
        <p className="text-lg text-muted-foreground mb-8">Browse products and add your favorites to the wishlist.</p>
        <Button onClick={() => navigate("/")} size="lg" className="rounded-full px-12 py-3">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Your Wishlist</h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              clearWishlist();
              toast({ title: "Cleared all wishlist items", duration: 2000 });
            }}
          >
            Clear All Wishlist
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute top-3 right-3 rounded-full z-10 transition-all text-rose-500 hover:bg-rose-50/80`}
                  onClick={() => {
                    toggleWishlist(product);
                    toast({ title: "Removed from wishlist", duration: 2000 });
                  }}
                  aria-label="Remove from wishlist"
                >
                  <Heart size={20} fill="currentColor" />
                </Button>
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <div className="mb-3 flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">{product.name}</h3>
                  <div className="flex items-center bg-amber-50 text-amber-700 px-2 py-1 rounded">
                    <Star size={16} className="fill-amber-400 stroke-none" />
                    <span className="text-sm font-semibold ml-1">{product.rating}</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-xl font-bold text-gray-900">{product.price}</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    <span className="ml-auto text-sm font-semibold text-rose-500">
                      {calculateDiscount(product.price, product.originalPrice)}% off
                    </span>
                  </div>

                  <Button
                    className="w-full rounded-lg py-5 font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all hover:scale-[1.02] shadow-md"
                    onClick={() => {
                      addToCart(product);
                      toast({ title: "Added to cart", duration: 2000 });
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
      </div>
    </section>
  );
};

export default WishlistPage;
