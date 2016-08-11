var myApp = angular.module('sample.reviews', [
  'ui.router',
  'backand',
  'auth0',
  'ngCookies'
]);

myApp.config(function($stateProvider) {

  $stateProvider
    .state('addEditReview', {
      url: '/addEditReview?to_user_id&product_id&id&show',
      controller: 'ReviewController',
      templateUrl: 'reviews/addEditReview.html',
      data: {
        requiresLogin: true
      }
  });
  
});

myApp.controller('ReviewController', function($scope, USER_TYPE,$ionicPopup, SearchService,NOTI_CATEGORY, UserService, PublicService, BackandService, auth,OFFSET, $state,$location, $stateParams){

  $scope.reviews = [];
  $scope.newReview = {};
  $scope.show = $stateParams.show;
  $scope.pageNumber = 1;
  $scope.loadGet = false;
  $scope.loadAdd = false;
  $scope.OFFSET = OFFSET;
  $scope.totalReviews = 0;
  $scope.loadedReviews = 0;

  $scope.main = function (){
    $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

    if($state.current.name == "addEditReview")
    {
      $scope.to_user_id = $stateParams.to_user_id;
      
      //edit
      if($stateParams.id != null)
      {
        getReviewById($stateParams.id);
      }

    }

    if($state.current.name == "showUser")
    {
      getAllReviews($stateParams.id,null,$scope.pageNumber);
      getTotalReview($stateParams.id,null);
      $scope.to_user_id = $stateParams.id;
    }

    if($state.current.name == "myProfile")
    {
      getAllReviews($scope.userInSession.user_id,null,$scope.pageNumber);
      getTotalReview($scope.userInSession.user_id,null);
    }
   
  }

  $scope.refresh = function(){
    $scope.reviews = [];
    $scope.main();
  }

  $scope.main();

  function getReviewById(id)
  {
    BackandService.getObjectById("reviews",id).then(function(result){
        
        if(result.status = 200)
        {
           $scope.newReview = result.data;         
        }

    },function errorCallback(result){
      PublicService.errorCallbackFunction(result,"default");
    });
  }

  function getTotalReview(to_user_id,product_id)
  {
    BackandService.getTotalReview(to_user_id,product_id).then(function (result){
      console.log("getTotalReview");
      console.log(result.data[0].total_review);
      if(result.status = 200)
      {
        $scope.totalReviews = result.data[0].total_review;
      }

    },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"default");
    });
  }

  function getAllReviews(to_user_id,product_id,pageNumber){
    $scope.loadGet = true;
    BackandService.getAllReviewsByToUserId(to_user_id,pageNumber).then(function (result){
      console.log("getAllReviewsByToUserId");
      console.log(result.data);

      if(result.status == 200)
      {
        if($scope.reviews.length == 0)
        {
          $scope.reviews = result.data;
        }
        else
        {
          $scope.reviews = $scope.reviews.concat(result.data);
        }
        
        $scope.loadedReviews = $scope.reviews.length;
        console.log($scope.reviews);
      }
      
      $scope.loadGet = false;
    },function errorCallback(result){
      PublicService.errorCallbackFunction(result,"default");
      $scope.loadGet = false;
    });

  }

  $scope.addReview = function(to_user_id,name){
    console.log(to_user_id);
    $state.go("addEditReview",{show:'Add', to_user_id:to_user_id})  
  }

  $scope.editReview = function(id){
    $state.go("addEditReview",{show:'Edit', id:id})  
  }


 $scope.confirmDelete = function(id)
  {
    function deleteReview(){
      BackandService.deleteObject("reviews",id).then(function (result){
          if(result.status == 200)
          {
            PublicService.successCallbackFunction("","Successfully Delete 1 Review");
            $scope.refresh();
          }

      },function errorCallback(result){
          PublicService.errorCallbackFunction(result,"default");
      });

    }

    var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Review',
       template: 'Are you sure?'
     });
     
    confirmPopup.then(function(result) {
        if(result)
        {
          deleteReview(id);
        }
     });
  }

  $scope.editReviewRecord = function(){
    $scope.loadAdd = true;

    $scope.newReview.updated_at = PublicService.getTimestampinMysql();

    console.log($scope.newReview);

    BackandService.editReviewById($scope.newReview.id,$scope.newReview.text,$scope.newReview.star,$scope.newReview.updated_at).then( function (result){
      console.log("editReviewById");
      console.log(result.data);

      if(result.status == 200)
      {
        PublicService.successCallbackFunction("Click on [Reviews] to refresh", "Successfully Edit Review");
        $state.pageNumber = 1;
        createNotificationReview($scope.newReview.to_user_id,null,"edit");
        $state.go("showUser",{id:$scope.newReview.to_user_id});
      }

      $scope.loadAdd = false;

    },function errorCallback(result){
      PublicService.errorCallbackFunction(result,"default");
      $scope.loadAdd = false;
    });
  }
  
  $scope.addReviewRecord = function(){
    $scope.loadAdd = true;

    $scope.newReview.from_user_id = $scope.userInSession.user_id;
    $scope.newReview.to_user_id = $stateParams.to_user_id;
    $scope.newReview.product_id = $stateParams.product_id;
    $scope.newReview.created_at = PublicService.getTimestampinMysql();
    $scope.newReview.updated_at = PublicService.getTimestampinMysql();

    console.log($scope.newReview);

    BackandService.addObject("reviews",$scope.newReview).then( function (result){
      console.log("addReviews");
      console.log(result.data);

      if(result.status == 200)
      {
        PublicService.successCallbackFunction("Click on [Reviews] to refresh", "Successfully Add Review");
        $state.pageNumber = 1;
        createNotificationReview($scope.to_user_id,null,"add");
        $state.go("showUser",{id:$scope.to_user_id});
      }

      $scope.loadAdd = false;

    },function errorCallback(result){
      PublicService.errorCallbackFunction(result,"default");
      $scope.loadAdd = false;
    });
  }
  
  function createNotificationReview(to_user_id,product_id,key){

    var text = "";
    var link = "/myProfile";
    var category = 0;
    var other_user_name = $scope.userInSession.first_name;

    if(product_id == null){
      text = other_user_name+" "+ key +" a review on your profile.";
    }

    else{
      text = other_user_name+" "+ key +" a review on your product.";      
    }

    category = NOTI_CATEGORY.REVIEW;

    BackandService.createNotification(to_user_id,text,link,category);
  }

  $scope.getMore = function()
  {
    console.log($scope.pageNumber);
    $scope.pageNumber += 1;
    $scope.main();
  }


});
