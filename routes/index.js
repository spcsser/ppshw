
/*
 * GET home page.
 */

var mongoose = require('mongoose')
  , File = mongoose.model('File')
;

var props={
    title:'Index',
    menuitems:[]
};

var render= function(res,file){
  res.render(file, props);
};

var cTotal=0;

var setCompleteCount = function(count){
  cTotal=count;
};

var addCompleteCount = function(add){
  cTotal+=add;
};

var complete = function(res,file){
  cTotal--;
  if(cTotal===0){
    render(res,file);
  }
};

var createFileTree=function(res,file){
  props.tagsandfiles={};
  setCompleteCount(2);
  File.find({'tags':[]},function(err,files){
    if(err){
      return;
    }
    props.tagsandfiles['No Tag']=files;
    complete(res,file);
  });
  
  File.find().distinct('tags',function(err1,tags){
    if(err1){
      return;
    }
    addCompleteCount(tags.length);
    tags.forEach(function (tag) {
      File.find({'tags':tag},function(err2,f){
        if(err2){
          return;
        }
        props.tagsandfiles[tag]=f;
        complete(res,file);
      });
    });
    complete(res,file);
  });
};

exports.index = function(req, res){
  props.pages=[
    {text:'Filename 1 page 1',preview:'flyer_aktion_bade_beach_2010.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_bade_beach_2011.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_fruehling_2010.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2009.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2010.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2011.png'},
    {text:'Filename 1 page 3',preview:'flyer_aktion_herbst_2012.png'}
  ];
  createFileTree(res,'index');
};

exports.filetree = function(req,res){
  createFileTree(res,'filetree');
};