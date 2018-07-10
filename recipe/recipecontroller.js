var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

var Recipe = require('./recipe');

// Return a recipe
router.get('/:name', function (req, res) {
  console.log(req.params);
  var filter = {
    FilterExpression: '#n = :m',
    ExpressionAttributeNames: {
      "#n": "name"
    },
    ExpressionAttributeValues: {
      ":m": req.params.name
    }
  };
  Recipe.scan(filter).exec(function (err, recipe) {
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
  var recipeName = req.body.name.toLowerCase().replace("-", " ");
  console.log(steps);
  Recipe.create({
    name: req.body.name,
    recipeName: recipeName,
    desc: req.body.desc,
    extended_desc: req.body.extended_desc,
    serves: req.body.serves,
    time: req.body.time,
    difficulty: req.body.difficulty,
    pic: req.body.pic,
    ingredients: ingredients,
    steps: steps,
    tags: tags
  },
  function (err, user) {
    console.log("err: " + err);
    if (err)
      return res.status(500).send("There was a problem adding the recipe to the database. " + err)
    console.log(user.name + " successfully added.");
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
  req.body.ingredients = req.body.ingredients.replace(/\r\n$/, "").split("\r\n");
  req.body.steps = req.body.steps.replace(/\r\n$/, "").split("\r\n");
  Recipe.update({name: req.params.name}, req.body, function (err) {
    if (err)
      return res.status(500).send("Recipe could not be updated.");
    return res.status(200).send("Recipe updated.");
  })
});

module.exports = router;
