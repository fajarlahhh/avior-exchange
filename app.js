const express = require('express');
const app = express();
const dotenv = require('dotenv')
const https = require('https');
const bodyParser = require('body-parser');
const axios = require('axios')

const fs = require('fs');

const hostname = 'exchange.aviortoken.com'

let options = {
    cert : fs.readFileSync('./certificate/aviortoken_com.crt'),
    ca : fs.readFileSync('./certificate/aviortoken_com.ca-bundle'),
    key : fs.readFileSync('./certificate/aviortoken_com.key')
 };

const httpsServer = https.createServer(options, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end("<h1>HTTPS server running</h1>");
});

dotenv.config()

const port = process.env.APP_PORT
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

httpsServer.listen(port, hostname);