// import React, { useEffect, useState } from "react"; 
// import axios from "axios"; 
// import { useNavigate } from "react-router-dom"; 
// import { motion } from "framer-motion"; 
 
// const API_URL = 
//   import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000"; 
 
// const CategoryGrid = () => { 
//   const navigate = useNavigate(); 
//   const [categories, setCategories] = useState<any[]>([]); 
//   const [loading, setLoading] = useState(true); 
//   const [error, setError] = useState<string | null>(null); 
 
//   useEffect(() => { 
//     const fetchCategories = async () => { 
//       try { 
//         const res = await axios.get(`${API_URL}/api/getAllData`, { 
//           withCredentials: true, 
//         }); 
//         setCategories(res.data.data?.categories || []); 
//         setError(null); 
//       } catch (err) { 
//         setError("Failed to load categories."); 
//         setCategories([]); 
//       } finally { 
//         setLoading(false); 
//       } 
//     }; 
 
//     fetchCategories(); 
//   }, []); 
 
//   if (loading) { 
//     return ( 
//       <div className="text-center py-10 text-lg text-gray-600"> 
//         Loading categories... 
//       </div> 
//     ); 
//   } 
 
//   if (error) { 
//     return <div className="text-center py-10 text-red-600">{error}</div>; 
//   } 
 
//   return ( 
//     <section className="py-16 bg-gradient-to-br from-purple-50 to-white mt-6"> 
//       <div className="container mx-auto px-4"> 
//         <div className="text-center mb-10"> 
//           <h2 className="text-4xl font-bold text-gray-900"> 
//             Our <span className="text-purple-600">Collections</span> 
//           </h2> 
//           <p className="text-gray-700 mt-2"> 
//             Scroll to explore a wide range of jewelry by category 
//           </p> 
//         </div> 
 
//         {/* Unified Horizontal Scroll Layout for all screen sizes */}
//         <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           <div className="flex space-x-6 px-2 pb-2" style={{ width: 'max-content' }}>
//             {categories.map((category, index) => ( 
//               <motion.div 
//                 key={category._id} 
//                 className="flex flex-col items-center cursor-pointer group flex-shrink-0" 
//                 onClick={() => navigate(`/category/${category.slug}`)} 
//                 initial={{ opacity: 0, scale: 0.8 }} 
//                 animate={{ opacity: 1, scale: 1 }} 
//                 transition={{ delay: index * 0.05, duration: 0.4 }} 
//               > 
//                 <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg group-hover:shadow-purple-300 transition-all duration-300 relative"> 
//                   <img 
//                     src={category.image || "/fallback.jpg"} 
//                     alt={category.name} 
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
//                     onError={(e) => { 
//                       (e.currentTarget as HTMLImageElement).src = "/fallback.jpg"; 
//                     }} 
//                   /> 
//                   <div className="absolute inset-0 bg-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div> 
//                 </div> 
//                 <h3 className="mt-3 text-base sm:text-lg md:text-xl lg:text-xl font-semibold text-gray-900 group-hover:text-purple-700 capitalize text-center max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]"> 
//                   {category.name} 
//                 </h3> 
//                 <p className="text-sm md:text-base text-gray-600 text-center mt-1 max-w-[130px] sm:max-w-[150px] md:max-w-[170px] lg:max-w-[190px] xl:max-w-[210px] line-clamp-2"> 
//                   {category.description || "Timeless elegance awaits."} 
//                 </p> 
//               </motion.div> 
//             ))} 
//           </div> 
//         </div> 
//       </div> 


//     </section> 
//   ); 
// }; 
 
// export default CategoryGrid;

import React, { useEffect, useState } from "react"; 
import axios from "axios"; 
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
 
const API_URL = 
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000"; 
 
const CategoryGrid = () => { 
  const navigate = useNavigate(); 
  const [categories, setCategories] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
 
  useEffect(() => { 
    const fetchCategories = async () => { 
      try { 
        const res = await axios.get(`${API_URL}/api/getAllData`, { 
          withCredentials: true, 
        }); 
        setCategories(res.data.data?.categories || []); 
        setError(null); 
      } catch (err) { 
        setError("Failed to load categories."); 
        setCategories([]); 
      } finally { 
        setLoading(false); 
      } 
    }; 
 
    fetchCategories(); 
  }, []); 
 
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  // Loading skeleton component
  const CategorySkeleton = () => (
    <div className="flex flex-col items-center space-y-3 flex-shrink-0">
      <Skeleton className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-full" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
 
  if (loading) { 
    return ( 
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20"> 
        <div className="container mx-auto px-4"> 
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6">
              <Sparkles className="w-3 h-3 mr-1" />
              Our Collections
            </Badge>
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          
          <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4">
            <div className="flex space-x-8 px-4" style={{ width: 'max-content' }}>
              {Array.from({ length: 7 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    ); 
  } 
 
  if (error) { 
    return (
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-base">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    );
  } 
 
  return ( 
    <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"> 
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative"> 
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        > 
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            <Sparkles className="w-3 h-3 mr-1" />
            Our Collections
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4"> 
            Discover Your{" "}
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Perfect Style
            </span>
          </h2> 
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"> 
            Explore our curated collection of exquisite jewelry, each piece crafted with passion and precision
          </p> 
        </motion.div> 
 
        <motion.div 
          className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex space-x-6 px-4" style={{ width: 'max-content' }}>
            {categories.map((category, index) => ( 
              <motion.div
                key={category._id} 
                variants={itemVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="flex-shrink-0"
              >
                <Card 
                  className="group cursor-pointer border-0 bg-transparent shadow-none hover:shadow-lg transition-all duration-300"
                  onClick={() => navigate(`/category/${category.slug}`)}
                > 
                  <CardContent className="flex flex-col items-center p-6 space-y-4">
                    <div className="relative">
                      {/* Glow effect */}
                      <div className="absolute inset-0 w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 scale-110" />
                      
                      {/* Image container */}
                      <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-full overflow-hidden border-2 border-border bg-card shadow-md group-hover:shadow-xl group-hover:border-primary/20 transition-all duration-300"> 
                        <img 
                          src={category.image || "/fallback.jpg"} 
                          alt={category.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          onError={(e) => { 
                            (e.currentTarget as HTMLImageElement).src = "/fallback.jpg"; 
                          }} 
                        /> 
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Accent dot */}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 delay-150" />
                    </div>
                    
                    <div className="text-center space-y-2 max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] xl:max-w-[220px]">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground group-hover:text-primary capitalize transition-colors duration-200 leading-tight"> 
                        {category.name} 
                      </h3> 
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 line-clamp-2 transition-colors duration-200 leading-relaxed"> 
                        {category.description || "Timeless elegance awaits"} 
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))} 
          </div> 
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm">
            <span className="text-xs text-muted-foreground mr-2">Scroll to explore</span>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="w-1 h-1 bg-primary rounded-full animate-pulse" 
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </Badge>
        </motion.div>
      </div> 
    </section> 
  ); 
}; 
 
export default CategoryGrid;