var myApp = angular.module('sample.about', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider) {

  $stateProvider
    .state('about', {
      url: '/about',
      controller: 'AboutController',
      templateUrl: 'about/about.html',
      data: {
        requiresLogin: false
      }
    });

});

//dependecy injection

myApp.controller('AboutController', function($location,growl, $scope, $state, APP_CONSTANT){
  
  $scope.APP_CONSTANT = APP_CONSTANT;

});
