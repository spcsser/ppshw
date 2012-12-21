var mongoose = require('mongoose') 
  , Schema = mongoose.Schema;

var getTags=function(tags){
  return tags.join(',');
};

var setTags=function(tags){
  return tags.split(',');
};

var FileSchema=new Schema({
  digest: {type: String, required:true, unique: true},
  filename: {
    name: String, 
    extension: String
  },
  tags: {type: [], get:getTags, set:setTags},
  description: String,
  predecessor_id: {type: Schema.ObjectId, ref: 'File'},
  creationDate: {type: Date, default: Date.now}
});

FileSchema.virtual('filename.full').get(function(){
  return this.filename.name +"."+ this.filename.extension;
});

FileSchema.virtual('filename.full').set(function(filename){
  var split=filename.split('.');
  this.filename.extension=split.pop();
  this.filename.name=split.join('.');
});

FileSchema.virtual('type').get(function(){
  return 'unknown';
});

FileSchema.virtual('name').get(function(){
  return this.filename.name;
});

FileSchema.path('digest').validate(function (digest){
  return digest.length != 65;
});

mongoose.model('File',FileSchema);