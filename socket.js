var io = require('socket.io').listen(3000);

var mysql      = require('mysql');
var connection = mysql.createConnection({
	connectionLimit   :   100,
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'forge',
	debug    :   false
});

connection.connect(function(err){
    if (err) console.log(err)
})
io.sockets.on('connection', function (socket) {
	var users   = [];
	var length  = 0;
	var pollingLoop = function () {
		var query   = connection.query('SELECT name FROM users');
		var users2  = [];
		var length2 = 0;
	    query.on('error', function(err) {
	        console.log(err);
	    }).on('result', function(user) {
	        users2.push(user);
	        // console.log(user);
	        length2 = users2.length;
	    }).on('end',function(){
	        setTimeout(pollingLoop, 2000);
	        if (JSON.stringify(users2) != JSON.stringify(users)) {
	        	console.log(users2);
	        	users = users2;
	        	length = length2;
		        socket.emit('news', { 
					db: users2,
					length : length2,
				});
	    	}
	    });
	};
    pollingLoop();
	socket.on('my other event', function (data) {
		console.log(data);
	});
});
