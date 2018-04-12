const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const nunjucks = require('nunjucks')
const compression = require('compression')

app.use(compression())
app.use(express.static(`${__dirname}/assets`))

nunjucks.configure('assets/views', {
  autoescape: true,
  express: app
})

app.get('/', (req, res) => {
  res.render('index.html', {})
})

let nextUserTeam = 'blue'
let balloonCount = 0
let blueScore = 0
let redScore = 0
let gameTimer = 10

setInterval(function () {
  io.emit('gameTime', gameTimer)
  if (gameTimer > 0) {
    gameTimer--
  } else {
    let winner
    if (redScore > blueScore) {
      winner = 'red'
    } else if (redScore < blueScore) {
      winner = 'blue'
    } else if (redScore === blueScore) {
      winner = 'draw'
    }
    io.emit('gameOver', winner)
    setTimeout(function () {
      redScore = 0
      blueScore = 0
      gameTimer = 10
      io.emit('newGame', gameTimer)
    }, 5000)
  }
}, 1000)

io.on('connection', function (socket) {
  io.emit('team', nextUserTeam)
  if (nextUserTeam === 'blue') {
    console.log('a blue user connected')
    nextUserTeam = 'red'
    socket.team = 'red'
  } else {
    console.log('a red user connected')
    nextUserTeam = 'blue'
    socket.team = 'blue'
  }
  socket.on('balloon', function (balloon) {
    balloonCount++
    balloon.id = balloonCount
    io.emit('balloon', balloon)
  })
  socket.on('destroy', function (id) {
    io.emit('destroy', id)
  })
  socket.on('score', function (score) {
    if (score === 'red') {
      redScore++
    } else if (score === 'blue') {
      blueScore++
    }
    io.emit('score', {redScore: redScore, blueScore: blueScore})
  })
  socket.on('disconnect', function () {
    console.log('a user disconnected')
  })
})

http.listen(process.env.PORT || 5000, () => {
  console.log('Listening.. port 5000')
})
