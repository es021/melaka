var myApp = angular.module('sample.signup', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider,$urlRouterProvider, authProvider) {

  $stateProvider
    .state('signupAgent', {
      url: '/signupAgent',
      controller: 'SignupControllerHelper',
      templateUrl: 'signup/signupAgent.html',
      data: {
        requiresLogin: true
      }
    });

  $stateProvider
    .state('signupSupplier', {
      url: '/signupSupplier',
      controller: 'SignupControllerHelper',
      templateUrl: 'signup/signupSupplier.html',
      data: {
        requiresLogin: true
      }
    });

});

  myApp.controller('SignupController', function($scope, $state){
  $scope.signupAsAgent = function(){
    console.log("Signing Up as Agent");
    $state.go("signupAgent");
  }

  $scope.signupAsSupplier = function(){
    console.log("Signing Up as Supplier");
    $state.go("signupSupplier");
  }

});

myApp.controller('SignupControllerHelper', function($scope, SignupService, auth, $state){
  
  $scope.newAgent = {};
  $scope.newSupplier = {};

  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));

  if($scope.authProfile.email != null)
  {
    $scope.newAgent.email = $scope.authProfile.email;
    $scope.newSupplier.email = $scope.authProfile.email;
  }

  function getTimestampinMysql(){
    var formatedMysqlTimestamp = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
    return formatedMysqlTimestamp;
  }

  function createNewUser (resultData, user_type){
    //Creating new User
    var newUser = {};
    if(user_type == "agent")
    {
      newUser.agent_id = resultData.id;
      newUser.supplier_id = 0;
    }
    else if(user_type == "supplier")
    {
      newUser.supplier_id = resultData.id;
      newUser.agent_id = 0;
    }

    newUser.email = resultData.email;
    newUser.auth_id = $scope.authProfile.auth_id;
    newUser.created_at = getTimestampinMysql();

    console.log(newUser.agent_id);
    console.log(newUser.supplier_id);
    console.log(newUser.email);
    console.log(newUser.created_at);

    //Creating new record in users DB
    SignupService.addRecord(newUser,"users").then(function(result){

      console.log("Result From Creating new User");
      console.log(result);      

      if(result.status == 200)
      {
        console.log("New record successfully created in 'users' table. ID : " + result.data.id)
        console.log(result.data.created_at);

        var userInSession = {};
        userInSession.user_id = result.data.id;
        userInSession.agent_id = newUser.agent_id;
        userInSession.user_type = user_type;
        window.localStorage.setItem("UserInSession",JSON.stringify(userInSession));
              
        $state.go("home");
      }
    });
  }

  $scope.addAgent = function(){
    //console.log($scope.userId);
    
    $scope.newAgent.created_at = getTimestampinMysql();
    $scope.newAgent.picture = $scope.authProfile.picture;

    console.log($scope.newAgent.email);
    console.log($scope.newAgent.picture);
    console.log($scope.newAgent.first_name);
    console.log($scope.newAgent.last_name);
    console.log($scope.newAgent.phone_number);
    console.log($scope.newAgent.state);
    console.log($scope.newAgent.category);
    console.log($scope.newAgent.about);

    //Creating new record in agents DB
    SignupService.addRecord($scope.newAgent,"agents").then(function(result){
      console.log("Result From Creating new Agent");
      console.log(result);

      //Agents DB SUCCESS
      if(result.status == 200)
      {
        console.log("New record successfully created in 'agents' table. ID : " + result.data.id);
        console.log(result.data.created_at);
        createNewUser(result.data,"agent");
      }
    });

  }

  $scope.addSupplier = function(){
    //console.log($scope.userId);
    //$scope.newSupplier.email = authProfile.email;
    $scope.newSupplier.created_at = getTimestampinMysql();
    $scope.newSupplier.picture = $scope.authProfile.picture;

    console.log($scope.newSupplier.email);
    console.log($scope.newSupplier.picture);
    console.log($scope.newSupplier.first_name);
    console.log($scope.newSupplier.last_name);
    console.log($scope.newSupplier.phone_number);
    console.log($scope.newSupplier.state);
    console.log($scope.newSupplier.about);

    //Creating new record in agents DB
    SignupService.addRecord($scope.newSupplier,"suppliers").then(function(result){
      console.log("Result From Creating new Supplier");
      console.log(result);

      //Agents DB SUCCESS
      if(result.status == 200)
      {
        console.log("New record successfully created in 'supplier' table. ID : " + result.data.id);
        console.log(result.data.created_at);
        createNewUser(result.data,"supplier");
      }
    });

  }
  //END of addAgent function


});


myApp.service('SignupService', function ($http, Backand, auth){
  var baseUrl = '/1/objects/';
  //var objectName = 'users/'

  function getUrl(objectName){
    return Backand.getApiUrl() + baseUrl + objectName +"/";
  }

  function getUrlForId(id,objectName){
    return getUrl(objectName) + id;
  }

  getRecord = function(objectName){
    return $http.get(getUrl(objectName));
  }

  addRecord = function(user,objectName){
    return $http.post(getUrl(objectName)+"?returnObject=true", user);
  }

  deleteRecord = function(id,objectName){
    return $http.delete(getUrlForId(id,objectName));
  }

  return{
    getRecord: getRecord,
    addRecord: addRecord,
    deleteRecord: deleteRecord
  }

});
