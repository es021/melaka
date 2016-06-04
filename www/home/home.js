var myApp = angular.module('sample.home', [
  'ui.router',
  'backand',
  'auth0'
]);

myApp.config(function($stateProvider, BackandProvider) {
  /*
  $stateProvider
    .state('home', {
      url: "/",
      controller: 'HomeController',
      templateUrl: 'home/home.html',

      params : {
        authenticated : "no",
        user_type : "new"
      }

    });

*/
  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');
  
});



myApp.controller('HomeController', function($scope, auth, HomeService, $state, $stateParams){

  $scope.authenticated = $stateParams.authenticated;
  $scope.user_type =  $stateParams.user_type;
  console.log ("From HomeController ->  " +  $scope.user_type);


  $scope.auth = auth;
  console.log("Auth");

  console.log($scope.auth);


  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  console.log("UserInSession");
  console.log($scope.userInSession);
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  console.log("AuthProfile");
  console.log($scope.authProfile);
});


myApp.service('HomeService', function ($http, Backand, auth){
  var baseUrl = '/1/objects/';
  var objectName = 'transactions/'

  function getUrl(){
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id){
  	console.log(getUrl() + id);
    return getUrl() + id;
  }


  return{
  }

});

