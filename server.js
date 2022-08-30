const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const crypto = require('crypto')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST ?? '128.199.239.234',
      port: process.env.DB_PORT ?? 3306,
      user: process.env.DB_USER ?? 'citizix_user',
      password: process.env.DB_PASS ?? 'secret',
      database: process.env.DB_DATABASE ?? 'citizix_db'
    },
    pool: { min: 0, max: 7 }
  });

const urlStore = {}
const url = 'https://smaretas.com/'

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/submit', async (req, res) => {
    try {
        const uuid = crypto.randomUUID();
        const key = uuid.substring(0, 7)
        await knex('shot_url').insert({
            url: req.body.url,
            shot_url: url + key,
            createdAt: knex.fn.now(),
        })
        res.send({ status: 200, message: 'OK', url: url + key });
    } catch (error) {
        console.log(error)
        res.send({ status: 500, error: error.message });
    }
})

app.get('/:code', async (req, res) => {
    try {
        const code = req.params.code
        const result = await knex('shot_url').where('shot_url', url + code).then(raw => raw[0])
        res.redirect(result.url)
    } catch (error) {
        console.log(error)
        res.send({ status: 500, error: error.message });
    }
})

app.listen(process.env.APP_PORT || 3000)