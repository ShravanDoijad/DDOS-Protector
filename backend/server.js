const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const redisClient = require('./src/config/redis');
const rateLimiter = require('./src/middleware/rateLimitter');
const requestLogger = require('./src/middleware/requestLogger');
const threatDetection = require('./src/middleware/threatDetection');
const ipBlocker = require('./src/middleware/ipBlocker');
const threatScoring = require('./src/middleware/threatScoring');
const decisionEngine = require('./src/middleware/decisionEngine');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;




app.use(express.json());

// Exclude dashboard routes from security middlewares so the admin is never locked out
// and the dashboard's polling traffic doesn't spam the request logs.
app.use('/api/dashboard', require('./src/routes/dashboardRoutes'));

app.use(ipBlocker);
app.use(rateLimiter);
app.use(requestLogger)
app.use(threatDetection);
app.use(threatScoring);
app.use(decisionEngine);

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

app.get('/',(req, res)=>{
    res.send('Hello World!');
})

app.get('/api/test', (req, res)=>{
    res.json({ message: 'API is working' });
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})