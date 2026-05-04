const http = require('http');

const optionsTemplate = {
  hostname: 'localhost',
  port: 5000,
  method: 'GET',
};

async function makeRequest(path, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve) => {
    const options = { ...optionsTemplate, path, method, headers };
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    
    req.on('error', (e) => resolve({ error: e.message }));
    
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log("🛡️ Starting Shield.js Attack Simulation...\n");

  // 1. Honeypot Attack
  console.log("🚨 [1/4] Simulating Honeypot Scan (Hitting /.env)...");
  const p1 = await makeRequest('/.env');
  console.log(`   Response: ${p1.status} - ${p1.body}\n`);

  // Wait a sec
  await new Promise(r => setTimeout(r, 1000));

  // 2. SQLi/XSS Attack (Input Sanitizer) -> This bumps the threat score by 40!
  console.log("🚨 [2/4] Simulating SQL Injection Attack...");
  const p2 = await makeRequest(encodeURI('/api/test?query=SELECT * FROM users'), 'GET');
  console.log(`   Response: ${p2.status} - ${p2.body}\n`);

  // 3. Another Malicious Attack to push threat score > 60 (triggers decision engine high severity)
  console.log("🚨 [3/4] Simulating XSS Attack to push threat score over 60...");
  const p3 = await makeRequest('/api/test', 'POST', { comment: "<script>alert(1)</script>" }, { 'Content-Type': 'application/json' });
  console.log(`   Response: ${p3.status} - ${p3.body}\n`);

  // Wait to let Redis persist
  await new Promise(r => setTimeout(r, 2000));

  // We need to unblock localhost to test brute force, or we can just simulate it from a fake IP, 
  // but since we are doing localhost, it's already blocked by Honeypot and Threat Score.
  // Let's clear Redis via the app's config so the next test works!
  const redisClient = require('./src/config/redis');
  await redisClient.flushall();
  console.log("🧹 Cleared Redis blocks to test Brute Force...");

  // 4. Brute Force Attack
  console.log("\n🚨 [4/4] Simulating Brute Force Login Attack...");
  for (let i = 1; i <= 6; i++) {
    const res = await makeRequest('/api/login', 'POST', { username: 'admin', password: 'wrongpassword' }, { 'Content-Type': 'application/json' });
    console.log(`   Attempt ${i}: Status ${res.status}`);
  }

  console.log("\n✅ Simulation Complete! Check your Discord channel for the alerts!");
  process.exit(0);
}

runTests();
