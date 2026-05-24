const crypto = require("crypto");

const generateId = () => {
  return crypto.randomUUID();
};

const sendResponse = (res, statusCode, success, data, message) => {
  return res.status(statusCode).json({
    success,
    data,
    message,
  });
};

module.exports = { generateId, sendResponse };
