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

myApp.controller('ProfileControllerHelper', function($scope, $stateParams, growl, BackandService, PublicService, auth, $state, USER_TYPE,USER_STATUS){
  //console.log("aaa");
  $scope.newUser = {};
  $scope.user_id = $stateParams.user_id;
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
    $scope.newUser.picture_large = $scope.authProfile.picture_large;
    $scope.newUser.cover_photo = $scope.authProfile.cover_photo;
    $scope.newUser.auth_id = $scope.authProfile.auth_id;

    $scope.newUser.user_type = $scope.user_type;

    $scope.newUser.user_status = USER_STATUS.ACTIVE;

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
});

myApp.controller('RegisterControllerHelper', function($scope, $stateParams, growl, BackandService, PublicService, auth, $state, USER_TYPE,USER_STATUS){
  //console.log("aaa");
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
    $scope.newUser.user_status = USER_STATUS.ACTIVE;

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
        userInSession.first_name = result.data.first_name;
        userInSession.last_name = result.data.last_name;

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
  


});