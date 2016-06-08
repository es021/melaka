var myApp = angular.module('sample.products', [
  'ui.router',
  'auth0'
]);

myApp.config(function($stateProvider,$urlRouterProvider, authProvider) {

  $stateProvider
    .state('myProducts', {
      url: '/myProducts',
      controller: 'ProductController',
      templateUrl: 'products/myProducts.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('addProduct', {
      url: '/addProduct',
      controller: 'AddProductController',
      templateUrl: 'products/addProduct.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('showProduct', {
      url: '/showProduct',
      controller: 'ShowProductController',
      templateUrl: 'products/showProduct.html',
      params : {
        product_id : 0
      },
      data: {
        requiresLogin: false
      }
  });

});

myApp.controller('ProductController', function(auth, $scope, $state, BackandService){

  $scope.myProductsObject = {};

  if(auth.isAuthenticated)
  {
    $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
    $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
    getProductBySupplierId($scope.userInSession.supplier_id);
  }

  $scope.addProduct = function(){
    console.log("Add Product Page");
    $state.go("addProduct");
  }


  $scope.showProduct = function(product_id)
  {
    $state.go('showProduct', {product_id:product_id});
  };

  function getProductBySupplierId(supplier_id){

    BackandService.getProductBySupplierId(supplier_id).then(function(result){

      console.log("Result From getProductBySupplierId");
      console.log(result);  
      $scope.myProductsObject = result.data;    

      if(result.status == 200)
      {

      }

    });

  }


});

myApp.controller('ShowProductController', function($scope, BackandService, $state, $stateParams, growl){
  $scope.showObject = {};
  $scope.productId = $stateParams.product_id;
  $scope.loading = false;

  function getObjectById(objectName,id)
  {
    BackandService.getObjectById(objectName,id).then(function(result){
    console.log("Data from show object");
    $scope.showObject = result.data;
    console.log($scope.showObject);

    });
  }

  getObjectById("products",$scope.productId);

  $scope.editProduct = function(){
    $scope.loading = true;
  };

  $scope.deleteProduct = function(){ 
    $scope.loading = true;
    BackandService.deleteObject("products",$scope.showObject.id).then(function(result){
      console.log("Data from delete products object");
      console.log(result);

      if(result.status == 200)
      {
        growl.success($scope.showObject.name+" Deleted" ,{title: 'Successfully Delete One Product!'});
        $scope.loading = true;
        $state.go('myProducts');
      }
    });
  };

});

myApp.controller('AddProductController', function($scope, BackandService, DropboxService, PublicService,FileReaderService, auth, $state,growl, PICTURE_CONSTANT){
  
  //MB
  $scope.imageSizeLimit = 2;
  
  $scope.newProduct = {};
  $scope.filePath = null;
  $scope.fileToUpload = {};

  $scope.file = null;
  $scope.imageSrc = null;
  $scope.progress = null;

  $scope.loading = false;
  $scope.loadStatus = "";

  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));

  if($scope.userInSession == null)
  {
    growl.error("Redirecting to home" ,{title: 'You Are Not Authenticated to Add New Product'});              
    $state.go("home");
  }
  if($scope.userInSession != null)
  {
    if($scope.userInSession.user_type != "supplier")
    {
      growl.error("Redirecting to home" ,{title: 'Agent Could Not Add New Product'});              
      $state.go("home");
    }
  }

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

  $scope.previewFile = function () {

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

    console.log($scope.file);
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
      
      addRecord();


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

    $scope.newProduct.supplier_id = $scope.userInSession.supplier_id;
    //$scope.newProduct.created_at = BackandService.getTimestampinMysql();

    console.log($scope.newProduct.supplier_id);
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

    var productName = "supplier"+$scope.userInSession.supplier_id +"_"+ timeStamp + "." + imageType;
    console.log(productName);
    return productName
  }

  $scope.createNewProduct = function (){
    
    $scope.loading = true;

    $scope.newProduct.created_at = BackandService.getTimestampinMysql();
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
