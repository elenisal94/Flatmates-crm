const { body, param, validationResult } = require("express-validator");

exports.createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 500 })
    .withMessage("Title cannot exceed 500 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned to is required")
    .isMongoId()
    .withMessage("Invalid tenant ID"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("completed")
    .notEmpty()
    .withMessage("Completed status is required")
    .isBoolean()
    .withMessage("Completed must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

exports.updateTaskValidation = [
  param("id").isMongoId().withMessage("Invalid task ID"),

  body().custom((value, { req }) => {
    if (Object.keys(req.body).length === 0) {
      throw new Error("At least one field must be updated");
    }
    return true;
  }),

  // Reuse create validation rules but make fields optional for updates
  body("title")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Title cannot exceed 500 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("assignedTo").optional().isMongoId().withMessage("Invalid tenant ID"),

  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid date"),

  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
