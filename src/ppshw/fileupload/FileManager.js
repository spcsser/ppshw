/**
 * New node file
 */

var fs=require('fs')
  , util=require('util')
  , crypto=require('crypto')
  , mongoose=require('mongoose')
  , File=mongoose.model('File')
;

var FileManager = {
    init : function(){
      this.child = require('child_process').fork('src/ppshw/system/Childprocess.js');
      this.taskId = 0;
      this.tasks = {};
      this.child.on('message', function(message) {
        // Look up the callback bound to this id and invoke it with the result
        if(FileManager.tasks[message.id]!==undefined){
          FileManager.tasks[message.id](message.data);
        }
      });
    },
    storeFile: function(filepath,digest,ext,filename){
      
      File.findOne({'digest':digest},function(err, file){
        if(file!==null){
//          file.creationDate=Date.now;
//          file.filename.full=filename;
//          file.save();
        }else{
          file=new File({digest:digest, filename:{full:filename}, type:'doc'});
          file.save();
        }
        FileManager.doStoreFile(filepath,digest,ext);
      });
    },
    doStoreFile: function(filepath,digest,ext){
      var new_filename=digest;
      var storage_path=ppshw.system.Config.get('ppshw:application:upload:dir');
      var content_path=storage_path + digest + '_cnt';
      var new_path=content_path + '/' + new_filename+'.'+ext;
      
      if(!fs.existsSync(new_path)){
      
        fs.mkdir(content_path);
      
        fs.rename(filepath,new_path);
        if(this.isConvertableFile(ext)){
          //let's create a pdf
          this.createPdf(content_path,new_path,new_filename);
          this.createImages(content_path,digest);
        }
      }
    },
    createPdf:function(content_path, new_path, filename){
      ppshw.converter.ConverterHandler.createPdf(content_path, new_path, filename);
    },
    createImages:function(content_path,digest){
      ppshw.converter.ConverterHandler.createImages(content_path,digest);
    },
    isPdfFile : function(ext){
      return ext==='pdf';
    },
    isConvertableFile : function(ext){
      switch(ext){
      case 'doc':
      case 'docx':
      case 'doct':
      case 'xls':
      case 'xlsx':
      case 'xlsb':
      case 'ppt':
      case 'pptx':
      case 'odf':
      case 'otf':
      case 'odt':
      case 'ott':
      case 'odc':
      case 'otc':
      case 'odp':
      case 'otp':
        return true;
      default:
          return false;
      }
    },
    addTask : function(data, runner, callback) {
      console.log(runner);
      var id = FileManager.taskId++;
      FileManager.tasks[id] = callback;
      FileManager.child.send({id: id, data: data, runner: runner});
    }
};
FileManager.init();

exports.handleUpload = function(filename, file){
  
  var ext = filename.split('.');
  ext=ext[ext.length-1];
  
  var hash = crypto.createHash('sha256')
    , stream = fs.createReadStream(file.path, {encoding: 'binary'})
  ;
  
  stream.addListener('data', function(chunk){
    hash.update(chunk);
  });
  
  stream.addListener('close', function(){
    var digest = hash.digest('hex');
    
    FileManager.storeFile(file.path,digest,ext,filename);
  });
};

//type file File expects digest, filename
exports.TYPE_FILE = "type_file";
//type pad File url, filename (extension empty)
exports.TYPE_EPL = "type_pad";
//type webpage File expects url, filename (page title as name, extension should be html) 
exports.TYPE_WEBPAGE = "type_webpage";
//type webdoc File expects url, filename
exports.TYPE_WEBDOC = "type_webdoc";
exports.addTask = FileManager.addTask;