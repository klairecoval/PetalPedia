const query = require('querystring');

const flowers = {};

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getFlowers = (request, response) => {
  const responseJSON = {
    message: { flowers },
  };

  return respondJSON(request, response, 200, responseJSON);
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notReal',
  };

  return respondJSON(request, response, 404, responseJSON);
};

const addUser = (request, response) => {
  let body = [];

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    body = query.parse(bodyString);

    const responseJSON = {};

    if (!body.name || !body.age) {
      responseJSON.message = 'All fields are required.';
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    if (flowers[body.name]) {
      responseCode = 204;
    } else {
      flowers[body.name] = {};
    }

    flowers[body.name].name = body.name;
    flowers[body.name].age = body.age;

    if (responseCode === 201) {
      responseJSON.message = 'Created New Flower Successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
  });
};

module.exports = {
  getFlowers,
  notReal,
  addUser,
};