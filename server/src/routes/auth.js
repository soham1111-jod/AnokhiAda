const express = require("express");
const {
  verifyEmail,
  sendOtp,
  login,
  register,
  logout,
  forgotPassword,
  verifyOtp,
  resetPassword,
  promoteToAdmin,
  refreshToken,
} = require("../controllers/authController");

const userMiddleware = require("../middleware/userMiddleware");
const passport = require("passport");
const adminMiddleware = require("../middleware/adminMiddleware");
const superAdminMiddleware = require("../middleware/superAdminMiddleware");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();

authRouter.post("/send-otp", sendOtp);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/signup", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);

//refresh token call it generates the the new access token
authRouter.post("/refresh-token", refreshToken);

//protected route of user
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

//admin route
authRouter.post("/admin", superAdminMiddleware, promoteToAdmin);

// Temporary route to create admin user for testing
authRouter.post("/create-admin", async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bcrypt = require("bcrypt");
    const User = require("../models/user");

    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = await User.create({
      firstName,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    res.status(201).json({
      message: "Admin user created successfully",
      user: {
        firstName: adminUser.firstName,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating admin user", error: err.message });
  }
});

//google auth
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);


authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const user = req.user; // This user is already processed in passport.js

      const token = jwt.sign(
        { _id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 } // 1 hour
      );

      const userData = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      };

      const userDataStr = encodeURIComponent(JSON.stringify(userData));
      res.redirect(
        `${process.env.CLIENT_URL}/auth/google/callback?token=${token}&userData=${userDataStr}`
      );
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect("/login");
    }
  }
);

module.exports = authRouter;
