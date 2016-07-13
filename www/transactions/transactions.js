var myApp = angular.module('sample.transactions', [
  'ui.router',
  'backand',
  'auth0'
]);

myApp.config(function($stateProvider, BackandProvider) {
  $stateProvider
    .state('myActiveListing', {
      url: "/myActiveListing",
      controller: 'TransactionsController',
      templateUrl: 'transactions/myActiveListing.html',
      data: {
        requiresLogin: true
      }
    });  

    $stateProvider
    .state('myCompletedTransaction', {
      url: "/myCompletedTransaction",
      controller: 'TransactionsController',
      templateUrl: 'transactions/myActiveListing.html',
      data: {
        requiresLogin: true
      }
    });

    $stateProvider
    .state('showTransaction', {
      url: "/showTransaction?id&other_user_id",
      controller: 'TransactionsController',
      templateUrl: 'transactions/showTransaction.html',
      data: {
        requiresLogin: true
      }
    });

});


myApp.controller('TransactionsController', function($state,$stateParams,growl,NOTI_CATEGORY, $ionicPopup,$scope, BackandService,PublicService, auth, TRANS_STATUS){
  
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.activeListing = {};
  $scope.showProduct = {};
  $scope.showItem = {};
  $scope.TRANS_STATUS = TRANS_STATUS;
  $scope.stateName = $state.current.name;
  $scope.loading = false;

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////  Main Listing /////////////////////////////////////////////////////////////////////////

  main();

  function main()
  {
    if($scope.authProfile != null && $scope.userInSession != null)
    {
      $scope.loading = true;
      if($state.current.name == "myActiveListing")
      {
        getUserActiveListing($scope.userInSession.user_id);
      }

      if($state.current.name == "myCompletedTransaction")
      {
        getUserCompletedTransaction($scope.userInSession.user_id);
      }

      if($state.current.name == "showTransaction")
      {
        getTransById($stateParams.id,$stateParams.other_user_id);
      }
    }
  }

  $scope.refresh = function()
  {
    console.log("Refresh");
    main();
    growl.info('List is up to date',{title: 'Refresh List!'});
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my Active Listing /////////////////////////////////////////////////////////////////////////
 
  function getUserActiveListing(user_id){
      BackandService.getUserActiveListing(user_id).then(function(result){
        $scope.activeListing = result.data;
        $scope.loading = false;
      });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my COMPLETED TRANSACTION  /////////////////////////////////////////////////////////////////////////


  function getUserCompletedTransaction(user_id){
      BackandService.getUserCompletedTransaction(user_id).then(function(result){
        $scope.activeListing  = result.data;
        $scope.loading = false;
      });
  }  

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// Update Active Listing HELPER FUNCTION /////////////////////////////////////////////////////

  $scope.updateTrans = function(id,key,value)
  {
    console.log(id + " "+key+" "+value);
    var timeUpdated = BackandService.getTimestampinMysql();
    if(key == "status")
    {
      editTransactionStatus(id,value,timeUpdated);
    }
    if(key == "payment_status")
    {
      editTransactionPaymentStatus(id,value,timeUpdated);
    }
  }

  $scope.confirmDeleteTrans = function(id){

    function deleteTrans(id){
      BackandService.deleteObject("transactions",id).then(function(result){
          if(result.status == 200)
          {
            growl.success("Deleted Transaction "+id,{title: 'Successfully Removed Request!'});
            main();
          }

        });
    }

    var confirmPopup = $ionicPopup.confirm({
       title: 'Remove This Request',
       template: 'Are you sure?'
     });
     
    confirmPopup.then(function(result) {
        if(result)
        {
          deleteTrans(id);
        }
     });
  }

 /*     "REQUESTED": 1,
        "DENIED": 2,
        "APPROVED": 3,
        "DELIVERED": 4,
        "RECEIVED": 5,
        "NOT_PAID" : 6,
        "PAID": 7,
        "COMFIRMED": 8*/

  function createNotificationTransaction(trans_id,key,value){

    var to_user_id = $scope.showItem.other_user_id;
    var text = "";
    var link = "/showTransaction?id="+trans_id+"&other_user_id="+$scope.userInSession.user_id;
    var category = 0;
    var other_user_name = $scope.userInSession.first_name;

    if(key == "status"){
      
      switch(value){
        case TRANS_STATUS.DENIED :
          text = other_user_name+" DENIED your product request. :("
          break;
        case TRANS_STATUS.APPROVED :
          text = other_user_name+" APPROVED your product request. :)"
          break;
        case TRANS_STATUS.DENIED :
          text = other_user_name+" has DELIVERED your package. :)"
          break;
        case TRANS_STATUS.RECEIVED :
          text = other_user_name+" has COMFIRMED package received. :)"
          break;
      }

      category = NOTI_CATEGORY.TRANSACTION;
    }

    if(key == "payment_status"){
      
      switch(value){
        case TRANS_STATUS.PAID :
          text = other_user_name+" has PAID for the product request. :)"
          break;
        case TRANS_STATUS.COMFIRMED :
          text = other_user_name+" has COMFIRMED payment received. :)"
          break;
      }

      category = NOTI_CATEGORY.PAYMENT;
    }
    //console.log($scope.showItem);
    //console.log(to_user_id);
    BackandService.createNotification(to_user_id,text,link,category);
  }

  function editTransactionStatus(id,status,timeUpdated){
    BackandService.editTransactionStatus(id,status,timeUpdated).then(function(result){
        callback(id,result.status);

        if(result.status == 200)
        {
          $scope.showItem.status = status;
          createNotificationTransaction(id,"status",status);
        }

      },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"Opps! Something went wrong")
      });
  }  

  function editTransactionPaymentStatus(id,payment_status,timeUpdated){
    BackandService.editTransactionPaymentStatus(id,payment_status,timeUpdated).then(function(result){
        callback(id,result.status);

        if(result.status == 200)
        {
          $scope.showItem.payment_status = payment_status;
          createNotificationTransaction(id,"payment_status",payment_status);
        }

      },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"Opps! Something went wrong")
      });
  }

  function callback(id,status)
  {
      if(status == 200)
      {
          growl.success("Updated Transaction "+id,{title: 'Successfully Updated!'});
          //getTransById(id);
      }
      else
      {
          growl.error("Failed to update transactions "+id+". Please try again." ,{title: 'Error!'});
      }
  }



  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my OTHER HELPER FUNCTION  /////////////////////////////////////////////////////////////////////////
   $scope.showTransaction = function()
   {
      console.log($scope.showItem.id);
      $state.go("showTransaction",{id:$scope.showItem.id, other_user_id: $scope.showItem.other_user_id});
   }

  function getProductbyId(product_id){
      BackandService.getObjectById("products",product_id).then(function(result){
        $scope.showProduct = result.data;
        console.log($scope.showProduct);
      });
  }  

  function getTransById(trans_id,other_user_id){
      BackandService.getTransById(trans_id,other_user_id).then(function(result){
        $scope.showItem = result.data[0];
        console.log($scope.showItem);
        if(result.status == 200 && $scope.showItem != null)
        {
          getProductbyId($scope.showItem.product_id);
          $scope.timeAgo = PublicService.getAgoTime($scope.showItem.updated_at);
        }
      },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"Opps! Something went wrong");
      });
  }

  $scope.goTo = function (state)
  {
    $state.go(state);
  }

  $scope.toggleItem = function(item) {
    //console.log(item.product_id);
    //getProductbyId(item.product_id);

    if ($scope.isItemShown(item)) 
    {
      $scope.showItem = null;
    } 
    else 
    {
      $scope.timeAgo = PublicService.getAgoTime(item.updated_at);
      $scope.showItem = item;
    }

  };

  $scope.isItemShown = function(item) {
    return $scope.showItem === item;
  };


  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my History ////// /////////////////////////////////////////////////////////////////////////
  
});