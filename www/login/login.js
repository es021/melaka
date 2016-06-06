var myApp = angular.module('sample.login', [
  'ui.router',
  'backand',
  'auth0',
  'ngCookies'
]);

myApp.config(function($stateProvider, BackandProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'LoginController',
      templateUrl: 'login/login.html'
    });

  $stateProvider
    .state('login_success', {
      url: '/login_success',
      controller: 'LoginSuccessController',
      templateUrl: 'login/login_success.html',
      data: {
        requiresLogin: true
      }
  });
  BackandProvider.setAppName('wzs21testapp');
  BackandProvider.setAnonymousToken('19251d3d-7ae7-4ca1-993b-60c67ddc0385');   

});

myApp.config(function($stateProvider,authProvider) {

 authProvider.init({
    domain: 'wzs21.auth0.com',
    clientID: 'j2ucVyLG1pMqGZiKsGL00QAkHbW21siH',
    //callbackURL: location.href,
    callbackURL: '/login',
    loginState: 'login'
  });

  authProvider.on('loginSuccess', function($state) {
    console.log("Login Success");
    $state.go('login_success');
  });

  authProvider.on('loginFailure', function(error) {
    console.log("Error Login : "+error);
    $state.go('login');

  });

});

myApp.run(function(auth) {
  auth.hookEvents();
});


myApp.controller('LoginController', function($scope, auth, $state) {
    auth.signin({
      email : $scope.email,
      password : $scope.password,
      connection : 'Username-Password-Authentication',
      sso: false
    });
});


myApp.controller('LoginSuccessController', function($scope, BackandService , auth, $state, growl, USER_LINK_TYPE){
  $scope.users = [];
  $scope.input = {};
  $scope.auth = auth;
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
    if(userInSession.agent_id == 0 && userInSession.supplier_id > 0)
    {
      userInSession.user_type = "supplier";
      $scope.user_type = "supplier";
    }

    console.log("User In Session")
    console.log(userInSession);    

    window.localStorage.setItem("UserInSession",JSON.stringify(userInSession));    
  }

  function setFooter(type)
  {
    var footer = "footer_"+ type;
    document.getElementById(footer).setAttribute("style","display:default");
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

        setFooter("newUser");
      }
      else
      {
        initUserSession(result);
        $scope.isNew = false; 

        setFooter($scope.user_type);
      }

      growl.success("" ,{title: 'Login Success!'});
      $scope.loading = false;
      $state.go('home');  

    });
  }

  watchDestroyer = $scope.$watch('auth.profile', function (profile) {
      if (typeof profile !== "undefined" && profile !== null) {
          //$scope.email = profile.email;
          //$scope.picture = profile.picture;
          console.log("Auth Profile");
          console.log(profile);
          var authProfile = {};
          authProfile.email = profile.email;

          //profile ni jgn tukar user_id
          authProfile.auth_id = profile.user_id;
          
          authProfile.picture = profile.picture;
          authProfile.nickname = profile.nickname;
          watchDestroyer();

          window.localStorage.setItem("AuthProfile",JSON.stringify(authProfile));
          
          getUserByAuthId(authProfile.auth_id);
      }

   });

});

