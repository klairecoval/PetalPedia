
const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');
const cssHandler = require('./cssResponses.js');
const imageHandler = require('./imageResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// Handle URLs
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': cssHandler.getStyle,
  '/assets/leavesBg.png': imageHandler.getBgImage,
  '/getFlowers': jsonHandler.getFlowers,
  '/notFound': htmlHandler.get404Page,
  '/addFlower': jsonHandler.addFlower,
  '/searchFlower': jsonHandler.searchFlower,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  if (urlStruct[parsedUrl.pathname]) {
    // Send back correct page
    urlStruct[parsedUrl.pathname](request, response, params);
  } else {
    // If URL not handled, send custom 404 page
    urlStruct['/notFound'](request, response, params);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
