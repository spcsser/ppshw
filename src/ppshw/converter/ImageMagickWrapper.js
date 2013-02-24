/**
 * New node file
 */
var convertType
 , config=require(__dirname+'/../system/Config.js')
;

var PARAM_CONVERT_PAGE="PARAM_CONVERT_PAGE"
  , PARAM_CONVERT_THUMBNAIL="PARAM_CONVERT_THUMBNAIL"
;

var constructor=function(type){
  var convertType=type;
};

var getConvertCommand = function(params){
  if(convertType==PARAM_CONVERT_PAGE){
    return getPageConvertCommand(paras);
  }else if(convertType==PARAM_CONVERT_THUMBNAIL){
    return getThumbnailConvertCommand(paras);
  }
}

var getPageConvertCommand = function(params) {
  var inputFile=params.contentPath+paraparams.digest+'.pdf';
  var outputFile=params.contentPath+'thumb_%d.jpg';
  var cmd={
    cmd:ppshw.system.Config.get('ppshw:application:imagemagick:path'),
    //convert -adaptive-resize 100x144 -auto-orient -alpha background -antialias cv-swen_2.pdf thumbnail_%d.jpg
    params:['-adaptive-resize','100x144','-auto-orient','-alpha background','-antialias',inputFile,outputFile]
  };
  return cmd;
};

var getPreviewConvertCommand = function(params){
  var inputFile=params.contentPath+paraparams.digest+'.pdf';
  var outputFile=params.contentPath+'page_%d.jpg';
  var cmd={
    cmd:ppshw.system.Config.get('ppshw:application:imagemagick:path'),
    //convert -density 300 -auto-orient -alpha background -antialias cv-swen_2.pdf page_%d.jpg
    params:['-density','300','-auto-orient','-alpha background','-antialias',inputFile,outputFile]
  };
  return cmd;
};

var run=function(process,message){
    // Process data
  var exec = require('child_process').execFile
    , child
    , data=getConvertCommand(message.data)
    , cmd=data.cmd
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
    process.send({id: message.id, data: 'Converting to images'});
  });
};

exports.run=run;

module.exports=constructor;