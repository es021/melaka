var myApp = angular.module('sample.transactions', [
  'ui.router',
  'backand',
  'auth0'
]);

myApp.config(function($stateProvider, BackandProvider) {
  $stateProvider
    .state('transactions', {
      url: "/transactions",
      controller: 'TransactionsController',
      templateUrl: 'transactions/transactions.html',
      data: {
        requiresLogin: true
      }
    });

  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');
  
});


myApp.controller('TransactionsController', function($scope, TransactionsService, auth){
  $scope.transactions = [];
  $scope.auth = auth;
  var userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.agentId = userInSession.agent_id;
  $scope.supplierId = userInSession.supplier_id;
  $scope.userType = userInSession.user_type;
  
  function getAllTransactions(id,user_type){
      TransactionsService.getAllTransaction(id,user_type).then(function(result){
        $scope.transactions = result.data;
        console.log(result.status);
        //console.log($scope.transactions);
      });
  }
  
  if($scope.userType == "agent")
    getAllTransactions($scope.agentId, $scope.userType);
  
  if($scope.userType == "supplier")
    getAllTransactions($scope.supplierId, $scope.userType);

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

