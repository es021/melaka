// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('sample', ['ionic','ionic.service.core', 
  'backand',
  'ui.router',
  'restangular',
  'sample.home',
  'sample.login',
  'sample.signup',
  'sample.users',
  'sample.transactions',
  'sample.products',
  'auth0',
  'ngCookies',
  'ngRoute',
  'angular-storage',
  'angular-jwt',
  'angular-growl'
  ]);

myApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTH 0 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.config( function ($urlRouterProvider, $stateProvider, authProvider, $httpProvider,growlProvider,BackandProvider) {

  growlProvider.globalTimeToLive(3000);

    $stateProvider
    .state('home', {
      url: "/",
      controller: 'AppController',
      templateUrl: 'home/home.html'
    });

  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');

});

myApp.constant("USER_LINK_TYPE", {
        "LINKED": 1,
        "NOT_REQUESTED": 2,
        "REQUESTED_BY_A": 3,
        "REQUESTED_BY_S": 4,
        "SAME_TYPE":5,
        "NOT_AUTH":6
});

myApp.constant("USER_TYPE", {
        "AGENT": 1,
        "SUPPLIER": 2
});

myApp.constant("TRANS_STATUS", {
        "REQUESTED": 1,
        "DENIED": 2,
        "APPROVED": 3,
        "DELIVERED": 4,
        "RECEIVED": 5
});

myApp.constant("PAYMENT_STATUS", {
        "PAID": 1,
        "COMFIRMED": 2
});

myApp.run(function(auth) {
  auth.hookEvents();
});


myApp.controller('AppController', function AppCtrl ($scope, auth, $state, growl, BackandService, USER_LINK_TYPE) {
  $scope.auth = auth;

  if(auth.isAuthenticated)
  {
    $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
    $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
    initAuthenticatedUser($scope);

    /*
    console.log("UserInSession");
    console.log($scope.userInSession);

    console.log("AuthProfile");
    console.log($scope.authProfile);
    */
  }

  function initAuthenticatedUser($scope)
  {
    $scope.myLinkedUser = {};
    $scope.requestedToUser = {};
    $scope.requestedFromUser = {};
    
    if($scope.userInSession != null)
    {
      if($scope.userInSession.user_type == "agent")
      {
        console.log("Init Agent");

        //myLinkedUser
        getSupplierLinkByAgentIdAndType($scope.userInSession.agent_id, USER_LINK_TYPE.LINKED);
        
        //requestedToUser
        getSupplierLinkByAgentIdAndType($scope.userInSession.agent_id, USER_LINK_TYPE.REQUESTED_BY_S);

        //requestedFromUser
        getSupplierLinkByAgentIdAndType($scope.userInSession.agent_id, USER_LINK_TYPE.REQUESTED_BY_A);
      }

      else if($scope.userInSession.user_type == "supplier")
      {
        console.log("Init Supplier");
        
        //myLinkedUser
        getAgentLinkBySupplierIdAndType($scope.userInSession.supplier_id, USER_LINK_TYPE.LINKED);
        
        //requestedToUser
        getAgentLinkBySupplierIdAndType($scope.userInSession.supplier_id, USER_LINK_TYPE.REQUESTED_BY_A);
        
        //requestedFromUser
        getAgentLinkBySupplierIdAndType($scope.userInSession.supplier_id, USER_LINK_TYPE.REQUESTED_BY_S);
      }
    }
    else
    {
      console.log("Init New");
    }

  }

  function getSupplierLinkByAgentIdAndType(agent_id,type){
    BackandService.getSupplierLinkByAgentIdAndType(agent_id,type).then(function(result){
      console.log("Getting all getSupplierLinkByAgentIdAndType | Type : "+type);
      console.log(result);

      if(type == USER_LINK_TYPE.LINKED)
      {
        $scope.myLinkedUser = result.data;
      }      


      //User : Agent
      //Kita nak supplier, request by supplier => requestedToUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_S)
      {
        $scope.requestedToUser = result.data;
      }


      //User : Agent
      //Kita nak supplier, request by agent => requestedFromUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_A)
      {
        $scope.requestedFromUser = result.data;
      }

    });
  }

  function getAgentLinkBySupplierIdAndType(supplier_id,type){
    BackandService.getAgentLinkBySupplierIdAndType(supplier_id,type).then(function(result){
      console.log("Getting all getAgentLinkBySupplierIdAndType | Type : "+type);
      console.log(result);

      if(type == USER_LINK_TYPE.LINKED)
      {
        $scope.myLinkedUser = result.data;
      }


      //User : Supplier
      //Kita nak agent, request by agent => requestedToUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_A)
      {
        $scope.requestedToUser = result.data;
      }

      //User : Supplier
      //Kita nak agent, request by supplier => requestedFromUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_S)
      {
        $scope.requestedFromUser = result.data;
      }

    });
  }

  $state.go("home");
  
  $scope.home = function(authenticated, user_type) {    
    $state.go('home');    
  };

  $scope.logout = function() {
    auth.signout();
    window.localStorage.removeItem("UserInSession");
    window.localStorage.removeItem("AuthProfile");
    $state.go('login');
  };

  $scope.allUsers = function() {
    $state.go('allUsers');
  };

  $scope.login = function() {

    $state.go('login');    
  };

  $scope.transactions = function() {
    $state.go('transactions');
  };

  $scope.agents = function() {
    $state.go('agents');
  };

  $scope.suppliers = function() {
    $state.go('suppliers');
  };  

  $scope.myProducts = function() {
    $state.go('myProducts');
  };

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BACKEND //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    deleteUserLink:deleteUserLink,

    //other
    getTimestampinMysql : getTimestampinMysql,

    //basic custom query
    getUserbyEmail : getUserbyEmail,
    getUserLink : getUserLink,
    editUserLink : editUserLink,
    getSupplierLinkByAgentIdAndType : getSupplierLinkByAgentIdAndType,
    getAgentLinkBySupplierIdAndType : getAgentLinkBySupplierIdAndType,

    //productQuery
    getProductBySupplierId : getProductBySupplierId
  }

});


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