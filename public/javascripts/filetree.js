FileTree={
    selectDocument:function(id){
      $('#pagelist').removeClass('hidden');
      $('#pagelist li').fadeOut();
      //remove former entries
      $('#pagelist li').remove();
      
      $('#pagelist li').fadeIn();
    },
};

$(document).ready(function(event){
  $('.ft_l2_entry').live('click',function(e){
    FileTree.selectDocument($(this).attr('id'));
  });
});