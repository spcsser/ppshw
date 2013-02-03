/**
 * New node file
 */
var http = require('http')
  , mongoose = require('mongoose')
  , Etherpad = mongoose.model('Etherpad')
  , async = require('async')
;

var pads=null;

var getPadListing = function(callback){
  Etherpad.find({}, function(epls){
    pads={};
    async.forEach(function(err,callback){
      getPadsForEPLInstance(epi);
    });
  });
};

var getPadsForEPLInstance=function(epi){
  var reqUrl=epi.url+"/api/1.2.1/listAllPads?apikey="+epi.apiKey;
  reqUrl=reqUrl.replace(/\/\//g, '/');
  http.get(reqUrl, function(res) {
    if(res.statusCode==200){
      var data = JSON.parse(res.data);
      pads[epi.url]={};
      pads[epi.url].name=epi.name;
      pads[epi.url].pads=data.padIDs;
    }else{
      console.log("Got wrong http status code: "+res.statusCode);
    }
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};
 
exports.getPads=function(callback){
  if(pads==null){
    getPadListing(function(){
      callback(pads);
    });
  }else{
    callback(pads);
  }
};