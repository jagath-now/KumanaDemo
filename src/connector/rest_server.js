// @Author : Sameera Nelson

var nconf = require('nconf');
var express = require('express');
var cache = require('memory-cache');
var unirest = require('unirest');
var app = express();

nconf.file({ file: '../../config/config.json' });
// Provide default values for settings which are in the config file.
nconf.defaults({
    'dataCollector': {
		'host': 'http://localhost',
        'port': 7089,
		'context' : '/stat'
    },
	'dataPublisher': {
		'host': 'http://localhost',
        'port': 6089,
		'context' : '/stat'

    },
	'pollingInterval': '5000',
	'pushingInterval' : '10000',
	'serverPort' : '8089'
});

var dataCollectorURL = nconf.get('dataCollector:host') + ":" + nconf.get('dataCollector:port') + nconf.get('dataCollector:context');
var dataPublisherURL = nconf.get('dataPublisher:host') + ":" + nconf.get('dataPublisher:port') + nconf.get('dataPublisher:context');

try {
setInterval(function() { 
console.log(Date() + ' : Calling the Data Collector Module at : ' + dataCollectorURL);
unirest.get(dataCollectorURL)
	//.headers({ 'Accept': 'application/json' })
	.headers({ 'Accept': 'application/text' })
	.end(function (response) {
		console.log(response.body);
		var array = response.body.split(",");
		cache.put('luxLevel', array[0]);
		cache.put('temperature', array[1]);
		cache.put('humidity', array[2]);
		cache.put('voltage', array[3]);
		cache.put('current', array[4]);
		cache.put('timestamp', array[5]);
});
}, nconf.get('pollingInterval'));
 
 setInterval(function() { 
console.log(Date() + ' : Pushing the Data to : ' + dataPublisherURL);
unirest.post(dataPublisherURL)
	.headers({ 'Accept': 'application/json' })
	.type('json')
	.send({
		'luxLevel': cache.get('luxLevel'),
		'temperature': cache.get('temperature'),
		'humidity' : cache.get('humidity'),
		'voltage': cache.get('voltage'),
		'current' : cache.get('current'),
		'timestamp' : cache.get('timestamp')})
	.end(function (response) {
		console.log(response.body);
	});
}, nconf.get('pushingInterval')); 
 
app.get('/waterStat/dataCollectTimeout', function(req, res) {
    res.send();
});
app.get('/waterStat/dataSendTimeout', function(req, res) {
    res.send();
});
 app.get('/waterStat/motorStart/normal', function(req, res) {
	//Start motor
    res.send();
});
app.get('/waterStat/motorStart/recovery', function(req, res) {
	// Start motor
	
	//set the time-outs to 1 sec to 1 min
    res.send();
});
app.get('/waterStat/motorStop', function(req, res) {
    res.send();
});
}catch (err) {
    console.log(err);
}
 
app.listen(nconf.get('serverPort'));
console.log('Listening on port : ' + nconf.get('serverPort') + ' ...');