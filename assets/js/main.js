var socket = io()
var form = document.forms[0]
var messages = document.getElementById('messages')

form.addEventListener('submit', function(e) {
  e.preventDefault()
  var message = document.getElementById('m')
  if (message.value) {
    socket.emit('chat message', message.value)
    message.value = ''
  }
  return false
})

socket.on('chat message', function(message) {
  messages.insertAdjacentHTML('beforeend', '<li>' + message + '</li>')
})
