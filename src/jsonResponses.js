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

const addFlower = (request, response) => {
  let body = [];

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    body = query.parse(bodyString);

    const responseJSON = {};

    if (!body.name || !body.image || !body.sunNeeds || !body.soilNeeds || !body.height || !body.bloomTime || !body.growZone || !body.funFact) {
      responseJSON.message = 'Please fill out all flower fields.';
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
    flowers[body.name].image = body.image;
    flowers[body.name].sunNeeds = body.sunNeeds;
    flowers[body.name].soilNeeds = body.soilNeeds;
    flowers[body.name].height = body.height;
    flowers[body.name].bloomTime = body.bloomTime;
    flowers[body.name].growZone = body.growZone;
    flowers[body.name].funFact = body.funFact;

    if (responseCode === 201) {
      responseJSON.message = 'New flower created successfully';
      return respondJSON(request, response, responseCode, responseJSON);
    }

    return respondJSONMeta(request, response, responseCode);
  });
};

module.exports = {
  getFlowers,
  notReal,
  addFlower,
};