var myApp = angular.module('sample.test', [
  'ui.router']);

myApp.config(function($stateProvider) {

  $stateProvider
    .state('test', {
      url: '/test',
      controller: 'TestController',
      templateUrl: 'test/test.html',
      data: {
        requiresLogin: false,
      }
    });
});

myApp.controller('TestController', function(ServerService, growl, $scope,$state){
  
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  
  if(!isAdmin($scope.authProfile,$scope.userInSession))
  {
    growl.error('Redirecting to Home page',{title: 'You are not authorize for this page'});
    $state.go("home");

  }

  function isAdmin(authProfile, userInSession)
  {
    if(authProfile == null)
    {
      return false;
    }
    else
    {
      if(userInSession == null)
      {
        return false;
      }
      else
      {
        if(userInSession.user_id == 1 || userInSession.user_id == 3)
        {
          return true;
        }
      }
    }

    return false;    
  }


  var data = {}
  data.name = "test";

  $scope.put = function()
  {
    ServerService.putObject("products",24,data).then(function (result){
    console.log(result);
    });   
  }



});