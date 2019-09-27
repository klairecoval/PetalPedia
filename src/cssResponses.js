const fs = require('fs');

const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const getStyle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(style);
  response.end();
};

module.exports.getStyle = getStyle;