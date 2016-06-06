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

    //productQuery
    getProductBySupplierId : getProductBySupplierId
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
        //console.log(data);
        console.log('file uploaded successfully');
    }).error(function(data, status, headers, config) {

    });
  }

  getShareLink = function(pathFile){
    return $http({
          method: 'POST',
          url: 'https://api.dropboxapi.com/1/media/auto/' + pathFile+ '?access_token=' + access_token
      }).success(function(data, status, headers, config) {
          console.log('share link successfully');           
      }).error(function(data, status, headers, config) {
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

myApp.service('PublicService', function (){

  getTimestampForFileName = function(timestamp)
  {
    return timestamp.replace(':', '-').replace(':', '-').replace(' ','-');
  }

  getTimestampinMysql = function(){
    var formatedMysqlTimestamp = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
    return formatedMysqlTimestamp;
  }

  return {
      getTimestampForFileName : getTimestampForFileName,
      getTimestampinMysql : getTimestampinMysql  
  };
  
});