const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const crypto = require('crypto')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/submit', async (req, res) => {
    try {
        const uuid = crypto.randomUUID();
        const key = uuid.substring(0, 7)
        // urlStore[key] = req.body.url;
        await knex('shot_url').insert({
            url: req.body.url,
            shot_url: 'https://smaretas.com/' + key,
            createdAt: knex.fn.now(),
            updatedAt: knex.fn.now()
        })
        res.send({ status: 200, message: 'OK', url: 'https://smaretas.com/' + key });
    } catch (error) {
        console.log(error)
        res.send({ status: 500, error: error.message });
    }
})

app.get('/:code', async (req, res) => {
    try {
        const code = req.query.code
        const result = await knex('shot_url').where('shot_url', 'https://smaretas.com/' + code).then(raw => raw[0])
        res.redirect(result.url)
    } catch (error) {
        console.log(error)
        res.send({ status: 500, error: error.message });
    }
})

app.listen(process.env.APP_PORT || 3000)