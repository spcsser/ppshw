var AdminSettings = {};

AdminSettings.addEplInstance = function(){
  var data={};
  data.url=$('input[name=epl_url]').val();
  data.name=$('input[name=epl_name]').val();
  data.apikey=$('input[name=epl_apikey]').val();
  this.socket.emit('addEplInstance',data);
};

$(document).ready(function(){
  var loc = document.location,
    port = loc.port == "" ? (loc.protocol == "https:" ? 443 : 80) : loc.port,
    url = loc.protocol + "//" + loc.hostname + ":" + port + "/",
    pathComponents = location.pathname.split('/'),
    // Strip admin/plugins
    baseURL = pathComponents.slice(0,pathComponents.length-2).join('/') + '/',
    resource = baseURL.substring(1) + "socket.io"
  ;
  
  AdminSettings.socket = io.connect(url, {resource : resource}).of("/admin/settings");
});