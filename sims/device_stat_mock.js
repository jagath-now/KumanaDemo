// @Author : Sameera Nelson

//Device side mock server which collects all data and given when requested
var express = require('express');
var app = express();

app.get('/stat', function(req, res) {
	console.log(Date() + ' Request Recieved >>>');
	res.contentType('application/text');
	res.send("560,30.2,65,12.10,2.15,2014-10-31-22:32:13");
}); 
 
app.listen(7089);
console.log('Mock Server Listening on port 7089...');