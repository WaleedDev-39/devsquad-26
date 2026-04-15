const { sendResponse } = require("../utils/helpers");

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    return sendResponse(res, 500, false, null, err.message || "Internal Server Error");
};

const notFoundHandler = (req, res, next) => {
    return sendResponse(res, 404, false, null, "Route not found");
};

module.exports = { errorHandler, notFoundHandler };
