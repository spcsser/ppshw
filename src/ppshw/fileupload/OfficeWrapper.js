/**
 * New node file
 */
process.on('message', function(message) {
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
   [],
   function (error, stdout, stderr) {
     console.log('stdout: ' + stdout);
     console.log('stderr: ' + stderr);
     if (error !== null) {
       console.log('exec error: ' + error);
     }
   }
  );
  process.send({id: message.id, data: 'some result'});
});
