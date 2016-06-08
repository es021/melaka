// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('sample', ['ionic','ionic.service.core', 
  'backand',
  'ui.router',
  'restangular',
  //'sample.login',
  'sample.custom',
  'sample.signup',
  'sample.users',
  'sample.transactions',
  'sample.products',
  'sample.service',
  'sample.constant',
  'sample.directive',
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
      url: "/home",
      controller: 'AppController',
      templateUrl: 'home/home.html'
    });

  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');

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
        initAgent();

      else if($scope.userInSession.user_type == "supplier")
        initSupplier();
    }
    else
    {
      console.log("Init New");
    }

  }

  function initAgent()
  {
    console.log("Init Agent");
    //myLinkedUser
    getSupplierLinkByAgentIdAndType($scope.userInSession.agent_id, USER_LINK_TYPE.LINKED);
    //requestedToUser
    getSupplierLinkByAgentIdAndType($scope.userInSession.agent_id, USER_LINK_TYPE.REQUESTED_BY_S);
    //requestedFromUser
    getSupplierLinkByAgentIdAndType($scope.userInSession.agent_id, USER_LINK_TYPE.REQUESTED_BY_A);
  
  }

  function initSupplier()
  {
    console.log("Init Supplier");
    //myLinkedUser
    getAgentLinkBySupplierIdAndType($scope.userInSession.supplier_id, USER_LINK_TYPE.LINKED);
    //requestedToUser
    getAgentLinkBySupplierIdAndType($scope.userInSession.supplier_id, USER_LINK_TYPE.REQUESTED_BY_A); 
    //requestedFromUser
    getAgentLinkBySupplierIdAndType($scope.userInSession.supplier_id, USER_LINK_TYPE.REQUESTED_BY_S);
  }

  function getSupplierLinkByAgentIdAndType(agent_id,type){
    BackandService.getSupplierLinkByAgentIdAndType(agent_id,type).then(function(result){
      console.log("Getting all getSupplierLinkByAgentIdAndType | Type : "+type);
      //console.log(result);

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
      //console.log(result);

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
  
  $scope.home = function() {    
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
