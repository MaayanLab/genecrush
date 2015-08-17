var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// connects to the mongodb database in our server.
mongoose.connect('mongodb://146.203.54.131:27017/genecrush');

// used to create template of each object stored in my database.
var userSchema = mongoose.Schema(
	{ username:String, 
		total_score:Number, 
		total_time:Number, 
		num_games_played:Number, 
		highest_score:Number,
		average_score:Number },
	{ collection:"users" })

// Each instance of user created for the schema.
var User = mongoose.model('users', userSchema);

var jsonParser = bodyParser.json({limit:'5mb'});
var urlencodedParser = bodyParser.urlencoded({limit:'5mb',extended:false});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Uses public directory as a main html file index.
app.use('/GeneCrush',express.static(__dirname + '/public'));


///////////////////////////////////////////////////GET///////////////////////////////////////////////////////////////////////////////
// gets the top ten highest scores.
app.get('/GeneCrush/global/highest_score',function(request, response){
	User.find({ username: { $exists: true } }).sort({highest_score:-1}).limit(10).exec(function(err, data) {response.send(data);});
})

// gets the top ten average scores.
app.get('/GeneCrush/global/average_score',function(request, response){
	User.find({ username: { $exists: true } }).sort({average_score:-1}).exec(function(err, data) {response.send(data);});
})

// gets the top ten number of games played.
app.get('/GeneCrush/global/games_played',function(request, response){
	User.find({ username: { $exists: true } }).sort({num_games_played:-1}).limit(10).exec(function(err, data) {response.send(data);});
})


///////////////////////////////////////////////////POST//////////////////////////////////////////////////////////////////////////////
// posts user id, then gets back the user information from the database.
app.post('/GeneCrush/user/getInfo', urlencodedParser, function(request, response){
	User.findOne(request.body).exec(function(err, data) {
		response.send(data);
	})
})

// posts the game data, then it pushes to the database. 
app.post('/GeneCrush/user/pushInfo', urlencodedParser, function(request, response){
	console.log(request.body.username);
	User.findOne({username:request.body.username}).exec(function(err, data) {

		if (data == null) {  // When the user doesn't exist, it creates a new user with the information passed.
			var newUser = new User ({
				username:request.body.username, 
				total_score:request.body.total_score, 
				total_time:request.body.total_time, 
				num_games_played:request.body.num_games_played, 
				highest_score:request.body.highest_score,
				average_score:request.body.average_score
			})
			newUser.save(function(err, data) {
				if (err) console.log(err);
				else console.log('saved', data);
			})
			response.send(data);
		} else {  // When there exists a user, it increments the total information in the database with the current game status.
			User.findOne({username:request.body.username}).exec(function(err, existingData) {
				existingData.total_score += +request.body.total_score;
				existingData.total_time += +request.body.total_time;
				existingData.num_games_played += +request.body.num_games_played;
				if (existingData.highest_score < request.body.highest_score) 
					existingData.highest_score = +request.body.highest_score;
				existingData.average_score = existingData.total_score / existingData.num_games_played;
				existingData.save();
				response.send(existingData);
			})
		}
	})
})

// Uses the port 1988
var port = 1988;
app.listen(port,function(){
	console.log('server@'+port);
});
