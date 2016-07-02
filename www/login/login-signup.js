var myApp = angular.module('sample.login-signup', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider,$urlRouterProvider, authProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'LoginSignupController',
      templateUrl: 'login/login.html',
      data: {
        requiresLogin: false
      }
    });  

    $stateProvider
    .state('login_success', {
      url: '/login_success',
      controller: 'LoginSuccessContoller',
      templateUrl: 'login/login_success.html',
      params : {
        accessToken : "",
        idToken : ""
      },
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('signup', {
      url: '/signup',
      controller: 'LoginSignupController',
      templateUrl: 'login/signup.html',
      data: {
        requiresLogin: false
      }
    });

});

myApp.controller('LoginSuccessContoller',function(auth,$scope, BackandService, $state, $stateParams, growl,AUTH_CONSTANT,USER_TYPE){
  $scope.users = [];
  $scope.user = [];
  $scope.isNew = null;
  $scope.user_type = "new";
  $scope.loading = true;

  function initUserSession(result)
  {
    var userInSession = {};

    userInSession.user_id = result.data[0].id;
    userInSession.user_type = result.data[0].user_type;
    userInSession.first_name = result.data[0].first_name;
    userInSession.last_name = result.data[0].last_name;
    

    console.log("User In Session")
    console.log(userInSession);    

    window.localStorage.setItem("UserInSession",JSON.stringify(userInSession));    
  }


  // From auth0 to the real database
  function getUserByAuthId(authId){
    //console.log(email);
    BackandService.getUserByAuthId(authId).then(function(result){

      $scope.user = result.data[0];
      //console.log(result.data);
      console.log(result.data[0]);
      
      if (result.data[0] == null)
      {
        console.log("New User - > " + authId);
        $scope.isNew = true; 
      }
      else
      {
        initUserSession(result);
        $scope.isNew = false;         
      }

      growl.success("" ,{title: 'Login Success!'});
      $scope.loading = false;
      //setFooter($scope.user_type);
      $state.go('home');  

    });
  }
  
    function getProfile(accessToken,idToken){
      
      var auth0 = new Auth0({
        domain: AUTH_CONSTANT.AUTH0_DOMAIN,
        clientID: AUTH_CONSTANT.AUTH0_CLIENT_ID,
        //callbackURL: CALLBACK_URL,
        callbackOnLocationHash: true
      });

      auth0.getProfile(idToken, function (err, profile) {
          console.log(err);      
          console.log(profile);
          if(err != null){
              $scope.error = err;
          }

          if(profile != null){
              $scope.authProfile = profile;
              console.log($scope.authProfile);

              var authProfileTemp = {};
              authProfileTemp.email = profile.email;

              //profile ni jgn tukar user_id
              authProfileTemp.auth_id = profile.user_id;
              authProfileTemp.picture = profile.picture;
              authProfileTemp.nickname = profile.nickname;

              window.localStorage.setItem("AuthProfile",JSON.stringify(authProfileTemp));
                
              getUserByAuthId(authProfileTemp.auth_id);
          }
      });
    }

    console.log($stateParams.accessToken);
    getProfile($stateParams.accessToken,$stateParams.idToken);

});

myApp.controller('LoginSignupController', function(auth, $scope, $state, BackandService,growl,AUTH_CONSTANT){
    
    console.log("aaa");

    var auth0 = new Auth0({
        domain: AUTH_CONSTANT.AUTH0_DOMAIN,
        clientID: AUTH_CONSTANT.AUTH0_CLIENT_ID,
        callbackOnLocationHash: true,
        sso : true
    });


   
    $scope.logout = function () {
        auth0.logout();
        $state.go('login');
    }

    $scope.loginInfo = {};

    $scope.login = function (e) {
    
       //console.log($scope.loginInfo.email);
       //console.log($scope.loginInfo.password);
        
        auth0.login({
            connection: AUTH_CONSTANT.AUTH0_DB_CONNECTION_NAME,
            email:   $scope.loginInfo.email,
            password:   $scope.loginInfo.password,
        },
        function (err, result) {
            if(err)
            {
                console.log(err);
                growl.error(""+err,{title: 'Login Error!'});
            }
            if(result != null)
            {
                console.log(result);
                $state.go('login_success', {accessToken:result.accessToken,idToken:result.idToken});
            }
        });

    };

    $scope.loginFacebook = function (e) {
      auth0.login({
        connection: "facebook"
      },
      function (err, result) {
            if(err)
            {
                console.log(err);
                growl.error(""+err,{title: 'Login Error!'});
            }
            if(result != null)
            {
                console.log(result);
                $state.go('login_success', {accessToken:result.accessToken,idToken:result.idToken});
            }
        });
    };

    $scope.loginGoogle = function (e) {
      auth0.login({
        connection: "google-oauth2"
      },
      function (err, result) {
            if(err)
            {
                console.log(err);
                growl.error(""+err,{title: 'Login Error!'});
            }
            if(result != null)
            {
                console.log(result);
                $state.go('login_success', {accessToken:result.accessToken,idToken:result.idToken});
            }
        });
    };


    $scope.signupInfo = {};

    $scope.signup = function (e) {
       // e.preventDefault();
        function signupCallback (err, profile, id_token) {
            console.log(err);
            console.log(profile);
            console.log(id_token);
           
            if (err) 
            {
                    console.log('Something went wrong signing up: ' + err);
                    growl.error(""+err ,{title: 'Signup Failed!'});
                    console.error(err);
            }
            if(profile)
            {
                growl.success("" ,{title: 'Successfully signed up!'});
                $state.go('login_success', {accessToken:profile.accessToken,idToken:profile.idToken});
            }
        }
            

        auth0.signup({
            // Don't display a popup to set an SSO cookie
            sso: false,
            auto_login: true,
            connection: AUTH_CONSTANT.AUTH0_DB_CONNECTION_NAME,
            email: $scope.signupInfo.email,
            password: $scope.signupInfo.password
        }, signupCallback);

    };


});