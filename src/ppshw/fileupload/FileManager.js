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
      this.child = require('child_process').fork(__dirname+"/OfficeWrapper.js");
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
        if(file===null){
//          file.creationDate=Date.now;
//          file.filename.full=filename;
//          file.save();
//        }else{
          file=new File({digest:digest, filename:{full:filename}, tags:'doc'});
          file.save();
          FileManager.doStoreFile(filepath,digest,ext);
        }
      });
    },
    doStoreFile: function(filepath,digest,ext){
      var new_filename=digest;
      var storage_path=ppshw.system.Config.get('ppshw:application:upload:dir');
      var content_path=storage_path + digest + '_cnt';
      var new_path=content_path+'\\' + new_filename+'.'+ext;
      
      fs.mkdir(content_path);
      
      fs.rename(filepath,new_path);
      if(this.isOfficeFile(ext)){
        //let's create a pdf
        this.createPdf(content_path,new_path,new_filename);
      };
    },
    isOfficeFile : function(ext){
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
      case 'odt':
      case 'odc':
      case 'ott':
        return true;
      default:
          return false;
      }
    },
    getConvertCommand : function(inputfile,outputpath) {
      var cmd={
        cmd:ppshw.system.Config.get('ppshw:application:office:path'),
        params:['--headless','--convert-to','pdf','"'+inputfile+'"','--outdir','"'+outputpath+'"']
      };
      
      return cmd;
    },
    createPdf : function(content_path,filepath,filename){
      var cmd=this.getConvertCommand(filepath,content_path);
      this.addTask(cmd);
    },
    addTask : function(data, callback) {
      var id = this.taskId++;
      this.tasks[id] = callback;
      this.child.send({id: id, data: data});
    }
};
FileManager.init();

exports.handleUpload = function(filename, file){
  
  var ext = filename.split('.');
  ext=ext[ext.length-1];
  
  var hash = crypto.createHash('md5')
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