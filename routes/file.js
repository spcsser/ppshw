var fs=require('fs')
  , util=require('util')
  , mongoose=require('mongoose')
  , File = mongoose.model('File')
  , mime = require('mime')
  , wrench = require('wrench')
;

var GETTYPE_FILE="FILE",
  GETTYPE_PAGE="PAGE",
  GETTYPE_THUMBNAIL="THUMBNAIL"
;
 

exports.put=function(req,res){
    var files=req.files;
    var uploadfile=files['upload']['file'];
    
    var filename=uploadfile['name'];
    
    var fuc=ppshw.fileupload.FileManager;
    
    fuc.handleUpload(filename,uploadfile);
    
    res.send('Done');
};

var getPath = function(digest,filetype, pageNo, type){
  var dir=ppshw.system.Config.get('ppshw:application:upload:dir')
    , filename=""
  ;
  if(type==GETTYPE_FILE){
    filename= digest + '.' + filetype;
  }else if(type==GETTYPE_PAGE){
    filename='page_'+pageNo+'.jpg';
  }else if(type==GETTYPE_THUMBNAIL){
    filename= 'thumb_'+pageNo+'.jpg';
  }
  return dir + digest + '_cnt/' + filename;
};

exports.getDocument=function(req,res){
  get(req,res,GETTYPE_FILE);
};

exports.getPage=function(req,res){
  get(req,res,GETTYPE_PAGE);
};

exports.getThumbnail=function(req,res){
  get(req,res,GETTYPE_THUMBNAIL);
};

var getFileType=function(req,type){
  return req.params.type !== undefined ? req.params.type : 'jpg';
};

var getPageNo=function(req){
  return req.params.page;
};

var get=function(req,res,type){
  var digest=req.params.digest
    , filetype=getFileType(req,type)
    , pageNo=getPageNo(req)
  ;
  path=getPath(digest, filetype, pageNo, type);
  /*File.findOne({'digest':digest}).exec(function(err,file){
    if(err){
      res.status(500).send('Internal server error.');
    }else if(file==null){
      res.status(403).send('File not found in database.');
    }else */if(!fs.existsSync(path)){
      res.status(404).send('File not found');
    }else{
      //var filename=file.filename.name;
      var stat = fs.statSync(path);
      
//      if(pageNo===undefined){
//        filename+='_0';
//      }
    
      res.set({
        'Content-Type' : mime.lookup(filetype),
        'Content-Length' : stat.size,
//        'Content-Disposition' : 'inline; filename="'+filename+'.'+filetype+'"'
      });
    
      var readStream = fs.createReadStream(path);
      // We replaced all the event handlers with a simple call to util.pump()
      util.pump(readStream, res);
    }
//  });
};

exports.remove = function(req,res){
  var digest=req.body.digest;
  
  path=getPath(digest);
  File.where('digest').equals(digest).remove(function(err){
    console.log("File removed from collection. %s",err);
  });
  
  if(fs.existsSync(path)){
    if(wrench.rmdirSyncRecursive(path)!=0){
      console.error('Directory could not be be removed.');
    }
  }
  res.send('Done.');
};

exports.addTags = function(req,res){
  var digest=req.body.digest
    , tags=req.body.tags
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
  var digest=req.body.digest
    , tags=req.body.tags
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
  
  File.findOne({digest:digest},function(err,file){
    if(!err && file!==null){
      msg={'file':digest,'tags':file.tags};
    }else{
      msg="File not found";
      res.status(404);
    }
    res.send(msg);
  });
};