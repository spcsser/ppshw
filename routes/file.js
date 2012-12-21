var fs=require('fs')
  , util=require('util')
  , mongoose=require('mongoose')
  , File = mongoose.model('File')
;

exports.get=function(req,res){
  var dir=ppshw.system.Config.get('ppshw:application:upload:dir')
    , digest=req.params.digest
    , filetype=req.params.type
  ;
  
  path=dir + digest + '_cnt/' + digest + '.'+filetype;
  
  File.findOne({'digest':digest}).exec(function(err,file){
    if(err){
      return;
    }
    
    if(file!==null && fs.existsSync(path)){
      var filename=file.filename.name;
      var stat = fs.statSync(path);
    
      res.set({
        'Content-Type':'application/'+filetype,
        'Content-Length':stat.size,
        'Content-Disposition': 'inline; filename="'+filename+'.'+filetype+'"'
      });
    
      var readStream = fs.createReadStream(path);
      // We replaced all the event handlers with a simple call to util.pump()
      util.pump(readStream, res);
    }else{
      res.status(404).send('File not found');
    }
  });
};