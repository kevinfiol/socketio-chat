var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendfile('index.html');
});

app.use("/css", express.static(__dirname + '/css'));

//array of users currently in chat
var people = {};

io.on('connection', function(socket){
	console.log('user connected!');

	socket.on('join', function(name){
		people[socket.id] = name; //create entry in 'people' with new user
		socket.emit("update", "You have connected to the server.");
		io.sockets.emit("update", name + " has joined the server.");
		io.sockets.emit("update_people_list", people);
	});

	socket.on('disconnect', function(){
		console.log('user disconnected!');
		if(people[socket.id] != ""){
			io.sockets.emit("update", people[socket.id] + " has left the server.");
			delete people[socket.id];
			io.sockets.emit("update_people_list", people);
		}
	});

	socket.on('chat message', function(msg){
		console.log('message: ' + msg);
		io.sockets.emit('chat message', people[socket.id], msg);
	});
});


http.listen(3000, function(){
	console.log('listening on *:3000');
});