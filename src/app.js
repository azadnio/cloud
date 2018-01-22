var http = require('http');
var port = 3000;

var br = "_VER_";

function requestHandler(request, response){
  console.log(request.url)
  response.end('Hello Node.js Server! branch: ' + br);
}

var server = http.createServer(requestHandler);

server.listen(port, function(err){
  if (err) {
    return console.log('something bad happened'+ err);
  }

  console.log('server is listening on ' + port);
});