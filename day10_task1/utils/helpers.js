const { v4: uuidv4 } = require("uuid");

const generateId = () => {
  return uuidv4();
};

const sendResponse = (res, statusCode, success, data, message) => {
  return res.status(statusCode).json({
    success,
    data,
    message,
  });
};

module.exports = { generateId, sendResponse };
