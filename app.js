require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')


const app = express();
const port = process.env.APP_PORT

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended : true }))
app.use(express.static('public'))
app.use(expressLayouts)

app.set('layout', './')

const routes = require('./routes/app.js')
app.use('/', routes)

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});