const express = require('express');
const dotenv = require('dotenv')
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser');
const axios = require('axios')

const fs = require('fs');

const hostname =  process.env.HOSTNAME

let options = {
    cert : fs.readFileSync('./certificate/aviortoken_com.crt'),
    key : fs.readFileSync('./certificate/aviortoken_com.key')
};

const app = express();
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

app.use((req, res, next) => {
    if(req.protocol === 'http') {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});
dotenv.config()

const portHttps = process.env.APP_PORT_HTTPS
const portHttp = process.env.APP_PORT_HTTP
const aviorPrice = process.env.AVIOR_PRICE

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(
    express.urlencoded({
      extended: true
    })
)
app.use(express.json())

app.get('/', async (req, res) => {
    usdtPrice = 0
    await axios.get('https://api.pancakeswap.info/api/v2/tokens/0x55d398326f99059fF775485246999027B3197955').then(data => {
        usdtPrice = parseFloat(data.data.data.price).toFixed(5)
    })
    .catch(error => {
        console.error(error)
    })
    res.render('index', { usdtPrice: usdtPrice, aviorPrice: aviorPrice })
});

app.post('/send', async (req,res) =>{

    await axios.post('https://admin.avior-exchange.com',req.body).then(data => {
        usdtPrice = parseFloat(data.data.data.price).toFixed(5)
    })
    .catch(error => {
        console.error(error)
    })
});

httpServer.listen(portHttp);
httpsServer.listen(portHttps, hostname);