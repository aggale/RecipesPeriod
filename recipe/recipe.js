// For object-relational mapping
var dynamoose = require('dynamoose');

var Schema = dynamoose.Schema;
var recipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  extended_desc: {
    type: String
  },
  pic: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String],
    required: true
  },
  steps: {
    type: [String],
    required: true
  },
  tags: {
    type: [String],
    required: true
  }
});
var Model = dynamoose.model('Recipe', recipeSchema);

module.exports = Model;
