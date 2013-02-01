/**
 * New node file
 */
process.on('message', function(message) {
  console.log(message);
  var runner=require(message.runner);
  console.log(runner);
  runner.run(process,message);
});