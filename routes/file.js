var fs=require('fs')
  , util=require('util')
  , mongoose=require('mongoose')
  , File = mongoose.model('File')
  , mime = require('mime')
;

exports.put=function(req,res){
    var files=req.files;
    var uploadfile=files['upload']['file'];
    
    var filename=uploadfile['name'];
    
    var fuc=ppshw.fileupload.FileManager;
    
    fuc.handleUpload(filename,uploadfile);
    
    res.send('Done');
};

var getPath = function(digest,filetype){
  var dir=ppshw.system.Config.get('ppshw:application:upload:dir');
  
  return dir + digest + '_cnt/' + ( filetype===undefined ? '' : digest + '.' + filetype );
};

exports.get=function(req,res){
  var digest=req.params.digest
    , filetype=req.params.type
  ;
  
  path=getPath(digest, filetype);
  
  File.findOne({'digest':digest}).exec(function(err,file){
    if(err){
      return;
    }
    
    if(file!==null && fs.existsSync(path)){
      var filename=file.filename.name;
      var stat = fs.statSync(path);
    
      res.set({
        'Content-Type':mime.lookup(filetype),
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

exports.remove = function(req,res){
  var digest=req.params.digest;
  
  path=getPath(digest);
  File.where('digest').equals(digest).remove(function(err){
    console.log("File removed from collection. %s",err);
  });
  
  if(fs.existsSync(path)){
    fs.unlink(path,function(err){
      console.log('Done, %s',err);
    });
  }
  res.send('Done.');
};

exports.addTags = function(req,res){
  var digest=req.params.digest
    , tags=req.params.tags
  ;
  
  File.findOne({'digest':digest},function(err,file){
    if(err){
      return;
    }

    if(file!==null){
      file.addTags(tags);
      file.save();
      msg='Tags '+tags+' added to file '+digest;
    }else{
      msg="File not found";
      res.status(404);
    }
    res.send(msg);
  });
};

exports.removeTags = function(req,res){
  var digest=req.params.digest
    , tags=req.params.tags
  ;

  File.findOne({'digest':digest},function(err,file){
    if(err){
      return;
    }
    if(file!==null){
      file.removeTags(tags);
      file.save();
      msg='Tags '+tags+' removed from file '+digest;
    }else{
      msg="File not found";
      res.status(404);
    }
    res.send(msg);
  });
};

exports.setTags = function(req,res){
  var digest=req.body.digest
    , tags=req.body.tags
  ;
  
  console.info("Updating tags for digest: ",digest," with tags ", tags);
  
  File.findOne({digest:digest},function(err,file){
    if(file!==null && !err){
      file.tags=tags;
      file.save();
      msg='Tags '+tags+' set for file '+digest;
    }else{
      msg="File not found";
      res.status(404);
    }
    res.send(msg);
  });
};

exports.getTags = function(req,res){
  var digest=req.body.digest;
  
  File.findOne({'digest':digest},function(err,file){
    if(err){
      return;
    }
    if(file!==null){
      msg={'file':digest,'tags':file.tags};
    }else{
      msg="File not found";
      res.status(404);
    }
    res.send(msg);
  });
};