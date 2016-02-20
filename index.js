var cool 		= require('cool-ascii-faces');
var pg   		= require('pg');
var httpStatus  = require('http-status-codes');

var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(req, res) {
	var output = '';
	var times  = process.env.COOL_TIMES || 1;

	for (var i = 0; i < times; i++) {
		output += ('<div>' + cool() + '</div>');
	}
	
	res.send(output);
});

app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
  	if (err) {
  		return response.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
  	}

    client.query('SELECT * FROM test_table', function(err, result) {
    	done();
    	if (err) {
    		console.error(err); 
    		return response.status(httpStatus.INTERNAL_SERVER_ERROR);
    	} else {
    		response.json({results: result.rows});
    	}
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
