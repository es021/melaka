var myApp = angular.module('sample.redirect', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider) {

  $stateProvider
    .state('contentNotFound', {
      url: '/contentNotFound?message',
      controller: 'RedirectController',
      templateUrl: 'redirect/contentNotFound.html',
      data: {
        requiresLogin: false
      }
    });

});

myApp.controller('RedirectController', function($scope, $state, $stateParams, APP_CONSTANT,TEAM_CONSTANT){
  
  $scope.stateParams = $stateParams;

});