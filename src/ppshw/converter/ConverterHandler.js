/**
 * New node file
 */
var getPdfConvertParams = function(inputfile,outputpath) {
  return {inputfile:inputfile, outputpath:outputpath};
};

var getBasePath = function(){
  return __dirname + '/';
};
    
var getPdfConverter = function(){
  return getBasePath()+'LibreOfficeWrapper.js';
};

var createPdf = function(content_path,filepath,filename){
  var cmd=getPdfConvertParams(filepath,content_path);
  ppshw.fileupload.FileManager.addTask(cmd, getPdfConverter(), doneConvertTask);
};
    
var getImageConverter = function(){
  return getBasePath()+'ImageMagickWrapper';
};

var getImageConvertParams = function(contentPath,digest){
  return {contentPath:contentPath,digest:digest};
};

var createImages = function(content_path,digest){
  var cmd=getImageConvertParams(content_path,digest);
  ppshw.fileupload.FileManager.addTask(cmd, getImageConverter(), doneConvertTask);
};

var doneConvertTask = function(data) {
  var msgData={type:'convert',status:'done',msg:data};
  ppshw.system.Socket.sendMessage('file',msgData);
};

exports.createPdf=createPdf;

exports.createImages=createImages;