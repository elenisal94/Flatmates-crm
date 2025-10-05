// validators/tenantValidator.js
const { body, param, validationResult } = require("express-validator");

// Helper middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.createTenantValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 500 })
    .withMessage("First name cannot exceed 500 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 500 })
    .withMessage("Last name cannot exceed 500 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .isLength({ max: 500 })
    .withMessage("Email cannot exceed 500 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{11}$/)
    .withMessage("Phone number must be 11 digits"),

  body("address.flat")
    .trim()
    .notEmpty()
    .withMessage("Flat number is required")
    .isLength({ max: 500 })
    .withMessage("Flat number cannot exceed 500 characters"),

  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street name and number is required")
    .isLength({ max: 500 })
    .withMessage("Street cannot exceed 500 characters"),

  body("address.city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 500 })
    .withMessage("City cannot exceed 500 characters"),

  body("address.postcode")
    .trim()
    .notEmpty()
    .withMessage("Postcode is required")
    .isLength({ max: 500 })
    .withMessage("Postcode cannot exceed 500 characters"),

  handleValidationErrors,
];

exports.updateTenantValidation = [
  param("id").isMongoId().withMessage("Invalid tenant ID"),

  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error("At least one field must be updated");
    }
    return true;
  }),

  // Allow reusing rules from create but making them optional
  body("firstName").optional().trim().isLength({ max: 500 }),
  body("lastName").optional().trim().isLength({ max: 500 }),
  body("email").optional().trim().isEmail(),
  body("phone")
    .optional()
    .matches(/^\d{11}$/),
  body("address.flat").optional().trim().isLength({ max: 500 }),
  body("address.street").optional().trim().isLength({ max: 500 }),
  body("address.city").optional().trim().isLength({ max: 500 }),
  body("address.postcode").optional().trim().isLength({ max: 500 }),

  handleValidationErrors,
];
