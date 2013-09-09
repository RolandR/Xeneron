var HTTP = require('http');
var URL = require('url');


var CONFIG = require('./config.js').Config;


function initiate(){

	console.log('Starting server...');
	
	
	HTTP.createServer(function (request, response) {
	  response.writeHead(200, {'Content-Type': 'text/plain'});
	  response.write('You requested '+URL.parse(request.url).pathname+'?'+URL.parse(request.url).query);
	  response.end();
	}).listen(CONFIG.port, '127.0.0.1');
	
	console.log('Server running at http://127.0.0.1:'+CONFIG.port+'/');
}

exports.initiate = initiate;