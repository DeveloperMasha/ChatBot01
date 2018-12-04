//This section list the required libraries
var express = require("express");
//create an instance of express server
var app = express();

//request is user, response is what your response to user
app.get("/",function(request,response){
	response.send('<h1>This is my web app</h1>');
});

//show default page on 127.0.0.1:{listening port}/something
app.get("/something",function(request,response){
	response.send('<h1>This is something</h1>');
});

app.get("/yourname",function(request,response){
	response.send('<h1>This is yourname</h1>');
});

//Start the express server to listen to a port in the server
    var listener = app.listen(process.env.PORT,
        process.env.IP,
        function(){
		console.log("server has started");
	    console.log('Listening on port ' + listener.address().port);
});
