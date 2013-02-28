
/**
 * Module dependencies.
 */

require('autoloader').autoload(__dirname + '/src');

var express = require('express')
  , http = require('http')
  , path = require('path')
  , config = ppshw.system.Config
  , fs = require('fs')
;

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.connect(config.get('ppshw:db'));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log('Db connection established.');
});

var model_path = __dirname + '/model/'
  , model_files = fs.readdirSync(model_path);
model_files.forEach(function (myfile) {
  require(model_path+'/'+myfile);
});

var app = express();

app.configure(function(){
  app.set('port', config.get('http:port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var routes = require('./routes')
  , fileRoute = require('./routes/file')
  , indexRoute = require('./routes/index')
  , adminSettingsRoute = require('./routes/admin/settings')
  , showRoute = require('./routes/show')
;
/*
var sessionTransfer=function(req,res){
  global.session=req.session;
  req.next();
};

app.get('*',sessionTransfer);
app.post('*',sessionTransfer);
*/
app.get('/', routes.index);
app.post('/file/upload', fileRoute.put);
app.get('/file/get/:type/:digest',fileRoute.get);
app.post('/file/remove',fileRoute.remove);
app.get('/filetree', indexRoute.filetree);

app.post('/file/addtags', fileRoute.addTags);
app.post('/file/removetags', fileRoute.removeTags);
app.post('/file/settags',fileRoute.setTags);
app.post('/file/gettags',fileRoute.getTags);

app.get('/admin/settings', adminSettingsRoute.index);

app.get('/show/:digest/:page', showRoute.index);

var server = http.createServer(app)
  , io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
ppshw.system.Socket.init(io);