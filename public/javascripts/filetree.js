FileTree={
    selectDocument:function(id){
      $('div#frontpage iframe').attr('src','/pdf.js/viewer.html?file=http://localhost:3000/file/get/pdf/'+id);
    },
    showTagMenu:function(elem){
      console.log(elem);
    },
};

$(document).ready(function(event){
  $('.ft_l2_entry')
    .on('click',function(e){
      FileTree.selectDocument($(this).attr('id'));
    })
    .find('.tagBtn')
    .on('click', function(e){
      e.stopPropagation();
      FileTree.showTagMenu($(this));
    });
});