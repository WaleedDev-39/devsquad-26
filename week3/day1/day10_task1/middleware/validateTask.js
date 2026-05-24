const { sendResponse } = require("../utils/helpers");

const validateTask = (req, res, next) => {
    const { title, completed } = req.body;

    if (title === undefined || typeof title !== "string" || title.trim() === "") {
        return sendResponse(
            res,
            400,
            false,
            null,
            "Validation Error: 'title' is required and must be a non-empty string"
        );
    }

    if (completed !== undefined && typeof completed !== "boolean") {
        return sendResponse(
            res,
            400,
            false,
            null,
            "Validation Error: 'completed' must be a boolean"
        );
    }

    next();
};

module.exports = { validateTask };
