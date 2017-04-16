var data = [];
var express = require('express');
var bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('todo',{ todos: data });
});

router.post('/', urlencodedParser, function(req, res){
	data.push(req.body);
	res.json(data);
});
router.delete('/:item', function(req, res){
	data = data.filter(function(todo){
		return todo.item.replace(/ /g, '-') !== req.params.item;
	});
	res.json(data)
});

module.exports = router;
