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
  Etherpad.find({}, function(err,epls){
    pads={};
    if(err || epls!=null){
      async.forEach(
        epls,
        function(epi){
          getPadsForEPLInstance(epi,callback);
        },
        function(err){
          if(err){
            console.log(err);
            callback();
          }
        }
      );
    }else{
      callback();
    }
  });
};

var getPadsForEPLInstance=function(epi,callback){
  var reqUrl=epi.url+"/api/1.2.1/listAllPads?apikey="+epi.apiKey;
  reqUrl=reqUrl.replace(/\/\//g, '/');
  reqUrl=reqUrl.replace(/http:\//g,'http://');
  console.log("Issuing request to "+reqUrl);
  http.get(reqUrl, function(res) {
    if(res.statusCode==200){
      console.log('Incoming request valid.');
      res.on('data',function(resData){
        var data = JSON.parse(resData);
        pads[epi.url]={};
        pads[epi.url].name=epi.name;
        pads[epi.url].pads=data.data.padIDs;
        callback();
      });
    }else{
      console.warn("Got wrong http status code: "+res.statusCode);
      callback();
    }
  }).on('error', function(e) {
    console.warn("Got error: " + e.message);
    callback();
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