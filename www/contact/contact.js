var myApp = angular.module('sample.contact', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider) {

  $stateProvider
    .state('contact', {
      url: '/contact',
      controller: 'ContactController',
      templateUrl: 'contact/contact.html',
      data: {
        requiresLogin: false
      }
    });

});

myApp.controller('ContactController', function($location,growl, $scope, $state, APP_CONSTANT){
  
  $scope.contact = {};

  $scope.submit = function ()
  {
    console.log($scope.contact.email);
    console.log($scope.contact.message);
    
    var sender = $scope.contact.email
    if($scope.contact.email == null || $scope.contact.email == "")
    {
      sender = "Anonymous";
    }

    var subject = APP_CONSTANT.NAME+" : Message from "+sender; 
    var body = $scope.contact.message;
    
    /*
    window.location.href('mailto:'
                +APP_CONSTANT.EMAIL
                +'?subject='+subject
                +'&body='+body
                );
    */

    successCallback();
  }

  function successCallback(){
    growl.success('Thank you for contacting us.',{title: 'Successfully Send Message!'});
    $state.go("home");
  }

  $scope.sendEmail = function(){
    console.log("sending email");
       $.ajax({
          url:'php/sendEmail.php',
          complete: function (response) {
              console.log(response);
              //console.log(response.responseText);
          },
          error: function () {
              console.log("Error");
          }
      });
      return false;
  }


});
