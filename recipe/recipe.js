// For object-relational mapping
var dynamoose = require('dynamoose');

var Schema = dynamoose.Schema;
var recipeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  recipeName: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  extended_desc: {
    type: String,
    required: true
  },
  serves: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    require: true
  },
  pic: {
    type: String,
    required: true
  },
  ingredients: {
    type: 'list',
    list: [String],
    required: true
  },
  steps: {
    type: 'list',
    list: [String],
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  show: {
    type: Boolean,
    required: true,
    default: true
  }
});
var Model = dynamoose.model('Recipe', recipeSchema);

module.exports = Model;
