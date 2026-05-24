const taskController = require("./controller/taskController");

console.log("🧪 Starting smoke test for createTask...");

// Mock req object
const mockReq = {
  body: {
    title: "Smoke Test Task",
    completed: false,
  },
};

// Mock res object
const mockRes = {
  statusCode: null,
  responseData: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(data) {
    this.responseData = data;
    console.log("✅ Response sent with status:", this.statusCode);
    console.log("✅ Response data:", JSON.stringify(data, null, 2));
    return this;
  },
};

try {
  taskController.createTask(mockReq, mockRes);
  console.log("✅ createTask executed successfully - no exceptions thrown");
  console.log("\n✅ Smoke test PASSED");
} catch (error) {
  console.error("❌ Smoke test FAILED with exception:", error.message);
  console.error(error.stack);
  process.exit(1);
}
