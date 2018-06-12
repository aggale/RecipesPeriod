var express = require('express');
var router = express.Router();

var tableName = 'recipe';

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
			res.render('allrecipes', {
					isactive: "browse",
			 		recipes: data.Items
			});
		}
	}
});

router.get('/:recipeId', function(req, res){
	var db = req.db;
	//var collection = db.collection('recipe');

	// collection.find({'name': req.params.recipeId}).toArray(function(err, docs){
	// 	if(err){
	// 		console.log("err: " + err);
	// 		return console.dir(err);
	// 	}
	//
	// 	res.render('recipe', {
	// 		recipe: docs[0]
	// 	});
	// });
	var params = {
		TableName: tableName,
		Key:{
			"name": req.params.recipeId
		}
	};
	db.get(params, function(err, data){
		if (err){
			console.log("err: " + JSON.stringify(err, null, 2));
		}
		res.render('recipe', {
			//recipe: docs[0]
			recipe: data.Item
		});
	});
});

module.exports = router;
