const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const errorPage = fs.readFileSync(`${__dirname}/../client/notFound.html`);

// Get main landing page
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

// Get custom simple 404 page
const get404Page = (request, response) => {
  response.writeHead(404, { 'Content-Type': 'text/html' });
  response.write(errorPage);
  response.end();
};


module.exports = {
  getIndex,
  get404Page,
};
