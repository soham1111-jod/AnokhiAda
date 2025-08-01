// import { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "axios";
// import { Star, Heart, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useCart } from "@/components/CartContext";
// import { toast } from "@/hooks/use-toast";

// interface Product {
//   _id: string;
//   Product_name: string;
//   Product_discription: string;
//   Product_price: number;
//   Product_image: string[];
//   Product_category: {
//     category: string;
//     slug: string;
//   };
//   Product_available?: boolean;
// }

// const ProductDetailPage = () => {
//   const { productId } = useParams();
//   const [product, setProduct] = useState<Product | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [loading, setLoading] = useState(true);
//   const { addToCart } = useCart();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`/api/getproductbyid?id=${productId?.trim()}`);
//         setProduct(res.data.product);
//         setSelectedImage(res.data.product.Product_image[0]);
//       } catch (error) {
//         console.error("Failed to load product:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   if (loading) {
//     return <div className="text-center py-10 text-gray-500 text-lg">Loading product...</div>;
//   }

//   if (!product) {
//     return <div className="text-center py-10 text-red-600 text-lg">Product not found.</div>;
//   }

//   return (
//     <section className="py-16 px-4 max-w-6xl mx-auto">
//       {/* Breadcrumb */}
//       <div className="mb-6 text-sm text-gray-500 flex items-center space-x-2">
//         <Link to="/" className="hover:underline text-purple-600 font-medium">Home</Link>
//         <ChevronRight size={16} />
//         <Link to={`/category/${product.Product_category.slug}`} className="hover:underline text-purple-600 font-medium">
//           {product.Product_category.category}
//         </Link>
//         <ChevronRight size={16} />
//         <span className="text-gray-800">{product.Product_name}</span>
//       </div>

//       <div className="grid md:grid-cols-2 gap-12">
//         {/* Images */}
//         <div>
//           <div className="rounded-xl overflow-hidden shadow-md border border-gray-100">
//             <img
//               src={selectedImage || "/fallback.jpg"}
//               alt={product.Product_name}
//               className="w-full h-[400px] object-cover transition-all"
//               onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
//             />
//           </div>

//           <div className="flex gap-4 mt-4 overflow-x-auto">
//             {product.Product_image.map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`Thumbnail ${idx}`}
//                 className={`h-20 w-20 rounded-md object-cover border-2 cursor-pointer transition-all duration-300 ${
//                   selectedImage === img ? "border-purple-600" : "border-transparent"
//                 }`}
//                 onClick={() => setSelectedImage(img)}
//                 onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-6">
//           <div className="flex justify-between items-start">
//             <h1 className="text-3xl font-bold text-gray-900">{product.Product_name}</h1>
//             <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-100 rounded-full">
//               <Heart />
//             </Button>
//           </div>

//           <div className="flex items-center space-x-4">
//             <div className="flex items-center text-amber-500 font-semibold text-sm bg-amber-50 px-2 py-1 rounded">
//               <Star size={16} className="fill-amber-400 stroke-none mr-1" />
//               4.8
//             </div>
//             {product.Product_available ? (
//               <span className="text-green-600 text-sm font-medium">In Stock</span>
//             ) : (
//               <span className="text-red-600 text-sm font-medium">Out of Stock</span>
//             )}
//           </div>

//           <div className="text-2xl font-semibold text-purple-600">
//             ₹{product.Product_price}
//           </div>

//           <p className="text-gray-700 whitespace-pre-line leading-relaxed">
//             {product.Product_discription}
//           </p>

//           <div className="flex items-center space-x-4">
//             <label htmlFor="quantity" className="text-gray-700 font-medium">
//               Quantity:
//             </label>
//             <input
//               type="number"
//               id="quantity"
//               min={1}
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <Button
//             className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
//             onClick={() => {
//               for (let i = 0; i < quantity; i++) {
//                 addToCart(product);
//               }
//               toast({ title: "Added to cart", duration: 3000 });
//             }}
//           >
//             Add to Cart
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductDetailPage;


import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Star,
  Heart,
  ChevronRight,
  X,
  Truck,
  Shield,
  RotateCcw,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/CartContext";
import { toast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  Product_name: string;
  Product_discription: string;
  Product_price: number;
  Product_image: string[];
  Product_category: {
    category: string;
    slug: string;
  };
  Product_available?: boolean;
}

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [showImageModal, setShowImageModal] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/getproductbyid?id=${productId?.trim()}`);
        setProduct(res.data.product);
        setSelectedImage(res.data.product.Product_image[0]);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const originalPrice = product ? Math.round(product.Product_price * 1.3) : 0;
  const discount = product
    ? Math.round(((originalPrice - product.Product_price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast({ title: "Added to cart", duration: 3000 });
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500 text-lg animate-pulse">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-red-600 text-lg">
        Product not found.
      </div>
    );
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      {/* Image Zoom Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={30} />
            </button>
            <img
              src={selectedImage!}
              alt="Zoomed"
              className="max-w-full max-h-[80vh] object-contain rounded"
            />
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="mb-6 text-sm text-gray-500 flex items-center space-x-2">
        <Link to="/" className="hover:underline text-purple-600 font-medium">Home</Link>
        <ChevronRight size={16} />
        <Link
          to={`/category/${product.Product_category.slug}`}
          className="hover:underline text-purple-600 font-medium"
        >
          {product.Product_category.category}
        </Link>
        <ChevronRight size={16} />
        <span className="text-gray-800">{product.Product_name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="relative group rounded-xl overflow-hidden shadow-md border border-gray-100">
            <img
              src={selectedImage || "/fallback.jpg"}
              alt={product.Product_name}
              onClick={() => setShowImageModal(true)}
              className="w-full h-[400px] object-cover cursor-zoom-in"
              onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-3 rounded-full">
                <ZoomIn size={22} />
              </div>
            </div>
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full font-semibold">
                {discount}% OFF
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-4 overflow-x-auto scrollbar-hide">
            {product.Product_image.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={`h-20 w-20 object-cover rounded-md border-2 cursor-pointer ${
                  selectedImage === img
                    ? "border-purple-600 ring-2 ring-purple-200 scale-105"
                    : "border-gray-200 hover:border-purple-400"
                } transition-all`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <h1 className="text-3xl font-bold text-gray-900">{product.Product_name}</h1>
            <Button variant="ghost" size="icon" className="text-rose-500 hover:bg-rose-100 rounded-full">
              <Heart />
            </Button>
          </div>

          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center bg-amber-50 px-2 py-1 rounded">
              <Star size={16} className="fill-amber-400 stroke-none mr-1" />
              4.8
            </div>
            <span
              className={`font-medium ${
                product.Product_available ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.Product_available ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-4 text-2xl font-bold text-purple-600">
            ₹{product.Product_price}
            {discount > 0 && (
              <>
                <span className="text-gray-400 line-through text-lg">
                  ₹{originalPrice}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 text-sm rounded">
                  Save ₹{originalPrice - product.Product_price}
                </span>
              </>
            )}
          </div>

          <p className="text-gray-700 whitespace-pre-line leading-relaxed">
            {product.Product_discription}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >-</button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
              >+</button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 px-6 rounded-lg transition-all mt-4"
            onClick={handleAddToCart}
            disabled={!product.Product_available}
          >
            {product.Product_available ? "Add to Cart" : "Out of Stock"}
          </Button>

          {/* Product Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { title: "Free Delivery", icon: <Truck size={20} />, desc: "On orders above ₹500" },
              { title: "Warranty", icon: <Shield size={20} />, desc: "1 year manufacturer warranty" },
              { title: "Easy Returns", icon: <RotateCcw size={20} />, desc: "7-day return policy" },
            ].map(({ title, icon, desc }, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-md">
                <div className="text-purple-600">{icon}</div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t pt-8">
        <div className="flex space-x-6 border-b mb-6">
          {["description", "reviews", "specs"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 font-medium text-sm ${
                activeTab === tab
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {product.Product_discription}
          </div>
        )}
        {activeTab === "specs" && (
          <ul className="text-gray-700 space-y-2">
            <li><b>Product ID:</b> {product._id}</li>
            <li><b>Category:</b> {product.Product_category.category}</li>
            <li><b>Price:</b> ₹{product.Product_price}</li>
            <li><b>Availability:</b> {product.Product_available ? "In Stock" : "Out of Stock"}</li>
          </ul>
        )}
        {activeTab === "reviews" && (
          <div className="text-gray-500 italic">Reviews coming soon...</div>
        )}
      </div>
    </section>
  );
};

export default ProductDetailPage;

