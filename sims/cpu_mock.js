// @Author : Sameera Nelson

//Device side mock server which collects all data and given when requested
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json()); 

app.post('/stat', function(req, res) {
	var reqData = JSON.stringify(req.body);
	console.log(Date() + ' Request Recieved >>> ' + reqData);
	res.contentType('application/json');
	res.send([{'status' : 'ok'}]);
}); 
 
app.listen(6089);
console.log('Mock Server Listening on port 6089...');