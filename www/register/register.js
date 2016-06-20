var myApp = angular.module('sample.register', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider,$urlRouterProvider, authProvider) {

  $stateProvider
    .state('register', {
      url: '/register?user_type',
      //cache: false,
      controller: 'RegisterControllerHelper',
      templateUrl: 'register/register.html',
      data: {
        requiresLogin: true
      }
    });
});

myApp.controller('RegisterController', function($scope, $state,USER_TYPE){

  $scope.USER_TYPE = USER_TYPE;
  $scope.register = function(user_type){
    console.log("Registering as User type "+user_type);
    $state.go("register",{user_type:user_type});
  }

});

myApp.controller('RegisterControllerHelper', function($scope, $stateParams, growl, BackandService, PublicService, auth, $state, USER_TYPE){
  console.log("aaa");
  $scope.newUser = {};
  $scope.user_type = $stateParams.user_type;
  $scope.USER_TYPE = USER_TYPE;

  $scope.loading = false;
  $scope.loadMessage = "Please Wait For Registration To Complete";

  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));

  if($scope.authProfile.email != null)
  {
    $scope.newUser.email = $scope.authProfile.email;
  }

  $scope.createNewUser = function(user_type){
    $scope.loading = true;

    $scope.newUser.picture = $scope.authProfile.picture;
    $scope.newUser.auth_id = $scope.authProfile.auth_id;

    $scope.newUser.user_type = $scope.user_type;
    $scope.newUser.created_at = PublicService.getTimestampinMysql();
    $scope.newUser.updated_at = PublicService.getTimestampinMysql();

    console.log($scope.newUser.user_type);
    console.log($scope.newUser.auth_id);
    console.log($scope.newUser.email);
    console.log($scope.newUser.picture);
    console.log($scope.newUser.first_name);
    console.log($scope.newUser.last_name);
    console.log($scope.newUser.phone_number);

    console.log($scope.newUser.city);
    console.log($scope.newUser.state);
    
    console.log($scope.newUser.about);


    //Creating new record in users DB
    BackandService.addObject("users",$scope.newUser).then(function(result){

      console.log("Result From Creating new User");
      console.log(result);      

      if(result.status == 200)
      {
        console.log("New record successfully created in 'users' table. ID : " + result.data.id)
        console.log(result.data.created_at);

        var userInSession = {};
        userInSession.user_id = result.data.id;
        userInSession.user_type = result.data.user_type;

        window.localStorage.setItem("UserInSession",JSON.stringify(userInSession));
        
        growl.success("Redirecting to Home Page" ,{title: 'Registration Completed!'});

        $state.go("home");
      }
    }, function errorCallback (result){
        growl.error(""+result ,{title: 'Registration Failed!'});
        console.log(result);
        $scope.loading = false;
    });
  }
  
  /*

  $scope.addAgent = function(){
    //console.log($scope.userId);
    $scope.loading = true;
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

        $scope.loading = false;
    }, function errorCallback (result){
        signupErrorCallback(result,"agent");
    });

  }

  function signupErrorCallback(result,type)
  {
    var error = "";
    if(result.data.includes("Duplicate entry"))
    {
       error = "The email is already taken by another " +type;
    }
    else
    {
      error = "Please try again";
    }

    growl.error(error ,{title: 'Registration Failed!'});
    console.log(result);
    $scope.loading = false;
  }

  $scope.addSupplier = function(){
    //console.log($scope.userId);
    //$scope.newSupplier.email = authProfile.email;
    $scope.loading = true;
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
        //console.log(result.data.created_at);
        createNewUser(result.data,"supplier");
      }

      $scope.loading = false;
    }, function errorCallback (result){
        signupErrorCallback(result,"supplier");
    });

  }
  */
  //END of addAgent function


});