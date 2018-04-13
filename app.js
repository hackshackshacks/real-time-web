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
let gameDuration = 30
let gameTimer = gameDuration
let gameActive = true
let destroyed = []
let redTeam = []
let blueTeam = []

setInterval(function () {
  if (gameTimer > 0) {
    io.emit('gameTime', gameTimer)
    gameTimer--
  } else if (gameTimer === 0 && gameActive) {
    io.emit('gameTime', gameTimer)
    gameActive = false
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
      gameTimer = gameDuration
      gameActive = true
      io.emit('score', {redScore: redScore, blueScore: blueScore})
      io.emit('newGame', gameTimer)
    }, 5000)
  }
}, 1000)

function joinTeam (id) {
  if (redTeam.length > blueTeam.length) {
    blueTeam.push(id)
    io.emit('team', 'blue')
    return 'blue'
  } else if (redTeam.length <= blueTeam.length) {
    redTeam.push(id)
    io.emit('team', 'red')
    return 'red'
  }
}
function leaveTeam (team, id) {
  if (team === 'red') {
    redTeam = redTeam.filter(user => user !== id)
  } else if (team === 'blue') {
    blueTeam = blueTeam.filter(user => user !== id)
  }
}
io.on('connection', function (socket) {
  socket.team = joinTeam(socket.id)
  io.emit('score', {redScore: redScore, blueScore: blueScore})

  socket.on('balloon', function (balloon) {
    balloonCount++
    balloon.id = balloonCount
    io.emit('balloon', balloon)
  })
  socket.on('destroy', function (balloon) {
    io.emit('destroy', balloon.id)
    if (balloon.team === 'blue' && !destroyed.includes(balloon.id)) {
      destroyed.push(balloon.id)
      if (balloon.click) {
        redScore++
      } else {
        blueScore++
      }
    } else if (balloon.team === 'red' && !destroyed.includes(balloon.id)) {
      destroyed.push(balloon.id)
      if (balloon.click) {
        blueScore++
      } else {
        redScore++
      }
    }
    io.emit('score', {redScore: redScore, blueScore: blueScore})
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
    leaveTeam(socket.team, socket.id)
    if (socket.team === 'red') {
      console.log('a red user disconnected')
    } else {
      console.log('a blue user disconnected')
    }   
  })
})

http.listen(process.env.PORT || 5000, () => {
  console.log('Listening.. port 5000')
})
