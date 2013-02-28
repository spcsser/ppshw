FileTree={
  baseUrl:null,
  getBaseUrl:function(){
    if(this.baseUrl===null){
        var bUrl=window.location.href;
        this.baseUrl=bUrl;
    }
    return this.baseUrl;
  },
  openAsPdf:function(){
    return false;
  },
  openDocument:function(id){
    if(this.openAsPdf()){
      $('div#pagelist').addClass('hidden');
      $('div#pages').addClass('hidden');
      $('div#fp_ifr').removeClass('hidden').attr('src','/pdf.js/viewer.html?file='+this.getBaseUrl()+'file/get/pdf/'+id);
    }else{
      $('div#fp_ifr').addClass('hidden');
      $('div#pagelist').removeClass('hidden');
      $('div#pages').removeClass('hidden');
    }
  },
  openPad:function(elem){
    var link=elem.parent().find('a.padlink').attr('href');
    $('div#frontpage iframe').attr('src',link);
  },
  showTagMenu:function(elem){
    var editor=$('#jsmenu #jseditor')
      , digest=elem.attr('id')
    ;
    
    editor.find('form').attr('action','#');
    $.post('/file/gettags',{digest:digest},function(data){
      var val='';
      if(data!=null && data.tags!=null){
        val=data.tags;
      }
      editor.find('input#editor_input').val(val);      
      editor.removeClass('hidden').offset(elem.offset());
    });
    
    var submitHandler=function(e){
      e.preventDefault();
      e.stopPropagation();
      var tags=editor.find('input#editor_input').attr('value');
      $.post('/file/settags',{digest:digest,tags:tags},function(){
        editor.addClass('hidden');
        FileTree.updateTree();
      });
    };
    
    var removeHandler=function(e){
      e.preventDefault();
      e.stopPropagation();
      if(confirm('Are you sure that you want to remove this file?')){
        $.post('/file/remove',{digest:digest},function(){
          editor.addClass('hidden')
          FileTree.updateTree();
        });
      }
    };
    
    var closeHandler=function(e){
      e.preventDefault();
      e.stopPropagation();
      editor.addClass('hidden')
    };
    
    editor.find('form, input#editor_submit').unbind('submit').on('submit',submitHandler);
    editor.find('input#editor_submit').unbind('click').on('click',submitHandler);
    editor.find('input#editor_delete').unbind('click').on('click',removeHandler);
    editor.find('input#editor_close').unbind('click').on('click',closeHandler);
  },
  initLinks:function(){
    this.getBaseUrl();
    $('.ft_l2_entry.type_doc')
      .live('click',function(e){
        FileTree.openDocument($(this).attr('id'));
      })
      .find('.tagBtn')
      .live('click', function(e){
        e.stopPropagation();
        FileTree.showTagMenu($(this).closest('li'));
      })
    ;
    $('.ft_l2_entry.type_pad')
      .live('click',function(e){
        FileTree.openPad($(this));
      })
    ;
  },
  updateTree: function(){
    //refresh file tree
    $.get('/filetree', function(data,textStatus,jqXHR){
      $('#filetree').html(data);
    },'html');
  }
};

$(document).ready(function(event){
  FileTree.initLinks();
});