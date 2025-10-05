const { body, param, validationResult } = require("express-validator");

exports.createRentValidation = [
  body("tenant")
    .notEmpty()
    .withMessage("Tenant is required")
    .isMongoId()
    .withMessage("Invalid tenant ID"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be positive"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("datePaid")
    .optional()
    .isISO8601()
    .withMessage("Date paid must be a valid date"),

  body("paymentMade")
    .notEmpty()
    .withMessage("Payment status is required")
    .isBoolean()
    .withMessage("Payment status must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateRentValidation = [
  param("id").isMongoId().withMessage("Invalid rent payment ID"),

  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error("At least one field must be updated");
    }
    return true;
  }),

  body("tenant").optional().isMongoId().withMessage("Invalid tenant ID"),

  body("amount")
    .optional()
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be positive"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("datePaid")
    .optional()
    .isISO8601()
    .withMessage("Date paid must be a valid date"),

  body("paymentMade")
    .optional()
    .isBoolean()
    .withMessage("Payment status must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
