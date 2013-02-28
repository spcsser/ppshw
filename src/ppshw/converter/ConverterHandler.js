/**
 * New node file
 */
var Imgck=ppshw.converter.ImageMagickWrapper
  , _=require("underscore")
  , fs=require("fs")
  , mongoose=require('mongoose')
  , File=mongoose.model('File')
;
 
var getPdfConvertParams = function(inputfile,outputpath,digest) {
  return {inputfile:inputfile, outputpath:outputpath,digest:digest};
};

var getBasePath = function(){
  return __dirname + '/';
};
    
var getPdfConverter = function(){
  return getBasePath()+'LibreOfficeWrapper.js';
};

var createPdf = function(content_path,filepath,filename,digest){
  var cmd=getPdfConvertParams(filepath,content_path,digest);
  ppshw.fileupload.FileManager.addTask(cmd, getPdfConverter(), function(data){
    createImages(content_path,digest);
    doneImagesTask(data);
   });
};
    
var getImageConverter = function(){
  return getBasePath()+'ImageMagickWrapper.js';
};

var getImageConvertParams = function(contentPath,digest){
  return {contentPath:contentPath,digest:digest,convertType:""};
};

var countPagesForDocument = function(content_path, digest){
  var files = fs.readdirSync(content_path)
    , count = 0
    , matches = new RegExp('^thumb_\\d+\\.jpg$','')
  ;
  files.forEach(function(file){
    console.info(file);
    if(matches.test(file)){
      count++;
    }
  });
  File.findOne({digest:digest},function(err,file){
    if(err || file == null){
      console.error('File not found in db: '+digest);
      return;
    }else{
      file.pageCount=count;
      file.save();
    }
  });
};

var createImages = function(content_path,digest){
  var cmd=getImageConvertParams(content_path, digest)
    , FileManager=ppshw.fileupload.FileManager
  ;

  cmd.convertType=Imgck.PARAM_CONVERT_THUMBNAIL;
  FileManager.addTask(cmd, getImageConverter(), doneImagesTask);
  
  cmd.convertType=Imgck.PARAM_CONVERT_PAGE;
  FileManager.addTask(cmd, getImageConverter(), function(data){
    //setTimeout(function(){
      countPagesForDocument(content_path, digest);
      doneConvertTask(data);
    //},1000);
  });
};

var doneImagesTask = function(data){
};

var doneConvertTask = function(data) {
  var msgData={type:'convert',status:'done',msg:data.msg};
  ppshw.system.Socket.sendMessage('file',msgData);
};

exports.createPdf=createPdf;

exports.createImages=createImages;