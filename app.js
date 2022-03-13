const express = require('express');
const app = express(); 
const path = require('path')
function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  }
  app.use(requireHTTPS);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname}); 
});

app.listen(80);