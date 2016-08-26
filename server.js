/////////////////////////////////////////////////////////////////////////////////////
/// APP INIT ////////////////////////////////////////////////////////////////////////
/// APP INIT ////////////////////////////////////////////////////////////////////////

var config = require('./config.json');
var AWS = config.AWS;
var MYSQL = config.MYSQL;
var TINIFY = config.TINIFY;

var express = require('express');
var app = express(); // Express App include
var http = require('http').Server(app); // http server
var mysql = require('mysql'); // Mysql include
var bodyParser = require("body-parser"); // Body parser for fetch posted data
var compression = require('compression')
var connection = mysql.createConnection({
  host     : MYSQL.HOST,
  user     : MYSQL.USER,
  password : MYSQL.PASSWORD,
  database : MYSQL.DATABASE
});

appInit();

function appInit()
{
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json()); // Body parser use JSON da
  app.use(compression());
  app.use(express.static(__dirname + '/www'));

  app.set('port', process.env.PORT || 8100);
  app.listen(app.get('port'), function () {
      console.log('Express server listening on port ' + app.get('port'));
  }); 

  app.get('/', function (request, response) {
      response.sendFile(__dirname + "/www/index.html");
      setTimerFlush(response);
  }); 
}

var APICallbackFunction = function(error,results,APIResponse){
    if (error)
    {
      APIResponse.status(500);
      return APIResponse.json();
    }
    return APIResponse.json(results); 
}

var queryError = function(APIResponse){
  console.log("Error"); 
  return APICallbackFunction(new Error(),null,APIResponse);
}

var querySuccess = function(data,APIResponse){
  console.log("Sucess");
  return APICallbackFunction(null,data,APIResponse);
} 

//the basic call to rest api
//only return one object
var basicQueryCallbackFunction = function(err, rows, fields, APIResponse){
    if(err || rows == null)
      return queryError(APIResponse);

    if(rows.length == 0)
        return queryError(APIResponse);
    else
    {
    return querySuccess(rows[0],APIResponse);
    }
}

var advancedQueryCallbackFunction = function(err, rows, fields, APIResponse){
    if(err || rows == null)
      return queryError(APIResponse);

    if(rows.length == 0)
        return queryError(APIResponse);
    else
    {
    return querySuccess(rows,APIResponse);
    }
}

function setTimerFlush (res){
  // send a ping approx every 2 seconds
  var timer = setInterval(function () {
    //res.write('data: ping\n\n')

    // !!! this is the important part
    res.flush()
  }, 2000)

  res.on('close', function () {
    clearInterval(timer)
  })

}
/////////////////////////////////////////////////////////////////////////////////////
/// REST API ////////////////////////////////////////////////////////////////////////
/// REST API ////////////////////////////////////////////////////////////////////////

app.get('/v1/:object/:id', function(request, response, next) {
  var id = request.params.id;
  var object = request.params.object;
  console.log(object+"/"+id);
  getObjectById(object, id, APICallbackFunction, response);

  setTimerFlush(response);
});

var getObjectById = function (object, id, callback, APIResponse) {
  connection.query("SELECT * from "+object+" WHERE id LIKE "+id,
    function(err, rows, fields){
      basicQueryCallbackFunction(err, rows, fields, APIResponse);
    }
  );

};

//////////////////////////////////////////////////////////////////////////////////
/// QUERY ////////////////////////////////////////////////////////////////////////
/// QUERY ////////////////////////////////////////////////////////////////////////

app.get('/v1/query/data/:queryName', function(request, response, next) {
  var queryName = request.params.queryName;
  var params = JSON.parse(request.query.parameters);

  switch(queryName)
  {
    case "getAllProductByUserId":
      var user_id = params.user_id;
      var start_from = params.start_from;
      var offset = params.offset;
    getAllProductByUserId(user_id,start_from,offset, APICallbackFunction,response);
      break;

    default :
      return queryError(response);
      break;
  }

  setTimerFlush(response);

});

function getAllProductByUserId(user_id,start_from,offset,callback,APIResponse){
  var query = "SELECT * from products"+
    " WHERE user_id LIKE "+user_id+
    " ORDER BY updated_at DESC"+
    " LIMIT "+start_from+", "+offset+";";
  
  console.log(query);

  connection.query(query,
    function(err, rows, fields){
      advancedQueryCallbackFunction(err, rows, fields, APIResponse);
    }
  );
}



