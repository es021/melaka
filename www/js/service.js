var myApp = angular.module('sample.service', [
  'ui.router',
  'backand'
]);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// BackandService ////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// BackandService ////////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('BackandService', function ($http, Backand, auth){
  var baseUrl = '/1/objects/';

  function getUrl(objectName){
    return Backand.getApiUrl() + baseUrl + objectName + "/";
  }

  //BASIC QUERY /////////////////////////////////////////////////

  getAllObjects = function(objectName){
    return $http.get(getUrl(objectName));
  }

  getObjectById = function(objectName,id){
    return $http.get(getUrl(objectName) + id);
  }

  addObject = function(objectName,object){
    return $http.post(getUrl(objectName)+"?returnObject=true", object);
  }

  deleteObject = function(objectName,id){
    return $http.delete(getUrl(objectName) + id);
  }

  //CUSTOM QUERY /////////////////////////////////////////////////

  getSupplierLinkByAgentIdAndType = function (agent_id,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierLinkByAgentIdAndType',
        params: {
          parameters: {
            agent_id: agent_id,
            type : type
          }
        }
      })
  }    

  getAgentLinkBySupplierIdAndType = function (supplier_id,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAgentLinkBySupplierIdAndType',
        params: {
          parameters: {
            supplier_id: supplier_id,
            type : type
          }
        }
      })
  }  

  getProductBySupplierId = function (supplier_id){
    console.log("product");
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getProductBySupplierId',
        params: {
          parameters: {
            supplier_id: supplier_id
          }
        }
      })
  }  

  getUserLink = function (agent_id,supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserLinkByBothId',
        params: {
          parameters: {
            agent_id: agent_id,
            supplier_id: supplier_id
          }
        }
      })
  }  

  deleteUserLink = function (agent_id,supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/deleteUserLink',
        params: {
          parameters: {
            agent_id: agent_id,
            supplier_id: supplier_id
          }
        }
      })
  }  

  editUserLink = function (agent_id,supplier_id,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editUserLink',
        params: {
          parameters: {
            agent_id: agent_id,
            supplier_id: supplier_id,
            type : type
          }
        }
      })
  }

  getUserbyEmail = function(email){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserbyEmail',
        params: {
          parameters: {
            email: email
          }
        }
      })
  }

  getUserByAuthId = function(auth_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserByAuthId',
        params: {
          parameters: {
            auth_id: auth_id
          }
        }
      })
  }  

  getLinkByAgentIdSupplierIdType = function(agent_id,supplier_id,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getLinkByAgentIdSupplierIdType',
        params: {
          parameters: {
            agent_id: agent_id,
            supplier_id: supplier_id,
            type: type
          }
        }
      })
  }  

  getAgentActiveListing = function(agent_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAgentActiveListing',
        params: {
          parameters: {
            agent_id: agent_id
          }
        }
      })
  }  

  getSupplierActiveListing = function(supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierActiveListing',
        params: {
          parameters: {
            supplier_id: supplier_id
          }
        }
      })
  }    

  getAgentCompletedTransaction = function(agent_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAgentCompletedTransaction',
        params: {
          parameters: {
            agent_id: agent_id
          }
        }
      })
  }    

  getSupplierCompletedTransaction = function(supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierCompletedTransaction',
        params: {
          parameters: {
            supplier_id: supplier_id
          }
        }
      })
  }  

  getSupplierNameById = function(supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierNameById',
        params: {
          parameters: {
            supplier_id: supplier_id
          }
        }
      })
  }  

  editTransactionStatus = function(id,status,timeUpdated){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editTransactionStatus',
        params: {
          parameters: {
            id: id,
            status : status,
            timeUpdated : timeUpdated
          }
        }
      })
  }  

  editTransactionPaymentStatus = function(id,payment_status,timeUpdated){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editTransactionPaymentStatus',
        params: {
          parameters: {
            id: id,
            payment_status : payment_status,
            timeUpdated : timeUpdated
          }
        }
      })
  }

  getTimestampinMysql = function(){
    var formatedMysqlTimestamp = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
    return formatedMysqlTimestamp;
  }
  ////////////////////////////////////////////////////////////////

  return{
    //basic query
    getAllObjects: getAllObjects,
    getObjectById: getObjectById,
    addObject: addObject,
    deleteObject: deleteObject,

    //other
    getTimestampinMysql : getTimestampinMysql,

    //loginQuery
    getUserByAuthId : getUserByAuthId,
    getUserbyEmail : getUserbyEmail,

    //userRelatedQuery
    getUserLink : getUserLink,
    editUserLink : editUserLink,
    deleteUserLink:deleteUserLink,
    getSupplierLinkByAgentIdAndType : getSupplierLinkByAgentIdAndType,
    getAgentLinkBySupplierIdAndType : getAgentLinkBySupplierIdAndType,
    getLinkByAgentIdSupplierIdType : getLinkByAgentIdSupplierIdType,
    getSupplierNameById : getSupplierNameById,

    //productQuery
    getProductBySupplierId : getProductBySupplierId,

    //transactionQuery
    getAgentActiveListing : getAgentActiveListing,
    getSupplierActiveListing : getSupplierActiveListing,
    editTransactionStatus : editTransactionStatus,
    editTransactionPaymentStatus : editTransactionPaymentStatus,
    getAgentCompletedTransaction : getAgentCompletedTransaction,
    getSupplierCompletedTransaction : getSupplierCompletedTransaction

  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('DropboxService', function ($http){
  var access_token = "H6PJA3e1IJMAAAAAAAA7s9vlI9ZyuZA8KVF49yanXNjRnRAicsDBPFauFoEIz42A";

  getFullUrl = function(url){
    return $http({
        method: 'POST',
        url: url
    }).success(function(data, status, headers, config) {
        console.log(data);
        console.log(headers);
        console.log('get full url successfully');
    }).error(function(data, status, headers, config) {
      
        console.log('get full url failed');
    });
  }  

  uploadFile = function(pathFile,data){
    return $http({
        method: 'PUT',
        url: 'https://api-content.dropbox.com/1/files_put/dropbox/' + pathFile+ '?access_token=' + access_token,
        data: data
    }).success(function(data, status, headers, config) {
        console.log('file uploaded successfully');
        console.log(data);           
        console.log(status);           
        console.log(headers);           
        console.log(config);  
    }).error(function(data, status, headers, config) {

    });
  }

//https://api.dropboxapi.com/1/shares/auto/<path>
  getShareLink = function(pathFile){
    return $http({
          method: 'POST',
          url: 'https://api.dropboxapi.com/1/shares/auto/' + pathFile
                +'?access_token=' + access_token
                +'&short_url=false'

      }).success(function(data, status, headers, config) {
          console.log('share link successfully'); 
          console.log(config);
          
      }).error(function(data, status, headers, config) {
          console.log('file share failed');
          console.log(data);           
          console.log(status);           
          console.log(headers);           
          console.log(config);           
    });
  }  



  return{
    //basic query
    uploadFile : uploadFile,
    getShareLink : getShareLink,
    getFullUrl : getFullUrl
  }

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('FileReaderService', function ($q, $log){

  var onLoad = function(reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.resolve(reader.result);
          });
      };
  };

  var onError = function (reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.reject(reader.result);
          });
      };
  };

  var onProgress = function(reader, scope) {
      return function (event) {
          scope.$broadcast("fileProgress",
              {
                  total: event.total,
                  loaded: event.loaded
              });
      };
  };

  var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
  };

  var readAsDataURL = function (file, scope) {
      var deferred = $q.defer();
       
      var reader = getReader(deferred, scope);         
      reader.readAsDataURL(file);
       
      return deferred.promise;
  };

  return {
      readAsDataURL: readAsDataURL  
  };
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// PublicService ///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// PublicService ///////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('PublicService', function ($http){


  getTimestampForFileName = function(timestamp)
  {
    return timestamp.replace(':', '-').replace(':', '-').replace(' ','-');
  }

  getTimestampinMysql = function(){
    var formatedMysqlTimestamp = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
    return formatedMysqlTimestamp;
  }

  getAgoTime = function(timestamp)
  {
    var ago = jQuery.timeago(timestamp);
    return ago; 
  }

  function monthNumToString(month)
  {
    var toReturn;
    
    if(month == "01")
      toReturn = "January";    
    if(month == "02")
      toReturn = "February";    
    if(month == "03")
      toReturn = "March";    
    if(month == "04")
      toReturn = "April";    
    if(month == "05")
      toReturn = "May";    
    if(month == "06")
      toReturn = "June";    
    if(month == "07")
      toReturn = "July";    
    if(month == "08")
      toReturn = "August";    
    if(month == "09")
      toReturn = "September";    
    if(month == "10")
      toReturn = "October";    
    if(month == "11")
      toReturn = "November";    
    if(month == "12")
      toReturn = "December";

    return toReturn;
  }

  getDate = function(timestamp)
  {
    //2016-06-04T21:06:16
    var date =  timestamp;
    var dateArr = date.split("T")[0].split("-");
  
    var year = dateArr[0];
    var month =  monthNumToString(dateArr[1]);
    var day = Number(dateArr[2]);

    var date = month + " " + day + " , " + year;

    return date;
   }

  setFooter = function (type)
  {
    
    var footer = "footer_newUser";
    var footerList = ["footer_agent","footer_supplier","footer_newUser"];

    if(type != "")
    {
      footer = "footer_"+ type;
    }



    for (var i = 0; i < footerList.length; i++)
    { 

      var element = document.getElementById(footerList[i]);
      //console.log(element);
      if(element != null)
      {
        if(footerList[i] == footer)
        {
          //console.log(footerList[i]);
          element.setAttribute("style","display:default");
        }
        else
        {
          //console.log(footerList[i]);
          element.setAttribute("style","display:none");
        }
      }
    }
  }

  setHeader = function (type)
  {
    var headerList = ["header_logout","header_login"];
    var header = "header_"+ type;

    for (var i = 0; i < headerList.length; i++)
    { 
      if(headerList[i] == header)
      {
        document.getElementById(headerList[i]).setAttribute("style","display:default");
      }
      else
      {
        document.getElementById(headerList[i]).setAttribute("style","display:none");
      }
    }

  }

  initHeaderFooter = function (authProfile,userInSession)
  {
    if(authProfile != null )
    {
      setHeader("logout");
      //console.log($scope.authProfile);
      if(userInSession != null)
      {
        setFooter(userInSession.user_type);
      }
      else
      {
        setFooter("newUser");
      }    
    }
  }

  logout = function(){
    var returnUrl = window.location.href.split("#")[0];
    //console.log(returnUrl);
    window.location = 'https://wzs21.auth0.com/v2/logout?returnTo='+returnUrl;
  }

  return {
      getTimestampForFileName : getTimestampForFileName,
      getTimestampinMysql : getTimestampinMysql ,
      setFooter : setFooter ,
      setHeader : setHeader,
      initHeaderFooter : initHeaderFooter,
      getAgoTime : getAgoTime,
      getDate : getDate,
      logout : logout,
  };


  
});