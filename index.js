var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/genecrush');

var userSchema = mongoose.Schema(
	{ username:String, 
		total_score:Number, 
		total_time:Number, 
		num_games_played:Number, 
		highest_score:Number }, // username
	{ collection:"users" })
var User = mongoose.model('users', userSchema);
// var submitted = mongoose.Schema({id:String,score:Number},{collection:"submitted"})
// var sb = mongoose.model('submitted',submitted);

var jsonParser = bodyParser.json({limit:'5mb'});
var urlencodedParser = bodyParser.urlencoded({limit:'5mb',extended:false});

// var publicDir = path.join(__dirname, '/');
// console.log('Serving static files from ' + publicDir);

app.use('/GeneCrush',express.static(__dirname + '/public'));

// GET the top ten players scores.
app.get('/user/getTopTen',function(request, response){
	User.find().sort({highest_score:-1}).limit(10).exec(function(err, data) {response.send(data);});
})

// POST to get back the user information.
app.post('/user/getInfo', urlencodedParser, function(request, response){
	User.findOne(request.body).exec(function(err, data) {
		if (data == null) {
			var newUser = new User ({
				username:request.body.username, 
				total_score:0, 
				total_time:0, 
				num_games_played:0.001, 
				highest_score:0
			})
			newUser.save(function(err, data) {
				if (err) console.log(err);
				else console.log('saved', data);
			})
		} else {
			response.send(data);
		}
	})
})

app.post('/user/pushInfo', urlencodedParser, function(request, response){
	console.log(request.body.username);
	User.findOne({username:request.body.username}).exec(function(err, data) {
		if (data == null) {
			var newUser = new User ({
				username:request.body.username, 
				total_score:request.body.total_score, 
				total_time:request.body.total_time, 
				num_games_played:request.body.num_games_played, 
				highest_score:request.body.highest_score
			})
			newUser.save(function(err, data) {
				if (err) console.log(err);
				else console.log('saved', data);
			})
			response.send(data);
		} else {
			User.findOne({username:request.body.username}).exec(function(err, existingData) {
				existingData.total_score += +request.body.total_score;
				existingData.total_time += +request.body.total_time;
				existingData.num_games_played += +request.body.num_games_played;
				if (existingData.highest_score < request.body.highest_score) 
					existingData.highest_score = +request.body.highest_score;
				existingData.save();
				response.send(existingData);
			})
		}
	})
})


app.post('/submit_score', urlencodedParser, function(request, response, next) {
	var newScore = new User({
		id: request.body.id,
		score: request.body.score
	})
	newScore.save(function (err, data) {
		if (err) console.log(err);
		else console.log('saved ', data);
	})
})


var port = 1988;
app.listen(port,function(){
	console.log('server@'+port);
});
