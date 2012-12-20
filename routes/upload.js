/**
 * New node file
 */
exports.upload = function(req,res){
  var files=req.files;
  var uploadfile=files['upload']['file'];
  
  var filename=uploadfile['name'];
  
  var fuc=ppshw.fileupload.FileManager;
  
  fuc.handleUpload(filename,uploadfile);
  
  res.send('Done');
};