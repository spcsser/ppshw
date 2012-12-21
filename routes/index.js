
/*
 * GET home page.
 */

var mongoose=require('mongoose')
  , File=mongoose.model('File')
;

var props={
  pages:[
    {text:'Filename 1 page 1',preview:'flyer_aktion_bade_beach_2010.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_bade_beach_2011.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_fruehling_2010.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2009.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2010.png'},
    {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2011.png'},
    {text:'Filename 1 page 3',preview:'flyer_aktion_herbst_2012.png'}
  ],
  tagsandfiles:{},
  title:'Index',
  menuitems:[],
};

var render= function(res){
  res.render('index', props);
};

exports.index = function(req, res){
  File.find({'tags':[]},function(err,files){
    if(err){
      return;
    }
    props.tagsandfiles['No Tag']=files;
  });
  File.find().distinct('tags',function(err,tags){
    if(err){
      return;
    }
    tags.forEach(function (tag) {
      File.find({'tags':tag},function(err2,files){
        if(err2){
          return;
        }
        props.tagsandfiles[tag]=files;
      });
    });
    render(res);
  });
};