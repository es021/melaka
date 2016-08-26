var myApp = angular.module('sample.server-service', [
  'ui.router'
]);

myApp.service('ServerService', function ($http, Backand, auth, USER_TYPE,OFFSET){

  var BASE_URL = "/v1";

  putObject = function(object,id,data){
    return $http({
      method: "PUT",
      url: BASE_URL +"/"+ object +"/"+ id,
      data: data
    })
  }

  editTransactionStatus = function(id,status,timeUpdated){
    return $http({
      method: "PUT",
      url: BASE_URL + "/transactions/"+id,
      data: {
        status: status,
        updated_at: timeUpdated
        }
    })
  }

  return{
    putObject : putObject
  }

});  