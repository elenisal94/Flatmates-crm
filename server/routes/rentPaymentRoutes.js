const express = require("express");
const router = express.Router();

const {
  createRentPayment,
  updateRentPayment,
  getAllRentPayments,
  getSpecificRentPayment,
  deleteRentPayment,
} = require("../controllers/rentPaymentController");

const checkJwt = require("../middleware/auth");
const {
  createRentValidation,
  updateRentValidation,
} = require("../middleware/rentValidator");

router.get("/", checkJwt, getAllRentPayments);

router.post("/", checkJwt, createRentValidation, createRentPayment);

router.get("/:id", checkJwt, getSpecificRentPayment);

router.put("/:id", checkJwt, updateRentValidation, updateRentPayment);

router.delete("/:id", checkJwt, deleteRentPayment);

module.exports = router;
