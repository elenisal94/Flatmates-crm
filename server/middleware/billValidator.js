// validators/billValidator.js
const { body, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.createBillValidation = [
  body("tenant")
    .notEmpty()
    .withMessage("Tenant ID is required")
    .isMongoId()
    .withMessage("Invalid tenant ID"),

  body("billType")
    .trim()
    .notEmpty()
    .withMessage("Bill type is required")
    .isString()
    .withMessage("Bill type must be a string"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isNumeric()
    .withMessage("Amount must be a number"),

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
    .optional()
    .isBoolean()
    .withMessage("paymentMade must be a boolean"),

  handleValidationErrors,
];

exports.updateBillValidation = [
  param("id").isMongoId().withMessage("Invalid bill ID"),

  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error("At least one field must be updated");
    }
    return true;
  }),

  body("tenant").optional().isMongoId(),
  body("billType").optional().isString(),
  body("amount").optional().isNumeric(),
  body("dueDate").optional().isISO8601(),
  body("datePaid").optional().isISO8601(),
  body("paymentMade").optional().isBoolean(),

  handleValidationErrors,
];
