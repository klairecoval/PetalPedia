
const http = require('http');
const url = require('url');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const cssHandler = require('./cssResponses.js');
const imageHandler = require('./imageResponses.js')

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': cssHandler.getStyle,
  '/assets/leavesBg.png': imageHandler.getBgImage,
  '/getFlowers': jsonHandler.getFlowers,
  '/notFound': htmlHandler.get404Page,
  '/addFlower': jsonHandler.addFlower,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct['/notFound'](request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);