# Task Manager API
A basic RESTful API built with Node.js and Express to manage tasks. Uses an in-memory JSON file for data storage. Complete with structured responses, UUIDs, data validation, and Swagger API documentation.

## Features
- In-Memory CRUD Operations (GET, POST, PUT, DELETE)
- Dynamic Search capability (filter tasks by title matching)
- API Statistics endpoint (total, completed, pending stats)
- Response Structure consistency wrapping payload
- Validation Middlewares evaluating strings and booleans
- Global Error Handling
- Swagger API Docs auto-generated via `swagger-jsdoc` and `swagger-ui-express`
- Generated Postman Collection for endpoints testing

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run devStart
```
The server will be running on `http://localhost:8000`.

## Swagger Documentation
After starting the server, go to `http://localhost:8000/api-docs` to access the interactive Swagger Documentation.

## Postman Collection
Import `Task_Manager_API.postman_collection.json` directly into Postman. It contains pre-configured requests for all available endpoints.

---

## Sample Request & Response Formats

### 1. `GET /api/tasks` (Get All Tasks or Search)
**Request:** `GET /api/tasks?title=express`
**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Learn Express",
      "completed": false
    }
  ],
  "message": "Found 1 tasks matching 'express'"
}
```

### 2. `POST /api/tasks` (Create Task)
**Request Body:**
```json
{
  "title": "Build cool API",
  "completed": false
}
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "eec8d96d-c5e3-4d43-9ba8-6fbe1cd144cf",
    "title": "Build cool API",
    "completed": false
  },
  "message": "Task created successfully"
}
```

### 3. Validation Error Output (If `title` is missing)
**Request:** `POST /api/tasks`
**Request Body:**
```json
{
  "completed": true
}
```
**Response (400 Bad Request):**
```json
{
  "success": false,
  "data": null,
  "message": "Validation Error: 'title' is required and must be a non-empty string"
}
```

### 4. `GET /api/stats`
**Request:** `GET /api/stats`
**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalTasks": 2,
    "completedTasks": 1,
    "pendingTasks": 1
  },
  "message": "Stats retrieved successfully"
}
```
