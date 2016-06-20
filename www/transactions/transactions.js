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

});


myApp.controller('TransactionsController', function($state,growl, $ionicPopup,$scope, BackandService,PublicService, auth, TRANS_STATUS){
  
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
    }
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

  function editTransactionStatus(id,status,timeUpdated){
    BackandService.editTransactionStatus(id,status,timeUpdated).then(function(result){
        callback(id,result.status);
        if(result.status == 200)
        {
          $scope.showItem.status = status;
        }

      });
  }  

  function editTransactionPaymentStatus(id,payment_status,timeUpdated){
    BackandService.editTransactionPaymentStatus(id,payment_status,timeUpdated).then(function(result){
        callback(id,result.status);

        if(result.status == 200)
        {
          $scope.showItem.payment_status = payment_status;
        }

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
 
  function getProductbyId(product_id){
      BackandService.getObjectById("products",product_id).then(function(result){
        $scope.showProduct = result.data;
        console.log($scope.showProduct);
        if(result.status == 200)
        {

        }
      });
  }  

  function getTransById(trans_id){
      BackandService.getObjectById("transactions",trans_id).then(function(result){
        $scope.showItem = result.data;
        console.log($scope.showItem);
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
      if($scope.showProduct.id != item.product_id)
      {
        $scope.showProduct = null;
        getProductbyId(item.product_id);
        $scope.timeAgo = PublicService.getAgoTime(item.updated_at);

      }
      $scope.showItem = item;
    }

  };

  $scope.isItemShown = function(item) {
    return $scope.showItem === item;
  };


  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my History ////// /////////////////////////////////////////////////////////////////////////
  
});
