var socket = io.connect('http://localhost:3000');
socket.on('file', function (data) {
  console.log(data);
});