const https = require('https');

const data = JSON.stringify({
  email: 'ziyad@islami.com',
  password: 'Ziyad@is1'
});

const options = {
  hostname: 'my-islami-site-production.up.railway.app',
  port: 443,
  path: '/api/auth/setup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => { body += d; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('Success! Admin account created: ziyad@islami.com');
    } else {
      console.log('Failed or already exists:', body);
    }
    process.exit(0);
  });
});

req.on('error', (error) => {
  console.error('Network error:', error);
  process.exit(1);
});

req.write(data);
req.end();
