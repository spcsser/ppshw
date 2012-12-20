/**
 * New node file
 */

var nconf=require('nconf');
nconf.argv().env();
nconf.file({file: 'config.json'});
nconf.defaults({
  'http': {
      'port': 3000
  }
});


module.exports=nconf;