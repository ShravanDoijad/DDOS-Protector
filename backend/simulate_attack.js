const http = require('http');

// Configuration
const targetUrl = 'http://localhost:5000/api/test';
const concurrency = 100; 

console.log(`Starting simulated DDoS attack on ${targetUrl}`);
console.log(`⚠️ Press Ctrl+C to stop.\n`);

let requestCount = 0;
let blockedCount = 0;

function makeRequest() {
    const req = http.get(targetUrl, (res) => {
        // Discard response data to keep memory usage low
        res.on('data', () => {});
        
        res.on('end', () => {
            requestCount++;
            // The DDOS system returns 429 (Rate Limit) or 403 (Blocked)
            if (res.statusCode === 403 || res.statusCode === 429) {
                blockedCount++;
            }
            // Fire the next request immediately
            makeRequest();
        });
    });

    req.on('error', (err) => {
        // If the server crashes or drops the connection
        blockedCount++;
        setTimeout(makeRequest, 10); // retry shortly
    });
}

// Start the attack loops
for (let i = 0; i < concurrency; i++) {
    makeRequest();
}

// Print live statistics every second
setInterval(() => {
    console.log(` Stats -> Total Requests Sent: ${requestCount} | Blocked/Failed: ${blockedCount}`);
}, 1000);
