const express = require('express');
var app = express();
const bodyParser = require('body-parser');
const router = require('./db_connection/Router');
const logger = require('morgan');
const mysql = require('mysql2');
const { json } = require('body-parser');
const { use } = require('./db_connection/Router');
const port = 3030;

app.listen(port,()=>{
    console.log('connected',port,'port')
});

app.set('view engine','ejs');
app.engine('html',require('ejs').renderFile);
app.set('views',__dirname,"./views");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname + '/public'));

app.use(logger('short'));

app.use('',router);


