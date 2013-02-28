/**
 * New node file
 */
var convertType
 , config=require(__dirname+'/../system/Config.js')
;
var PARAM_CONVERT_PAGE="PARAM_CONVERT_PAGE"
  , PARAM_CONVERT_THUMBNAIL="PARAM_CONVERT_THUMBNAIL"
;

var getConvertCommand = function(params){
  if(params.convertType==PARAM_CONVERT_PAGE){
    return getPageConvertCommand(params);
  }else if(params.convertType==PARAM_CONVERT_THUMBNAIL){
    return getThumbnailConvertCommand(params);
  }else{
    console.error("Unknown convertType:",params.convertType);
  }
};

var getPageConvertCommand = function(params) {
  var inputFile=params.contentPath+'/'+params.digest+'.pdf';
  var outputFile=params.contentPath+'/thumb_%d.jpg';
  var data={
    cmd:config.get('ppshw:application:imagemagick:path'),
    //convert -adaptive-resize 100x144 -auto-orient -alpha background -antialias cv-swen_2.pdf thumbnail_%d.jpg
    params:['-adaptive-resize','100x144','-auto-orient','-alpha','background','-antialias',inputFile,outputFile]//'-alpha background',
  };
  return data;
};

var getThumbnailConvertCommand = function(params){
  var inputFile=params.contentPath+'/'+params.digest+'.pdf';
  var outputFile=params.contentPath+'/page_%d.jpg';
  var data={
    cmd:config.get('ppshw:application:imagemagick:path'),
    //convert -density 300 -auto-orient -alpha background -antialias cv-swen_2.pdf page_%d.jpg
    params:['-density','300','-auto-orient','-alpha','background','-antialias',inputFile,outputFile]//'-alpha background',
  };
  return data;
};

var run=function(process,message){
    // Process data
  var exec = require('child_process').execFile
    , child
    , data=getConvertCommand(message.data)
  ;

  var cmd=data.cmd
    , params=data.params
    , options={ encoding: 'utf8',
        timeout: 0,
        maxBuffer: 200*1024,
        killSignal: 'SIGTERM',
        cwd: null,
        env: null }
  ;
  
  //console.log(cmd);
  //console.log(params);
  
  child = exec(
   cmd,
   params,
   options,
   function (error, stdout, stderr) {
     if (error !== null) {
       console.log('exec error: ' + error);
     }
   }
  );
  child.on('exit',function(code,signal){
    process.send({id: message.id, data: {msg:'Converting to images'}});
  });
};

exports.constructor=constructor;

exports.run=run;

exports.PARAM_CONVERT_PAGE=PARAM_CONVERT_PAGE;
exports.PARAM_CONVERT_THUMBNAIL=PARAM_CONVERT_THUMBNAIL;
