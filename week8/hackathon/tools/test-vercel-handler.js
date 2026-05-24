const handler = require('../backend/dist/main.js').default;

console.log("Handler loaded:", typeof handler);

const req = {
  url: '/api/documents',
  method: 'GET',
  headers: {}
};

// Simple mock for Express/Node response
const res = {
  statusCode: 200,
  headers: {},
  setHeader: function(name, value) {
    this.headers[name] = value;
  },
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  send: function(data) {
    console.log('--- Response Send ---');
    console.log('Status:', this.statusCode);
    console.log('Headers:', this.headers);
    console.log('Body:', data);
    return this;
  },
  json: function(data) {
    return this.send(JSON.stringify(data));
  },
  end: function(data) {
    console.log('--- Response End ---');
    if (data) console.log('Data:', data);
    return this;
  }
};

console.log("Invoking handler...");
handler(req, res)
  .then(result => {
    console.log("Handler promise resolved successfully.");
  })
  .catch(err => {
    console.error("Handler promise rejected with error:", err);
  });
