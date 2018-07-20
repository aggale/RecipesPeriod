var express = require('express');
var router = express.Router();
var url = require('url');

var tableName = 'Recipe';

router.get('/all', function(req, res){
	var db = req.db;
	var params = {
		TableName: tableName
	};
	db.scan(params, onScan);

	function onScan(err, data) {
		if (err) {
			console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			//data.Items.forEach(i => console.log(i.name + " " + i.ingredients['values']));
			//console.log(data.Items[0].ingredients['values']);
			res.render('allrecipes', {
					isactive: "browse",
			 		recipes: data.Items
			});
		}
	}
});

router.get('/:recipeId', function(req, res){
	var db = req.db;
	var params = {
		TableName: tableName,
		Key:{
			"name": req.params.recipeId
		}
	};
	db.get(params, function(err, data){
		if (err) {
			console.log("err: " + JSON.stringify(err, null, 2));
			res.status(500).send("An error occurred contacting the database.");
		}
		else if (data.Item == undefined){
			res.status(500).send("Could not locate recipe.");
		} else {
			res.render('recipe', {
				//recipe: docs[0]
				recipe: data.Item,
				fullurl: url.format({
					protocol: req.protocol,
					host: req.get('host'),
					pathname: req.originalUrl
				})
			});
		}
	});
});

module.exports = router;
