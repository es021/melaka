var myApp = angular.module('sample.server-service', [
  'ui.router'
]);

myApp.service('ServerService', function ($http){

  var BASE_URL = "/v1";

  tinifyStoreAWS = function (file_url,file_basename,product_id){
    return $http ({
        method: 'GET',
        url: BASE_URL + '/query/data/tinifyStoreAWS',
        params: {
          parameters: {
            file_url: file_url,
            file_basename: file_basename,
            product_id: product_id
          }
        }
      })
  }


  return{
    tinifyStoreAWS : tinifyStoreAWS
  }

});  