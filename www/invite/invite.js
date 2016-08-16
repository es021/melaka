var myApp = angular.module('sample.invite', [
  'ui.router',
  'auth0'
]);

myApp.config(["$stateProvider", function($stateProvider) {

  $stateProvider
    .state('invite', {
      url: '/invite',
      controller: 'InviteController',
      templateUrl: 'invite/invite.html',
      data: {
        requiresLogin: false
      }
    });

}]);

myApp.controller('InviteController', ["$location", "growl", "BackandService", "PublicService", "$scope", "$state", "APP_CONSTANT", "TEAM_CONSTANT", function($location,growl,BackandService,PublicService, $scope, $state, APP_CONSTANT,TEAM_CONSTANT){

  $scope.sent = false;
  $scope.loading = false;

  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.newInvitation = {};
  if($scope.authProfile != null)
  {
    $scope.newInvitation.sender_name = $scope.authProfile.nickname; 
  }

  $scope.shareOnFacebook = function() {
    var url = APP_CONSTANT.DOMAIN + "home";
    var title = "Check Out This Awesome App That Will Change How You Do Your Business";
    var description = "DropBug : The ABC of Your Business. Join Malaysia's first business tool and hub for suppliers, stockists, and dropships."
    var imageUrl = null;
    PublicService.shareOnFacebook(url,title,imageUrl,description);
  }

  $scope.shareOnTwitter = function() {
    var url = APP_CONSTANT.DOMAIN + "home";
    var text = "Check Out DropBug";
    PublicService.shareOnTwitter(url,text);
  }


  $scope.addEmail = function(){

    $("#emailInvitation").append($("<input type='email' class='form-control' placeholder='Your friend email'> required"));
    
  }

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

$scope.sendInvitation =function(){

  var emails = $("#emailInvitation").find("input");

  $scope.validEmail = [];
  $scope.invalidEmail = [];
  

  for(var i = 0; i<emails.length; i++) 
  {
    var email = emails[i].value;

    if(email == null || email == '')
    {
      continue;
    }

    if(validateEmail(email)){
      $scope.validEmail.push(email);
    }    
    else
    {
      $scope.invalidEmail.push(email);
    }
  }     

  if($scope.validEmail.length > 0)
  {
    sendEmail($scope.validEmail,$scope.newInvitation.sender_name);
  }

  if($scope.validEmail.length == 0 && $scope.invalidEmail.length == 0) 
  {
    $scope.empty = true;
  }
  else
  {
    $scope.sent = true;
  }

}

function sendEmail(emails,sender_name)
{
    for(var i = 0; i<emails.length; i++)
    {
      BackandService.invitationEmail(emails[i],sender_name).then(function(result){
        
        console.log("email sent to");
        console.log(result);

      },function errorCallback(result){
          PublicService.errorCallbackFunction(result,"Send Email Failed. Please Try Again");
      });
    }
}

$scope.sendAgain = function(){
  $scope.sent = false;
}


}]);
