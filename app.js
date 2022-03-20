const express = require('express');
const app = express(); 
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.APP_PORT
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: __dirname}); 
});

app.listen(port);