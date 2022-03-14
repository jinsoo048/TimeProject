var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root', //Your Database User Name
	password:'', // Your Database Password
	database:'timereportdb'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Database Connected Successfully..!!');
	}
});

module.exports = connection;