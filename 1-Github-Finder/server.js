// requireing Modules
var http	= require('http');
var url		= require('url');
var path	= require('path');
var fs		= require('fs');

// declaring a port
var port = 8000;

// declaring Mime Types
var mimeTypes = {
	'html':'text/html',
	'jpeg':'image/jpeg',
	'jpg':'image/jpeg',
	'png':'image/png',
	'js':'text/javascript',
	'css':'text/css'
};

// create Server function
var server = http.createServer(function(req,res){

	var uri = url.parse(req.url).pathname; // return the current working file path
	var fileName = path.join(process.cwd(), unescape(uri)); // cwd return the current working directory
	console.log(`loading ${uri}`);
	var stats;


	// loking for the file, if is not there then go to catch
	try{
		stats = fs.lstatSync(fileName);
	} catch(e){
		res.writeHead(404, {'Content-Type':'text/html'});
		fs.createReadStream(__dirname+'/404.html','utf-8').pipe(res);
		return;
	}


	/*	================= get the right file type or directory =================
	*	path.extname(filename)	----> to get the extention name for specific file
	*	.split('.')	----> to remove the dot from it
	*	.reverse()	----> to reverse the name with the another array empty element
	*/

	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]];
		res.writeHead(200, {'Content-Type':mimeType});
		fs.createReadStream(fileName).pipe(res);
	} else if(stats.isDirectory()){
		res.writeHead(302, {'Location':'index.html'});
		res.end();
	} else {
		res.writeHead(500, {'Content-Type':'text/plain'});
		res.write('500 Internal Error\n');
		res.end();
	}

});

server.listen(port, function(){
	console.log(`You are now listening to localhost:${port}`);
});
