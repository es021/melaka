
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('sample', ['ionic','ionic.service.core', 
  'backand',
  'ui.router',
  'restangular',
  //'tinify',
  'sample.home',
  'sample.login-signup',
  'sample.register',
  'sample.users',
  'sample.transactions',
  'sample.products',
  'sample.contact',
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

myApp.config( function ($urlRouterProvider, $httpProvider, $stateProvider, authProvider, $httpProvider,growlProvider,BackandProvider,$locationProvider) {
  //$locationProvider.html5Mode(true);
  growlProvider.globalTimeToLive(3000);

  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');
  
  //BackandProvider.setAppName('dropbug');
  //BackandProvider.setAnonymousToken('5ee54b6c-f992-4a78-b789-0a36721791c7');
  
  console.log("From app config");
  
  //$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
});


myApp.run(function(auth) {
  auth.hookEvents();
});


myApp.controller('AppController', function ($scope,UserService,$ionicPopup,$ionicSideMenuDelegate, auth, $state,$stateParams,PublicService,$location,AUTH_CONSTANT, USER_TYPE,APP_CONSTANT) {
  
  $scope.APP_CONSTANT = APP_CONSTANT;

  $scope.main = function(){
    var state = $location.path().replace("/", "");

    console.log(state);

    //login with sosial provider
    if(state.length > 30)
    {
      console.log("a");
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
  }

  //setting header and footer
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));  

  //to clear off from previous production
  if($scope.userInSession != null)
  {
    if(typeof($scope.userInSession.user_type) == "string")
    {
        window.localStorage.removeItem("UserInSession");
        window.localStorage.removeItem("AuthProfile");
        $scope.userInSession = null;
        $scope.authProfile = null;
    }
  }
  
  $scope.main();

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

  $scope.USER_TYPE = USER_TYPE;

  PublicService.initHeaderFooter( $scope.authProfile,$scope.userInSession);
  if($scope.authProfile != null)
  {
    PublicService.initSideMenu();
  }

 $scope.comfirmLogout = function()
  {
    function logout(){

      $scope.authProfile = null;
      $scope.userInSession = null;
      window.localStorage.removeItem("UserInSession");
      window.localStorage.removeItem("AuthProfile");
      PublicService.setHeader("login");
      PublicService.setFooter("newUser");

      PublicService.logout();
      //$state.go('login');
    }

    var confirmPopup = $ionicPopup.confirm({
       title: 'Log Out From '+APP_CONSTANT.NAME,
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
    closeSideMenuBar();
    $state.go('home');    
  };

  $scope.allUsers = function() {
    closeSideMenuBar();
    $state.go('allUsers');
  };

  $scope.login = function() {
    console.log("here");
    $state.go('login');    
  };  

  $scope.signup = function() {
    $state.go('signup');    
  };

  $scope.myActiveListing = function() {
    closeSideMenuBar();
    $state.go('myActiveListing');
  };
  

  $scope.findUser = function(user_type_request) {
    closeSideMenuBar();
    $state.go('findUser',{user_type_request:user_type_request});
  };    


  $scope.myProducts = function() {
    closeSideMenuBar();
    $state.go('myProducts');
  };
  
  ///////////////////////////////////////////////
  //SIDE MENU BAR //////////////////////////////////
  $scope.toggleSideMenuLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };  

  $scope.toggleSideMenuRight = function(){
    $ionicSideMenuDelegate.toggleRight();
  };

  function closeSideMenuBar(){
    if($ionicSideMenuDelegate.isOpenLeft()){
      $ionicSideMenuDelegate.toggleLeft();
    }    

    if($ionicSideMenuDelegate.isOpenRight()){
      $ionicSideMenuDelegate.toggleRight();
    }
  }

  $scope.myLinkedUser = function() {
    closeSideMenuBar();
    $state.go('myLinkedUser');
  };  

  $scope.myCompletedTransaction = function() {
    closeSideMenuBar();
    $state.go('myCompletedTransaction');
  };

  $scope.myPendingLinkRequest = function()
  {
    closeSideMenuBar();
    $state.go('myPendingLinkRequest');
  } 

  $scope.contact = function() {   
    closeSideMenuBar();
    $state.go();    
  };

  $scope.showUser = function (id){
    closeSideMenuBar();
    console.log(id);
    $state.go('showUser',{id:id}); 
  };

  $scope.myProfile = function (){
    closeSideMenuBar();
   

    if($scope.userInSession != null)
    {
      $state.go('myProfile');     
    }
    else
    {
      growl.error("Supplier, Stockist or Dropship" ,{title: 'You have to Register First!'});    
    }

  };

  $scope.showProductList = function(user_id){
    closeSideMenuBar();
    $state.go('showProductList',{user_id:user_id});
  }

  $scope.showProduct = function(product_id,show)
  {
    $state.go('showProduct',{product_id:product_id,show:show})
  };

});
