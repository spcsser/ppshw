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
  openPad:function(elem){
    var link=elem.parent().find('a.padlink').attr('href');
    $('div#frontpage iframe').attr('src',link);
  },
  showTagMenu:function(elem){
    var editor=$('#jsmenu #jseditor')
      , digest=elem.attr('id')
    ;
    
    editor.find('form').attr('action','#');
    $.post('/file/gettags',{digest:digest},function(data,textStatus,jqXHR){
      var val='';
      if(data!=null && data.tags!=null){
        val=data.tags;
      }
      editor.find('input[name="editor_input"]').val(val);      
      editor.removeClass('hidden').offset(elem.offset());
    });
    
    var submitHandler=function(e){
      e.preventDefault();
      e.stopPropagation();
      var tags=editor.find('input[name="editor_input"]').attr('value');
      $.post('/file/settags',{digest:digest,tags:tags},function(data,textStatus,jqXHR){
        editor.addClass('hidden');
        FileTree.updateTree();
      });
    };
    
    editor.find('form, input').unbind('submit').on('submit',submitHandler);
    editor.find('input[type=submit]').unbind('submit').on('click',submitHandler);
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