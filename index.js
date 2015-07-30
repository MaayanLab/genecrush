var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');

var sbSchema = mongoose.Schema({id:String,score:Number},{collection:"scoreboard"})
var User = mongoose.model('scoreboard',sbSchema);
// var submitted = mongoose.Schema({id:String,score:Number},{collection:"submitted"})
// var sb = mongoose.model('submitted',submitted);

var jsonParser = bodyParser.json({limit:'5mb'});
var urlencodedParser = bodyParser.urlencoded({limit:'5mb',extended:false});

app.use('/enrichrgame',express.static(__dirname + '/public'));

app.get('/get_top_ten_scores',function(request, response){
	// console.log(typeof(req.query['ids']));
	// var ids = JSON.parse(req.query['ids']);
	// var query = detail.find({'lincs_id':{$in:ids}})
	// .select('-_id assay assay-info center').lean().exec(function(err,docs){
	// 	res.send(docs);
	// })
	User.find().exec(function(err, data) {response.send(data);});
})

var sampledata = {id:'nottwice',score:1}


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


var port = 9090;
app.listen(port,function(){
	console.log('server@'+port);
});
