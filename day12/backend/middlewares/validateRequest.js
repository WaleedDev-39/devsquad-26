const { validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
    // Check for validation errors from express-validator
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Return early with 400 Bad Request and validation errors
        return res.status(400).json({ errors: errors.array() });
    }

    // If no errors, proceed to the next middleware or controller
    next();
};

module.exports = validateRequest;
