import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ScrollingWords from "@/components/ScrollingWords";
import FeaturedProducts from "@/components/FeaturedProducts";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import BannerSlider from "@/components/BannerSlider";
import CategoryGrid from "@/components/CategoryGrid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Header />
      <div className="gradient-hero"> {/* Removed top padding to fix gap between navbar and main content */}
        {/* BannerSlider removed as per user request */}
        {/* <HeroSection /> */}
        {/* <ScrollingWords /> */}
        {/* CategoryGrid removed as per user request */}
        <BannerSlider/>
        <CategoryGrid />
        <FeaturedProducts />
        <AboutSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
