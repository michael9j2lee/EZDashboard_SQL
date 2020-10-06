var express = require('express');
var app = express();
var sql = require("mssql");
var bodyParser = require('body-parser');
const config = require('config');
var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

let appPort = config.get('app.port');
// let dbHost = config.get('db.host');
let dbPort = config.get('db.port');
let dbDatabase = config.get('db.database');
let dbUser = config.get('db.user');
let dbPassword = config.get('db.password');



app.post('/query' , function (req, res) {
    // config for your database
    var data = req.body;
    var sqlQuery;

    if(data.query ==1 || data.query == "1"){
        sqlQuery = 'SELECT TOP 10 * FROM [SampleData].[dbo].[SampleAggregates] ORDER BY Date_YYYYMMDD DESC'
    }

    var config = {
        user: dbUser,
        password: dbPassword,
        server: 'localhost', 
        database: dbDatabase,
        port: dbPort,
        encrypt:false,
        pool: {
            max: 10,
            min:0,
            idleTimeoutMillis:30000
        }
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log("Failed to connect:" + err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query(sqlQuery, function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.setHeader('Content-Type','application/json');
            res.setHeader("Access-Control-Allow-Origin",'*');
            res.send(recordset);
            console.log("Query Successful!")
        });
    });
});

var server = app.listen(appPort, function () {
    console.log('Server is running..');
});