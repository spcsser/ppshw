var socketio;

var init = function(io){
  socketio=io;
};

exports.init = init;

exports.sendMessage = function(eventname, data){
  socketio.sockets.emit(eventname, data);
};