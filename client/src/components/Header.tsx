import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const searchPanelRef = useRef(null);
  const profileMenuRef = useRef(null);
  const lastScrollY = useRef(0);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cart, clearCart } = useCart();
  const { clearWishlist } = useWishlist();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 60) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);

    // Click outside handler
    const handleClickOutside = (event) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isSearchOpen || isProfileMenuOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, isProfileMenuOpen, isMobileMenuOpen]);

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/category" },
    { name: "Collections", path: "/category" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const handleLogout = () => {
    logout();
    clearCart();
    clearWishlist();
    toast({
      title: "Logged out successfully",
      description: "Come back soon!",
      variant: "default"
    });
    navigate("/");
    setIsProfileMenuOpen(false);
  };

  const isAuthenticated = !!user;
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-purple-50/95 border-b border-purple-100 shadow-sm transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate("/")}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                <span className="text-purple-600">Anokhi</span> <span className="text-gray-600">अदा</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-8">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                    }}
                    className="text-base font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-300 relative py-1 group"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
            </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-3 md:gap-4">
                {user?.role === "admin" && (
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                    onClick={() => navigate("/admin")}
                  >
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent text-gray-800 hover:text-purple-600"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-transparent text-gray-800 hover:text-purple-600 relative"
                  onClick={() => navigate("/wishlist")}
                >
                  <Heart size={20} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent text-gray-800 hover:text-purple-600 relative"
                  onClick={() => navigate("/cart")}
                >
                  <ShoppingCart size={20} />
                  {totalQuantity > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </Button>
              
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center">
                {!isAuthenticated ? (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-gray-800 hover:text-purple-600"
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="relative" ref={profileMenuRef}>
<Button
  variant="ghost"
  size="icon"   
  className="hover:bg-transparent"
  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
  title={user.firstName || user.email}
>
  <User size={20} className="text-gray-800" />
</Button>
                    
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white border border-purple-100 rounded-lg shadow-xl z-50 overflow-hidden"
                        >
<div className="px-4 py-3 border-b border-purple-100">
  <p className="text-sm font-medium text-gray-900">{user.firstName || user.email}</p>
  <p className="text-xs text-gray-500">{user.firstName || user.email}</p>
</div>
                          <button
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              navigate("/profile");
                            }}
                          >
                            My Profile
                          </button>
                          <button
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50"
                            onClick={() => {
                              setIsProfileMenuOpen(false);
                              navigate("/orders");
                            }}
                          >
                            My Orders
                          </button>
                          {user.isAdmin && (
                            <button
                              className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 border-t border-purple-100"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                navigate("/admin");
                              }}
                            >
                              Admin
                            </button>
                          )}
                          <button
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 border-t border-purple-100"
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-800 hover:bg-transparent"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 inset-x-0 bg-white z-40 lg:hidden shadow-lg border-b border-purple-100"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.path}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className="py-3 px-4 text-gray-800 hover:bg-purple-50 rounded-lg font-medium"
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-purple-100 mt-2">
                  {!isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        className="w-full py-3 border-purple-300 text-gray-800"
                        onClick={() => {
                          navigate("/login");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="default"
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-800"
                        onClick={() => {
                          navigate("/signup");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Create Account
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{user.firstName || user.email}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        className="w-full text-left py-3 px-4 text-gray-800 hover:bg-purple-50 rounded-lg"
                        onClick={() => {
                          navigate("/profile");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        My Profile
                      </button>
                      <button
                        className="w-full text-left py-3 px-4 text-gray-800 hover:bg-purple-50 rounded-lg"
                        onClick={() => {
                          navigate("/orders");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        My Orders
                      </button>
                      <button
                        className="w-full text-left py-3 px-4 text-gray-800 hover:bg-purple-50 rounded-lg text-red-600"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Panel */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 bg-white z-40 shadow-lg border-b border-purple-100"
            ref={searchPanelRef}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for jewelry, collections, or categories..."
                  className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;