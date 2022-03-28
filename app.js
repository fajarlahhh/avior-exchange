const express = require('express');
const dotenv = require('dotenv')
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser')
const axios = require('axios')
const mysql = require('mysql')
const uuid = require('uuid')
const cors = require('cors')

var unique = null

const fs = require('fs');

const db = mysql.createConnection({
    host: 'avior-db-do-user-8702993-0.b.db.ondigitalocean.com',
    user: 'doadmin',
    port: 25060,
    password: 'F4bVPeCHUhsqDzCz',
    database: 'avior'
});

const hostname =  process.env.HOSTNAME

let options = {
    cert : fs.readFileSync('./certificate/aviortoken_com.crt'),
    key : fs.readFileSync('./certificate/aviortoken_com.key')
};

const app = express();
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

// app.use((req, res, next) => {
//     if(req.protocol === 'http') {
//       res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
// });
dotenv.config()

const portHttps = process.env.APP_PORT_HTTPS
const portHttp = process.env.APP_PORT_HTTP
const aviorPrice = process.env.AVIOR_PRICE

app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
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

app.get('/form', async (req, res) => {
    res.render('form')
});

app.get('/admin', async (req, res) => {
    await db.query('SELECT * FROM transaction where status = 0 and txid_client is not null', (error, elements) => {
        if (error) {
            res.render('admin', { result: [] })
        }
        res.render('admin', { result: elements})
    });
});

app.post('/delete', async (req, res) => {
    const {
        account
    } = req.body
    await db.query('DELETE FROM transaction WHERE address = ? and txid_client is null', [account], (error, elements) => {
        if (error) {
            console.log(error)
            return res.send(null);
        }
        return res.send(account)
    });
});

app.post('/create', async (req,res) =>{
    const {
        account,
        usdt,
        avior
    } = req.body
    unique = uuid.v1()

    if (unique) {
        await db.query('INSERT INTO transaction(`unique`, address, usdt_amount, avior_amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, 0, now(), now())', [
            unique,
            account,
            usdt,
            avior
        ], (error, elements) => {
            if (error) {
                return res.send(null);
            }
            return res.send(unique)
        });
    }
});

app.post('/update', async (req,res) =>{
    const {
        unique,
        txid
    } = req.body

    if (unique) {
        await db.query('UPDATE transaction SET txid_client=? WHERE `unique`=?', [
            txid,
            unique
        ], (error, elements) => {
            if (error) {
                return res.send(null);
            }
            return res.send(unique)
        });
    }
});

app.post('/sukses', async (req,res) =>{
    const {
        unique,
        txid
    } = req.body

    if (unique) {
        await db.query('UPDATE transaction SET txid_admin=?,status=1 WHERE `unique`=?', [
            txid,
            unique
        ], (error, elements) => {
            if (error) {
                return res.send(null);
            }
            return res.send(unique)
        });
    }
});

httpServer.listen(portHttp);
// httpsServer.listen(portHttps, hostname);