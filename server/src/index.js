require("dotenv").config();
const express = require("express");
const app = express();

const cors = require("cors");
const helmet = require("helmet");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const redisClient = require("./config/redis");
const authRouter = require("./routes/auth");
const passport = require("./config/passport");
const session = require("express-session");
const AdminRouter = require("./routes/AdminRoutes");
const dataRouter = require("./routes/getDataRoutes"); 
const orderRouter = require("./routes/orderRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const notificationRouter = require("./routes/notificationRoutes");

const PORT_NO = process.env.PORT_NO || 3000;
app.use(express.json());
app.use(cookieParser());

app.use(helmet());
const allowedOrigins = process.env.CLIENT_URL.split(",");
app.use(cors({
  origin: "http://localhost:8080",  // Your React/Vue/Next frontend URL
  credentials: true
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "your_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true if using HTTPS
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/admin", AdminRouter);
app.use("/api", dataRouter);
app.use("/orders", orderRouter);
app.use("/wishlist", wishlistRouter);
app.use("/notifications", notificationRouter);

const initialConnection = async () => {
  try {
    await Promise.all([redisClient.connect(), database()]);
    console.log("Databases Connected");

    app.listen(PORT_NO, () => {
      console.log(`Server is Listening on port no ${PORT_NO}`);
    });
  } catch (err) {
    console.log("Error :-  " + err);
  }
};

initialConnection();
