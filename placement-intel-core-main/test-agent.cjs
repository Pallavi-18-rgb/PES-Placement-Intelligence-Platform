const http = require('http');
const jwt = require('jsonwebtoken');

// Generate mock token
const token = jwt.sign({ id: 'mock-user-123', role: 'STUDENT' }, 'dev-secret-key');

const postData = JSON.stringify({
  query: 'Can you tell me about the requirements for Google?'
});

const options = {
  hostname: 'localhost',
  port: 8082,
  path: '/api/agent/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('RESPONSE:', body);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(postData);
req.end();
