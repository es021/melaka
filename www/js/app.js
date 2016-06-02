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
  'sample.todoList',
  'sample.todoItem',
  'auth0',
  'ngCookies',
  'ngRoute',
  'angular-storage',
  'angular-jwt']);

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

myApp.config( function ($urlRouterProvider, authProvider, $httpProvider) {



});

myApp.run(function(auth) {
  auth.hookEvents();
});

myApp.controller('AppCtrl', function AppCtrl ($scope, auth, $state) {
  $scope.auth = auth;
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  console.log("UserInSession");
  console.log($scope.userInSession);
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  console.log("AuthProfile");
  console.log($scope.authProfile);
  
  //console.log("authenticated");
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

});


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BACKEND //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////