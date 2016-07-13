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


myApp.controller('HomeController', function ($scope,growl, $state, BackandService,PublicService,USER_TYPE,NOTI_CATEGORY) {
  
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
    $scope.myNotificationLoad = true;

    //LIMIT 5 je
    getNotification($scope.userInSession.user_id,5);

  }

  $scope.refreshNotification = function()
  {
    console.log("Refresh");
    getNotification($scope.userInSession.user_id,5);
    growl.info('Notification is up to date',{title: 'Refresh Notification!'});
  }


  function getNotification(user_id,limit)
  {
    $scope.NOTI_CATEGORY = NOTI_CATEGORY;
    BackandService.getAllNotificationByUserId(user_id,limit).then(function(result){
      console.log("Return Result from getAllNotificationByUserId");
      console.log(result);

        $scope.myNotificationLoad = false;
        if(result.status == 200)
        {
          $scope.myNotification = result.data;
        }

      }, function errorCallback (result){
            console.log(result);
            PublicService.errorCallbackFunction(result,"Opps! Something went wrong.");
            $scope.myNotificationLoad = false;
      });
  }

  $scope.isRead = function (item)
  {
    item.isRead = true;

    BackandService.setNotificationIsReadTrue(item.id).then(function(result){
      console.log("Return Result from isRead");
      console.log(result);

        if(result.status == 200)
        {
        }

      }, function errorCallback (result){
            PublicService.errorCallbackFunction(result,"Opps! Something went wrong.");
      });

  }

});
