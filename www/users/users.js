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
      url: '/allUsers?user_type&pageNumber',
      controller: 'AllUserController',
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
      url: '/myLinkedUser?refresh&pageNumber',
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

myApp.controller('AllUserController', function($scope, USER_TYPE,SearchService,UserService,PublicService, BackandService, auth,OFFSET, $state,$location, $stateParams){
  $scope.user_type = $stateParams.user_type;
  $scope.users = [];
  $scope.loading = false;
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  /////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////// SEARCH HELPER /////////////////////////////////////////////////////////////////////
  $scope.pageNumber = $stateParams.pageNumber;
  console.log($scope.pageNumber);
  
  $scope.OFFSET = OFFSET; 
  $scope.search = {};

  $scope.searchUser = [];
  $scope.searchLoad = false;
  $scope.isSubmit = false;

  function searchUserByNameTypeFixed(searchKey)
  {
    var length = 0;
    try
    {
      length = searchKey.length;
    }
    catch(err)
    {
      console.log(err);
    }


    if(length < 3)
    {
      return;
    }

    $scope.searchLoad = true;
    SearchService.searchUserByNameTypeFixed(searchKey,$scope.user_type).then(function(result){
      $scope.searchUser = result.data
      console.log(result);
      $scope.searchLoad = false;

    },function errorCallback(result){

        PublicService.errorCallbackFunction(result,"default");
        $scope.searchLoad = false;
    });
  }

  $scope.submit = function()
  {
    if(!$scope.search.key || $scope.search.key == '')
    {
      $scope.searchUser = [];
    }
    $scope.isSubmit = true;
    
    searchUserByNameTypeFixed($scope.search.key);    
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////

  function getAllUserByUserType()
  {
    $scope.loading = true;
    BackandService.getUserByType($scope.user_type,"all").then(function(result){
      $scope.users = result.data
      console.log(result);
      $scope.loading = false;

    },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"default");
        $scope.loading = false;
    });
  }

  getAllUserByUserType();


});

myApp.controller('FindUserController', function($scope, USER_TYPE,PublicService,UserService,SearchService, BackandService, auth, $state,$location, $stateParams){
  
  $scope.user_type_request = $stateParams.user_type_request;
  $scope.USER_TYPE = USER_TYPE;

  console.log($scope.user_type_request);
  
  $scope.suppliers = {};  
  $scope.stockists = {};
  $scope.dropships = {};

  $scope.loadSupplier = true;
  $scope.loadStockist = true;
  $scope.loadDropship = true;

  $scope.userCount_load = ["count",0,0,0];
  $scope.suppliersCount = 0;
  $scope.stockistsCount = 0;
  $scope.dropshipsCount = 0; 

  /////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////// SEARCH HELPER /////////////////////////////////////////////////////////////////////
  $scope.search = {};
  $scope.search.key = $stateParams.searchKey;
  $scope.user_type = USER_TYPE.ALL;

  $scope.users = [];
  $scope.searchLoad = false;
  $scope.isSubmit = false;

  function searchUserNameByType(searchKey,type)
  {
    var length = 0;
    try
    {
      length = searchKey.length;
    }
    catch(err)
    {
      console.log(err);
    }


    if(length < 3)
    {
      return;
    }

    $scope.searchLoad = true;
    SearchService.searchUserByNameByType(searchKey,type).then(function(result){
      $scope.users = result.data
      console.log(result);
      $scope.searchLoad = false;

    },function errorCallback(result){

        PublicService.errorCallbackFunction(result,"default");
        $scope.searchLoad = false;
    });
  }

  $scope.submit = function()
  {
    if(!$scope.search.key)
    {
      $scope.users = [];
    }
    $scope.isSubmit = true;
    searchUserNameByType($scope.search.key,$scope.search.user_type);    
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////

  $scope.findMore = function(user_type)
  {
    console.log("find more " + user_type);
    $state.go("allUsers",{user_type:user_type, pageNumber:1});

  }

  function getUserByType(user_type,limit){
      BackandService.getUserByType(user_type,limit).then(function(result){
        console.log("getUserByType");
        console.log(result);

        if(user_type == USER_TYPE.SUPPLIER)
        {
          $scope.suppliers = result.data;
          $scope.loadSupplier = false;
        }

        if(user_type == USER_TYPE.STOCKIST)
        {
          $scope.stockists = result.data;
          $scope.loadStockist = false;
        }

        if(user_type == USER_TYPE.DROPSHIP)
        {
          $scope.dropships = result.data;
          $scope.loadDropship = false;
        }
      });
    }


  function getUserCountByUserType(user_type){
    BackandService.getUserCountByUserType(user_type).then(function(result){
      if(user_type == USER_TYPE.SUPPLIER)
      {
        $scope.suppliersCount = result.data[0].total_user;
      }

      if(user_type == USER_TYPE.STOCKIST)
      {
        $scope.stockistsCount = result.data[0].total_user;
      }

      if(user_type == USER_TYPE.DROPSHIP)
      {
        $scope.dropshipsCount = result.data[0].total_user;
      }

      $scope.userCount_load[user_type] = false;

    },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"default");
    });
  }

  function main()
  {
    var limitGetUser = 3;
    for(var i=1; i<=3 ;i++)
    {
      getUserByType(i,limitGetUser);
      $scope.userCount_load[i] = true;
      getUserCountByUserType(i);
    }
  }

  main();


});


myApp.controller('ShowUserController', function($scope,NOTI_CATEGORY,$ionicPopup, PublicService,BackandService, auth, growl, $state, $stateParams, USER_LINK_TYPE){
  
  $scope.loading = false;
  $scope.loadingProducts = false;
  $scope.show = "info";

  $scope.showObject = {};
  $scope.showObjectLoad = false;



  $scope.USER_LINK_TYPE = USER_LINK_TYPE;


  $scope.user_link_id = null;

  $scope.userLinkType = USER_LINK_TYPE.NOT_REQUESTED;

  $scope.isRequestToUser = false;
  $scope.isRequestByUser = false;

  $scope.fullAddress = false;
  $scope.show_user_id = $stateParams.id;

  $scope.toggleFullAddress = function()
  {
    if($scope.fullAddress)
        $scope.fullAddress = false;
    else
        $scope.fullAddress = true;
  }

  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  if($scope.userInSession != null)
  {
    console.log("USER IN SESSION");
    console.log($scope.userInSession);
    $scope.linkObject = {};
    $scope.session_user_id = $scope.userInSession.user_id;

    if($scope.userInSession.user_id == $scope.show_user_id)
    {
      $state.go('myProfile');
      return;
    }

    console.log("Showing User "+$scope.show_user_id)
    initLink();
  }

  getObjectById("users", $scope.show_user_id);


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

      BackandService.createNotification($scope.show_user_id,
                                        "You got a new link request from "+$scope.userInSession.first_name,
                                        "/showUser?id="+$scope.userInSession.user_id,
                                        NOTI_CATEGORY.LINK);
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

          if(operation == "removeFromList")
          {
            var text = "You were removed you from "+$scope.userInSession.first_name+ "'s list"
            BackandService.createNotification($scope.show_user_id,
                                      text,
                                      "/showUser?id="+$scope.userInSession.user_id,
                                      NOTI_CATEGORY.LINK);
          }
        }

      });
    }    

    if(operation == "confirmRequest")
    {
      editUserLink($scope.user_link_id, USER_LINK_TYPE.LINKED);

      BackandService.createNotification($scope.show_user_id,
                                  "You are now linked with "+$scope.userInSession.first_name,
                                  "/showUser?id="+$scope.userInSession.user_id,
                                  NOTI_CATEGORY.LINK);
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
    $scope.showObjectLoad = true;

    BackandService.getObjectById(objectName,id).then(function(result){
      console.log("Data from show object");
      $scope.showObject = result.data;
      console.log($scope.showObject);
      if(result.status == 200)
      {
        $scope.showObject.created_at = PublicService.getDate($scope.showObject.created_at);
      }
        $scope.showObjectLoad = false;

    }, function errorCallback (result){
          userLinkErrorCallback(result,"Error in Retrieving Info");
          $scope.showObjectLoad = false;
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


myApp.controller('LinkedUserController', function ($scope,growl,OFFSET, $state,$stateParams,UserService, BackandService,PublicService,SearchService, USER_LINK_TYPE) {
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));


  /////////////////////////////////////////////////////////////////////////////////////////////////
  ///////////// SEARCH HELPER /////////////////////////////////////////////////////////////////////
  $scope.pageNumber = $stateParams.pageNumber;
  console.log($scope.pageNumber);
  
  $scope.OFFSET = OFFSET; 
  $scope.search = {};

  $scope.searchProduct = [];
  $scope.searchLoad = false;
  $scope.isSubmit = false;

  function searchProductByNameByCategory(searchKey)
  {
    var length = 0;
    try
    {
      length = searchKey.length;
    }
    catch(err)
    {
      console.log(err);
    }


    if(length < 3)
    {
      return;
    }

    $scope.searchLoad = true;
    SearchService.searchLinkedUserByNameByState(searchKey,$scope.userInSession.user_id).then(function(result){
      $scope.searchProduct = result.data
      console.log(result);
      $scope.searchLoad = false;

    },function errorCallback(result){

        PublicService.errorCallbackFunction(result,"default");
        $scope.searchLoad = false;
    });
  }

  $scope.submit = function()
  {
    if(!$scope.search.key || $scope.search.key == '')
    {
      $scope.searchProduct = [];
    }
    $scope.isSubmit = true;
    searchProductByNameByCategory($scope.search.key);    
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////

  $scope.refresh = function(){
    initLinkedUser();
    growl.info('List is up to date',{title: 'Refresh List!'});
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
    BackandService.getLinkedUserById(user_id,$scope.pageNumber).then(function(result){
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

  $scope.getMore = function(direction)
  {
    console.log(direction);
    var pageNumber = $scope.pageNumber;
    if(direction == 'next')
    {
      pageNumber = Number($scope.pageNumber) + 1;
    }

    if(direction == 'previous')
    {
      pageNumber = Number($scope.pageNumber) - 1;
    }

    console.log(pageNumber);
    $state.go($state.current.name,{pageNumber:pageNumber});
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


myApp.controller('MyProfileController', function ($scope, growl, $state,UserService, BackandService,PublicService, USER_LINK_TYPE, USER_TYPE) {
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  $scope.myProfile = null; 
  $scope.oldProfile = null;
  $scope.myProfileLoad = false;
  $scope.page = "show";
  $scope.fullAddress = false;

  $scope.toggleFullAddress = function()
  {
    if($scope.fullAddress)
        $scope.fullAddress = false;
    else
        $scope.fullAddress = true;
  }

  $scope.USER_TYPE = USER_TYPE;

  function getObjectById(objectName, id)
  {
    $scope.myProfileLoad = true;
    BackandService.getObjectById(objectName,id).then(function(result){
      console.log("Data from show object");
      $scope.myProfile = result.data;
      $scope.oldProfile = result.data;
      console.log($scope.myProfile);
      if(result.status == 200)
      {

      }
      $scope.myProfileLoad = false;

    }, function errorCallback (result){
        $scope.myProfileLoad = false;
        userLinkErrorCallback(result,"Error in Retrieving Info");
    });
  }

  $scope.submitEditProfile = function(){
    $scope.oldProfile = $scope.myProfile;
    console.log("submitEditProfile");

    $scope.loadStatus = "Editing old record in database"
    
    $scope.myProfile.updated_at = PublicService.getTimestampinMysql();
    
    console.log($scope.myProfile);

    BackandService.
    editUserById($scope.myProfile.id,
                $scope.myProfile.first_name,
                $scope.myProfile.last_name,
                $scope.myProfile.company_name,
                $scope.myProfile.address_line_1,
                $scope.myProfile.address_line_2,
                $scope.myProfile.city,
                $scope.myProfile.state,
                $scope.myProfile.postal_code,
                $scope.myProfile.email,
                $scope.myProfile.phone_number,
                $scope.myProfile.about,
                $scope.myProfile.updated_at)
    .then(function(result){

      console.log("Result From Editing Profile");
      console.log(result);      

      if(result.status == 200)
      {
        growl.success("" ,{title: 'Successfully Edit Your Product!'});              
        $scope.page = "show";
      }
      $scope.loading = false;

    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed to edit your profile");
    });

  }

  $scope.editProfile = function(){
    $scope.page = "edit";
    $scope.oldProfile = JSON.parse(JSON.stringify($scope.myProfile));
  }

  $scope.showProfile = function(){
    $scope.page = "show";
    console.log($scope.oldProfile);
    console.log($scope.myProfile);
    $scope.myProfile = $scope.oldProfile;
  }

  $scope.showProductList = function (user_id)
  {
    $state.go("showProductList",{user_id:user_id,pageNumber:1});
  }

  console.log($scope.userInSession == null);
  if($scope.userInSession != null)
  {
    getObjectById("users",$scope.userInSession.user_id);
  }
  else
  {
    console.log($scope.authProfile);
    //growl.error("Supplier, Stockist or Dropship" ,{title: 'You have to Register First!'});    
  }

});