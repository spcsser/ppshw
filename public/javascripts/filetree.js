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
  getPageCount:function(id){
    return $('#'+id+' .pageCount').text();
  },
  renderPictures:function(id,callback){
    //clear pagelist
    var pagelist=$('#pagelist').html("").append('<ul></ul>').find('ul')
      , thumbUrl='/file/getThumbnail/'+id+'/'
      , pageUrl=this.getDocPageUrl(id)
      , elem=''
      , pageCount = this.getPageCount(id)
      , pageClass = ''
    ;
    
    for(var i=0;i<pageCount;i++){
         pageClass='thumbnail page_'+i;
         pagelist.append('<li class="'+pageClass+'">'
           + '<a href="' + pageUrl + i + '">'
           + '<img src="' + thumbUrl + i + '" alt="thumbnail page_' + i + '"/>'
           + '</a>'
           + '</li>');
    }
    
    this.openDocPage(pageUrl+0, 0);
    
    if(callback){
      callback();
    }
  },
  getDocPageUrl:function(id){
    return '/file/getPage/'+id+'/';
  },
  openDocPage:function(pageUrl,pageNo){
    //clear pages
    var showPage=$('#frontpage').html("");
    showPage.append('<div class="page page_'+pageNo+'"><img src="'+pageUrl+'" alt="page_'+pageNo+'"/></div>');
  },
  openDocument:function(id){
    if(this.openAsPdf()){
      $('div#pagelist').addClass('hidden');
      $('div#pages').addClass('hidden');
      $('div#fp_ifr').removeClass('hidden').attr('src','/pdf.js/viewer.html?file='+this.getBaseUrl()+'file/get/pdf/'+id);
    }else{
      this.renderPictures(id,function(){
        $('div#fp_ifr').addClass('hidden');
        $('div#pagelist').removeClass('hidden');
        $('div#pages').removeClass('hidden');
      });
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
      //set values and make editor visible
      var input=editor.find('input#editor_input');
      input.val(val);
      editor.removeClass('hidden').offset(elem.offset());
      input.focus();
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
      .live(
        'click',
        function(e){
          FileTree.openDocument($(this).attr('id'));
        }
      )
      .find('.tagBtn')
      .live(
        'click',
        function(e){
          e.stopPropagation();
          FileTree.showTagMenu($(this).closest('li'));
        }
      )
    ;
    $('.ft_l2_entry.type_pad').live('click',function(e){
        FileTree.openPad($(this));
    });
    $('.listExpandControl').live('click',function(e){
      var elem=$(this);
      var listElem=elem.closest('.ft_l1_entry').find('.ft_l2');
      if(listElem.hasClass('collapsed')){
        //expand list
        listElem.fadeIn('fast').removeClass('collapsed');
        elem.text(" [-] ");
      }else{
        //collapse list
        listElem.fadeOut('fast').addClass('collapsed');
        elem.text(" [+] ");
      }
    });
    $('.thumbnail a').live('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      var pageUrl=$(this).attr('href');
      var pageNo=pageUrl.match(/\/(\d+)$/);
      if(pageNo != null && pageNo.length==2){
        pageNo=pageNo[1];
      }else{
        pageNo=0;
      }
      FileTree.openDocPage(pageUrl,pageNo);
    });
  },
  updateTreeInProgress: false,
  updateTree: function(){
    //refresh file tree
    if(!FileTree.updateTreeInProgress){
      FileTree.updateTreeInProgress=true;
      $.get('/filetree', function(data,textStatus,jqXHR){
        $('#filetree').html(data);
        FileTree.updateTreeInProgress=false;
      },'html');
    }
  }
};

$(document).ready(function(event){
  FileTree.initLinks();
});