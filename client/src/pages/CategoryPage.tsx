import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

interface Product {
  _id: string;
  Product_name: string;
  Product_price: number;
  Product_discription: string;
  Product_category: string;
  Product_image: string[];
  Product_rating?: number;
  isNew?: boolean;
}

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `/api/getproductsbycategory?category=${categoryName}`
        );
        setProducts(res.data.product || []);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <div className="pt-24 container mx-auto px-4">
        <h1 className="text-4xl font-heading font-semibold text-primary mb-8 text-center capitalize">
          {categoryName} Collection
        </h1>
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={{
                  id: product._id,
                  name: product.Product_name,
                  price: `₹${product.Product_price}`,
                  image: product.Product_image[0], // assuming it's an array
                  rating: product.Product_rating || 4.5,
                  isNew: product.isNew || false,
                  originalPrice: `₹${Math.round(product.Product_price * 1.2)}`, // dummy discount
                }}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
