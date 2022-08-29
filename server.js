const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const crypto = require('crypto')

const urlStore = {}

app.use(bodyParser.json())

app.get('/:code', (req, res) => {
    if (!urlStore[req.params.code]) {
        return res.json({ status: 404, message: 'Not found' })
    }
    return res.redirect(urlStore[req.params.code])
})

app.post('/', (req, res) => {
    const uuid = crypto.randomUUID()
    urlStore[uuid] = req.body.url
    res.send({ status: 200, message: 'OK', url: 'http://localhost:3232/' + uuid })
})

app.listen(3232)