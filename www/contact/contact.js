var myApp = angular.module('sample.contact', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider) {

  $stateProvider
    .state('contact', {
      url: '/contact',
      controller: 'ContactController',
      templateUrl: 'contact/contact.html',
      data: {
        requiresLogin: false
      }
    });

});

myApp.controller('ContactController', function($location,growl, $scope, $state, APP_CONSTANT,TEAM_CONSTANT){
  
  $scope.TEAM_CONSTANT = TEAM_CONSTANT;
  console.log(TEAM_CONSTANT);
  
  $scope.showItem = null;


  $scope.submit = function ()
  {

  }

  function successCallback(){
    growl.success('Thank you for contacting us.',{title: 'Successfully Send Message!'});
    $state.go("home");
  }


  $scope.toggleItem = function(item) {
    
    if ($scope.isItemShown(item)) 
    {
      $scope.showItem = null;
    } 
    else 
    {
      $scope.showItem = item;
      console.log($scope.showItem);
    }

  };

  $scope.isItemShown = function(item) {
    return $scope.showItem === item;
  };



});
