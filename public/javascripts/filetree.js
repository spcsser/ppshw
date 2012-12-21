FileTree={
    selectDocument:function(id){
      $('div#frontpage iframe').attr('src','/pdf.js/viewer.html?file=http://localhost:3000/file/get/pdf/'+id);
    },
};

$(document).ready(function(event){
  $('.ft_l2_entry').live('click',function(e){
    FileTree.selectDocument($(this).attr('id'));
  });
});