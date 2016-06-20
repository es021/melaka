var myApp = angular.module('sample.home', [
  'ui.router',
  'auth0'
]);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTH 0 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.config(function($stateProvider,$urlRouterProvider, authProvider) {  //$locationProvider.html5Mode(true);
  $stateProvider
    .state("home", {
      url: "/home",
      cache: false,
      controller: 'HomeController',
      templateUrl: 'home/home.html'
    });
});


myApp.controller('HomeController', function ($scope, $state, BackandService,PublicService,USER_TYPE) {
  
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  console.log($scope.userInSession);
  PublicService.initHeaderFooter( $scope.authProfile,$scope.userInSession);
  
  $scope.USER_TYPE = USER_TYPE;
  
  if($scope.authProfile != null )
  {
    if($scope.userInSession != null)
      initDashboard($scope);

    PublicService.initSideMenu();
  }

  function initDashboard($scope)
  {
    $scope.myNotification = {};
    $scope.myNotificationLoad = false;

    getNotification($scope.userInSession.user_id);

  }

  function getNotification(user_id)
  {

  }


});
