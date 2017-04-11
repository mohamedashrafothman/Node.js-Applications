/*
	1- requiring the modules
	2- define files types (6 types)
	3- create the server
		1- get the requested file pathname, then join current 
		   directory and that file pathname
		2- look for the requested file is that file exested
		3- check for that requested file is file or directory
	4-listen to the server

*/


//  1- requiring the modules
var http	= require('http');
var url		= require('url');
var path	= require('path');
var fs		= require('fs');
var port 	= 8000;


//  2- define files types (6 types)
var filesTypes = {
	'html':'text/html',
	'jpeg':'image/jpeg',
	'jpg':'image/jpeg',
	'png':'image/png',
	'js':'text/javascript',
	'css':'text/css'
};

// 	3- create the server
var server = http.createServer(function(req,res){

	// 3.1- get the requested file pathname, then join current directory and that file pathname
	var uri = url.parse(req.url).pathname; // return the current working file path
	var fileName = path.join(process.cwd(), unescape(uri)); // cwd return the current working directory
	console.log(`loading ${uri}...`);
	var stats;


	// 3.2- look for the requested file is that file exested
	try{
		stats = fs.lstatSync(fileName);
	} catch(e){
		res.writeHead(404, {'Content-Type':'text/html'});
		fs.createReadStream(__dirname+'/404.html','utf-8').pipe(res);
		return;
	}


	/*	3.3- check for that requested file is file or directory
	*
	*	isFile() ----> check if it's a file, return true or flase
	*	path.extname(filename)	----> to get the extention name for specific file
	*	split('.')	----> to remove the dot from it
	*	isDirectory() ----> check if it's a folder, return true or false
	*/
	if(stats.isFile()){
		var fileType = filesTypes[path.extname(fileName).split('.')[1]];
		res.writeHead(200, {'Content-Type':fileType});
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


// 	4-listen to the server on port 8000
server.listen(port, function(){
	console.log(`You are now listening to localhost:${port}`);
});
