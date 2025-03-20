const express = require("express");
const router = express.Router();
const tenantController = require("../controllers/tenantController");

router.get("/", tenantController.getAllTenants);
router.post("/", tenantController.createTenant);
router.get("/:id", tenantController.getSpecificTenant);
router.put("/:id", tenantController.updateTenant);
router.delete("/:id", tenantController.deleteTenant);

module.exports = router;
