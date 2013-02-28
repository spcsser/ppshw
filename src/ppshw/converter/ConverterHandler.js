/**
 * New node file
 */
var Imgck=ppshw.converter.ImageMagickWrapper
  , _=require("underscore");
 
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
  ppshw.fileupload.FileManager.addTask(cmd, getPdfConverter(), function(){
    createImages(content_path,digest);
    doneConvertTask();
   });
};
    
var getImageConverter = function(){
  return getBasePath()+'ImageMagickWrapper';
};

var getImageConvertParams = function(contentPath,digest){
  return {contentPath:contentPath,digest:digest,convertType:""};
};

var createImages = function(content_path,digest){
  var cmd=getImageConvertParams(content_path,digest)
    , FileManager=ppshw.fileupload.FileManager
  ;
  
  cmd.convertType=Imgck.PARAM_CONVERT_PAGE;
  FileManager.addTask(cmd, getImageConverter(), doneConvertTask);

  cmd.convertType=Imgck.PARAM_CONVERT_THUMBNAIL;
  FileManager.addTask(cmd, getImageConverter(), doneConvertTask);
};

var doneConvertTask = function(data) {
  var msgData={type:'convert',status:'done',msg:data};
  ppshw.system.Socket.sendMessage('file',msgData);
};

exports.createPdf=createPdf;

exports.createImages=createImages;