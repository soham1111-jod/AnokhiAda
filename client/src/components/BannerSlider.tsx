import React, { useEffect, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import axios, { AxiosResponse, AxiosError } from "axios";

// Environment variable with proper typing
const API_URL: string =
  import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

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
  success?: boolean;
  message?: string;
}

interface BannerSliderProps {
  className?: string;
  headerHeight?: number;
  autoplayDelay?: number;
  showThumbnails?: boolean;
  showPlayPause?: boolean;
}

// Loading skeleton component
const BannerSkeleton: React.FC<{
  className?: string;
  headerHeight: number;
}> = ({ className, headerHeight }) => (
  <motion.div
    className={`w-full max-w-7xl mx-auto px-4 py-8 ${className || ""}`}
    style={{ marginTop: `${headerHeight}px` }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <div className="relative">
      <Skeleton className="w-full h-[300px] md:h-[500px] lg:h-[600px] rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100" />
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-3 h-3 rounded-full bg-white/60" />
        ))}
      </div>
    </div>
  </motion.div>
);

// Error state component
const BannerError: React.FC<{
  className?: string;
  headerHeight: number;
  onRetry?: () => void;
}> = ({ className, headerHeight, onRetry }) => (
  <div
    className={`w-full max-w-7xl mx-auto px-4 py-8 ${className || ""}`}
    style={{ marginTop: `${headerHeight}px` }}
  >
    <Card className="p-8 text-center bg-gradient-to-br from-purple-50/50 to-pink-50/50 border-purple-100">
      <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Unable to load banners
      </h3>
      <p className="text-gray-600 mb-4">
        Please check your connection and try again
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          Try Again
        </Button>
      )}
    </Card>
  </div>
);

const BannerSlider: React.FC<BannerSliderProps> = ({
  className = "",
  headerHeight = 80,
  autoplayDelay = 4000,
  showThumbnails = true,
  showPlayPause = true,
}) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const fetchBanners = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(false);

      const res: AxiosResponse<BannerApiResponse> = await axios.get(
        `${API_URL}/api/getbanners`,
        {
          withCredentials: true,
          timeout: 10000, // 10 second timeout
        }
      );

      if (res.data.success !== false && res.data.banners) {
        setBanners(res.data.banners);
      } else {
        throw new Error(res.data.message || "Failed to fetch banners");
      }
    } catch (err) {
      console.error("Failed to fetch banners:", err);
      setError(true);
      setBanners([]);

      // Log detailed error information
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        console.error("Axios error details:", {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const togglePlayPause = useCallback((): void => {
    if (!swiperInstance) return;

    if (isPlaying) {
      swiperInstance.autoplay.stop();
    } else {
      swiperInstance.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  }, [swiperInstance, isPlaying]);

  const goToSlide = useCallback(
    (index: number): void => {
      if (swiperInstance) {
        swiperInstance.slideTo(index);
      }
    },
    [swiperInstance]
  );

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
      const target = e.currentTarget as HTMLImageElement;
      target.src = "/fallback-banner.jpg";
      target.onerror = null; // Prevent infinite loop
    },
    []
  );

  const handleSwiperInit = useCallback((swiper: SwiperType): void => {
    setSwiperInstance(swiper);
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType): void => {
    setCurrentSlide(swiper.realIndex);
  }, []);

  const handleBannerClick = useCallback((banner: Banner): void => {
    if (banner.BannerLink) {
      window.open(banner.BannerLink, "_blank", "noopener,noreferrer");
    }
  }, []);

  // Loading state
  if (loading) {
    return <BannerSkeleton className={className} headerHeight={headerHeight} />;
  }

  // Error state
  if (error) {
    return (
      <BannerError
        className={className}
        headerHeight={headerHeight}
        onRetry={fetchBanners}
      />
    );
  }

  // No banners state
  if (!banners.length) {
    return null;
  }

  return (
    <motion.section
      className={`w-full max-w-7xl mx-auto px-4 py-8 relative ${className}`}
      style={{ marginTop: `${headerHeight}px` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 rounded-3xl blur-3xl transform scale-110" />

      <div className="relative">
        {/* Header with controls */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Badge
              variant="secondary"
              className="mb-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Featured Collections
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Discover Latest Trends
            </h2>
          </div>

          {/* Slide counter and controls */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium text-purple-600">
                {String(currentSlide + 1).padStart(2, "0")}
              </span>
              <span>/</span>
              <span>{String(banners.length).padStart(2, "0")}</span>
            </div>

            {showPlayPause && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlayPause}
                className="hidden md:flex items-center space-x-2 border-purple-200 hover:bg-purple-50"
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                <span className="text-xs">{isPlaying ? "Pause" : "Play"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Main slider */}
        <Card className="overflow-hidden border-0 shadow-2xl shadow-purple-500/10 bg-gradient-to-br from-white to-purple-50/30">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            loop={banners.length > 1}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            autoplay={{
              delay: autoplayDelay,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-pagination-bullet !bg-white/60 !w-3 !h-3",
              bulletActiveClass:
                "swiper-pagination-bullet-active !bg-white !w-8 !rounded-full",
              renderBullet: (index: number, className: string): string => {
                return `<span class="${className} transition-all duration-300 cursor-pointer hover:!bg-white/80" aria-label="Go to slide ${
                  index + 1
                }"></span>`;
              },
            }}
            navigation={{
              prevEl: ".swiper-button-prev-custom",
              nextEl: ".swiper-button-next-custom",
            }}
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            className="rounded-3xl overflow-hidden group"
          >
            {banners.map((banner, index) => (
              <SwiperSlide key={banner._id} className="relative">
                <div
                  className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden cursor-pointer"
                  onClick={() => handleBannerClick(banner)}
                >
                  {/* Image with overlay */}
                  <img
                    src={banner.BannerUrl}
                    alt={banner.BannerTitle || `Banner ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-105"
                    loading={index === 0 ? "eager" : "lazy"}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBannerClick(banner);
                          }}
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
          {banners.length > 1 && (
            <>
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
            </>
          )}
        </Card>

        {/* Thumbnail navigation */}
        {showThumbnails && banners.length > 1 && (
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
                    ? "border-purple-500 shadow-lg shadow-purple-500/20 scale-105"
                    : "border-purple-200 hover:border-purple-400"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Go to slide ${index + 1}`}
              >
                <img
                  src={banner.BannerUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    currentSlide === index ? "bg-purple-500/20" : "bg-black/40"
                  }`}
                />
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Custom pagination styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .swiper-pagination {
          bottom: 24px !important;
        }
        .swiper-pagination-bullet {
          transition: all 0.3s ease !important;
        }
        .swiper-pagination-bullet:hover {
          transform: scale(1.2) !important;
        }
      `,
        }}
      />
    </motion.section>
  );
};

export default BannerSlider;
