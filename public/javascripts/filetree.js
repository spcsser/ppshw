FileTree={
  baseUrl:null,
  getBaseUrl:function(){
    if(this.baseUrl===null){
        var bUrl=window.location.href;
        console.log(bUrl);
        this.baseUrl=bUrl;
    }
    return this.baseUrl;
  },
  selectDocument:function(id){
      $('div#frontpage iframe').attr('src','/pdf.js/viewer.html?file='+this.getBaseUrl()+'file/get/pdf/'+id);
  },
  showTagMenu:function(elem){
    console.log(elem);
  },
  initLinks:function(){
    this.getBaseUrl();
    $('.ft_l2_entry')
      .live('click',function(e){
        FileTree.selectDocument($(this).attr('id'));
      })
      .find('.tagBtn')
      .live('click', function(e){
        e.stopPropagation();
        FileTree.showTagMenu($(this));
      })
    ;
  },
};

$(document).ready(function(event){
  FileTree.initLinks();
});