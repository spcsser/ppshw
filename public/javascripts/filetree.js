FileTree={
  baseUrl:null,
  getBaseUrl:function(){
    if(this.baseUrl===null){
        var bUrl=window.location.href;
        this.baseUrl=bUrl;
    }
    return this.baseUrl;
  },
  openDocument:function(id){
      $('div#frontpage iframe').attr('src','/pdf.js/viewer.html?file='+this.getBaseUrl()+'file/get/pdf/'+id);
  },
  showTagMenu:function(elem){
    console.log(elem);
  },
  initLinks:function(){
    this.getBaseUrl();
    $('.ft_l2_entry')
      .live('click',function(e){
        FileTree.openDocument($(this).attr('id'));
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