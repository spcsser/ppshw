var mongoose = require('mongoose') 
  , Schema = mongoose.Schema 
;

var EtherpadSchema=new Schema({
  url: {type: String, required:true, unique: true},
  apiKey: String,
  name: String
});

mongoose.model('Etherpad',EtherpadSchema);