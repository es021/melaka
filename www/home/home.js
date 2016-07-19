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
  
  $stateProvider
    .state("allNotifications", {
      url: "/allNotifications?pageNumber",
      cache: false,
      controller: 'NotificationController',
      templateUrl: 'home/allNotifications.html'
    });

});


myApp.controller('HomeController', function ($scope,growl, $state, BackandService,PublicService,USER_TYPE,NOTI_CATEGORY) {
  
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  console.log($scope.userInSession);
  PublicService.initHeaderFooter( $scope.authProfile,$scope.userInSession);

  $scope.userCount_load = ["count",0,0,0];
  $scope.suppliersCount = 0;
  $scope.stockistsCount = 0;
  $scope.dropshipsCount = 0; 

  $scope.USER_TYPE = USER_TYPE;
  
  function getAllUserCount()
  {
    for(var i=1; i<=3 ;i++)
    {
      $scope.userCount_load[i] = true;
      getUserCountByUserType(i);
    }

  }

  function getUserCountByUserType(user_type){
    BackandService.getUserCountByUserType(user_type).then(function(result){
      if(user_type == USER_TYPE.SUPPLIER)
      {
        $scope.suppliersCount = result.data[0].total_user;
      }

      if(user_type == USER_TYPE.STOCKIST)
      {
        $scope.stockistsCount = result.data[0].total_user;
      }

      if(user_type == USER_TYPE.DROPSHIP)
      {
        $scope.dropshipsCount = result.data[0].total_user;
      }

      $scope.userCount_load[user_type] = false;

    },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"default");
    });
  }
  
  if($scope.authProfile != null )
  {
    if($scope.userInSession != null)
      initDashboard($scope);

    PublicService.initSideMenu();
  }
  else
  {
      getAllUserCount();
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

myApp.controller('NotificationController', function ($scope,growl, $state,$stateParams, BackandService,PublicService,USER_TYPE,NOTI_CATEGORY) {
  
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  console.log($scope.userInSession);

  $scope.pageNumber = $stateParams.pageNumber;

  getNotificationByPage($scope.userInSession.user_id,$scope.pageNumber);
  

  $scope.refreshNotification = function()
  {
    console.log("Refresh");
    getNotificationByPage($scope.userInSession.user_id,$scope.pageNumber);
    growl.info('Notification is up to date',{title: 'Refresh Notification!'});
  }

  function getNotificationByPage(user_id,pageNumber)
  {
    $scope.NOTI_CATEGORY = NOTI_CATEGORY;
    BackandService.getAllNotificationByUserId_page(user_id,pageNumber).then(function(result){
      console.log("Return Result from getAllNotificationByUserId_page");
      console.log(result);

        $scope.myNotificationLoad = false;
        if(result.status == 200)
        {
          $scope.myNotification = result.data.data;
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

  $scope.getMoreNotification = function(direction)
  {
    console.log(direction);
    if(direction == 'next')
    {
      $scope.pageNumber = Number($scope.pageNumber) + 1;
    }

    if(direction == 'previous')
    {
      $scope.pageNumber = Number($scope.pageNumber) - 1;
    }


    $state.go('allNotifications',{pageNumber:$scope.pageNumber});
  }


 

});
