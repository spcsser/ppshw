/**
 * New node file
 */

var nconf=require('nconf')
  , fs=require('fs')
  , wrench=require('wrench')
;
nconf.argv().env();
nconf.file({file: 'config.json'});
nconf.defaults({
  'http': {
      'port': 3000
  }
});

var upDir=nconf.get('ppshw:application:upload:dir');
if(!fs.existsSync(upDir)){
  wrench.mkdirSyncRecursive(upDir);
}

module.exports=nconf;