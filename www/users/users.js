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
        requiresLogin: false
      }
    });

  $stateProvider
    .state('suppliers', {
      url: '/suppliers',
      controller: 'UserController',
      templateUrl: 'users/suppliers.html',
      data: {
        requiresLogin: false
      }
  });

  $stateProvider
    .state('allUsers', {
      url: '/allUsers',
      controller: 'UserController',
      templateUrl: 'users/allUsers.html',
      data: {
        requiresLogin: false
      }
  });


  $stateProvider
    .state('showAgent', {
      url: '/showAgent',
      controller: 'ShowUserController',
      templateUrl: 'users/showAgent.html',
      params : {
        id : 0,
        objectName : ""
      },
      data: {
        requiresLogin: false
      }
  });

  $stateProvider
    .state('showSupplier', {
      url: '/showSupplier',
      controller: 'ShowUserController',
      templateUrl: 'users/showSupplier.html',
      params : {
        id : 0,
        objectName : ""
      },
      data: {
        requiresLogin: false
      }
  }); 



  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');
  
});



myApp.controller('UserController', function($scope, BackandService, auth, $state, $stateParams){
  
  //console.log($state.current.name);

  $scope.agents = [];
  $scope.suppliers = [];

  $scope.showObject = $stateParams.showObject;

  $scope.auth = auth;
  var userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.agentId = userInSession.agent_id;
  $scope.supplierId = userInSession.supplier_id;
  $scope.userType = userInSession.user_type;
  
  function getAllObjects(objectName){
      BackandService.getAllObjects(objectName).then(function(result){

        if(objectName == "agents")
          $scope.agents = result.data.data;

        if(objectName == "suppliers")
          $scope.suppliers = result.data.data;


        console.log(result.status);
        console.log("Data from returned objects");
        console.log(result.data.data);

      });
    }

  $scope.showObjectFunction = function(objectName, id)
  {
    if(objectName == "agents")
      $state.go('showAgent', {id:id, objectName:objectName});

    if(objectName == "suppliers")
      $state.go('showSupplier', {id:id, objectName:objectName});
  };

  if($state.current.name == "allUsers")
  {
    getAllObjects("agents");
    getAllObjects("suppliers");
  }

  if($state.current.name == "agents")
  {
    getAllObjects("agents");
  }

  if($state.current.name == "suppliers")
  {
    getAllObjects("suppliers");
  }



});

myApp.controller('ShowUserController', function($scope, BackandService, auth, $state, $stateParams){
  
  $scope.id = $stateParams.id;
  $scope.objectName = $stateParams.objectName;
  $scope.showObject = $stateParams.showObject;

  function getObjectById(objectName, id)
  {
    BackandService.getObjectById(objectName,id).then(function(result){
    console.log("Data from show object");
    $scope.showObject = result.data;

    });
  }

  getObjectById($scope.objectName,$scope.id);

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
