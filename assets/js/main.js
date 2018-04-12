var socket = io()
var balloonBtn = document.querySelector('button')
var redScore = document.querySelector('#redScore')
var blueScore = document.querySelector('#blueScore')
var teamEl = document.querySelector('#team')
var startSplash = document.querySelector('.startSplash')
var timer = document.querySelector('#time')
var winner = document.querySelector('#winner')
var myTeam

balloonBtn.addEventListener('click', function (e) {
  var balloon = {
    x: ((e.pageX - 80) / window.innerWidth) * 100,
    team: myTeam
  }
  socket.emit('balloon', balloon)
})
function createBalloon (balloon) {
  var newBalloon = document.createElement('div')
  newBalloon.classList.add('balloon')
  newBalloon.style.left = balloon.x + '%'
  newBalloon.innerHTML = '<svg viewBox=" 0 0 38.65 80"> <path class="' + balloon.team + '" stroke="black" d="M67.32,33c0-13.8-8.65-25-19.32-25S28.67,19.19,28.67,33c0,11.67,7.59,21.44,16,24.19-.38.24-.62.51-.62.79,0,.84.78,1.54,3,1.7a29.66,29.66,0,0,0,.35,13.41c2,7,0,14.48,0,14.56l1.34.36a31.73,31.73,0,0,0,0-15.3,28.81,28.81,0,0,1-.28-13c2.66-.07,3.6-.81,3.6-1.72,0-.28-.24-.55-.62-.79C59.74,54.44,67.32,44.66,67.32,33Z" transform="translate(-28.67 -8)"/></svg>'
  newBalloon.setAttribute('id', balloon.id)
  newBalloon.addEventListener('click', function () {
    if (balloon.team !== myTeam) {
      socket.emit('destroy', {id: balloon.id, team: balloon.team})
    }
  })
  newBalloon.addEventListener('animationend', function () {
    socket.emit('score', balloon.team)
    socket.emit('destroy', {id: balloon.id, team: balloon.team})
  })
  document.body.appendChild(newBalloon)
}
function destroyBalloon (balloon) {
  var destroy = document.getElementById(balloon)
  if (destroy) {
    document.body.removeChild(destroy)
  }
}

function updateScore (score) {
  redScore.innerHTML = score.redScore
  blueScore.innerHTML = score.blueScore
}

socket.on('team', function (team) {
  if (!myTeam) {
    myTeam = team
    teamEl.innerHTML = myTeam
    if (myTeam === 'red') {
      startSplash.style.background = '#d11d05'
    } else if (myTeam === 'blue') {
      startSplash.style.background = 'dodgerblue'
    }
  }
})
socket.on('balloon', function (balloon) {
  createBalloon(balloon)
})

socket.on('destroy', function (balloon) {
  destroyBalloon(balloon)
})

socket.on('score', function (score) {
  updateScore(score)
})

socket.on('gameTime', function (time) {
  timer.innerHTML = time
})

socket.on('gameOver', function (team) {
  if (team !== 'draw') {
    timer.innerHTML = team + ' team wins!'
  } else {
    timer.innerHTML = 'Draw!'
  }
  var remainingBalloons = document.querySelectorAll('.balloon')
  remainingBalloons.forEach(function (balloon) {
    document.body.removeChild(balloon)
  })
  winner.classList.add('end')
  balloonBtn.disabled = true
})

socket.on('newGame', function (time) {
  balloonBtn.disabled = false
})

winner.addEventListener('animationend', function () {
  winner.classList.remove('end')
})
