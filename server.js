const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Tenant, Task, RentPayment, BillPayment } = require("./schema.js");
const tenantRoutes = require("./routes/tenantRoutes");
const taskRoutes = require("./routes/taskRoutes");
const rentPaymentRoutes = require("./routes/rentPaymentRoutes");
const billPaymentRoutes = require("./routes/billPaymentRoutes");
require("./helpers/cronJob.js");

const app = express();
const PORT = process.env.PORT || 5001;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options(
  "*",
  (req, res, next) => {
    console.log("Received CORS preflight request");
    next();
  },
  cors(corsOptions)
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, HEAD, POST, PUT, DELETE, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());

mongoose
  .connect("mongodb://localhost/crm-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/tenants", tenantRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/rent-payments", rentPaymentRoutes);
app.use("/api/bill-payments", billPaymentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
