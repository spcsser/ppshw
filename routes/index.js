
/*
 * GET home page.
 */

exports.index = function(req, res){
  var tagsandfiles={
    example: [
      {type:'unknown',name:'Filename 1'},
      {type:'unknown',name:'Filename 2'},
      {type:'unknown',name:'Filename 3'}
    ], 
    anone: [
      {type:'unknown',name:'Filename 1'},
      {type:'unknown',name:'Filename 2'},
      {type:'unknown',name:'Filename 3'},
      {type:'unknown',name:'Filename 4'},
      {type:'unknown',name:'Filename 5'},
      {type:'unknown',name:'Filename 6'},
      {type:'unknown',name:'Filename 7'},
      {type:'unknown',name:'Filename 8'}
    ],
    twest: [
      {type:'unknown',name:'Filename 1'},
      {type:'unknown',name:'Filename 2'},
      {type:'unknown',name:'Filename 3'},
      {type:'unknown',name:'Filename 4'},
      {type:'unknown',name:'Filename 5'}
    ],
    myexample: [
      {type:'unknown',name:'Filename 1'},
      {type:'unknown',name:'Filename 2'},
      {type:'unknown',name:'Filename 3'}
    ], 
    antwo: [
      {type:'unknown',name:'Filename 1'},
      {type:'unknown',name:'Filename 2'},
      {type:'unknown',name:'Filename 3'},
      {type:'unknown',name:'Filename 4'},
      {type:'unknown',name:'Filename 5'},
      {type:'unknown',name:'Filename 6'},
      {type:'unknown',name:'Filename 7'},
      {type:'unknown',name:'Filename 8'}
    ],
    thriest: [
      {type:'unknown',name:'Filename 1'},
      {type:'unknown',name:'Filename 2'},
      {type:'unknown',name:'Filename 3'},
      {type:'unknown',name:'Filename 4'},
      {type:'unknown',name:'Filename 5'}
    ]
  };
  var pages=[
             {text:'Filename 1 page 1',preview:'flyer_aktion_bade_beach_2010.png'},
             {text:'Filename 1 page 2',preview:'flyer_aktion_bade_beach_2011.png'},
             {text:'Filename 1 page 2',preview:'flyer_aktion_fruehling_2010.png'},
             {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2009.png'},
             {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2010.png'},
             {text:'Filename 1 page 2',preview:'flyer_aktion_herbst_2011.png'},
             {text:'Filename 1 page 3',preview:'flyer_aktion_herbst_2012.png'}
  ];
  
  res.render('index', { title: 'ppshw', tagsandfiles: tagsandfiles, pages: pages, menuitems: [] });
};