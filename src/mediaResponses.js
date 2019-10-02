const fs = require('fs');
const path = require('path');

// declare variables needed for range
let start;
let end;
let total;

// get byte range from request's range header
const getRange = (request, stats) => {
  let { range } = request.headers;

  if (!range) {
    range = 'bytes=0-';
  }

  const positions = range.replace(/bytes=/, '').split('-');

  start = parseInt(positions[0], 10);

  total = stats.size;
  end = positions[1] ? parseInt(positions[1], 100) : total - 1;

  if (start > end) {
    start = end - 1;
  }
};

// write headers for client, determine how big of a chunk to send to browser
const writeResponseHead = (response, request, fileType) => {
  const chunksize = (end - start) + 1;

  response.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${total}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': fileType,
  });
};

// create file stream
const streamMedia = (file, response) => {
  const stream = fs.createReadStream(file, { start, end });

  stream.on('open', () => {
    stream.pipe(response);
  });

  stream.on('error', (streamErr) => {
    response.end(streamErr);
  });

  return stream;
};

// handle errors, create file obj
const loadFile = (request, response, filePath, fileType) => {
  const file = path.resolve(__dirname, filePath);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    // call new functions
    getRange(request, stats);
    writeResponseHead(response, request, fileType, stats);
    return streamMedia(file, response);
  });
};

// exportable functions
const getBg = (request, response) => {
  loadFile(request, response, '../assets/leavesBg.png', 'image/png');
};


module.exports = {
    getBg,
};