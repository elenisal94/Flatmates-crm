const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { Tenant, Task, RentPayment, BillPayment } = require("./schema.js");
const tenantRoutes = require("./routes/tenantRoutes");
const taskRoutes = require("./routes/taskRoutes");
const rentPaymentRoutes = require("./routes/rentPaymentRoutes");
const billPaymentRoutes = require("./routes/billPaymentRoutes");
const resetRoutes = require("./routes/resetData.js");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("./helpers/cronJob.js");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());

app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after a minute",
});

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(limiter);

app.options(
  "*",
  (req, res, next) => {
    next();
  },
  cors(corsOptions)
);

app.use(cors(corsOptions));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost/crm-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/tenants", tenantRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rent-payments", rentPaymentRoutes);
app.use("/api/bill-payments", billPaymentRoutes);
app.use("/api/reset", resetRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
