const express = require("express");
const router = express.Router();

const {
  createTenant,
  updateTenant,
  getAllTenants,
  getSpecificTenant,
  deleteTenant,
} = require("../controllers/tenantController");

const checkJwt = require("../middleware/auth");
const {
  createTenantValidation,
  updateTenantValidation,
} = require("../middleware/tenantValidator");

router.get("/", checkJwt, getAllTenants);

router.post("/", checkJwt, createTenantValidation, createTenant);

router.get("/:id", checkJwt, getSpecificTenant);

router.put("/:id", checkJwt, updateTenantValidation, updateTenant);

router.delete("/:id", checkJwt, deleteTenant);

module.exports = router;
