// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('sample', ['ionic','ionic.service.core', 
  'backand',
  'ui.router',
  'restangular',
  'sample.login-signup',
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

myApp.config( function ($urlRouterProvider, $stateProvider, authProvider, $httpProvider,growlProvider,BackandProvider,$locationProvider) {
  //$locationProvider.html5Mode(true);
  growlProvider.globalTimeToLive(3000);

  $stateProvider
    .state("home", {
      url: "/home",
      controller: 'HomeController',
      templateUrl: 'home/home.html'
    });

  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');

});

myApp.run(function(auth) {
  auth.hookEvents();
});


myApp.controller('AppController', function ($scope,$ionicPopup, auth, $state,PublicService,$location) {

  var state = $location.path().replace("/", "");
  console.log(state);

  //login with sosial provider

  if(state.length > 30)
  {
    socialLoginHandler(state);
  }
  else if(state == "")
  {
    $state.go("home");
  }
  else
  {
    $state.go(state);
  }

  function socialLoginHandler(state)
  {
    //access_token=qtcCiHqxEVXL4tFt&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d6czIxLmF1dGgwLmNvbS8iLCJzdWIiOiJmYWNlYm9va3wxMDIwNjAyMTI1MDQwMTI5MCIsImF1ZCI6ImoydWNWeUxHMXBNcUdaaUtzR0wwMFFBa0hiVzIxc2lIIiwiZXhwIjoxNDY1NjExMjU2LCJpYXQiOjE0NjU1NzUyNTZ9.ot1xygGZA1QjXo3fX-P3G3USUvm6UoIrTqr5ejOdvtE&token_type=Bearer&state=NbT1JRZPbTd15Q7kU1UixCg3
    var token = state.split("&");
    //console.log(token);
    var accessToken = token[0].split("=")[1];
    var idToken =token[1].split("=")[1];
    //console.log(accessToken);
    //console.log(idToken);
    $state.go('login_success', {accessToken:accessToken,idToken:idToken});
  }



  //setting header and footer
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));  
  
  PublicService.initHeaderFooter( $scope.authProfile,$scope.userInSession);
  
 $scope.comfirmLogout = function()
  {
    function logout(){
      auth.signout();
      $scope.authProfile = null;
      $scope.userInSession = null;
      window.localStorage.removeItem("UserInSession");
      window.localStorage.removeItem("AuthProfile");
      PublicService.setHeader("login");
      PublicService.setFooter("newUser");
      $state.go('login');
    }

    var confirmPopup = $ionicPopup.confirm({
       title: 'Log Out From Melaka',
       template: 'Are you sure?'
     });
     
    confirmPopup.then(function(result) {
        if(result)
        {
          logout();
        }
     });
  }
  
  $scope.home = function() {    
    $state.go('home');    
  };

  $scope.allUsers = function() {
    $state.go('allUsers');
  };

  $scope.login = function() {

    $state.go('login');    
  };  

  $scope.signup = function() {

    $state.go('signup');    
  };

  $scope.myActiveListing = function() {
    $state.go('myActiveListing');
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


myApp.controller('HomeController', function ($scope, $state, BackandService,PublicService, USER_LINK_TYPE) {
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  PublicService.initHeaderFooter( $scope.authProfile,$scope.userInSession);

  if($scope.authProfile != null )
  {
    initDashboard($scope);
  }

  function initDashboard($scope)
  {
    $scope.myLinkedUser = {};
    $scope.requestedToUser = {};
    $scope.requestedFromUser = {};

    $scope.myLinkedUserLoad = true;
    $scope.requestedToUserLoad = true;
    $scope.requestedFromUserLoad = true;
    
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
        $scope.myLinkedUserLoad = false;
      }      

      //User : Agent
      //Kita nak supplier, request by supplier => requestedToUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_S)
      {
        $scope.requestedToUser = result.data;
        $scope.requestedToUserLoad = false;
      }


      //User : Agent
      //Kita nak supplier, request by agent => requestedFromUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_A)
      {
        $scope.requestedFromUser = result.data;
        $scope.requestedFromUserLoad = false;
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
        $scope.myLinkedUserLoad = false;
      }

      //User : Supplier
      //Kita nak agent, request by agent => requestedToUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_A)
      {
        $scope.requestedToUser = result.data;
        $scope.requestedToUserLoad = false;
      }

      //User : Supplier
      //Kita nak agent, request by supplier => requestedFromUser
      if(type == USER_LINK_TYPE.REQUESTED_BY_S)
      {
        $scope.requestedFromUser = result.data;
        $scope.requestedFromUserLoad = false;

      }

    });
  }


});
