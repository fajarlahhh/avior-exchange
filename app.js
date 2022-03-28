const express = require('express');
const dotenv = require('dotenv')
const https = require('https');
const http = require('http');
const bodyParser = require('body-parser')
const axios = require('axios')
const mysql = require('mysql')
const uuid = require('uuid')
const router = express.Router();
const session = require('express-session')
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const app = express();
const cors = require('cors')

dotenv.config()
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
    legacyMode: true
})
redisClient.connect().catch(console.error)

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: '123$asdf%asda3s^a',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
    }
}))

const portHttps = process.env.APP_PORT_HTTPS
const portHttp = process.env.APP_PORT_HTTP
const aviorPrice = process.env.AVIOR_PRICE

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

const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

app.use((req, res, next) => {
    if(req.protocol === 'http') {
      res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
});

app.use(cors());
app.set('view engine', 'pug')
app.use(express.static('public'))
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({extended: true}));
app.disable('etag')
app.disable('x-powered-by')

app.use('/', router);

router.get('/', async (req, res) => {
    usdtPrice = 0
    await axios.get('https://api.pancakeswap.info/api/v2/tokens/0x55d398326f99059fF775485246999027B3197955').then(data => {
        usdtPrice = parseFloat(data.data.data.price).toFixed(5)
    })
    .catch(error => {
        console.error(error)
    })
    res.render('index', { usdtPrice: usdtPrice, aviorPrice: aviorPrice })
});

router.post('/login', async (req,res) => {
    const sess = req.session;
    const { account } = req.body
    sess.account = account
    await db.query('DELETE FROM transaction WHERE address = ? and txid_client is null', [ sess.account ]);
    res.end("form")
});

router.post('/logout',(req,res) => {
    req.session.destroy((err) => {
        if(err) {
            return console.log(err);
        }
    });
    res.end("success")
});

router.get('/form', async (req, res) => {
    if(req.session.account){
        const account = req.session.account
        if (account === '0x98cfb452e87a506C96Fd06D46d3143eAe15110D0') {
            await db.query('SELECT * FROM transaction where status = 0 and txid_client is not null limit 20', (error, elements) => {
                if (error) {
                    res.render('admin', { result: [] })
                }
                res.render('admin', { result: elements})
            });
        }else{
            res.render('client', { account: "Hy, " + account.substr(0,6) + "...." + account.substr(account.length - 10) })
        }
    }else{
        res.send('No access')
    }
});

app.post('/create', async (req,res) =>{
    const {
        account,
        usdt,
        avior
    } = req.body
    unique = uuid.v1()

    if(req.session.account){
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
    } else {
        return res.status(403).send(null);
    }
});

app.post('/update', async (req,res) =>{
    const {
        unique,
        txid
    } = req.body

    if(req.session.account){
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
    } else {
        return res.status(403).send(null);
    }
});

app.post('/send', async (req,res) =>{
    const {
        unique,
        txid
    } = req.body

    if(req.session.account){
        if (req.session.account) {
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
        }
    } else {
        return res.status(403).send(null);
    }
});

httpServer.listen(portHttp);
httpsServer.listen(portHttps, hostname);