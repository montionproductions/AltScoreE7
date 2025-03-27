const express = require('express')
const app = express()
const { altScoreRouter, fetchLeaderboard } = require('./controllers/altScore');

app.use(express.static('dist'))
app.use(express.json())

app.use('/api', altScoreRouter)

module.exports = app