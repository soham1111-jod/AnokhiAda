// import Header from "@/components/Header";
// import { useAuth } from "@/components/AuthContext";
// import { format, isValid } from "date-fns";
// import { User, Mail, Shield, Calendar } from "lucide-react";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

// interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   createdAt?: string;
// }

// const Profile = () => {
//   const { user }: { user: User | null } = useAuth();

//   // Safe date formatting function
//   const formatDate = (dateString: string | undefined, formatString: string): string => {
//     if (!dateString) return 'N/A';
    
//     try {
//       const date = new Date(dateString);
//       if (!isValid(date)) return 'N/A';
//       return format(date, formatString);
//     } catch (error) {
//       console.error('Date formatting error:', error);
//       return 'N/A';
//     }
//   };

//   // Safe function to get user initials
//   const getUserInitials = (firstName?: string, lastName?: string): string => {
//     const first = firstName?.trim() || '';
//     const last = lastName?.trim() || '';
    
//     if (first && last) {
//       return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
//     } else if (first) {
//       return first.charAt(0).toUpperCase();
//     } else if (last) {
//       return last.charAt(0).toUpperCase();
//     } else {
//       return 'U'; // Default to 'U' for User
//     }
//   };

//   // Safe function to get display name
//   const getDisplayName = (firstName?: string, lastName?: string): string => {
//     const first = firstName?.trim() || '';
//     const last = lastName?.trim() || '';
    
//     if (first && last) {
//       return `${first} ${last}`;
//     } else if (first) {
//       return first;
//     } else if (last) {
//       return last;
//     } else {
//       return 'User'; // Default fallback
//     }
//   };

//   if (!user) {
//     return (
//       <>
//         <Header />
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white">
//           <div className="text-center max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50">
//             <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <User className="w-8 h-8 text-purple-600" />
//             </div>
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
//               Please Login
//             </h1>
//             <p className="text-gray-600 mb-8 leading-relaxed">
//               You need to be logged in to view your profile information.
//             </p>
//             <button 
//               onClick={() => window.location.href = '/login'}
//               className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//             >
//               Go to Login
//               <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Header />
//       {/* ✅ Updated: Added more top margin for laptop view */}
//       <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-16 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32">
//         {/* Enhanced Background Decorations */}
//         <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />
//         <div className="fixed bottom-40 right-10 w-48 h-48 rounded-full bg-pink-200/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
//         <div className="fixed top-1/2 right-1/4 w-24 h-24 rounded-full bg-purple-300/15 blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        
//         <div className="max-w-4xl mx-auto relative z-10">
//           {/* Enhanced Header */}
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full text-sm font-semibold mb-6">
//               <User className="w-4 h-4" />
//               Personal Information
//             </div>
//             <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4">
//               My Profile
//             </h1>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//               Your account information and details
//             </p>
//           </div>

//           {/* Profile Avatar Section */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-8 md:p-10 mb-8">
//             <div className="flex flex-col items-center">
//               <div className="relative group">
//                 <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
//                   <span className="text-2xl md:text-4xl font-bold text-white">
//                     {getUserInitials(user.firstName, user.lastName)}
//                   </span>
//                 </div>
//               </div>
//               <div className="text-center mt-6">
//                 <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//                   {getDisplayName(user.firstName, user.lastName)}
//                 </h2>
//                 <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200/50">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
//                   <span className="text-sm font-medium text-gray-600">Active Account</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Profile Information Grid */}
//           <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-8 md:p-10">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {/* Personal Details */}
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
//                     <User className="w-4 h-4 text-purple-600" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center gap-3 mb-3">
//                     <User className="w-5 h-5 text-purple-600" />
//                     <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Full Name</label>
//                   </div>
//                   <p className="text-xl font-bold text-gray-900">
//                     {getDisplayName(user.firstName, user.lastName)}
//                   </p>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center gap-3 mb-3">
//                     <Mail className="w-5 h-5 text-purple-600" />
//                     <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Email Address</label>
//                   </div>
//                   <p className="text-xl font-bold text-gray-900">{user.email || 'Not provided'}</p>
//                 </div>
//               </div>

//               {/* Account Information */}
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
//                     <Shield className="w-4 h-4 text-purple-600" />
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center gap-3 mb-3">
//                     <Shield className="w-5 h-5 text-purple-600" />
//                     <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Account Type</label>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white capitalize">
//                       {user.role || 'user'}
//                     </span>
//                     {user.role === 'admin' && (
//                       <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
//                         Admin Privileges
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
//                   <div className="flex items-center gap-3 mb-3">
//                     <Calendar className="w-5 h-5 text-purple-600" />
//                     <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Member Since</label>
//                   </div>
//                   <p className="text-xl font-bold text-gray-900">
//                     {formatDate(user.createdAt, 'MMMM d, yyyy')}
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     {formatDate(user.createdAt, "'Joined' EEEE 'at' h:mm a")}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;














import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from '@/utils/axiosConfig';
import { format, isValid } from "date-fns";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Package,
  Heart,
  Settings,
  LogOut,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfile {
  _id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phoneNo?: number | string;
  role: string;
  createdAt?: string;
  isVerified?: boolean;
  isPhoneVerified?: boolean;
  // Address fields
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pinCode?: string;
    country?: string;
  };
  // Or flat address fields
  street?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  country?: string;
}

interface EditableUserData {
  firstName: string;
  lastName: string;
  phoneNo: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

const Profile = () => {
  const { user, updateUser }: { user: UserProfile | null; updateUser: (userData: any) => void } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State management
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<EditableUserData>({
    firstName: '',
    lastName: '',
    phoneNo: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India'
  });

  // Fetch complete user profile
  const fetchUserProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/user/profile');
      const profileData = response.data.user || response.data;
      
      setUserProfile(profileData);
      
      // Initialize edit data
      setEditData({
        firstName: profileData.firstName || '',
        lastName: profileData.lastName || '',
        phoneNo: profileData.phoneNo?.toString() || '',
        street: profileData.address?.street || profileData.street || '',
        city: profileData.address?.city || profileData.city || '',
        state: profileData.address?.state || profileData.state || '',
        pinCode: profileData.address?.pinCode || profileData.pinCode || '',
        country: profileData.address?.country || profileData.country || 'India'
      });
      
      console.log('✅ User profile loaded:', profileData);
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      
      // Fallback to basic user data from auth context
      if (user) {
        setUserProfile(user);
        setEditData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phoneNo: user.phoneNo?.toString() || '',
          street: user.address?.street || user.street || '',
          city: user.address?.city || user.city || '',
          state: user.address?.state || user.state || '',
          pinCode: user.address?.pinCode || user.pinCode || '',
          country: user.address?.country || user.country || 'India'
        });
      }
      
      toast({
        title: "Profile Load Warning",
        description: "Some profile data may not be available. Please try refreshing.",
        variant: "default"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Handle profile update
  const handleSaveProfile = async () => {
    if (!userProfile) return;
    
    setIsSaving(true);
    try {
      const updatePayload = {
        firstName: editData.firstName.trim(),
        lastName: editData.lastName.trim(),
        phoneNo: editData.phoneNo ? parseInt(editData.phoneNo) : undefined,
        address: {
          street: editData.street.trim(),
          city: editData.city.trim(),
          state: editData.state.trim(),
          pinCode: editData.pinCode.trim(),
          country: editData.country.trim()
        }
      };

      const response = await axiosInstance.put('/api/user/profile', updatePayload);
      const updatedProfile = response.data.user || response.data;
      
      setUserProfile(updatedProfile);
      updateUser(updatedProfile); // Update auth context
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default"
      });
      
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof EditableUserData, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Safe date formatting function
  const formatDate = (dateString: string | undefined, formatString: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  // Safe function to get user initials
  const getUserInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    
    if (first && last) {
      return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
    } else if (first) {
      return first.charAt(0).toUpperCase();
    } else if (last) {
      return last.charAt(0).toUpperCase();
    } else {
      return 'U';
    }
  };

  // Safe function to get display name
  const getDisplayName = (firstName?: string, lastName?: string): string => {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    
    if (first && last) {
      return `${first} ${last}`;
    } else if (first) {
      return first;
    } else if (last) {
      return last;
    } else {
      return 'User';
    }
  };

  // Get formatted address
  const getFormattedAddress = (profile: UserProfile): string => {
    const address = profile.address || profile;
    const parts = [
      address.street,
      address.city,
      address.state,
      address.pinCode,
      address.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'Not provided';
  };

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex flex-col justify-center items-center py-12 sm:py-20">
      <div className="relative mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-3 sm:border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="text-gray-600 text-sm sm:text-lg font-medium">Loading your profile...</p>
    </div>
  );

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white px-4">
          <div className="text-center max-w-sm sm:max-w-md p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100/50">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 sm:mb-4">
              Please Login
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              You need to be logged in to view your profile information.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-full px-6 sm:px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  const currentProfile = userProfile || user;

  return (
    <>
      {/* ✅ Add responsive CSS */}
      <style>{`
        @media (max-width: 360px) {
          .container {
            padding-left: 8px;
            padding-right: 8px;
          }
        }
        
        .xs\\:hidden {
          @media (max-width: 479px) {
            display: none;
          }
        }
        
        .xs\\:block {
          @media (min-width: 480px) {
            display: block;
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <Header />
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-12 sm:py-16 px-2 sm:px-4 lg:px-8 pt-16 sm:pt-20 lg:pt-24">
        {/* Background Decorations - Scaled for mobile */}
        <div className="fixed top-16 left-4 sm:top-20 sm:left-10 w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-purple-200/20 blur-2xl sm:blur-3xl animate-pulse" />
        <div className="fixed bottom-32 right-4 sm:bottom-40 sm:right-10 w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-pink-200/20 blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="fixed top-1/2 right-1/4 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-purple-300/15 blur-xl sm:blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        <div className="max-w-4xl xl:max-w-5xl mx-auto relative z-10">
          {/* ✅ Mobile-optimized Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              Personal Information
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-2 sm:mb-4 px-4">
              My Profile
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 max-w-lg sm:max-w-2xl mx-auto leading-relaxed px-4">
              Your account information and details
            </p>
          </motion.div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* ✅ Mobile-optimized Profile Avatar Section */}
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
                        {getUserInitials(currentProfile.firstName, currentProfile.lastName)}
                      </span>
                    </div>
                    {/* Status indicators */}
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        {currentProfile.isVerified ? (
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4 sm:mt-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {getDisplayName(currentProfile.firstName, currentProfile.lastName)}
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-center">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-3 sm:px-4 py-2 rounded-full border border-purple-200/50">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs sm:text-sm font-medium text-gray-600">Active Account</span>
                      </div>
                      
                      {currentProfile.isPhoneVerified && (
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-3 sm:px-4 py-2 rounded-full border border-green-200/50">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          <span className="text-xs sm:text-sm font-medium text-green-700">Phone Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ✅ Quick Actions */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <button
                  onClick={() => navigate('/orders')}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">My Orders</span>
                </button>
                
                <button
                  onClick={() => navigate('/wishlist')}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600 mb-2" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">Wishlist</span>
                </button>
                
                <button
                  onClick={() => navigate('/custom-hamper')}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600 mb-2" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">Hampers</span>
                </button>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-purple-100/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Edit3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2" />
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">Edit Profile</span>
                </button>
              </motion.div>

              {/* ✅ Profile Information Grid - Ultra Responsive */}
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-purple-100/50 p-4 sm:p-6 md:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Edit mode header */}
                {isEditing && (
                  <div className="flex items-center justify-between mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                    <div className="flex items-center gap-3">
                      <Edit3 className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Editing Profile</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className="text-xs"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  {/* Personal Details */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Personal Details</h3>
                    </div>

                    {/* First Name */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">First Name</label>
                      </div>
                      {isEditing ? (
                        <Input
                          value={editData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="text-lg font-bold border-purple-200 focus:border-purple-500"
                          placeholder="Enter first name"
                        />
                      ) : (
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {currentProfile.firstName || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">Last Name</label>
                      </div>
                      {isEditing ? (
                        <Input
                          value={editData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="text-lg font-bold border-purple-200 focus:border-purple-500"
                          placeholder="Enter last name"
                        />
                      ) : (
                        <p className="text-lg sm:text-xl font-bold text-gray-900">
                          {currentProfile.lastName || 'Not provided'}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">Email Address</label>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900 break-all">
                        {currentProfile.email || 'Not provided'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Phone Number */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">Phone Number</label>
                      </div>
                      {isEditing ? (
                        <Input
                          type="tel"
                          value={editData.phoneNo}
                          onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                          className="text-lg font-bold border-purple-200 focus:border-purple-500"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <div>
                          <p className="text-lg sm:text-xl font-bold text-gray-900">
                            {currentProfile.phoneNo || 'Not provided'}
                          </p>
                          {currentProfile.isPhoneVerified && (
                            <div className="flex items-center gap-1 mt-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">Verified</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address & Account Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">Address & Account</h3>
                    </div>

                    {/* Address */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">Address</label>
                      </div>
                      {isEditing ? (
                        <div className="space-y-3">
                          <Input
                            value={editData.street}
                            onChange={(e) => handleInputChange('street', e.target.value)}
                            placeholder="Street address"
                            className="border-purple-200 focus:border-purple-500"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={editData.city}
                              onChange={(e) => handleInputChange('city', e.target.value)}
                              placeholder="City"
                              className="border-purple-200 focus:border-purple-500"
                            />
                            <Input
                              value={editData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              placeholder="State"
                              className="border-purple-200 focus:border-purple-500"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              value={editData.pinCode}
                              onChange={(e) => handleInputChange('pinCode', e.target.value)}
                              placeholder="PIN Code"
                              className="border-purple-200 focus:border-purple-500"
                            />
                            <Input
                              value={editData.country}
                              onChange={(e) => handleInputChange('country', e.target.value)}
                              placeholder="Country"
                              className="border-purple-200 focus:border-purple-500"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed">
                          {getFormattedAddress(currentProfile)}
                        </p>
                      )}
                    </div>

                    {/* Account Type */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">Account Type</label>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white capitalize">
                          {currentProfile.role || 'user'}
                        </span>
                        {currentProfile.role === 'admin' && (
                          <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                            Admin Privileges
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Since */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">Member Since</label>
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-gray-900">
                        {formatDate(currentProfile.createdAt, 'MMMM d, yyyy')}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {formatDate(currentProfile.createdAt, "'Joined' EEEE 'at' h:mm a")}
                      </p>
                    </div>

                    {/* Verification Status */}
                    <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        <label className="text-xs sm:text-sm font-semibold text-purple-800 uppercase tracking-wide">Verification Status</label>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Email Verified</span>
                          <div className="flex items-center gap-1">
                            {currentProfile.isVerified ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 font-medium">Yes</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-amber-600 font-medium">Pending</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Phone Verified</span>
                          <div className="flex items-center gap-1">
                            {currentProfile.isPhoneVerified ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 font-medium">Yes</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                <span className="text-sm text-amber-600 font-medium">Pending</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
