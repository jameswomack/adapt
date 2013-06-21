var cradle = require('cradle');
var connection = new(cradle.Connection)();
var db = connection.database('adapt');
db.create();