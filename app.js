const http = require('http')
const port = 3000

var br = "_VER_";

const requestHandler = (request, response) => {
  console.log(request.url)
  response.end(`Hello Node.js Server! branch: ${br}`)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port} branch: ${br}`);
})