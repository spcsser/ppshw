FileTree={
    selectDocument:function(id){
      $('div#frontpage iframe').attr('src','/pdf.js/viewer.html?file=http://localhost:3000/file/get/pdf/'+id);
    },
    showTagMenu:function(elem){
      console.log(elem);
    },
    initLinks:function(){
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