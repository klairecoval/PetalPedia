const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../assets/leavesBg.png`);

// Load in background image, needed for CSS
const getBgImage = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(index);
  response.end();
};

module.exports = {
  getBgImage,
};
