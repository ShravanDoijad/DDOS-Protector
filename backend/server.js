const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis');
const app = express();
const helmet = require('helmet');

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https:'],
        },
    },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

const corsOptions = {
    origin: (origin, cb) => {
        const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());
        if (!origin || allowed.includes('*') || allowed.includes(origin)) cb(null, true);
        else cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    maxAge: 86400,
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;




app.use(express.json());

app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));


app.use(require('./src/middleware/honeypot'));        // 1. instant exit for scanners
app.use(require('./src/middleware/ipBlocker'));       // 2. blocked IPs exit here
app.use(require('./src/middleware/rateLimitter')); // 3. per-endpoint rate limits
app.use(require('./src/middleware/botDetection'));    // 4. add score for bots
app.use(require('./src/middleware/requestLogger'));   // 5. log the request
app.use(require('./src/middleware/threatDetection')); // 6. burst detection
app.use(require('./src/middleware/inputSanitizer')); // 7. SQLi/XSS scan
app.use(require('./src/middleware/threatScoring'));   // 8. compute final score
app.use(require('./src/middleware/decisionEngine')); // 9. block / delay / pass
app.use(require('./src/middleware/bruteForce'));      // 10. login-specific lockout
connectDB();

async function initializeRedis() {
    try {
        await redisClient.set('test', 'Redis is working');
        const value = await redisClient.get('test');
        console.log('Redis is ready to use', value);
    }
    catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1);
    }
}

initializeRedis();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})