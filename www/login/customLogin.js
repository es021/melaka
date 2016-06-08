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

});


myApp.controller('CustomController', function(auth, $scope, $state, BackandService){
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

    //somehow this work hahahhahahhah wth!
    var lock = new Auth0Lock('dsa7d77dsa7d7', 'mine.auth0.com');
    var hash = lock.parseHash();
    if (hash) {
      if (hash.error) {
        console.log("There was an error logging in", hash.error);
      } else {
        lock.getProfile(hash.id_token, function(err, profile) {
          if (err) {
            console.log('Cannot get user :(', err);
            return;
          }

          console.log("Hey dude", profile);
        });
      }
    }
    
    $scope.logout = function () {
        auth0.logout();
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
            console.log(err);
            console.log(result);
        });

    };



    // TODO Add this as a method in auth0.js
    function v2PatchUser (userId, id_token, data, successCallback, errorCallback) {
        $.ajax({
            method: 'patch',
            url: apiEndpoint + 'users/' + userId,
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + id_token
            },
            data: data,
            success: successCallback,
            error: errorCallback
        });
    }


    $scope.signup = function (e) {
       // e.preventDefault();
        function signupCallback (err, profile, id_token) {
            if (err) {
                alert('Something went wrong signing up: ' + err);
                console.error(err);
            } else {
                var data = {
                    user_metadata: {
                        favorite_color: $('#color').val(),
                        name: $('#name').val()
                    }
                };

                function updateSuccess () {
                    alert('Successfully signed up!');
                }

                function updateError (jqXHR) {
                    alert('Something went wrong signing up: ' + jqXHR.responseText);
                    console.error(jqXHR);
                }

                v2PatchUser(profile.user_id, id_token, data, updateSuccess, updateError);
            }
        }

        auth0.signup({
            // Don't display a popup to set an SSO cookie
            sso: false,
            auto_login: true,
            connection: AUTH0_DB_CONNECTION_NAME,
            email: $('#signup-email').val(),
            password: $('#signup-password').val()
        }, signupCallback);

    };


});