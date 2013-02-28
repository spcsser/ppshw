var mongoose = require('mongoose') 
  , Schema = mongoose.Schema;

var is_array=function(sv){
  return Object.prototype.toString.call( sv ) === '[object Array]';
};

var getTags=function(tags){
  return tags.join(',');
};

var setTags=function(tags){
  return is_array(tags) ? tags : tags.replace(/ +,|, +/g,',').split(',');
};

var FileSchema=new Schema({
  digest: {type: String, required:true, unique: true},
  filename: {
    name: String, 
    extension: String
  },
  tags: {type: [], get: getTags, set: setTags},
  description: String,
  predecessor_id: {type: Schema.ObjectId, ref: 'File'},
  creationDate: {'type': Date, 'default': Date.now},
  url: String,
  type: String,
  pageCount: Number
});

FileSchema.virtual('filename.full').get(function(){
  return this.filename.name +"."+ this.filename.extension;
});

FileSchema.virtual('filename.full').set(function(filename){
  var split=filename.split('.');
  this.filename.extension=split.pop();
  this.filename.name=split.join('.');
});

FileSchema.methods.addTags = function(tags){
  if(is_array(tags)){
    tags=tags.join(',');
  }
  this.tags+=','+tags;
};

FileSchema.methods.removeTags = function(tags){
  if(typeof(tags)=='string'){
    tags=tags.split(',');
  }
  var mytags=this.tags.split(',');
  tags.forEach(function(tag){
    mytags.splice(mytags.indexOf(tag), 1);
  });
  this.tags=mytags;
};

FileSchema.virtual('name').get(function(){
  return this.filename.name;
});

mongoose.model('File',FileSchema);