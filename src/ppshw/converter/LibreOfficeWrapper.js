/**
 * New node file
 */
var config=require(__dirname+'/../system/Config.js')
;
 
var getConvertCommand = function(params) {
      var cmd={
        cmd:config.get('ppshw:application:office:path'),
        params:['--headless','--convert-to','pdf','"'+params.inputfile+'"','--outdir','"'+params.outputpath+'"']
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
    process.send({id: message.id, data: {msg:'Converting to pdf'}});
  });
};

exports.run=run;