var express = require('express');
var router = express.Router();
var tags = [];

var tableName = 'recipe';

router.get('/', function(req, res){
	var db = req.db;
	var params = {
    TableName: tableName,
		ProjectionExpression: "tags",
  };
  db.scan(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error: ", JSON.stringify(err, null, 2));
    } else {
			tags = data.Items.reduce((total, item) => {
				for (var i = 0; i < item.tags.length; i++) {
					if (!total.includes(item.tags[i])) {
							total.push(item.tags[i]);
					}
				}
				return total;
			}, []);
		}

	  res.render('search', {
			tags: tags,
			recipes: []
		});
	});
});

router.post('/', function(req, res){
  var db = req.db;
  var recipeName = req.body.name.toLowerCase();

	var ingredient = req.body.ingredient;

	var selectedTags = [];
	for (var key in req.body) {
		if (key.startsWith('tag')) {
			selectedTags.push(req.body[key]);
		}
	}

	var params = {
    TableName: tableName,
		ProjectionExpression: "#n, #d, pic, ingredients",
		ExpressionAttributeNames: {
			"#n": "name",
			"#d": "desc"
		}
  };
	if (recipeName === "") {
		selectedTags.forEach((tag, index) => {
			if (index == 0) {
				params.ExpressionAttributeValues = {};
				params.FilterExpression = "contains(tags, :t" + index + ")";
			}	else
				params.FilterExpression += " AND contains(tags, :t" + index + ")";
			params.ExpressionAttributeValues[":t" + index] = selectedTags[index];
		});
	} else {
		params.FilterExpression = "contains(recipeName, :n)";
	  params.ExpressionAttributeValues = {
			":n": recipeName
    };
		selectedTags.forEach((tag, index) => {
			params.FilterExpression += " AND contains(tags, :t" + index + ")";
			params.ExpressionAttributeValues[":t" + index] = selectedTags[index];
		});
	}

  db.scan(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error: ", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
			res.render('search', {
				tags: tags,
				message : `${data.Items.length} results found`,
				recipes : data.Items
			});
    }
  });
});

module.exports = router;
