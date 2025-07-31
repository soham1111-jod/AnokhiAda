

// import React, { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
// import { motion, AnimatePresence } from "framer-motion";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// interface Banner {
//   _id: string;
//   BannerUrl: string;
//   BannerTitle?: string;
//   BannerDescription?: string;
//   BannerLink?: string;
// }

// const BannerSlider = () => {
//   const [banners, setBanners] = useState<Banner[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [swiperInstance, setSwiperInstance] = useState<any>(null);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/api/getbanners`, { 
//           withCredentials: true 
//         });
//         setBanners(res.data.banners || []);
//         setError(false);
//       } catch (err) {
//         setError(true);
//         setBanners([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBanners();
//   }, []);

//   const togglePlayPause = () => {
//     if (!swiperInstance) return;
    
//     if (isPlaying) {
//       swiperInstance.autoplay.stop();
//     } else {
//       swiperInstance.autoplay.start();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const goToSlide = (index: number) => {
//     if (swiperInstance) {
//       swiperInstance.slideTo(index);
//     }
//   };

//   // Loading skeleton
//   if (loading) {
//     return (
//       <motion.div 
//         className="w-full max-w-7xl mx-auto px-4 py-8"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//       >
//         <div className="relative">
//           <Skeleton className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-3xl" />
//           <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
//             {[1, 2, 3].map((i) => (
//               <Skeleton key={i} className="w-3 h-3 rounded-full" />
//             ))}
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   // Don't render if no banners or error
//   if (!banners.length || error) return null;

//   return (
//     <motion.section 
//       className="w-full max-w-7xl mx-auto px-4 py-8 relative"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       {/* Background decoration */}
//       <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-3xl transform scale-110" />
      
//       <div className="relative">
//         {/* Header with controls */}
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <Badge variant="secondary" className="mb-2">
//               Featured Collections
//             </Badge>
//             <h2 className="text-2xl md:text-3xl font-bold text-foreground">
//               Discover Latest Trends
//             </h2>
//           </div>
          
//           {/* Slide counter and controls */}
//           <div className="flex items-center space-x-4">
//             <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
//               <span className="font-medium text-foreground">
//                 {String(currentSlide + 1).padStart(2, '0')}
//               </span>
//               <span>/</span>
//               <span>{String(banners.length).padStart(2, '0')}</span>
//             </div>
            
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={togglePlayPause}
//               className="hidden md:flex items-center space-x-2"
//             >
//               {isPlaying ? (
//                 <Pause className="w-4 h-4" />
//               ) : (
//                 <Play className="w-4 h-4" />
//               )}
//               <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
//             </Button>
//           </div>
//         </div>

//         {/* Main slider */}
//         <Card className="overflow-hidden border-0 shadow-2xl shadow-primary/10">
//           <Swiper
//             modules={[Autoplay, Pagination, EffectFade, Navigation]}
//             spaceBetween={0}
//             slidesPerView={1}
//             loop={true}
//             effect="fade"
//             fadeEffect={{ crossFade: true }}
//             autoplay={{ 
//               delay: 4000, 
//               disableOnInteraction: false,
//               pauseOnMouseEnter: true 
//             }}
//             pagination={{ 
//               clickable: true,
//               bulletClass: 'swiper-pagination-bullet !bg-white/60 !w-3 !h-3',
//               bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-8 !rounded-full',
//               renderBullet: (index, className) => {
//                 return `<span class="${className} transition-all duration-300 cursor-pointer hover:!bg-white/80"></span>`;
//               }
//             }}
//             navigation={{
//               prevEl: '.swiper-button-prev-custom',
//               nextEl: '.swiper-button-next-custom',
//             }}
//             onSwiper={setSwiperInstance}
//             onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
//             className="rounded-3xl overflow-hidden group"
//           >
//             {banners.map((banner, index) => (
//               <SwiperSlide key={banner._id} className="relative">
//                 <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden">
//                   {/* Image with overlay */}
//                   <img
//                     src={banner.BannerUrl}
//                     alt={banner.BannerTitle || `Banner ${index + 1}`}
//                     className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-105"
//                     loading="lazy"
//                     onError={(e) => {
//                       (e.currentTarget as HTMLImageElement).src = '/fallback-banner.jpg';
//                     }}
//                   />
                  
//                   {/* Gradient overlay */}
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
//                   <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                  
//                   {/* Content overlay */}
//                   {(banner.BannerTitle || banner.BannerDescription) && (
//                     <motion.div 
//                       className="absolute bottom-8 left-8 right-8 text-white z-10"
//                       initial={{ opacity: 0, y: 30 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: 0.3, duration: 0.6 }}
//                     >
//                       {banner.BannerTitle && (
//                         <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
//                           {banner.BannerTitle}
//                         </h3>
//                       )}
//                       {banner.BannerDescription && (
//                         <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
//                           {banner.BannerDescription}
//                         </p>
//                       )}
//                       {banner.BannerLink && (
//                         <Button 
//                           variant="secondary" 
//                           size="lg"
//                           className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300"
//                         >
//                           Explore Collection
//                         </Button>
//                       )}
//                     </motion.div>
//                   )}
                  
//                   {/* Shimmer effect */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
          
//           {/* Custom navigation buttons */}
//           <Button
//             variant="secondary"
//             size="icon"
//             className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </Button>
          
//           <Button
//             variant="secondary"
//             size="icon"
//             className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </Button>
//         </Card>

//         {/* Thumbnail navigation */}
//         {banners.length > 1 && (
//           <motion.div 
//             className="flex justify-center mt-6 space-x-3 overflow-x-auto pb-2"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.8 }}
//           >
//             {banners.map((banner, index) => (
//               <motion.button
//                 key={banner._id}
//                 onClick={() => goToSlide(index)}
//                 className={`relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
//                   currentSlide === index 
//                     ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
//                     : 'border-border hover:border-primary/50'
//                 }`}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 <img
//                   src={banner.BannerUrl}
//                   alt={`Thumbnail ${index + 1}`}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className={`absolute inset-0 transition-opacity duration-300 ${
//                   currentSlide === index ? 'bg-primary/20' : 'bg-black/40'
//                 }`} />
//               </motion.button>
//             ))}
//           </motion.div>
//         )}
//       </div>
      
//       {/* Custom pagination styles */}
//       <style jsx global>{`
//         .swiper-pagination {
//           bottom: 24px !important;
//         }
//         .swiper-pagination-bullet {
//           transition: all 0.3s ease !important;
//         }
//         .swiper-pagination-bullet:hover {
//           transform: scale(1.2) !important;
//         }
//       `}</style>
//     </motion.section>
//   );
// };

// export default BannerSlider;

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import axios, { AxiosResponse } from "axios";

// Environment variable with proper typing
const API_URL: string = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// Interface definitions
interface Banner {
  _id: string;
  BannerUrl: string;
  BannerTitle?: string;
  BannerDescription?: string;
  BannerLink?: string;
}

interface BannerApiResponse {
  banners: Banner[];
}

interface BannerSliderProps {
  className?: string;
  headerHeight?: number; // Allow custom header height
}

const BannerSlider: React.FC<BannerSliderProps> = ({ 
  className = "", 
  headerHeight = 80 // Default header height
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);

  useEffect(() => {
    const fetchBanners = async (): Promise<void> => {
      try {
        const res: AxiosResponse<BannerApiResponse> = await axios.get(
          `${API_URL}/api/getbanners`, 
          { withCredentials: true }
        );
        setBanners(res.data.banners || []);
        setError(false);
      } catch (err) {
        console.error("Failed to fetch banners:", err);
        setError(true);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBanners();
  }, []);

  const togglePlayPause = (): void => {
    if (!swiperInstance) return;
    
    if (isPlaying) {
      swiperInstance.autoplay.stop();
    } else {
      swiperInstance.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number): void => {
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.currentTarget as HTMLImageElement;
    target.src = '/fallback-banner.jpg';
  };

  // Loading skeleton
  if (loading) {
    return (
      <motion.div 
        className={`w-full max-w-7xl mx-auto px-4 py-8 ${className}`}
        style={{ marginTop: `${headerHeight}px` }} // Add spacing for header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative">
          <Skeleton className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-3xl" />
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-full" />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Don't render if no banners or error
  if (!banners.length || error) {
    if (error) {
      return (
        <div 
          className={`w-full max-w-7xl mx-auto px-4 py-8 ${className}`}
          style={{ marginTop: `${headerHeight}px` }}
        >
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Failed to load banners. Please try again later.</p>
          </Card>
        </div>
      );
    }
    return null;
  }

  return (
    <motion.section 
      className={`w-full max-w-7xl mx-auto px-4 py-8 relative ${className}`}
      style={{ marginTop: `${headerHeight}px` }} // Prevent header overlap
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl blur-3xl transform scale-110" />
      
      <div className="relative">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              Featured Collections
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Discover Latest Trends
            </h2>
          </div>
          
          {/* Slide counter and controls */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {String(currentSlide + 1).padStart(2, '0')}
              </span>
              <span>/</span>
              <span>{String(banners.length).padStart(2, '0')}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              className="hidden md:flex items-center space-x-2"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span className="text-xs">{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
          </div>
        </div>

        {/* Main slider */}
        <Card className="overflow-hidden border-0 shadow-2xl shadow-primary/10">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{ 
              delay: 4000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true 
            }}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-white/60 !w-3 !h-3',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !w-8 !rounded-full',
              renderBullet: (index: number, className: string): string => {
                return `<span class="${className} transition-all duration-300 cursor-pointer hover:!bg-white/80" aria-label="Go to slide ${index + 1}"></span>`;
              }
            }}
            navigation={{
              prevEl: '.swiper-button-prev-custom',
              nextEl: '.swiper-button-next-custom',
            }}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            className="rounded-3xl overflow-hidden group"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={banner._id} className="relative">
                <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden">
                  {/* Image with overlay */}
                  <img
                    src={banner.BannerUrl}
                    alt={banner.BannerTitle || `Banner ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-105"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
                  
                  {/* Content overlay */}
                  {(banner.BannerTitle || banner.BannerDescription) && (
                    <motion.div 
                      className="absolute bottom-8 left-8 right-8 text-white z-10"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {banner.BannerTitle && (
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                          {banner.BannerTitle}
                        </h3>
                      )}
                      {banner.BannerDescription && (
                        <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
                          {banner.BannerDescription}
                        </p>
                      )}
                      {banner.BannerLink && (
                        <Button 
                          variant="secondary" 
                          size="lg"
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300"
                          onClick={() => window.open(banner.BannerLink, '_blank')}
                        >
                          Explore Collection
                        </Button>
                      )}
                    </motion.div>
                  )}
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom navigation buttons */}
          <Button
            variant="secondary"
            size="icon"
            className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            variant="secondary"
            size="icon"
            className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </Card>

        {/* Thumbnail navigation */}
        {banners.length > 1 && (
          <motion.div 
            className="flex justify-center mt-6 space-x-3 overflow-x-auto pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {banners.map((banner, index) => (
              <motion.button
                key={banner._id}
                onClick={() => goToSlide(index)}
                className={`relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  currentSlide === index 
                    ? 'border-primary shadow-lg shadow-primary/20 scale-105' 
                    : 'border-border hover:border-primary/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to slide ${index + 1}`}
              >
                <img
                  src={banner.BannerUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 transition-opacity duration-300 ${
                  currentSlide === index ? 'bg-primary/20' : 'bg-black/40'
                }`} />
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
      
      {/* Custom pagination styles */}
      <style jsx global>{`
        .swiper-pagination {
          bottom: 24px !important;
        }
        .swiper-pagination-bullet {
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet:hover {
          transform: scale(1.2) !important;
        }
      `}</style>
    </motion.section>
  );
};

export default BannerSlider;