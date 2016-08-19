// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var myApp = angular.module('sample', ['ionic','ionic.service.core',
  'backand',
  'ui.router',
  'restangular',    
  'sample.home',
  'sample.login-signup',
  'sample.register',
  'sample.users',
  'sample.transactions',
  'sample.reviews',
  'sample.products',
  'sample.contact',
  'sample.about',
  'sample.faq',
  'sample.invite',
  //'sample.redirect',
  'sample.service',
  'sample.constant',
  'sample.directive',
  
  'auth0',
  'ngCookies',
  'ngRoute',
  'angular-storage',
  'angular-jwt',
  'angular-growl'

  ]);



myApp.run(["$ionicPlatform", function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });


  //ar config = require('../server.js');


}]);


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTH 0 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.config( ["$urlRouterProvider", "$stateProvider", "authProvider","$compileProvider",'$logProvider', "$httpProvider", "growlProvider", "BackandProvider", "$locationProvider", "APP_CONSTANT", function ($logProvider,$compileProvider,$urlRouterProvider, $stateProvider, authProvider, $httpProvider,growlProvider,BackandProvider,$locationProvider,APP_CONSTANT) {
  //$locationProvider.html5Mode(true);
  $logProvider.debugEnabled = false ;
  $compileProvider.debugInfoEnabled = false ;

  growlProvider.globalTimeToLive(5000);
  //growlProvider.globalPosition('bottom-right');

  BackandProvider.setAppName(APP_CONSTANT.BACKAND_APP_NAME);
  BackandProvider.setAnonymousToken(APP_CONSTANT.BACKAND_TOKEN);

  FB.init({ 
      appId: '153782718362391',
      status: true, 
      cookie: true, 
      xfbml: true,
      version: 'v2.4'
      });

  //$urlRouterProvider.otherwise('/home');
  
  console.log("From APP CONFIG");
  
  $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}]);

myApp.run(["auth", function(auth) {
  auth.hookEvents();
}]);


myApp.controller('AppController', ["growl", "Backand", "$scope", "UserService", "$ionicModal", "$ionicPopup", "$ionicSideMenuDelegate", "auth", "$state", "$stateParams", "PublicService", "$location", "AUTH_CONSTANT", "USER_TYPE", "APP_CONSTANT", function (growl,Backand,$scope,UserService,$ionicModal,$ionicPopup,$ionicSideMenuDelegate, auth, $state,$stateParams,PublicService,$location,AUTH_CONSTANT, USER_TYPE,APP_CONSTANT) {


  $scope.ready = false;

  angular.element(document).ready(function () {
    console.log( "ready!" );
    $("div#main-body").removeClass("hidden");
    $("div#load-body").addClass("hidden");

    $scope.ready = true;
    $scope.main();
  });



  console.log("FROM APP CONTROLLER");
  $scope.APP_CONSTANT = APP_CONSTANT;
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile")); 
  //console.log($scope.userInSession); 
  $scope.USER_TYPE = USER_TYPE;


  $scope.main = function()
  {
    //to clear off from previous production
    if($scope.userInSession != null)
    {
      if(typeof($scope.userInSession.user_type) == "string")
      {
        window.localStorage.removeItem("UserInSession");
        window.localStorage.removeItem("AuthProfile");
        $scope.userInSession = null;
        $scope.authProfile = null;
      }
    }

    var state = $location.path().replace("/", "");

    console.log(state);

    //login with sosial provider
    if(state.length > 30)
    {
      socialLoginHandler(state);
    }
    else if(state == "")
    {
      $state.go("home");
    }
    else
    {
      //filter required login page
      if($scope.authProfile == null)
      {

        var notRequiredLoginPage = ["home","contact","login","invite","faq","findUser","signup","about","showProduct","showUser"];
        var goToLogin = false;
        console.log(state);
        goToLogin = notRequiredLoginPage.indexOf(state) < 0;

        if(goToLogin)
        {
          growl.error('Please login first',{title: 'This Page Required Login!'});
          //$state.go("login");

          var host = "";
          if(window.location.host == "hosting.backand.io")
          {
            host = "hosting.backand.io/dropbug";
          }
          else
          {
            host = window.location.host;
          }

          window.location.href = window.location.protocol+"//"+host+"/#/login";
        }
        else
        {
          $state.go(state);
        }
      } 
      else if($scope.authProfile != null && $scope.userInSession == null)
      {
          var notRequiredRegisterPage = ["home","contact","invite","login","findUser","faq","signup","about","showProduct","showUser"];
          var goToHome = false;
          goToHome = notRequiredRegisterPage.indexOf(state) < 0;
          if(goToHome)
          {
              growl.error('Please register first',{title: 'Opps.. Sorry, this page is only for Authorized Registered User'});        
              var host = "";
              if(window.location.host == "hosting.backand.io")
              {
                host = "hosting.backand.io/dropbug";
              }
              else
              {
                host = window.location.host;
              }

              window.location.href = window.location.protocol+"//"+host+"/#/home";
          }
      }
      else
      {
        $state.go(state);
      }
  }

    //setting header and footer
    PublicService.initHeaderFooter( $scope.authProfile,$scope.userInSession);
    if($scope.authProfile != null)
    {
      PublicService.initSideMenu();
    }
  }
  

  function socialLoginHandler(state)
  {
    //access_token=qtcCiHqxEVXL4tFt&id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3d6czIxLmF1dGgwLmNvbS8iLCJzdWIiOiJmYWNlYm9va3wxMDIwNjAyMTI1MDQwMTI5MCIsImF1ZCI6ImoydWNWeUxHMXBNcUdaaUtzR0wwMFFBa0hiVzIxc2lIIiwiZXhwIjoxNDY1NjExMjU2LCJpYXQiOjE0NjU1NzUyNTZ9.ot1xygGZA1QjXo3fX-P3G3USUvm6UoIrTqr5ejOdvtE&token_type=Bearer&state=NbT1JRZPbTd15Q7kU1UixCg3
    var token = state.split("&");
    //console.log(token);
    var accessToken = token[0].split("=")[1];
    var idToken =token[1].split("=")[1];
    //console.log(accessToken);
    //console.log(idToken);
    $state.go('login_success', {accessToken:accessToken,idToken:idToken});
  }



 $scope.comfirmLogout = function()
  {
    function logout(){

      $scope.authProfile = null;
      $scope.userInSession = null;
      window.localStorage.removeItem("UserInSession");
      window.localStorage.removeItem("AuthProfile");
      PublicService.setHeader("login");
      PublicService.setFooter("newUser");

      PublicService.logout();
      //$state.go('login');
    }

    var confirmPopup = $ionicPopup.confirm({
       title: 'Log Out From '+APP_CONSTANT.NAME,
       template: 'Are you sure?'
     });
     
    confirmPopup.then(function(result) {
        if(result)
        {
          logout();
        }
     });
  }
  
  function footerActive(name)
  {
    //reset all footer
    console.log("white " +name);
    var prevState = $state.current.name;
    $("span#footer-"+prevState).removeClass("footer-active");

    if(name != "none")
    {
      $("span#footer-"+name).addClass("footer-active");
    }

  }

  $scope.home = function() {    
    closeSideMenuBar();
    footerActive("home");
    $state.go('home');    
  };

  $scope.login = function() {
    console.log("here");
    footerActive("none");    
    $state.go('login');    
  };  

  $scope.signup = function() {
    $state.go('signup');    
  };
  $scope.findUser = function(user_type_request) {
    closeSideMenuBar();
    footerActive("findUser");
    $state.go('findUser',{user_type_request:user_type_request});
  };  
  $scope.contact = function() {   
    closeSideMenuBar();
    footerActive("contact");
    $state.go('contact');    
  };

  $scope.faq = function() {   
    closeSideMenuBar();
    footerActive("faq");
    $state.go('faq');    
  };

  $scope.about = function() {   
    closeSideMenuBar();
    footerActive("about");       
    $state.go('about');    
  };

  $scope.invite = function() {   
    closeSideMenuBar();
    footerActive("invite");
    $state.go('invite');    
  };

  $scope.showUser = function (id){
    closeSideMenuBar();
    footerActive("none");
    $state.go('showUser',{id:id}); 
  };  


  $scope.showProduct = function(product_id,show)
  {
    footerActive("none");
    $state.go('showProduct',{product_id:product_id,show:show})
  };

  $scope.share = function(social,page,id,title,picture,description)
  {    
    console.log(social);
    console.log(page);
    console.log(id);
    console.log(title);

    var url =APP_CONSTANT.DOMAIN+page;
    var text = "";

    if(page == "showProduct")
    {
      //url += "?product_id=" + id +"&show=info";
      url += "?product_id=" + id;
      text = title + " on DropBug.";
    }

    if(page == "showUser")
    {
      url += "?id=" + id;
      text = "Check Out My Profile on DropBug.";
    }

    console.log(url);

    if(social == "twitter")
    {
      PublicService.shareOnTwitter(url,text);
    }

    if(social == "facebook")
    {
      PublicService.shareOnFacebook(url,title,picture,description);
    }
  }  
  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////

  $scope.allUsers = function() {
    closeSideMenuBar();
    $state.go('allUsers');
  };

  $scope.addProduct = function(){
    console.log("Add Product Page");
    footerActive("none");    
    $state.go("addProduct");
  }


  $scope.myActiveListing = function() {
    footerActive("myActiveListing");
    closeSideMenuBar();
    var pageNumber = 1;
    console.log("Page "+pageNumber);
    $state.go('myActiveListing',{pageNumber,pageNumber});
  };
  

  $scope.myCompletedTransaction = function() {
    footerActive("none");    
    closeSideMenuBar();
    var pageNumber = 1;
    $state.go('myCompletedTransaction',{pageNumber,pageNumber});
  };

  $scope.myProducts = function() {
    footerActive("showProductList");
    closeSideMenuBar();
    //$state.go('myProducts');
    if($scope.userInSession == null)
    {
      $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
    }

    var pageNumber = 1;
    $state.go('showProductList',{user_id:$scope.userInSession.user_id,refresh:'y', pageNumber:pageNumber });
  };
  
  ///////////////////////////////////////////////
  //SIDE MENU BAR //////////////////////////////////
  $scope.toggleSideMenuLeft = function(){
    $ionicSideMenuDelegate.toggleLeft();
  };  

  $scope.toggleSideMenuRight = function(){
    $ionicSideMenuDelegate.toggleRight();
  };

  function closeSideMenuBar(){
    if($ionicSideMenuDelegate.isOpenLeft()){
      $ionicSideMenuDelegate.toggleLeft();
    }    

    if($ionicSideMenuDelegate.isOpenRight()){
      $ionicSideMenuDelegate.toggleRight();
    }
  }

  $scope.myLinkedUser = function() {
    footerActive("none");        
    closeSideMenuBar();
    var pageNumber = 1;
    $state.go('myLinkedUser',{pageNumber,pageNumber});
  };  

  $scope.myPendingLinkRequest = function()
  {
    footerActive("none");        
    closeSideMenuBar();
    $state.go('myPendingLinkRequest');
  } 

  $scope.myProfile = function (){
    footerActive("none");       
    closeSideMenuBar();
    $state.go('myProfile'); 
  };

  $scope.showProductList = function(user_id){
    footerActive("none");    
    closeSideMenuBar();
    var pageNumber = 1;
    $state.go('showProductList',{user_id:user_id,refresh:'y', pageNumber:pageNumber});
  }

  $scope.allNotifications = function(){
    footerActive("none");    
    closeSideMenuBar();
    var pageNumber = 1;
    console.log("Page "+pageNumber);
    $state.go('allNotifications',{pageNumber:pageNumber});
  }


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
// MODAL ///////////////////////////////////////////////////////////////////////////////

  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
    }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(title,image){
    $scope.modalTitle = title;
    $scope.modalImage = image;
    $scope.modal.show();
  }

  $ionicModal.fromTemplateUrl('modal/terms.html', {
    scope: $scope
    }).then(function(modal) {
    $scope.modalTerm = modal;
  });
    
////////////////////////////////////////////////////////////////////////////////////////

  $scope.range = function(min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
          input.push(i);
      }
      return input;
  };

  $scope.copyToClipboard = function(textToCopy)
  {
     $("body")
        .append($('<input type="text" name="fname" class="textToCopyInput"/>' )
        .val(textToCopy))
        .find(".textToCopyInput")
        .select();
      try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        PublicService.successCallbackFunction(textToCopy,"Text successfully copied to clipboard!");

      } catch (err) {
        window.prompt("To copy the text to clipboard: Ctrl+C, Enter", textToCopy);
      }
     $(".textToCopyInput").remove();

  }


}]);
