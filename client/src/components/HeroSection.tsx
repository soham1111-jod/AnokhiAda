import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();
  
  // Mock hero image URL
  const heroImage = "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="relative pt-24 md:pt-15 min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-50 to-white">
       <div className="container mx-auto px-4 z-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your<br />
              <span className="text-purple-600">Unique</span>{" "}
              <span className="text-gray-800">Anokhi अदा</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-lg mx-auto lg:mx-0">
              Elegant jewelry for every mood & moment. Handcrafted with love, designed for your unique style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="rounded-full px-8 py-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-lg font-semibold shadow-lg"
                  onClick={() => navigate("/category")}
                >
                  Explore Collection
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="rounded-full px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg font-semibold"
                >
                  Custom Designs
                </Button>
              </motion.div>
            </div>
            
            {/* Brand Promises */}
            <div className="mt-12 flex flex-wrap justify-center lg:justify-start gap-4">
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-purple-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <div className="font-medium">100% Handcrafted</div>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-amber-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="font-medium">Premium Materials</div>
              </div>
              <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full border border-pink-200 shadow-sm">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <div className="font-medium">Ethically Sourced</div>
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div 
            className="relative flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative w-full max-w-lg">
              {/* Image container */}
              <div className="relative overflow-hidden rounded-3xl border-8 border-white shadow-xl">
                <img
                  src={heroImage}
                  alt="Elegant jewelry collection"
                  className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              {/* Floating badge */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-full shadow-lg font-bold z-10 text-sm"
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                New Collection
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-purple-200/30 blur-3xl"></div>
      <div className="absolute bottom-40 right-10 w-36 h-36 rounded-full bg-pink-200/30 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;