var myApp = angular.module('sample.faq', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider) {

  $stateProvider
    .state('faq', {
      url: '/faq',
      controller: 'FAQController',
      templateUrl: 'faq/faq.html',
      data: {
        requiresLogin: false
      }
    });

});

myApp.controller('FAQController', function($location,growl, $scope, $state, APP_CONSTANT){
  
  $scope.APP_CONSTANT = APP_CONSTANT;


});
