var myApp = angular.module('sample.custom', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider,$urlRouterProvider, authProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'CustomController',
      templateUrl: 'login/customLogin.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('signup', {
      url: '/signup',
      controller: 'CustomController',
      templateUrl: 'login/customSignup.html',
      data: {
        requiresLogin: false
      }
    });

});


myApp.controller('CustomController', function(auth, $scope, $state, BackandService,growl){
    var AUTH0_DOMAIN = 'wzs21.auth0.com';
    var AUTH0_CLIENT_ID ='j2ucVyLG1pMqGZiKsGL00QAkHbW21siH';
    var AUTH0_DB_CONNECTION_NAME = 'Username-Password-Authentication';
    var CALLBACK_URL = "http://localhost:8100";

    var apiEndpoint = 'https://' + AUTH0_DOMAIN + '/api/v2/';
    var auth0 = new Auth0({
        domain: AUTH0_DOMAIN,
        clientID: AUTH0_CLIENT_ID,
        callbackURL: CALLBACK_URL,
        callbackOnLocationHash: true
    });

    function loginSuccessHelper(accessToken,idToken)
    {
        $scope.users = [];
      $scope.input = {};
      //$scope.authProfile = auth;
      $scope.email = [];
      $scope.user = [];
      $scope.isNew = null;
      $scope.user_type = "new";
      $scope.loading = true;
      

  function initUserSession(result)
  {
    var userInSession = {};

    userInSession.user_id = result.data[0].id;
    userInSession.agent_id = result.data[0].agent_id;
    userInSession.supplier_id = result.data[0].supplier_id;
    
    console.log("initUserSession");

    if(userInSession.agent_id > 0 && userInSession.supplier_id == 0)
    {
      userInSession.user_type = "agent";
      $scope.user_type = "agent";
    }
    else if(userInSession.agent_id == 0 && userInSession.supplier_id > 0)
    {
      userInSession.user_type = "supplier";
      $scope.user_type = "supplier";
    }
    else
    {
        $scope.user_type = "newUser";
    }

    console.log("User In Session")
    console.log(userInSession);    

    window.localStorage.setItem("UserInSession",JSON.stringify(userInSession));    
  }


  // From auth0 to the real database
  function getUserByAuthId(authId){
    //console.log(email);
    BackandService.getUserByAuthId(authId).then(function(result){

      $scope.user = result.data[0];
      console.log(result.data);
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

    getProfile(accessToken,idToken);
}
   
    $scope.logout = function () {
        auth0.logout();
        $scope.go('login');
    }

    $scope.login = function (e) {
    
       console.log($scope.email);
       console.log($scope.password);
        
        auth0.login({
            connection: AUTH0_DB_CONNECTION_NAME,
            email: $scope.email,
            password: $scope.password
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
                loginSuccessHelper(result.accessToken,result.idToken);
            }
        });
    };


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
                loginSuccessHelper(profile.accessToken,profile.idToken);
            }
        }
            

        auth0.signup({
            // Don't display a popup to set an SSO cookie
            sso: false,
            auto_login: true,
            connection: AUTH0_DB_CONNECTION_NAME,
            email: $scope.email,
            password: $scope.password
        }, signupCallback);

    };


});