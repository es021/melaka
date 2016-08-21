var AWS = {
  "ACCESS_KEY_ID"       : 'AKIAIJO7YPBHO4WTVKDA',
  "SECRECT_ACCESS_KEY"  : 'gT4jdhZwHqj1MCUyzifyi2zBO94HIOerLW7xv4VF',
  "REGION"              : 'ap-southeast-1',
  "BUCKET_NAME"         : 'elasticbeanstalk-ap-southeast-1-807460766039'
}

var MYSQL = {
  "HOST"     : 'sql5.freesqldatabase.com',
  "USER"     : 'sql5104477',
  "PASSWORD" : '9XUcya9tVl',
  "DATABASE" : 'sql5104477'
}

var express = require('express');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');
var bodyParser = require("body-parser");
var compression = require('compression')
var tinify = require("tinify");
var connection = mysql.createConnection({
  host     : MYSQL.HOST,
  user     : MYSQL.USER,
  password : MYSQL.PASSWORD,
  database : MYSQL.DATABASE
});

/////////////////////////////////////////////////////////////////////////////////////
/// APP INIT ////////////////////////////////////////////////////////////////////////
/// APP INIT ////////////////////////////////////////////////////////////////////////

appInit();
tinifyInit();

function appInit()
{
	app.use(bodyParser.urlencoded({ extended: false }));
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

///////////////////////////////////////////////////////////////////////////////////
/// TINIFY ////////////////////////////////////////////////////////////////////////
/// TINIFY ////////////////////////////////////////////////////////////////////////

function tinifyInit(){
  console.log("Initialize TinyPNG")
  tinify.key = "XCi84z1igNgjjp0hDh_QuT-gol_ePm1r";
}

function tinifyStoreAWS(fileUrl, fileBaseName,product_id,APIResponse){
    if(product_id == null || product_id < 0)
    {
      return queryError("Undefined product id",APIResponse);
    }    

    if(typeof fileUrl != "string")
    {
      return queryError("Params file_url is not type of string",APIResponse);
    }

    tinify.fromUrl(fileUrl).store({ 
      service               : "s3",
      aws_access_key_id     : AWS.ACCESS_KEY_ID,
      aws_secret_access_key : AWS.SECRECT_ACCESS_KEY,
      region                : AWS.REGION,
      path                  : AWS.BUCKET_NAME+"/Images/"+fileBaseName

/*    service: "s3",
      aws_access_key_id: "AKIAIJO7YPBHO4WTVKDA",
      aws_secret_access_key: "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",
      region: "ap-southeast-1",
      path: "elasticbeanstalk-ap-southeast-1-807460766039/Images/"+fileBaseName*/

    }).then(function(result){
        var location = result.headers.location
        if(location!= null && location != '')
        {
          var query = "UPDATE products SET picture_tinify = '"+location+"' WHERE id LIKE "+product_id;
          //runAdvancedQuery(query,APICallbackFunction,response);  
        }
    });  
}

//////////////////////////////////////////////////////////////////////////////////////////////
/// CALLBACK FUNCTION ////////////////////////////////////////////////////////////////////////
/// CALLBACK FUNCTION ////////////////////////////////////////////////////////////////////////

var APICallbackFunction = function(error,results,APIResponse){
    if (error)
    {
    	APIResponse.status(500);
    	return APIResponse.json(error);
    }
    return APIResponse.json(results);	
}

var queryError = function(errorMessage, APIResponse){
	console.log("Error");	
	return APICallbackFunction(errorMessage,null,APIResponse);
}

var querySuccess = function(data,APIResponse){
	console.log("Sucess");
	return APICallbackFunction(null,data,APIResponse);
} 

//the basic call to rest api
//only return one object
var basicQueryCallbackFunction = function(err, rows, fields, APIResponse){
    if(err)
    	return queryError(err,APIResponse);

    if(rows == null)
      return queryError("Row return null", APIResponse);
    
    if(rows.length == 0)
      return queryError("Row return empty", APIResponse);
    else
		  return querySuccess(rows[0],APIResponse);
    
}

var advancedQueryCallbackFunction = function(err, rows, fields, APIResponse){
    if(err)
      return queryError(err,APIResponse);

    if(rows == null)
      return queryError("Row return null", APIResponse);
    
    if(rows.length == 0)
      return queryError("Row return empty", APIResponse);
    else
		  return querySuccess(rows,APIResponse);
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

/////////////////////////////////////////////////////////////////////////////////////////////////
/// BASIC REST API QUERY ////////////////////////////////////////////////////////////////////////
/// BASIC REST API QUERY ////////////////////////////////////////////////////////////////////////

app.get('/v1/:object/:id', function(request, response, next) {
  var id = request.params.id;
  var object = request.params.object;
  //console.log(object+"/"+id);
  var query = "SELECT * from "+object+" WHERE id LIKE "+id;
  runBasicQuery(query,APICallbackFunction, response)
  setTimerFlush(response);
});

function runBasicQuery(query,callback,APIResponse){
  connection.query(query,
    function(err, rows, fields){
      basicQueryCallbackFunction(err, rows, fields, APIResponse);
    }
  );
}

///////////////////////////////////////////////////////////////////////////////////////////
/// ADVANCED QUERY ////////////////////////////////////////////////////////////////////////
/// ADVANCED QUERY ////////////////////////////////////////////////////////////////////////

app.get('/v1/query/data/:queryName', function(request, response, next) {
  var queryName = request.params.queryName;
  console.log(request.query.parameters);
  var params = JSON.parse(request.query.parameters);

  switch(queryName)
  {
  	case "getAllProductByUserId":
  	 	var user_id = params.user_id;
  	 	var start_from = params.start_from;
  	 	var offset = params.offset;
      var query = "SELECT * from products"+
        " WHERE user_id LIKE "+user_id+
        " ORDER BY updated_at DESC"+
        " LIMIT "+start_from+", "+offset+";";
      runAdvancedQuery(query,APICallbackFunction,response);  
  		break;

    case "tinifyStoreAWS":
      var file_url = params.file_url;
      var file_basename = params.file_basename;
      var product_id = params.product_id;
      tinifyStoreAWS(file_url,file_basename,product_id,response);
      break;

  	default :
  		return queryError("Invalid query name",response);
  		break;
  }

  setTimerFlush(response);

});

function runAdvancedQuery(query,callback,APIResponse){
  connection.query(query,
    function(err, rows, fields){
      advancedQueryCallbackFunction(err, rows, fields, APIResponse);
    }
  );
}


