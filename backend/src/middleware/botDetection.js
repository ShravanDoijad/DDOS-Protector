const BAD_UA = [/curl\//i, /wget\//i, /python-requests/i, /scrapy/i,
  /masscan/i, /nikto/i, /sqlmap/i, /dirbuster/i, /zgrab/i];
const HEADLESS = [/headlesschrome/i, /phantomjs/i, /puppeteer/i, /playwright/i];

const botDetection = (req, res, next) => {
  const ua = req.headers['user-agent'] || '';
  let add = 0;
  if (!ua) add = 20;
  else if (BAD_UA.some(r => r.test(ua))) add = 20;
  else if (HEADLESS.some(r => r.test(ua))) add = 25;
  else if (!req.headers['accept-language']) add = 10; 
  if (add) req.threatScore = (req.threatScore || 0) + add;
  next();
};

module.exports = botDetection;