/**
 * New node file
 */
var mongoose = require('mongoose')
  , Etherpad = mongoose.model('Etherpad')
  , Socket = ppshw.system.Socket
;

var render=function(req, res){
  Etherpad.find({}, function(err, eplis){
    res.render('admin/settings',{title:'ppshw &gt; Settings', menuitems:[], eplis:eplis});
  });  
};

exports.index = function(req, res){
  init();
  render(req, res);
};

var isEplIDataCorrect = function(epli){
  return true;
}

var init = function(){
  var io = Socket.getInstance().of("/admin/settings");
  io.on('connection', function (socket) {

    socket.on("addEplInstance", function(epli){
      if(isEplIDataCorrect(epli)){
        //epli should have url, name, apikey
        var ep=new Etherpad(epli);
        ep.save();
      }else{
        //issue an error
      }
    });
  });
};