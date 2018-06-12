var express = require('express');
var router = express.Router();

var tableName = 'recipe';

router.get('/', function(req, res){
	var db = req.db;
	var params = {
		TableName: tableName
	};
	db.scan(params, onScan);

	function onScan(err, data) {
		if (err) {
			console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
			res.sendStatus(500);
		} else {
			console.log(data.Items);
			res.render('allrecipes', {
			 		recipes: data.Items
			});
		}
	}
});

module.exports = router;
