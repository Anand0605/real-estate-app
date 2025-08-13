const DatauriParser = require('datauri/parser');
const path = require('path');

const parser = new DatauriParser();

const getDataUri = (file) =>
  parser.format(path.extname(file.originalname).toString(), file.buffer);

module.exports = getDataUri;
