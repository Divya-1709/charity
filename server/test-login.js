const http = require('http');

const data = JSON.stringify({ email: 'admin@hopebridge.org', password: 'admin123' });

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    const parsed = JSON.parse(body);
    if (parsed.token) {
      console.log('✅ LOGIN SUCCESS!');
      console.log('User:', parsed.user.name, '|', parsed.user.role);
      console.log('Token:', parsed.token.substring(0, 40) + '...');
    } else {
      console.log('❌ LOGIN FAILED:', parsed.message);
    }
  });
});

req.on('error', e => console.error('Request error:', e.message));
req.write(data);
req.end();
