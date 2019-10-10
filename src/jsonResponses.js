const query = require('querystring');

// Setup API with initial content
const flowers = {
  'Blackeyed Susan': {
    name: 'Blackeyed Susan',
    image: 'https://www.proflowers.com/blog/wp-content/plugins/pf-flowertypes/image/black-eyed-susan-334122.jpg',
    sunNeeds: 'Full Sun',
    soilNeeds: 'Well-drained',
    height: '1-3ft',
    bloomTime: 'Late Summer - Mid Fall',
    growZone: '3-9',
    funFact: 'Good for cut flowers',
  },
  Daffodil: {
    name: 'Daffodil',
    image: 'https://www.proflowers.com/blog/wp-content/plugins/pf-flowertypes/image/flower-661585.jpg',
    sunNeeds: 'Full Sun',
    soilNeeds: 'Well-drained',
    height: '0.25-2ft',
    bloomTime: 'Spring',
    growZone: '3-9',
    funFact: 'Good for cut flowers',
  },
  Daisy: {
    name: 'Daisy',
    image: 'https://www.proflowers.com/blog/wp-content/plugins/pf-flowertypes/image/daisies-276112.jpg',
    sunNeeds: 'Full Sun',
    soilNeeds: 'Well-drained',
    height: '0.8-3ft',
    bloomTime: 'Late Spring - Early Summer',
    growZone: '2-11',
    funFact: 'Good for cut flowers',
  },
  Lupine: {
    name: 'Lupine',
    image: 'https://www.proflowers.com/blog/wp-content/plugins/pf-flowertypes/image/beautiful-2223.jpg',
    sunNeeds: 'Full Sun/Partial Shade',
    soilNeeds: 'Well-drained',
    height: '2.5-5ft',
    bloomTime: 'Summer',
    growZone: '3-9',
    funFact: 'Good for cut flowers',
  },
  Tulip: {
    name: 'Tulip',
    image: 'https://www.proflowers.com/blog/wp-content/plugins/pf-flowertypes/image/tulip-271352.jpg',
    sunNeeds: 'Full Sun/Partial Shade',
    soilNeeds: 'Well-drained',
    height: '2.5-5ft',
    bloomTime: 'Summer',
    growZone: '3-9',
    funFact: 'Good for cut flowers',
  },
  Violet: {
    name: 'Violet',
    image: 'https://www.proflowers.com/blog/wp-content/plugins/pf-flowertypes/image/plant-978227.jpg',
    sunNeeds: 'Full Sun/Partial Shade',
    soilNeeds: 'Well-drained',
    height: '0.25-1ft',
    bloomTime: 'Early Spring - Early Fall',
    growZone: '3-9',
    funFact: 'Non-invasive',
  },
};

// Steamline JSON responses to not repeat code
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// Return all flowers as JSON data
const getFlowers = (request, response) => {
  const responseJSON = {
    message: { flowers },
  };

  return respondJSON(request, response, 200, responseJSON);
};

// Return 404 error if URL does not exist
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'NotFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// Add flower to API
const addFlower = (request, response) => {
  let body = [];

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    body = query.parse(bodyString);

    const responseJSON = {};

    // Check if all inputs are filled out
    if (!body.name || !body.image
        || !body.sunNeeds || !body.soilNeeds
        || !body.height || !body.bloomTime
        || !body.growZone || !body.funFact) {
      responseJSON.message = 'Please fill out all flower fields.';
      responseJSON.id = 'missingParams';
      return respondJSON(request, response, 400, responseJSON);
    }

    let responseCode = 201;

    // Check for flower update based on name
    if (flowers[body.name]) {
      responseCode = 204;
    } else {
      flowers[body.name] = {};
    }

    // Append information
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

// Given URL, find flower with name matching query and display JSON
const searchFlower = (request, response, params) => {
  const responseJSON = {
    message: flowers[params.name],
  };

  // Throw error if /searchFlower is missing query
  if (!params.name) {
    responseJSON.message = 'Missing valid name';
    responseJSON.id = 'badRequest';
    return respondJSON(request, response, 400, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  getFlowers,
  notFound,
  addFlower,
  searchFlower,
};
