require('dotenv').config();
const express = require('express');
const shield = require('shravan-ddos-shield'); // <--- Using your very own published NPM package!

const app = express();


app.use(shield({ 
    honeypot: { enabled: true },
    botDetection: { enabled: true }
}));

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Victim Website!</h1><p>I am protected by Shravan DDOS Shield!</p>');
});

app.listen(3000, () => {
    console.log('🛡️ Victim website is running on http://localhost:3000');
    console.log('Try to trigger the honeypot by visiting http://localhost:3000/.env');
});
