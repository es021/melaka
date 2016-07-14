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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// MyProductController  ////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// MyProductController  ////////////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('MyProductController', function(auth,PublicService,growl,$location,$stateParams, $scope, $state, BackandService,USER_TYPE){

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

  $scope.refresh = function()
  {
    console.log("Refresh");
    getAllProductByUserId($scope.userInSession.user_id);
    growl.info('List is up to date',{title: 'Refresh List!'});
  }

  $scope.addProduct = function(){
    console.log("Add Product Page");
    $state.go("addProduct");
  }

  $scope.editProduct = function(id,user_id){
    console.log("Edit Product Page");
    $state.go("editProduct",{id:id , user_id:user_id});
  }

  $scope.showProduct = function(id){
    console.log("Show Product Page");
    $state.go("showProduct",{product_id:id , show:'info'});
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// ShowProductController  //////////////////////////////////////////////////////////////////////////////////////////////
///////////////// ShowProductController  //////////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('ShowProductController', function($scope,$ionicPopup, $location, PublicService,BackandService,NOTI_CATEGORY, $state, $stateParams, growl, TRANS_STATUS, USER_LINK_TYPE){
  $scope.showObject = null;

  $scope.productId = $stateParams.product_id;
  $scope.show = $stateParams.show;

  $scope.loading = false;
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));


  ///// FOR REQUEST FORM ///////////////////////////
  $scope.newRequest = {};
  $scope.newRequest.total_price = 0;
  $scope.loadingRequest = false;

  console.log("here");
  getShowProductById($scope.productId);

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

        BackandService.createNotification(result.data.to_user_id,
                                          "New product request from "+$scope.userInSession.first_name,
                                          "/showTransaction?id="+result.data.id+"&other_user_id="+$scope.userInSession.user_id,
                                          NOTI_CATEGORY.PRODUCT);
      }

      $scope.loadingRequest = false;
    },function errorCallback(error){
        PublicService.errorCallbackFunction(error,"Failed to Send Request");
        $scope.loadingRequest = false;
    });

  }

  ////////////////////////////////////////////////
  ///// FOR TAB //////////////////////////////////

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
  /////////////////////////////////////////////


  function getShowProductById(id)
  {
    BackandService.getShowProductById(id).then(function(result){
      console.log("Data from show object");

        $scope.showObject = result.data[0];
        console.log(result);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// AddEditProductController  ////////////////////////////////////////////////////////////////////////////////////////////
///////////////// AddEditProductController  ////////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('AddEditProductController', function($scope,$http, $stateParams, USER_TYPE, BackandService, DropboxService, PublicService,FileReaderService, auth, $state,growl, PICTURE_CONSTANT){
  
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
  $scope.filedata = null;
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

  //////////////////////////////////////////////////////
  ///////////////// CUSTOM PRICING  ////////////////////
  ///////////////// CUSTOM PRICING  ////////////////////

  $scope.hasCustomPricing = false;
  $scope.customPricingDone = false;

  $scope.showCustomPricingForm = false;
  $scope.showCustomPricingFormEdit = false;
  $scope.showCustomPricingFormLast = false;

  $scope.newCustomPricing = {};
  $scope.tempCustomPricing = {};
  $scope.editIndex = 0;

  $scope.customPricingList = [];
  $scope.index = 0;
  $scope.newCustomPricing.from = 0;
  $scope.doneErrorMessageList = [];

  $scope.toggleShowCustomPricingForm = function()
  {
    if($scope.showCustomPricingForm)
    {
      $scope.showCustomPricingForm = false;
    }
    else
    {
      $scope.showCustomPricingForm = true;
    }
  } 

  //open the form
  $scope.customPricingOperation = function (operation,index)
  {
    if(operation == 'cancel')
    {
      $scope.showCustomPricingForm = false;
      $scope.showCustomPricingFormEdit = false;
      $scope.showCustomPricingFormLast = false;
    }

    if(operation == 'add')
    {
      $scope.showCustomPricingForm = true;
      $scope.showCustomPricingFormEdit = false;
      $scope.showCustomPricingFormLast = false;

    }

    if(operation == 'addLast')
    {
      $scope.showCustomPricingForm = false;
      $scope.showCustomPricingFormEdit = false;
      $scope.showCustomPricingFormLast = true;
      $scope.newCustomPricing.to = "Infinity"
    }

    if(operation == 'edit')
    {
      $scope.showCustomPricingForm = false;
      $scope.showCustomPricingFormEdit = true;
      $scope.showCustomPricingFormLast = false;

      $scope.tempCustomPricing = JSON.parse(JSON.stringify($scope.customPricingList[index]));
      
      $scope.editIndex = index;
    }
  } 

  $scope.removeLastCustomPrice = function()
  {
    $scope.customPricingList.pop();
    $scope.index --;

    var newFrom = 0;
    if($scope.customPricingList.length > 0)
    {
      newFrom = $scope.customPricingList[$scope.index-1].to + 1;
    }

    $scope.customPricingDone = false;

    $scope.newCustomPricing = {};
    $scope.newCustomPricing.from = newFrom;
  }

  $scope.editCustomPricing = function (index)
  {
    if(!validateCustomPricing($scope.tempCustomPricing,"edit"))
      return;

    console.log("edit success "+ $scope.editIndex);
    $scope.customPricingList[$scope.tempCustomPricing.index] = JSON.parse(JSON.stringify($scope.tempCustomPricing));
    $scope.customPricingOperation('cancel',0);


    if($scope.customPricingDone)
    {
      checkCustomPricingList();
    }

   }

   function checkCustomPricingList()
   {
      var prevTo = 0;
      var isGood = true;
      var message = "";
      $scope.doneErrorMessageList = [];

      if($scope.customPricingList[0].from != 0)
      {
        isGood = false;
        message = "The quantity did not start from 0";
        $scope.doneErrorMessageList.push(message);;
      }

      for(var i = 0; i<$scope.customPricingList.length; i++)
      {
        console.log($scope.customPricingList[i]);

        if( (i!=0) && (($scope.customPricingList[i].from - prevTo) != 1) )
        {
          isGood = false;
          message = "There is a loop hole between "+ i + " and " + (i+1);
          message += " [" + prevTo + "..." +$scope.customPricingList[i].from + "]";
          $scope.doneErrorMessageList.push(message);
        }

        if(i == $scope.customPricingList.length-1 && $scope.customPricingList[i].to != "Infinity")
        {
          isGood = false;
          message = "The quantity did not end with 'Infinity'";
          $scope.doneErrorMessageList.push(message);
        }

        prevTo = $scope.customPricingList[i].to;
      }

      console.log($scope.doneErrorMessageList);

   }

  function validateCustomPricing(price,operation)
  {
    var isValid = true;
    var errorMessage = "";

    console.log(price);

    //basic validation
    if(price.from > price.to)
    {
      isValid = false;
      errorMessage = "[To] cannot be smaller than [From]";
    }    

    if(price.from == price.to)
    {
      isValid = false;
      errorMessage = "[To] cannot be same with [From]";
    }

    //for edit need to check previous and after
    if(operation == "edit")
    {

      if(price.index != 0) // ada prev
      {
        if(price.from <=  $scope.customPricingList[price.index - 1].to)
        {
          isValid = false;
          errorMessage = "[From] cannot be smaller than [To] of previous";
        }
      } 

      if(price.index != $scope.customPricingList.length - 1) // ada next
      {
        if(price.to >=  $scope.customPricingList[price.index + 1].from)
        {
          isValid = false;
          errorMessage = "[To] cannot be larger than [From] of next";
        }
      } 
      
    }


    if(!isValid)
    {
      growl.error(errorMessage+"" ,{title: 'Invalid Pricing'});    
         console.log(isValid);
    console.log(errorMessage);          
      return;
    }

    return isValid;
  }

  $scope.addCustomPricing = function()
  {  
    if(!validateCustomPricing($scope.newCustomPricing,"add"))
      return;

    $scope.newCustomPricing.index = $scope.index;
    $scope.index ++;

    var newCustomPricing = $scope.newCustomPricing;
    $scope.customPricingList.push(newCustomPricing);

    var newFrom = $scope.newCustomPricing.to + 1;
    
    $scope.newCustomPricing = {};
    $scope.newCustomPricing.from = newFrom;

    if($scope.showCustomPricingFormLast)
    {
      $scope.customPricingDone = true;
    }
       
    $scope.customPricingOperation('cancel',0);

    if($scope.customPricingDone)
    {
      checkCustomPricingList();
    }

  }

  $scope.removeCustomPricing= function(index)
  {
    $scope.newCustomPricing.index = $scope.index;
  }
 
  ///////////////// CUSTOM PRICING  //////////////////////////////
  ///////////////// CUSTOM PRICING  //////////////////////////////
  ////////////////////////////////////////////////////////////////

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
      
      if($scope.oldProduct.custom_pricing != "")
      {
        console.log("getting custom price edit");
        $scope.customPricingList = JSON.parse($scope.oldProduct.custom_pricing);
        $scope.hasCustomPricing = true;
        $scope.customPricingDone = true;
      }

      $scope.progress = 100;

    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed to open product editor!");
    });
  }


  $scope.toogleHasCustomPricing = function(){
    if($scope.hasCustomPricing)
      $scope.hasCustomPricing = false;
    else
      $scope.hasCustomPricing = true;

    console.log($scope.hasCustomPricing);
  }

  $scope.editProduct = function(){

    //kena check for all attributes


    $scope.loading = true;
    $scope.newProduct.updated_at = BackandService.getTimestampinMysql();
    console.log($scope.hasCustomPricing);

    if($scope.hasCustomPricing)
    {
      $scope.newProduct.custom_pricing = JSON.stringify($scope.customPricingList);
      $scope.newProduct.price_per_unit = 0.00;
    }
    else
    {
      $scope.newProduct.custom_pricing = null;
    }

    console.log($scope.newProduct);

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
        uploadFileBackand();
      }
    }


  }

  function editRecord(){
    $scope.loadStatus = "Editing Your Profile Now"
    $scope.loadingEdit = true;
    //$scope.newProduct.user_id = $scope.userInSession.user_id;

    console.log($scope.newProduct);

    BackandService.
    editProductById($scope.newProduct.id,
                $scope.newProduct.name,
                $scope.newProduct.category,
                $scope.newProduct.price_per_unit,
                $scope.newProduct.description,
                $scope.newProduct.picture,
                $scope.newProduct.custom_pricing,
                $scope.newProduct.updated_at)
    .then(function(result){

      console.log("Result From Editing old Product");
      console.log(result);      

      if(result.status == 200)
      {
        growl.success("Redirecting to product page" ,{title: 'Successfully Added New Product!'}); 
        $scope.loadingEdit = false;             
        $scope.loading = false;             
        $state.go("myProducts",{refresh:'y'});
      }
      
    },function errorCallback(error){
      PublicService.errorCallbackFunction(error,"Failed to edit product");
    });

  }

///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////
  
  function sizeInMB(size)
  {
    return size / 1000000;
  }

  $scope.removePicture = function () {
    $scope.filePath = null;
    $scope.fileToUpload = {};

    $scope.file = null;
    $scope.filedata = null;
    $scope.imageSrc = null;
    $scope.progress = null;
  }

$scope.loadImage = false;

$scope.addPicture = function(){
  $scope.loadImage = true;

  var f = document.getElementById('file').files[0];
  var r = new FileReader();

  r.onload = function(e){
    $scope.filedata = e.currentTarget.result;
    $scope.filename = f.name;

    $scope.file = f;
    $scope.loadImage = false;
    previewFile();
  }
  
  //r.readAsBinaryString(f);
   r.readAsDataURL(f);
}

function tinify(){
    $http ({
        method: 'POST',
        url: 'https://api.tinify.com/shrink',
        Authorization: 'XCi84z1igNgjjp0hDh_QuT-gol_ePm1r',
        data: $scope.file
        });
}

  function previewFile(){
    console.log($scope.file);
    console.log($scope.file.type.split("/")[0] == "image");

    if($scope.file == null)
    {
      $scope.removePicture();
      return;
    }
    else if(!$scope.file.type.split("/")[0] == "image")
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


  function uploadFileBackand(){ 
    $scope.loadStatus = "Saving image of your new product. Might be a while depending on the size of the image"

    var filename = generateProductName();
    var filedata = $scope.filedata;

      BackandService.uploadFile(filename,filedata).then(function(result){

          console.log("Result From Upload Image to Backand");
          console.log(result);      

          if(result.status == 200)
          {
            $scope.newProduct.picture = result.data.url;

            if($scope.state == "editProduct")
            {
              editRecord();
            }

            if($scope.state == "addProduct")
            {
              addRecord();
            }
          }

        },function errorCallback(result){
            console.log(result);
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
        $state.go("myProducts",{refresh:'y'});
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

    if($scope.hasCustomPricing)
    {
      $scope.newProduct.custom_pricing = JSON.stringify($scope.customPricingList);
      $scope.newProduct.price_per_unit = 0.00;
    }
    else
    {
      $scope.newProduct.custom_pricing = "";
    }

    if($scope.file == null)
    {
      $scope.newProduct.picture = PICTURE_CONSTANT.UNAVAILABLE;
      console.log($scope.newProduct);
      addRecord();
    }
    else
    {
      uploadFileBackand();
    }
  };

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// ShowProductListController  ////////////////////////////////////////////////////////////////////////////////////////////
///////////////// ShowProductListController  ////////////////////////////////////////////////////////////////////////////////////////////

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