/**
 * New node file
 */
var getPdfConvertParams = function(inputfile,outputpath) {
  return {inputfile:inputfile, outputpath:outputpath};
};
    
 var getPdfConverter = function(){
  return pphshw.converter.LibreOfficeWrapper;
};

var createPdf : function(content_path,filepath,filename){
  var cmd=getPdfConvertParams(filepath,content_path);
  addTask(cmd, getPdfConverter(), doneConvertTask);
};
    
var getImageConverter : function(){
  return ppshw.converter.ImageMagickWrapper;
};

var getImageConverterParams = function(contentPath,digest){
  return {contentPath:contentPath,digest:digest};
};

var createImages : function(content_path,digest){
  var cmd=getImageConvertParams(content_path,digest);
  addTask(cmd, getImageConverter(), doneConvertTask);
};

var doneConvertTask : function(data) {
  var msgData={type:'convert',status:'done',msg:data};
  ppshw.system.Socket.sendMessage('file',msgData);
};
    
var addTask : function(data, runner, callback) {
  console.log(runner);
  var id = taskId++;
  tasks[id] = callback;
  child.send({id: id, data: data, runner: runner});
};

exports.createPdf=createPdf(content_path,filepath,filename);

exports.createImages=createImages(content_path);