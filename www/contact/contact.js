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

myApp.controller('ContactController', function($location,growl,BackandService,PublicService, $scope, $state, APP_CONSTANT,TEAM_CONSTANT){
  
  $scope.TEAM_CONSTANT = TEAM_CONSTANT;
  $scope.showItem = null;
  $scope.newMessage = {};

  initSendMessage();

  function initSendMessage(){
    $scope.newMessage = {};
    $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));

    if($scope.authProfile != null)
    {
      $scope.newMessage.email_from = $scope.authProfile.email;
    }
  }


  $scope.submit = function ()
  {
    console.log($scope.newMessage);

    if($scope.newMessage.email_from == null || $scope.newMessage.email_from == '')
    {
      $scope.newMessage.email_from = "Anonymous";
    }

    BackandService.sendEmailToInnovaSeeds($scope.newMessage.email_from,$scope.newMessage.message).then(function(result){
      
      if(result.status == 200)
      {
        successCallback();
      }

    },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"Send Message Failed. Please Try Again");
    });

  }

  function successCallback(){
    growl.success('Thank you for contacting us.',{title: 'Successfully Send Message!'});
    initSendMessage();
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


$scope.testgrowl =function(){
    growl.success('Thank you for contacting us.',{title: 'Successfully Send Message!'});

}

});
