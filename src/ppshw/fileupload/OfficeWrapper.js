var run=function(process,message){
    // Process data
  var exec = require('child_process').execFile
    , child
    , cmd=message.data.cmd
    , params=message.data.params
    , options={ encoding: 'utf8',
        timeout: 0,
        maxBuffer: 200*1024,
        killSignal: 'SIGTERM',
        cwd: null,
        env: null }
  ;
  
  console.log(cmd);
  console.log(params);
  
  child = exec(
   cmd,
   params,
   options,
   function (error, stdout, stderr) {
     console.log('stdout: ' + stdout);
     console.log('stderr: ' + stderr);
     if (error !== null) {
       console.log('exec error: ' + error);
     }
   }
  );
  child.on('exit',function(code,signal){
    process.send({id: message.id, data: 'Done'});
  });
};

exports.run=run;