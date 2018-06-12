var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Recipe = require('./recipe');

// Return a recipe
router.get('/:name', function (req, res) {
  console.log(req.params.name);
  Recipe.scan({name: req.params.name}, function (err, recipe) {
    if (err)
      return res.status(500).send("There was a problem finding the recipe. " + err);
    if (!recipe)
      return res.status(404).send("No recipe found.");
    res.status(200).send(recipe);
  });
});

// Create a new recipe
router.post('/', function (req, res) {
  console.log(req.body);
  var ingredients = req.body.ingredients.split("\r\n").map(s => s.trim());
  var steps = req.body.steps.split("\r\n").map(s => s.trim());
  var tags = req.body.tags.split(",").map(s => s.trim());
  Recipe.create({
    name: req.body.name,
    desc: req.body.desc,
    extended_desc: req.body.extended_desc,
    pic: req.body.pic,
    ingredients: ingredients,
    steps: steps,
    tags: tags
  },
  function (err, user) {
    if (err)
      return res.status(500).send("There was a problem adding the recipe to the database. " + err)
    res.status(200).send(user.name + " successfully added.");
  });
});

// Delete a recipe
router.delete('/:name', function (req, res) {
  Recipe.delete({name: req.params.name}, function (err) {
    if (err)
      return res.status(500).send("Recipe could not be deleted.")
    return res.status(200).send("Recipe deleted.");
  });
});

// Update a recipe
router.put('/:name', function (req, res) {
  req.body.tags = req.body.tags.split(",").map(s => s.trim());
  Recipe.update({name: req.params.name}, req.body, function (err) {
    if (err)
      return res.status(500).send("Recipe could not be updated.");
    return res.status(200).send("Recipe updated.");
  })
});

module.exports = router;
