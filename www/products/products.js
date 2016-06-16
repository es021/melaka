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
      url: '/showProduct?product_id',
      controller: 'ShowProductController',
      templateUrl: 'products/showProduct.html',
      /*params : {
        product_id : 0
      },
      */
      data: {
        requiresLogin: false
      }
  });

});

myApp.controller('ProductController', function(auth,$location, $scope, $state, BackandService){

  $scope.myProductsObject = {};
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.loading = false;

  if($scope.authProfile != null && $state.current.name == "myProducts")
  {
    $scope.loading = true;
    $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
    getProductBySupplierId($scope.userInSession.supplier_id);
  }

  $scope.addProduct = function(){
    console.log("Add Product Page");
    $state.go("addProduct");
  }


  $scope.showProduct = function(product_id)
  {
    $location.url("/showProduct?product_id="+product_id);
  };

  function getProductBySupplierId(supplier_id){

    BackandService.getProductBySupplierId(supplier_id).then(function(result){

      console.log("Result From getProductBySupplierId");
      console.log(result);  
      $scope.myProductsObject = result.data;    
      $scope.loading = false;

    });

  }
});

myApp.controller('ShowProductController', function($scope,$ionicPopup, $location, BackandService, $state, $stateParams, growl, TRANS_STATUS, USER_LINK_TYPE){
  $scope.showObject = {};

  $scope.productId = $stateParams.product_id;
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
    $scope.newRequest.agent_id = $scope.userInSession.agent_id;
    $scope.newRequest.supplier_id = $scope.showObject.supplier_id;
    $scope.newRequest.product_id = $scope.productId;
    $scope.newRequest.status = TRANS_STATUS.REQUESTED;
    $scope.newRequest.payment_status = TRANS_STATUS.NOT_PAID;
    $scope.newRequest.created_at = BackandService.getTimestampinMysql();
    $scope.newRequest.updated_at = BackandService.getTimestampinMysql();
    $scope.newRequest.supplier_name = $scope.showObject.supplier_name;
    $scope.newRequest.agent_name = $scope.authProfile.nickname;
    $scope.newRequest.product_name = $scope.showObject.name;

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
    });

  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///// FOR TITLE /////////////////////////////////////////////////////////////////////////////////  
  $scope.showSupplier = function()
  {
    $location.url("/showSupplier?id="+$scope.showObject.supplier_id+"&objectName=suppliers");
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  ///// FOR TAB /////////////////////////////////////////////////////////////////////////////////
  $scope.show = "info";
  $scope.authenticated = false;
  $scope.linkedAgent = false;
  function checkAuthentication()
  {
    if($scope.userInSession.supplier_id == $scope.showObject.supplier_id)
    {
      $scope.authenticated = true;
    }
  }

  function checkLinkedAgent()
  {
    if($scope.userInSession.user_type == "agent")
    {
      BackandService.getLinkByAgentIdSupplierIdType($scope.userInSession.agent_id, $scope.showObject.supplier_id, USER_LINK_TYPE.LINKED).then(function(result){
        console.log("getLinkByAgentIdSupplierIdType");
        if(result.status == 200)
        {
          //console.log(result.data.length);
          if(result.data.length > 0)
          {
            $scope.linkedAgent = true;
          }
        }
      });      
    }
  }

  $scope.showFunction = function(show)
  {
    $scope.show = show;   
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////


  function getObjectById(objectName,id)
  {
    BackandService.getObjectById(objectName,id).then(function(result){
      console.log("Data from show object");

        $scope.showObject = result.data;
        console.log($scope.showObject);

        if(result.status == 200 && $scope.showObject != null)
        {
          if($scope.userInSession != null)
          {
            checkAuthentication();
            checkLinkedAgent();
          }
        }
      
    });
  }

  getObjectById("products",$scope.productId);

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
        $state.go('myProducts');
      }

      $scope.loading = false;
    
    }, function errorCallback (result){
        growl.error("There is one or more transactions associated with this product" ,{title: 'Failed to delete this product'});
        console.log(result);
        $scope.loading = false;
    });
  };


});

myApp.controller('AddProductController', function($scope, BackandService, DropboxService, PublicService,FileReaderService, auth, $state,growl, PICTURE_CONSTANT){
  
  //MB
  $scope.imageSizeLimit = 2;
  $scope.supplierName = "";
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
    else //supplierName
    {
      getSupplierNameById($scope.userInSession.supplier_id);
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

$scope.loadImage = false;

$scope.add = function(){

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
    $scope.newProduct.supplier_name = $scope.supplierName;
    //$scope.newProduct.created_at = BackandService.getTimestampinMysql();

    console.log($scope.newProduct.supplier_id);
    console.log($scope.newProduct.supplier_name);
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

  function getSupplierNameById(id)
  {
        BackandService.getSupplierNameById(id).then(function(result){

        console.log("Result From getSupplierNameById");
        console.log(result);      

        if(result.status == 200)
        {
          $scope.supplierName = result.data[0].first_name +" "+result.data[0].last_name;
        }

      });
  }

});
