var socket = io.connect('http://localhost:3000');
socket.on('file', function (data) {
  if(data.type == 'convert'){
    if(data.status == 'done'){
      //refresh file tree
      $.get('/filetree', function(data,textStatus,jqXHR){
        $('#filetree').html(data);
      },'html');
    }
  }
});