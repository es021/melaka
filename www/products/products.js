var myApp = angular.module('sample.products', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider,$urlRouterProvider, authProvider) {

  $stateProvider
    .state('myProducts', {
      url: '/myProducts?refresh',
      controller: 'MyProductController',
      templateUrl: 'products/myProducts.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('showProductList', {
      url: '/showProductList?user_id?refresh',
      controller: 'ShowProductListController',
      templateUrl: 'products/showProductList.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('addProduct', {
      url: '/addProduct',
      controller: 'AddEditProductController',
      templateUrl: 'products/addEditProduct.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('editProduct', {
      url: '/editProduct?id?user_id',
      controller: 'AddEditProductController',
      templateUrl: 'products/addEditProduct.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('showProduct', {
      url: '/showProduct?product_id?show',
      controller: 'ShowProductController',
      templateUrl: 'products/showProduct.html',
      data: {
        requiresLogin: false
      }
  });

});

myApp.controller('MyProductController', function(auth,PublicService,$location,$stateParams, $scope, $state, BackandService,USER_TYPE){

  if($stateParams.refresh == 'y')
  {
    console.log("Refresh");
    getAllProductByUserId($scope.userInSession.user_id);
  }

  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.loading = false;

  if($scope.authProfile != null && $state.current.name == "myProducts")
  {
    $scope.loading = true;
    $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

    if($scope.userInSession.user_type < USER_TYPE.DROPSHIP)
    {
      getAllProductByUserId($scope.userInSession.user_id);
    }
  }


  $scope.addProduct = function(){
    console.log("Add Product Page");
    $state.go("addProduct");
  }

  $scope.editProduct = function(id,user_id){
    console.log("Edit Product Page");
    $state.go("editProduct",{id:id , user_id:user_id});
  }

 function getAllProductByUserId(user_id){

    BackandService.getAllProductByUserId(user_id).then(function(result){

      console.log("Result From getAllProductByUserId");
      console.log(result);  
      $scope.productList = result.data;    
      $scope.loading = false;

    });

  }

  $scope.authenticated = null;

  function checkAuthentication()
  {
    if($scope.userInSession.user_id == $scope.showItem.user_id)
    {
      $scope.authenticated = true;
    }
  }

  $scope.toggleItem = function(item) {
    
    if ($scope.isItemShown(item)) 
    {
      $scope.showItem = null;
    } 
    else 
    {
      $scope.showItem = item;
      $scope.timeAgo = PublicService.getAgoTime(item.updated_at);
    }

    if($scope.authenticated == null)
    {
      checkAuthentication();
    }

  };

  $scope.isItemShown = function(item) {
    return $scope.showItem === item;
  };

});

myApp.controller('ShowProductController', function($scope,$ionicPopup, $location, PublicService,BackandService, $state, $stateParams, growl, TRANS_STATUS, USER_LINK_TYPE){
  $scope.showObject = null;

  $scope.productId = $stateParams.product_id;
  $scope.show = $stateParams.show;

  $scope.loading = false;
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));


  ///// FOR REQUEST FORM /////////////////////////////////////////////////////////////////////////
  $scope.newRequest = {};
  $scope.newRequest.total_price = 0;
  $scope.loadingRequest = false;

  $scope.updateTotalPrice = function()
  { 
    $scope.newRequest.total_price = $scope.newRequest.quantity * $scope.showObject.price_per_unit;
    $scope.newRequest.total_price = $scope.newRequest.total_price.toFixed(2);
    
    if(isNaN($scope.newRequest.total_price))
    {
      $scope.newRequest.total_price = 0;
    }
  }

  $scope.requestProduct = function()
  {
    $scope.loadingRequest = true;
    
    if($scope.showObject == null)
    {
      PublicService.errorCallbackFunction(null,"Failed to Send Request");
      $scope.loadingRequest = false;
      return;
    }

    $scope.newRequest.from_user_id = $scope.userInSession.user_id;
    $scope.newRequest.to_user_id = $scope.showObject.user_id;
    //$scope.newRequest.supplier_id = $scope.showObject.supplier_id;
    $scope.newRequest.product_id = $scope.productId;
    $scope.newRequest.status = TRANS_STATUS.REQUESTED;
    $scope.newRequest.payment_status = TRANS_STATUS.NOT_PAID;
    $scope.newRequest.created_at = BackandService.getTimestampinMysql();
    $scope.newRequest.updated_at = BackandService.getTimestampinMysql();

    //$scope.newRequest.total_price
    //$scope.newRequest.type
    //$scope.newRequest.quantity
    //$scope.newRequest.note

    BackandService.addObject("transactions",$scope.newRequest).then(function(result){
      console.log("Result From Creating new Request");
      console.log(result);      

      if(result.status == 200)
      {
        growl.success("Redirecting to Listing Page" ,{title: 'Successfully Added New Request!'});              
        $state.go("myActiveListing");
      }

      $scope.loadingRequest = false;
    },function errorCallback(error){
        PublicService.errorCallbackFunction(error,"Failed to Send Request");
        $scope.loadingRequest = false;
    });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///// FOR TAB /////////////////////////////////////////////////////////////////////////////////
  $scope.authenticated = false;
  $scope.linked = false;
  function checkAuthentication()
  {
    if($scope.userInSession.user_id == $scope.showObject.user_id)
    {
      $scope.authenticated = true;
    }
  }

  function checkIsUserLinked(user1,user2)
  {
    BackandService.getLinkByFromIdToIdType(user1, user2, USER_LINK_TYPE.LINKED).then(function(result){
      console.log("getLinkByFromIdToIdType");
      if(result.status == 200)
      {
        //console.log(result.data.length);
        if(result.data.length > 0)
        {
          $scope.linked = true;
        }
        else
        {
          $scope.linked = false;
        }
      }
    });      
  }

  $scope.showFunction = function(show)
  {
    $scope.show = show;   
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////


  function getShowProductById(id)
  {
    BackandService.getShowProductById(id).then(function(result){
      console.log("Data from show object");

        $scope.showObject = result.data[0];
        console.log($scope.showObject);

        if(result.status == 200 && $scope.showObject != null)
        {
          if($scope.userInSession != null)
          {
            checkAuthentication();
            checkIsUserLinked($scope.userInSession.user_id,$scope.showObject.user_id);
          }
        }
      
    });
  }

  getShowProductById($scope.productId);

  $scope.editProduct = function(){
    $scope.loading = true;
  };

  $scope.comfirmDeleteProduct = function(){
      $scope.loading = false;
      var confirmPopup = $ionicPopup.confirm({
        title: 'Are You Sure?',
        template: 'This action cannot be undone.'
      });
           
      confirmPopup.then(function(result) {
        if(result)
        {
          $scope.loading = true;
          deleteProduct();
        }

      });
  };

  function deleteProduct(){ 
    BackandService.deleteObject("products",$scope.showObject.id).then(function successCallback (result){
      console.log("Data from delete products object");
      console.log(result);

      if(result.status == 200)
      {
        growl.success($scope.showObject.name+" Deleted" ,{title: 'Successfully Delete One Product!'});
        $state.go('myProducts',{refresh:"y"});
      }

      $scope.loading = false;
    
    }, function errorCallback (result){
        growl.error("There is one or more transactions associated with this product" ,{title: 'Failed to delete this product'});
        console.log(result);
        $scope.loading = false;
    });
  };


});

myApp.controller('AddEditProductController', function($scope, $stateParams, USER_TYPE, BackandService, DropboxService, PublicService,FileReaderService, auth, $state,growl, PICTURE_CONSTANT){
  
  //MB
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  
  $scope.state = $state.current.name;

  if($scope.state == "editProduct")
  {
    $scope.editId =  $stateParams.id;
    $scope.product_user_id =  $stateParams.user_id;

    initEditProduct($scope.editId);
  }

  $scope.imageSizeLimit = 2;

  $scope.newProduct = {};
  $scope.filePath = null;
  $scope.fileToUpload = {};

  $scope.file = null;
  $scope.imageSrc = null;
  $scope.progress = null;

  $scope.loading = false;
  $scope.loadStatus = "";

  if($scope.userInSession == null)
  {
    growl.error("Redirecting to home" ,{title: 'You Are Not Authenticated to Add New Product'});              
    $state.go("home");
  }
  if($scope.userInSession != null)
  {
    if($scope.userInSession.user_type > USER_TYPE.STOCKIST)
    {
      growl.error("Redirecting to home" ,{title: 'You Could Not Add New Product'});              
      $state.go("home");
    }
  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 
  function initEditProduct(id)
  {
    if(checkAuthentication())
    {
      getShowProductById(id); 
    }
    else
    {
      growl.error('Redirecting..',{title: 'You are not authenticated to edit this product!'});
      $state.go("myProducts");
    }
  }
  
  function checkAuthentication()
  {
    if($scope.userInSession.user_id == $scope.product_user_id)
    {
      return true;
    }
  }

  function getShowProductById(id)
  {
    BackandService.getShowProductById(id).then(function(result){
      console.log("Data from show object");

      $scope.newProduct = result.data[0];
      $scope.oldProduct = result.data[0];

      $scope.oldImageSrc = $scope.newProduct.picture;
      $scope.imageSrc = $scope.newProduct.picture;
      
      $scope.progress = 100;

    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed to open product editor!");
    });
  }

  $scope.editProduct = function(){

    //kena check for all attributes


    $scope.loading = true;
    $scope.newProduct.updated_at = BackandService.getTimestampinMysql();

    if($scope.oldImageSrc == $scope.imageSrc) 
    {
      editRecord();
    }
    else
    {
      if($scope.file == null)
      {
        $scope.newProduct.picture = PICTURE_CONSTANT.UNAVAILABLE;
        editRecord();
      }
      else
      {
        uploadFileDropbox();
      }
    }


  }

  function editRecord(){
    $scope.loadStatus = "Editing old record in database"

    //$scope.newProduct.user_id = $scope.userInSession.user_id;
    console.log($scope.newProduct);

    BackandService.
    editProductById($scope.newProduct.id,
                $scope.newProduct.name,
                $scope.newProduct.category,
                $scope.newProduct.price_per_unit,
                $scope.newProduct.description,
                $scope.newProduct.picture,
                $scope.newProduct.updated_at)
    .then(function(result){

      console.log("Result From Editing old Product");
      console.log(result);      

      if(result.status == 200)
      {
        growl.success("Redirecting to product page" ,{title: 'Successfully Added New Product!'});              
        $state.go("myProducts");
      }
      $scope.loading = false;

    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed to edit product");
    });

  }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  function sizeInMB(size)
  {
    return size / 1000000;
  }

  $scope.removePicture = function () {
    $scope.filePath = null;
    $scope.fileToUpload = {};

    $scope.file = null;
    $scope.imageSrc = null;
    $scope.progress = null;
  }

$scope.loadImage = false;

$scope.addPicture = function(){
  $scope.loadImage = true;

  var f = document.getElementById('file').files[0];
  var r = new FileReader();

  r.onloadend = function(e){
    var data = e.target.result;
    $scope.file = f;
    $scope.loadImage = false;
    previewFile();
  }
  
  r.readAsBinaryString(f);
}

  function previewFile(){
    if($scope.file == null)
    {
      $scope.removePicture();
      return;
    }

    else if(!$scope.file.type.includes("image"))
    {
      growl.error('File uploaded is not an image. Please try again',{title: 'Error Upload Image!'});
      $scope.file = null;
      return;
    }
    else if(sizeInMB($scope.file.size) > $scope.imageSizeLimit)
    {
      growl.error('Image Size is Too Large. Please try again',{title: 'Error Upload Image!'});
      $scope.file = null;
      return;
    }

    //console.log($scope.file);
    $scope.progress = null;


    FileReaderService.readAsDataURL($scope.file, $scope).then(function(result) {
        $scope.imageSrc = result;
        //console.log("RESULT FROM READ URL :" +result);
      });
    };
 
  $scope.$on("fileProgress", function(e, progress) {
      $scope.progress = (progress.loaded / progress.total)*100;
  });


 function getShareLinkDropbox(filePath){
    $scope.loadStatus = "Getting link for the saved image."

    DropboxService.getShareLink(filePath).then(function(result){
      console.log("Result From Get Share Link From Dropbox");
      console.log(result);      
      
      if(result.status == 200)
      {
        //console.log(result.data.url);
        //result.data.url -> https://www.dropbox.com/s/a2hhhx67zuwol7f/supplier1_2016-06-07-09-12-55.jpeg?dl=0
        var temp = result.data.url.split(/[ ?]+/)[0];
        $scope.newProduct.picture = temp+"?raw=1"; //picture <- https://www.dropbox.com/s/a2hhhx67zuwol7f/supplier1_2016-06-07-09-12-55.jpeg?raw=1
        console.log($scope.newProduct.picture);
      }
      else
      {
        $scope.newProduct.picture = PICTURE_CONSTANT.UNAVAILABLE;
      }
      

      if($scope.state == "editProduct")
      {
        editRecord();
      }

      if($scope.state == "addProduct")
      {
        addRecord();
      }

    });  
 }

  function uploadFileDropbox(){ 
    $scope.loadStatus = "Saving image of your new product. Might be a while depending on the size of the image"

    var filePath = "img/"+ generateProductName();
    var file = $scope.file;
    //console.log($scope.file.name);

    DropboxService.uploadFile(filePath,file).then(function(result){

      console.log("Result From Upload Image to Dropbox");
      console.log(result);      

      if(result.status == 200)
      {
        getShareLinkDropbox(filePath);
      }

    });  
  }  

  function addRecord(){
    $scope.loadStatus = "Creating new record in database"

    $scope.newProduct.user_id = $scope.userInSession.user_id;

    console.log($scope.newProduct.user_id);
    console.log($scope.newProduct.name);
    console.log($scope.newProduct.category);
    console.log($scope.newProduct.description);
    console.log($scope.newProduct.picture);
    console.log($scope.newProduct.price_per_unit);
    console.log($scope.newProduct.custom_pricing);
    console.log($scope.newProduct.specification);
    $scope.loading = false;

    BackandService.addObject("products",$scope.newProduct).then(function(result){

      console.log("Result From Creating new Product");
      console.log(result);      

      if(result.status == 200)
      {
        growl.success("Redirecting to product page" ,{title: 'Successfully Added New Product!'});              
        $state.go("myProducts");
      }
    });

  }

  function generateProductName()
  {
    //supplier<id>_<create_at>
    var imageType = $scope.file.type.split(/[ /]+/)[1];
    var timeStamp = PublicService.getTimestampForFileName($scope.newProduct.created_at);

    var productName = "user"+$scope.userInSession.user_id +"_"+ timeStamp + "." + imageType;
    console.log(productName);
    return productName
  }

  $scope.createNewProduct = function (){
    
    $scope.loading = true;

    $scope.newProduct.created_at = BackandService.getTimestampinMysql();
    $scope.newProduct.updated_at = BackandService.getTimestampinMysql();

    if($scope.file == null)
    {
      $scope.newProduct.picture = PICTURE_CONSTANT.UNAVAILABLE;
      addRecord();
    }
    else
    {
      uploadFileDropbox();
    }
  };

});


myApp.controller('ShowProductListController', function($scope,USER_TYPE,USER_LINK_TYPE,$stateParams, BackandService,PublicService,$state){

  $scope.userObject = {};
  $scope.userObject.id = $stateParams.user_id;
  $scope.productList = {};
  $scope.showItem = {};
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  getUserNameById($scope.userObject.id);
  getAllProductByUserId($scope.userObject.id);

  function getUserNameById(id){
    BackandService.getUserNameById(id).then(function(result){
      console.log(result);
      $scope.userObject.user_name = result.data[0].user_name;

    });
  }

  function getAllProductByUserId(user_id){

    BackandService.getAllProductByUserId(user_id).then(function(result){

      console.log("Result From getAllProductByUserId");
      console.log(result);  
      $scope.productList = result.data;    
      $scope.loading = false;

    });

  }

  $scope.toggleItem = function(item) {
    //getProductbyId(item.product_id);
    if($scope.linked == null)
    {
      checkIsUserLinked($scope.userObject.id,$scope.userInSession.user_id);
    }

    if ($scope.isItemShown(item)) 
    {
      $scope.showItem = null;
    } 
    else 
    {
      $scope.showItem = item;
      $scope.timeAgo = PublicService.getAgoTime(item.updated_at);
    }

  };

  $scope.isItemShown = function(item) {
    return $scope.showItem === item;
  };

  /////////////////////// action button
  $scope.linked = null;

  function checkIsUserLinked(user1,user2)
  {
    BackandService.getLinkByFromIdToIdType(user1, user2, USER_LINK_TYPE.LINKED).then(function(result){
      console.log("getLinkByFromIdToIdType");
      if(result.status == 200)
      {
        //console.log(result.data.length);
        if(result.data.length > 0)
        {
          $scope.linked = true;
        }
        else
        {
          $scope.linked = false;
        }
      }
    });      
  }
  
});