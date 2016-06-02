var myApp = angular.module('sample.users', [
  'ui.router',
  'backand',
  'auth0',
  'ngCookies'
]);

myApp.config(function($stateProvider, BackandProvider) {
  $stateProvider
    .state('agents', {
      url: '/agents',
      controller: 'UserController',
      templateUrl: 'users/agents.html',
      data: {
        requiresLogin: true
      }
    });

  $stateProvider
    .state('suppliers', {
      url: '/suppliers',
      controller: 'UserController',
      templateUrl: 'users/suppliers.html',
      data: {
        requiresLogin: true
      }
  });

  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');
  
});


myApp.controller('UserController', function($scope, BackandService, auth, $state){
  
  $scope.agents = [];
  $scope.suppliers = [];

  $scope.auth = auth;
  var userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.agentId = userInSession.agent_id;
  $scope.supplierId = userInSession.supplier_id;
  $scope.userType = userInSession.user_type;
  
  function getAllObjects(objectName,user_type){
      BackandService.getAllObjects(objectName).then(function(result){

        if($scope.userType == "agent")
          $scope.suppliers = result.data.data;

        if($scope.userType == "supplier")
          $scope.agents = result.data.data;


        console.log(result.status);
        console.log("Data from returned objects");
        console.log(result.data.data);

      });


  }

  
  if($scope.userType == "agent")
   getAllObjects("suppliers", $scope.userType);
  
  if($scope.userType == "supplier")
   getAllObjects("agents", $scope.userType);

});


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
    return $http.post(getUrl(objectName), object);
  }

  deleteObject = function(objectName,id){
    return $http.delete(getUrl(objectName) + id);
  }

  //CUSTOM QUERY /////////////////////////////////////////////////

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

  ////////////////////////////////////////////////////////////////

  return{
    //basic query
    getAllObjects: getAllObjects,
    getObjectById: getObjectById,
    addObject: addObject,
    deleteObject: deleteObject,

    //custom query
    getUserbyEmail : getUserbyEmail
  }

});
