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
});


myApp.controller('TransactionsController', function($state,$scope, BackandService, auth,TRANS_STATUS){
  
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my Active Listing /////////////////////////////////////////////////////////////////////////
  $scope.activeListing = {};
  $scope.showProduct = {};
  $scope.TRANS_STATUS = TRANS_STATUS;

  if($scope.authProfile != null && $scope.userInSession != null)
  {
    if($state.current.name == "myActiveListing")
    {
      if($scope.userInSession.user_type == "agent")
        getAgentActiveListing($scope.userInSession.agent_id);

      if($scope.userInSession.user_type == "supplier")
        getSupplierActiveListing($scope.userInSession.supplier_id);
    }

  }


  function getAgentActiveListing(agent_id){
      BackandService.getAgentActiveListing(agent_id).then(function(result){
        $scope.activeListing  = result.data;
        
        if(result.status == 200)
        {

        }

        for(var i; i < $scope.activeListing.length; i++)
        {
            $scope.activeListing[i].show = false;
        }

      });


  }  

  function getSupplierActiveListing(supplier_id){
      BackandService.getSupplierActiveListing(supplier_id).then(function(result){
        $scope.activeListing = result.data;
        if(result.status == 200)
        {

        }
      });
  }

  function getProductbyId(product_id){
      BackandService.getObjectById("products",product_id).then(function(result){
        $scope.showProduct = result.data;
        console.log($scope.showProduct);
        if(result.status == 200)
        {

        }
      });
  }

  $scope.toggleItem = function(item) {
    //console.log(item.product_id);
    //getProductbyId(item.product_id);

    if ($scope.isItemShown(item)) 
    {
      $scope.shownItem = null;
    } 
    else 
    {
      if($scope.showProduct.id != item.product_id)
      {
        $scope.showProduct = null;
        getProductbyId(item.product_id);
      }
      $scope.shownItem = item;
    }

  };

  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my History ////// /////////////////////////////////////////////////////////////////////////
  
});


myApp.service('TransactionsService', function ($http, Backand, auth){
  var baseUrl = '/1/objects/';
  var objectName = 'transactions/'

  function getUrl(){
    return Backand.getApiUrl() + baseUrl + objectName;
  }

  function getUrlForId(id){
  	console.log(getUrl() + id);
    return getUrl() + id;
  }

  getAllTransaction = function(id,user_type){
    var query = "";
    if(user_type == "agent")
    {
      query = "getAllTransactionByAgent";
    }
    else if(user_type == "supllier")
    {
      query = "getAllTransactionBySupplier";
    }

    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/' + query,
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  return{
    getAllTransaction: getAllTransaction,
  }

});

