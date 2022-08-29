const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const crypto = require('crypto')

app.use(bodyParser.json())

const knex = require('knex')({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DATABASE
    },
    pool: { min: 0, max: 7 }
  });

const urlStore = {}

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/', (req, res) => {
    const uuid = crypto.randomUUID()
    urlStore[uuid] = req.body.url
    res.send({ status: 200, message: 'OK', url: 'http://localhost:3232/' + uuid })
})

app.listen(process.env.APP_PORT || 3000)