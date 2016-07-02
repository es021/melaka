var myApp = angular.module('sample.users', [
  'ui.router',
  'backand',
  'auth0',
  'ngCookies'
]);

myApp.config(function($stateProvider) {


  $stateProvider
    .state('findUser', {
      url: '/findUser?user_type_request',
      controller: 'FindUserController',
      templateUrl: 'users/findUser.html',
      data: {
        requiresLogin: false
      }
    });


  $stateProvider
    .state('allUsers', {
      url: '/allUsers',
      controller: 'UserController',
      templateUrl: 'users/allUsers.html',
      data: {
        requiresLogin: false
      }
  });



  $stateProvider
    .state('showUser', {
      url: '/showUser?id',
      controller: 'ShowUserController',
      templateUrl: 'users/showUser.html',
      data: {
        requiresLogin: false
      }
  });

  $stateProvider
    .state('myProfile', {
      url: '/myProfile',
      controller: 'MyProfileController',
      templateUrl: 'users/myProfile.html',
      data: {
        requiresLogin: true
      }
  });


  $stateProvider
    .state('myLinkedUser', {
      url: '/myLinkedUser?refresh',
      controller: 'LinkedUserController',
      templateUrl: 'users/myLinkedUser.html',
      data: {
        requiresLogin: true
      }
  }); 

  $stateProvider
    .state('myPendingLinkRequest', {
      url: '/myPendingLinkRequest?refresh',
      controller: 'PendingLinkController',
      templateUrl: 'users/myPendingLinkRequest.html',
      data: {
        requiresLogin: true
      }
  }); 

  
});

myApp.controller('FindUserController', function($scope, USER_TYPE,UserService, BackandService, auth, $state,$location, $stateParams){
  
  $scope.user_type_request = $stateParams.user_type_request;
  $scope.USER_TYPE = USER_TYPE;

  console.log($scope.user_type_request);
  
  $scope.suppliers = {};  
  $scope.stockists = {};
  $scope.dropships = {};

  $scope.loadSupplier = false;
  $scope.loadStockist = false;
  $scope.loadDropship = false;



  function getUserByType(user_type){
      BackandService.getUserByType(user_type).then(function(result){
        console.log("getUserByType");
        console.log(result);

        if(user_type == 1)
          $scope.suppliers = result.data;

        if(user_type == 2)
          $scope.stockists = result.data;

        if(user_type == 3)
          $scope.dropships = result.data;

      });
    }

  for(var i=1; i<=3 ;i++)
  {
    if($scope.user_type_request != i)
    {
      getUserByType(i);
    }
  }

});


myApp.controller('ShowUserController', function($scope,$ionicPopup, PublicService,BackandService, auth, growl, $state, $stateParams, USER_LINK_TYPE){
  
  $scope.loading = false;
  $scope.loadingProducts = false;
  $scope.show = "info";

  $scope.showObject = {};
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  $scope.linkObject = {};
  $scope.show_user_id = $stateParams.id;
  $scope.session_user_id = $scope.userInSession.user_id;

  $scope.USER_LINK_TYPE = USER_LINK_TYPE;


  $scope.user_link_id = null;

  $scope.userLinkType = USER_LINK_TYPE.NOT_REQUESTED;

  $scope.isRequestToUser = false;
  $scope.isRequestByUser = false;

  if($scope.userInSession.user_id == $scope.show_user_id)
  {
    $state.go('myProfile');
    return;
  }

  getObjectById("users", $scope.show_user_id);
  initLink();

  function initLink()
  {
    //requestedByUser
    getUserLink($scope.session_user_id ,$scope.show_user_id, USER_LINK_TYPE.REQUESTED_BY_USER);

    //requestedToUser
    getUserLink($scope.show_user_id ,$scope.session_user_id, USER_LINK_TYPE.REQUESTED_TO_USER);

    if($scope.userInSession.user_type == $scope.showObject.user_type)
    {
      $scope.userLinkType = USER_LINK_TYPE.SAME_TYPE;
    }
  }

  function getUserLink(from_user_id, to_user_id, user_link_type)
  {
      BackandService.getUserLink(from_user_id,to_user_id).then(function(result){
      console.log("Data from get link object");
      console.log(result);
      if(result.data.length > 0)
      {
        $scope.linkObject = result.data[0];

        if(result.data[0].id != null)
        {
          $scope.user_link_id = result.data[0].id;
        }

        if(result.data[0].type == USER_LINK_TYPE.REQUESTED && user_link_type == USER_LINK_TYPE.REQUESTED_BY_USER)
        {
          $scope.userLinkType = USER_LINK_TYPE.REQUESTED;
          $scope.isRequestByUser = true; 
        }
        if(result.data[0].type == USER_LINK_TYPE.REQUESTED && user_link_type == USER_LINK_TYPE.REQUESTED_TO_USER)
        {
          $scope.userLinkType = USER_LINK_TYPE.REQUESTED;
          $scope.isRequestToUser = true; 
        }
        else
        {
          $scope.userLinkType = result.data[0].type;
        }
      }
    }, function errorCallback (result){

    });
  }

  $scope.linkUser = function(operation)
  {
    $scope.loading = true;

    if(operation == "sendRequest")
    {
      var newLink = {};
      newLink.to_user_id =  $scope.show_user_id;
      newLink.from_user_id = $scope.session_user_id;
      newLink.type = USER_LINK_TYPE.REQUESTED;
      newLink.created_at = BackandService.getTimestampinMysql();
      newLink.update_at = BackandService.getTimestampinMysql();
      addObject("userLinks",newLink,"Request Sent!");
    }

    if(operation == "cancelRequest" || operation == "ignoreRequest" || operation == "removeFromList")
    {
      $scope.loading = false;
      var confirmPopup = $ionicPopup.confirm({
        title: 'Are You Sure?',
        template: 'This action cannot be undone.'
      });
           
      confirmPopup.then(function(result) {
        if(result)
        {
          $scope.loading = true;
          deleteUserLink($scope.user_link_id);
        }

      });
    }    

    if(operation == "confirmRequest")
    {
      editUserLink($scope.user_link_id, USER_LINK_TYPE.LINKED);
    }
  }

  function refreshPage()
  {
    $state.transitionTo($state.current, $stateParams, {
      reload: true,
      inherit: false,
      notify: true
    });
  }

  function userLinkErrorCallback(result,operation)
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

    growl.error(error ,{title: operation+" Failed!"});
    console.log(result);
    $scope.loading = false;
  }

  function addObject(objectName, object, successMessage)
  {
    BackandService.addObject(objectName,object).then(function(result){
    console.log("Return Result from Adding to "+objectName);
    console.log(result);
      $scope.loading = false;

      if(result.status == 200)
      {
        growl.success("" ,{title: ""+successMessage});
        $scope.userLinkType = USER_LINK_TYPE.REQUESTED;
        $scope.user_link_id = result.data.id;
        $scope.isRequestToUser = false;
        $scope.isRequestByUser = true;
      }

    }, function errorCallback (result){
          userLinkErrorCallback(result,"Request");
    });
  }

  function getObjectById(objectName, id)
  {
    BackandService.getObjectById(objectName,id).then(function(result){
      console.log("Data from show object");
      $scope.showObject = result.data;
      if(result.status == 200)
      {
        $scope.showObject.created_at = PublicService.getDate($scope.showObject.created_at);
      }

    }, function errorCallback (result){
          userLinkErrorCallback(result,"Error in Retrieving Info");
    });
  }

  function editUserLink(id,type)
  {
      var updated_at = PublicService.getTimestampinMysql();
      BackandService.editUserLinkById(id,type,updated_at).then(function(result){
      console.log("Data from edit link object");
      console.log(result);

      $scope.loading = false;

      if(result.status == 200)
      {
        growl.success("" ,{title: 'Successfully Edit Record!'});
        $scope.userLinkType = type;
        $scope.isRequestToUser = false;
        $scope.isRequestByUser = false;
      }

    }, function errorCallback (result){
          userLinkErrorCallback(result,"Comfirm Request");
    });
  }

  function deleteUserLink(id)
  {
      BackandService.deleteObject("userLinks",id).then(function(result){
      console.log("Data from delete link object");
      console.log(result);
      /*
      if(result.data.length > 0)
      {
        $scope.linkObject = result.data[0];
        $scope.userLinkType = result.data[0].type;
      }
      */
      $scope.loading = false;

      if(result.status == 200)
      {
        growl.success("" ,{title: 'Successfully Delete Record!'});
        $scope.userLinkType = USER_LINK_TYPE.NOT_REQUESTED;
        $scope.isRequestToUser = false;
        $scope.isRequestByUser = false;
      }

    }, function errorCallback (result){
          userLinkErrorCallback(result,"Remove Request");
    });
  }


////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////
//// TO SHOW PRODUCT

  function getProductBySupplierId(supplier_id){
    $scope.loadingProducts = true;
    BackandService.getProductBySupplierId(supplier_id).then(function(result){

      console.log("Result From getProductBySupplierId");
      //console.log(result);  
      $scope.myProductsObject = result.data;    

      if(result.status == 200)
      {

      }
      $scope.loadingProducts = false;

    });

  }

  $scope.showFunction = function(showPage)
  {
      console.log($scope.myProductsObject);
     $scope.show = showPage;
     if(showPage == "products")
     {
        if($scope.myProductsObject == null)
        {
          getProductBySupplierId($scope.id);
        }
     }
  }


});


myApp.controller('LinkedUserController', function ($scope, $state,UserService, BackandService,PublicService, USER_LINK_TYPE) {
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  $scope.refresh = function(){
    initLinkedUser();
  };
  
 if($scope.userInSession != null)
  {
    initLinkedUser();
  }
  else
  {
    $state.go("login");
  }

  function defineScopeLinked()
  {
    $scope.myLinkedUser = {};
    $scope.myLinkedUserLoad = true;
  }

  function initLinkedUser()
  {
    console.log("initAgentLinked");
    defineScopeLinked();
    getLinkedUserById($scope.userInSession.user_id);
  }  

  function getLinkedUserById(user_id){
    BackandService.getLinkedUserById(user_id).then(function(result){
      console.log("Getting all getLinkedUserById");
      //console.log(result);

      if(result.status == 200)
      {
        $scope.myLinkedUser = result.data;
        $scope.myLinkedUserLoad = false;
      }      

    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed : getLinkedUserById");
    });
  }    

});

myApp.controller('PendingLinkController', function ($scope, $state, $stateParams, UserService, BackandService,PublicService, USER_LINK_TYPE) {
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  $scope.refresh = function(){
    initPendingUser(); 
  };

 if($scope.userInSession != null)
  {
    initPendingUser(); 
  }
  else
  {
    $state.go("login");
  }

  function defineScopePending()
  {
    $scope.requestedToUser = {};
    $scope.requestedFromUser = {};
    $scope.requestedToUserLoad = true;
    $scope.requestedFromUserLoad = true;
  }

  function initPendingUser()
  {
    console.log("initAgentPending");
    defineScopePending();
    getRequestToUserById($scope.userInSession.user_id);
    getRequestFromUserById($scope.userInSession.user_id);  
  }  

  function getRequestToUserById(user_id){
    BackandService.getRequestToUserById(user_id).then(function(result){
      console.log("Getting all getRequestToUserById");
      //console.log(result);

      if(result.status == 200)
      {
        $scope.requestedToUser = result.data;
        $scope.requestedToUserLoad = false;
      }      

    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed : getRequestToUserById");
    });
  }  

  function getRequestFromUserById(user_id){
    BackandService.getRequestFromUserById(user_id).then(function(result){
      console.log("Getting all getRequestFromUserById");
      //console.log(result);

      if(result.status == 200)
      {
        $scope.requestedFromUser = result.data;
        $scope.requestedFromUserLoad = false;
      }      

    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed : getRequestFromUserById");
    });
  }  

});


myApp.controller('MyProfileController', function ($scope, $state,UserService, BackandService,PublicService, USER_LINK_TYPE) {
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  $scope.myProfile = null; 

  function getObjectById(objectName, id)
  {
    BackandService.getObjectById(objectName,id).then(function(result){
      console.log("Data from show object");
      $scope.myProfile = result.data;
      if(result.status == 200)
      {

      }

    }, function errorCallback (result){
          userLinkErrorCallback(result,"Error in Retrieving Info");
    });
  }

  getObjectById("users",$scope.userInSession.user_id);


});