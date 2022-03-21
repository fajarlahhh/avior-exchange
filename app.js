const express = require('express');
const app = express();
const dotenv = require('dotenv')
const http = require('http');
const bodyParser = require('body-parser');
var server = http.createServer(app);
const axios = require('axios')

dotenv.config()

const port = process.env.APP_PORT
const aviorPrice = process.env.AVIOR_PRICE

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.json());

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
    
});

server.listen(port);