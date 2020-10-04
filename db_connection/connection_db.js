var mysql      = require('mysql2');
var db = mysql.createConnection({
  host     : 'secret',
  user     : 'root',
  password : 'secret',
  database : 'project2',
  dateStrings: 'date',
  multipleStatements : true
});
 
module.exports=db
