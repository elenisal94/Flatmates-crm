const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { Tenant, Task, RentPayment, BillPayment } = require("./schema.js");
const tenantRoutes = require("./routes/tenantRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const rentPaymentRoutes = require("./routes/rentPaymentRoutes.js");
const billPaymentRoutes = require("./routes/billPaymentRoutes.js");
const resetRoutes = require("./routes/resetData.js");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sanitiseInput = require("./middleware/sanitiseInput");

const app = express();
const PORT = process.env.PORT || 5001;

// === Helmet for security headers ===
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        `https://${process.env.AUTH0_DOMAIN}`,
        process.env.FRONTEND_URL || "http://localhost:3000",
      ],
      frameSrc: [`https://${process.env.AUTH0_DOMAIN}`],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// === Input sanitization ===
app.use(mongoSanitize());
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// === Rate limiting ===
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  message: "Too many requests from this IP, please try again after a minute",
});
app.use(limiter);

// === CORS setup ===
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// === Extra headers for CORS ===
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.FRONTEND_URL || "http://localhost:3000"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // send quick response for preflight
  }
  next();
});

// === Body parsing and sanitization ===
app.use(express.json());
app.use(sanitiseInput);

// === MongoDB connection ===
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crm-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// === Routes ===
app.use("/api/tenants", tenantRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rent-payments", rentPaymentRoutes);
app.use("/api/bill-payments", billPaymentRoutes);
app.use("/api/reset", resetRoutes);

if (process.env.NODE_ENV !== "production" && !process.env.LAMBDA_TASK_ROOT) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}

// === Serverless handler ===
module.exports.handler = require("serverless-http")(app);
