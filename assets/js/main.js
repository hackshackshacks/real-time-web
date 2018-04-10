var socket = io()
var text = document.querySelector('#textInput')
var color = document.querySelector('#colorInput')
var balloon = {}

function createBalloon (balloon) {
  var windowWidth = document.body.getBoundingClientRect().width
  var x = Math.floor(Math.random() * windowWidth)
  document.body.insertAdjacentHTML('beforeend', '<svg style="left: ' + x + 'px" class="balloon" viewBox="0 0 38.65 80"><path fill="' + balloon.color + '" stroke="black" d="M67.32,33c0-13.8-8.65-25-19.32-25S28.67,19.19,28.67,33c0,11.67,7.59,21.44,16,24.19-.38.24-.62.51-.62.79,0,.84.78,1.54,3,1.7a29.66,29.66,0,0,0,.35,13.41c2,7,0,14.48,0,14.56l1.34.36a31.73,31.73,0,0,0,0-15.3,28.81,28.81,0,0,1-.28-13c2.66-.07,3.6-.81,3.6-1.72,0-.28-.24-.55-.62-.79C59.74,54.44,67.32,44.66,67.32,33Z" transform="translate(-28.67 -8)"/></svg>')
}
color.addEventListener('change', function (e) {
  e.preventDefault()
  balloon.color = color.value
  balloon.text = text.value
  socket.emit('balloon', balloon)
  return false
})

socket.on('balloon', function (balloon) {
  createBalloon(balloon)
})
