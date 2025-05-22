# Express Validators

- install npm i express-validator

- We're importing two things from the express-validator library:

  - body: lets you define validation rules for req.body fields.

  - validationResult: lets you collect any validation errors after the rules run.

    ```js
    import { body, validationResult } from "express-validator";

    // 👇 Array of middleware for /register
    export const validateRegister = [
      // Username validations
      body("username")
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(
          "Username can only contain letters, numbers, and underscores"
        ),

      // Email validations
      body("email")
        .isEmail()
        .withMessage("Email must be valid")
        .normalizeEmail(), // optional, cleans up input like lowercase etc.

      // Password validations
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/\d/)
        .withMessage("Password must contain at least one number"),

      // Custom middleware to handle errors
      (req, res, next) => {
        const errors = validationResult(req); // Get validation results
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(), // Send all errors as a list
          });
        }
        next(); // If no errors, go to the next middleware/controller
      },
    ];
    ```
