var myApp = angular.module('sample.transactions', [
  'ui.router',
  'backand',
  'auth0'
]);

myApp.config(function($stateProvider, BackandProvider) {
  $stateProvider
    .state('myActiveListing', {
      url: "/myActiveListing?pageNumber&refresh",
      controller: 'TransactionsController',
      templateUrl: 'transactions/myActiveListing.html',
      data: {
        requiresLogin: true
      }
    });  

    $stateProvider
    .state('myCompletedTransaction', {
      url: "/myCompletedTransaction?pageNumber&refresh",
      controller: 'TransactionsController',
      templateUrl: 'transactions/myActiveListing.html',
      data: {
        requiresLogin: true
      }
    });

    $stateProvider
    .state('showTransaction', {
      url: "/showTransaction?id&other_user_id&show",
      controller: 'TransactionsController',
      templateUrl: 'transactions/showTransaction.html',
      data: {
        requiresLogin: true
      }
    });

});


myApp.controller('TransactionsController', function($state,OFFSET,$stateParams,growl,NOTI_CATEGORY,$ionicModal, $ionicPopup,$scope, BackandService,PublicService,FileReaderService, auth, TRANS_STATUS){
  
  $scope.authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
  $scope.activeListing = {};
  $scope.showItem = {};
  $scope.product_quantity = null;
  $scope.TRANS_STATUS = TRANS_STATUS;
  $scope.stateName = $state.current.name;
  $scope.loading = false;
  $scope.show = 'info';

  $scope.pageNumber = $stateParams.pageNumber;
  console.log($scope.pageNumber);
  $scope.OFFSET = OFFSET;
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  //////////  Main Listing /////////////////////////////////////////////////////////////////////////

  main();

  function main()
  {
    if($scope.authProfile != null && $scope.userInSession != null)
    {
      $scope.loading = true;
      if($state.current.name == "myActiveListing")
      {
        getUserActiveListing($scope.userInSession.user_id);
      }

      if($state.current.name == "myCompletedTransaction")
      {
        getUserCompletedTransaction($scope.userInSession.user_id);
      }

      if($state.current.name == "showTransaction")
      {
        getTransById($stateParams.id,$stateParams.other_user_id);        
        if($stateParams.show != null)
        {
          $scope.show = $stateParams.show; 
          console.log($scope.show);
        }
      }
    }
  }


  $scope.showProduct = function()
  {
    $state.go('showProduct',{product_id:$scope.showItem.product_id,show:'info'})
  };

  $scope.openLink = function(link)
  {
    if(link == "delivery_detail"){
      link = $scope.showItem.delivery_detail;
    }

    if(link == "payment_detail"){
      link = $scope.showItem.payment_detail;
    }

    console.log(link);
    var win = window.open(link, '_blank');
    win.focus();
  }

  $scope.refresh = function(body)
  {
    console.log("Refresh");
    main();
    growl.info(body+' is up to date',{title: 'Refresh List!'});
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
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my Active Listing /////////////////////////////////////////////////////////////////////////
 
  function getUserActiveListing(user_id){
      BackandService.getUserActiveListing(user_id,$scope.pageNumber).then(function(result){
        $scope.activeListing = result.data;
        console.log($scope.activeListing);
        $scope.loading = false;
      });
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my COMPLETED TRANSACTION  /////////////////////////////////////////////////////////////////////////


  function getUserCompletedTransaction(user_id){
      BackandService.getUserCompletedTransaction(user_id,$scope.pageNumber).then(function(result){
        $scope.activeListing  = result.data;
        $scope.loading = false;
      });
  }  

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// Update Active Listing HELPER FUNCTION /////////////////////////////////////////////////////

  $scope.approveTrans = function(product_id)
  {
    //check the quantity of the product first
    BackandService.getProductQuantity(product_id).then(function(result){
      if(result.status == 200)
      {
        console.log(result);
        $scope.product_quantity = result.data[0].quantity;
        console.log($scope.product_quantity);
        if($scope.showItem.quantity <= $scope.product_quantity)
        {
          console.log("Valid to be approved");
          $scope.product_quantity -= $scope.showItem.quantity;
          console.log($scope.product_quantity);
          $scope.updateTrans($scope.showItem.id,"status",TRANS_STATUS.APPROVED);
        }
        else
        {
            growl.error("The quantity of product '"+$scope.showItem.product_name+"' is less than amount requested",
              {title: 'Failed to approve request!'});
        }
      }

    },function errorCallback(result) 
      {
        PublicService.errorCallbackFunction(result,"default");
      });

    
  }

  $scope.updateTrans = function(id,key,value)
  {
    console.log(id + " "+key+" "+value);
    var timeUpdated = BackandService.getTimestampinMysql();
    if(key == "status")
    {
      editTransactionStatus(id,value,timeUpdated);
    }
    if(key == "payment_status")
    {
      editTransactionPaymentStatus(id,value,timeUpdated);
    }
  }

  $scope.confirmDeleteTrans = function(id){

    function deleteTrans(id){
      BackandService.deleteObject("transactions",id).then(function(result){
          if(result.status == 200)
          {
            growl.success("Deleted Transaction "+id,{title: 'Successfully Removed Request!'});
            $state.go("myActiveListing",{pageNumber:1, refresh:'y'});
          }

        });
    }

    var confirmPopup = $ionicPopup.confirm({
       title: 'Remove This Request',
       template: 'Are you sure?'
     });
     
    confirmPopup.then(function(result) {
        if(result)
        {
          deleteTrans(id);
        }
     });
  }

 /*     "REQUESTED": 1,
        "DENIED": 2,
        "APPROVED": 3,
        "DELIVERED": 4,
        "RECEIVED": 5,
        "NOT_PAID" : 6,
        "PAID": 7,
        "COMFIRMED": 8*/

  function createNotificationTransaction(trans_id,key,value){

    var to_user_id = $scope.showItem.other_user_id;
    var text = "";
    var link = "/showTransaction?id="+trans_id+"&other_user_id="+$scope.userInSession.user_id;
    var category = 0;
    var other_user_name = $scope.userInSession.first_name;

    if(key == "status"){
      
      switch(value){
        case TRANS_STATUS.DENIED :
          text = other_user_name+" DENIED your product request";
          break;
        case TRANS_STATUS.APPROVED :
          text = other_user_name+" APPROVED your product request";
          break;
        case TRANS_STATUS.DELIVERED :
          text = other_user_name+" has DELIVERED your package";
          break;
        case TRANS_STATUS.RECEIVED :
          text = other_user_name+" has CONFIRMED package received";
          break;
      }

      category = NOTI_CATEGORY.TRANSACTION;
    }

    if(key == "payment_status"){
      
      switch(value){
        case TRANS_STATUS.PAID :
          text = other_user_name+" has PAID for the product request";
          break;
        case TRANS_STATUS.COMFIRMED :
          text = other_user_name+" has CONFIRMED payment received";
          break;
      }

      category = NOTI_CATEGORY.PAYMENT;
    }
    //console.log($scope.showItem);
    //console.log(to_user_id);

    postActionTransacation();

    BackandService.createNotification(to_user_id,text,link,category);
  }

  function postActionTransacation()
  {
      $scope.isNewProduct = false;
      $scope.oldProduct = {};
      $scope.newProduct = {};
      
      function createNotificationProduct(key,product_id,product_name){

            var to_user_id = $scope.showItem.from_user_id;
            var text = "";
            var link = "/showProduct?product_id="+product_id+"&show=info";
            var category = NOTI_CATEGORY.PRODUCT;
            var other_user_name = $scope.userInSession.first_name;

            if(key == "new"){
                text = "New product ["+product_name+"] has been added to your inventory.";
            }

            if(key == "update"){
               text = "Quantity product ["+product_name+"] has been updated.";
            }

            BackandService.createNotification(to_user_id,text,link,category);        
      }

      function getProductAndCreateProduct(product_id){
          BackandService.getObjectById("products",product_id).then(function(result){
            console.log("getObjectById");
            $scope.oldProduct = result.data;
            console.log($scope.showProduct);

            if(result.status == 200)
            {
              $scope.newProduct.user_id = $scope.showItem.from_user_id;
              $scope.newProduct.parent_id = $scope.showItem.product_id;
              $scope.newProduct.quantity = $scope.showItem.quantity;
              $scope.newProduct.created_at = $scope.showItem.updated_at;
              $scope.newProduct.updated_at = $scope.showItem.updated_at;

              $scope.newProduct.name = $scope.oldProduct.name;
              $scope.newProduct.category = $scope.oldProduct.category;
              $scope.newProduct.picture = $scope.oldProduct.picture;
              $scope.newProduct.description = $scope.oldProduct.description;
              $scope.newProduct.price_per_unit = $scope.oldProduct.price_per_unit;
              $scope.newProduct.custom_pricing = $scope.oldProduct.custom_pricing;
              $scope.newProduct.specification = $scope.oldProduct.specification;


              BackandService.addObject("products",$scope.newProduct).then(function (result){
                  console.log("addObject");
                  console.log(result); 
                  if(result.status == 200)
                  {
                    createNotificationProduct("new",result.data.id,result.data.name);
                  }              
              });
            }

          },function errorCallback(result){
            PublicService.errorCallbackFunction(result,"default");
          });
      }  

      function addNewProduct()
      {
        console.log("addNewProduct");
        getProductAndCreateProduct($scope.showItem.product_id);
      }

      function updateOldProduct()
      {
        console.log("updateOldProduct");
        var newQuantity = $scope.oldProduct.quantity + $scope.showItem.quantity;
        console.log(newQuantity);

        BackandService.editProductQuantity($scope.oldProduct.id,newQuantity).then(function(result){
          console.log("editProductQuantity");
          console.log(result);

          console.log(result.status == 200)
          {
              createNotificationProduct("update",$scope.oldProduct.id,$scope.oldProduct.name);
          }

        },function errorCallback(result){
            PublicService.errorCallbackFunction(result,"default");
        });
      }

      function checkIfNewProduct(user_id,parent_id){
        console.log("checkIfNewProduct")

          BackandService.getProductbyUserIdParentId(user_id,parent_id).then(function (result){

            console.log(result);

            if(result.status == 200)
            {
              if(result.data.length > 0)
              {
                $scope.isNewProduct = false;
                $scope.oldProduct = result.data[0];
                updateOldProduct();
              }
              else
              {
                $scope.isNewProduct = true;
                addNewProduct();
              }

            }

          },function errorCallback(result){
              PublicService.errorCallbackFunction(result,"default");
          });
      }

      console.log("postActionTransacation")

      if(($scope.showItem.type == "Delivery" && $scope.showItem.status == TRANS_STATUS.RECEIVED && $scope.showItem.payment_status == TRANS_STATUS.COMFIRMED) ||
        ($scope.showItem.type == "Pick Up" && $scope.showItem.status == TRANS_STATUS.APPROVED && $scope.showItem.payment_status == TRANS_STATUS.COMFIRMED))
      {
          checkIfNewProduct($scope.showItem.from_user_id,$scope.showItem.product_id);
      }

      else
      {
        console.log("Skipping");
      }
  }


  function editTransactionStatus(id,status,timeUpdated){
    BackandService.editTransactionStatus(id,status,timeUpdated).then(function(result){
        callback(id,result.status);

        if(result.status == 200)
        {
          $scope.showItem.status = status;
          createNotificationTransaction(id,"status",status);
          postTransStatusUpdateAction(status);
        }

      },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"Opps! Something went wrong")
      });
  }  

  function editTransactionPaymentStatus(id,payment_status,timeUpdated){
    BackandService.editTransactionPaymentStatus(id,payment_status,timeUpdated).then(function(result){
        callback(id,result.status);

        if(result.status == 200)
        {
          $scope.showItem.payment_status = payment_status;
          createNotificationTransaction(id,"payment_status",payment_status);
          postTransStatusUpdateAction(payment_status);
        }

      },function errorCallback(result){
        PublicService.errorCallbackFunction(result,"Opps! Something went wrong")
      });
  }

  function callback(id,status)
  {
      if(status == 200)
      {
          growl.success("Updated Transaction "+id,{title: 'Successfully Updated!'});
      }
      else
      {
          growl.error("Failed to update transactions "+id+". Please try again." ,{title: 'Error!'});
      }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// DETAILS HELPER FUNCTION  /////////////////////////////////////////////////////////////////////////

  $scope.requestDetail = function(type)
  {
    var confirmPopup = $ionicPopup.confirm({
         title: "Remind "+$scope.showItem.other_user_name,
         template: "to add a proof of "+type+"?"
       });
       
      confirmPopup.then(function(result) {
          if(result)
          {
            editTransDetailAndCreateNotification(type,"request","requested");   
          }
       });
  }


  function editTransDetailAndCreateNotification(type,edit_type,edit_value)
  {
      $scope.loadStatus = "Editing transaction record";
      $scope.loadingFile  = true;

      var to_user_id = $scope.showItem.other_user_id;
      
      var link = "/showTransaction?id="+$scope.showItem.id+"&other_user_id="+$scope.userInSession.user_id;
      var category = 0;
      var other_user_name = $scope.userInSession.first_name;
      var updated_at = PublicService.getTimestampinMysql();

      var text = "";
      
      if(edit_type == "request")
      {
        text = other_user_name +" request you to add a proof of "+type;
        link += "&show=add_"+type+"_detail"
      } 
           
      if(edit_type == "link")
      {
        text = other_user_name +" added a proof of "+type;
      }

      if(type == "delivery")
      {
        category = NOTI_CATEGORY.TRANSACTION;
        BackandService.editDeliveryDetailByTransId($scope.showItem.id,edit_value,updated_at).then(function(result){
          
          if(result.status == 200)
          {
            $scope.showItem.delivery_detail = edit_value;
            BackandService.createNotification(to_user_id,text,link,category);
            $scope.loadingFile  = false;
            $scope.show = 'info';
          }
        },function errorCallbackFunction(result){
            PublicService.errorCallbackFunction(result,"default");
            $scope.loadingFile  = false;
        });

      }
      
      if(type == "payment")
      {
        category = NOTI_CATEGORY.PAYMENT;
        BackandService.editPaymentDetailByTransId($scope.showItem.id,edit_value,updated_at).then(function(result){
          
          if(result.status == 200)
          {
            $scope.showItem.payment_detail = edit_value;
            BackandService.createNotification(to_user_id,text,link,category);
            $scope.show = 'info';
            $scope.loadingFile  = false;
          }

        },function errorCallbackFunction(result){
            PublicService.errorCallbackFunction(result,"default");
            $scope.loadingFile  = false;
       
        });

      }
  }

  $scope.setShow = function(show)
  {
    $scope.show = show;
  }

  function postTransStatusUpdateAction (status)
  {
    if(status == TRANS_STATUS.APPROVED)
    {
        console.log("post action");
        BackandService.editProductQuantity($scope.showItem.product_id,$scope.product_quantity).then(function(result){

        },function errorCallback(result){
            PublicService.errorCallbackFunction(result,"default");
        });

    }

    if(status == TRANS_STATUS.DELIVERED)
    {
      var confirmPopup = $ionicPopup.confirm({
         title: 'Delivery Status Successfully Updated',
         template: 'Do you want to upload a proof of delivery?'
       });
       
      confirmPopup.then(function(result) {
          if(result)
          {
            $scope.setShow('add_delivery_detail');
          }
       });
    } 

    if(status == TRANS_STATUS.PAID)
    {
      var confirmPopup = $ionicPopup.confirm({
         title: 'Payment Status Successfully Updated',
         template: 'Do you want to upload a proof of payment?'
       });
       
      confirmPopup.then(function(result) {
          if(result)
          {
            $scope.setShow('add_payment_detail');
          }
       });
    } 
  }




  //////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////// my OTHER HELPER FUNCTION  /////////////////////////////////////////////////////////////////////////
   $scope.showTransaction = function()
   {
      console.log($scope.showItem.id);
      $state.go("showTransaction",{id:$scope.showItem.id, other_user_id: $scope.showItem.other_user_id});
   }  

  function getTransById(trans_id,other_user_id){
      BackandService.getTransById(trans_id,other_user_id).then(function(result){
        $scope.showItem = result.data[0];
        console.log($scope.showItem);
        if(result.status == 200 && $scope.showItem != null)
        {
          $scope.showItem.delivery_address = JSON.parse($scope.showItem.delivery_address);
          console.log($scope.showItem);
          if($scope.showItem.payment_detail == '')
          {
            $scope.showItem.payment_detail = null;
          }

          if($scope.showItem.delivery_detail == '')
          {
            $scope.showItem.delivery_detail = null;
          }

          $scope.timeAgo = PublicService.getAgoTime($scope.showItem.updated_at);

          $scope.loading = false;

        }
      },function errorCallback(result){
          PublicService.errorCallbackFunction(result,"Opps! Something went wrong");
          $scope.loading = false;

      });
  }

  $scope.goTo = function (state)
  {
    $state.go(state);
  }

  $scope.toggleItem = function(item) {
    //console.log(item.product_id);
    //getProductbyId(item.product_id);

    if ($scope.isItemShown(item)) 
    {
      $scope.showItem = null;
    } 
    else 
    {
      $scope.timeAgo = PublicService.getAgoTime(item.updated_at);
      $scope.showItem = item;
    }

  };

  $scope.isItemShown = function(item) {
    return $scope.showItem === item;
  };  

  // ---------------------------------------------------------------------------------------------------------------------//
  // ---------------------------------------------------------------------------------------------------------------------//
  // ---------------------------------------------------------------------------------------------------------------------//
  // ADD FILE //
  // ADD FILE //
  // ADD FILE //

  $scope.imageSizeLimit = 2;

  $scope.filePath = null;
  $scope.fileToUpload = {};

  $scope.file = null;
  $scope.filedata = null;
  $scope.imageSrc = null;
  $scope.progress = null;

  $scope.filename = "";

  $scope.loadingFile = false;
  $scope.loadStatus = "";

  $scope.file_link = "";
  $scope.loadImage = false;


  
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
    console.log($scope.file.type);
    console.log($scope.file.type.split("/")[1]);
    if($scope.file == null)
    {
      $scope.removePicture();
      return;
    }
    else if($scope.file.type.split("/")[0] != "image" && $scope.file.type.split("/")[1] != "pdf")
    {
      growl.error('File uploaded is not an image or pdf. Please try again',{title: 'Error Upload File!'});
      $scope.file = null;
      return;
    }
    else if(sizeInMB($scope.file.size) > $scope.imageSizeLimit)
    {
      growl.error('File Size is Too Large. Please try again',{title: 'Error Upload File!'});
      $scope.file = null;
      return;
    }

    //console.log($scope.file);
    $scope.progress = null;

    FileReaderService.readAsDataURL($scope.file, $scope).then(function(result) {
        if($scope.file.type.split("/")[0] == "image")
        {
          $scope.imageSrc = result;
        }
      });
  };

  $scope.$on("fileProgress", function(e, progress) {
    $scope.progress = (progress.loaded / progress.total)*100;
  });

  function uploadFileBackand(type){ 
    $scope.loadStatus = "Saving file to the server. Might be a while depending on the size of the file."

    var filename = generateFileName(type);
    var filedata = $scope.filedata;

      BackandService.uploadFile(filename,filedata).then(function(result){

          console.log("Result From Upload Image to Backand");
          console.log(result);      

          if(result.status == 200)
          {
            $scope.file_link = result.data.url;
            editTransDetailAndCreateNotification(type,"link",$scope.file_link);   
          }

          $scope.loadingFile = false;

        },function errorCallback(result){
            console.log(result);
            $scope.loadingFile = false;
        });  

  }  
 
  function generateFileName(type)
  {
    //supplier<id>_<create_at>
    var fileType = $scope.file.type.split(/[ /]+/)[1];
    var timeStamp = PublicService.getTimestampForFileName(PublicService.getTimestampinMysql());

    var fileName = "transactions"+$scope.showItem.id +"_"+type+"_"+ timeStamp + "." + fileType;
    //console.log(productName);
    return fileName;
  }

  $scope.submitFile = function(type){
      $scope.loadingFile = true;
      var type = $scope.show.split("_")[1];
      console.log(type);
      uploadFileBackand(type);
  }



});

