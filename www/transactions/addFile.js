
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////// AddFileController  ////////////////////////////////////////////////////////////////////////////////////////////
///////////////// AddFileController  ////////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('AddFileController', function($scope,$http, $stateParams, USER_TYPE, BackandService, DropboxService, PublicService,FileReaderService, auth, $state,growl, PICTURE_CONSTANT){
  
  
  $scope.imageSizeLimit = 2;

  $scope.filePath = null;
  $scope.fileToUpload = {};

  $scope.file = null;
  $scope.filedata = null;
  $scope.imageSrc = null;
  $scope.progress = null;

  $scope.loading = false;
  $scope.loadStatus = "";

  $scope.file_link = "";


  
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

$scope.loadFile = false;

$scope.addPicture = function(){
  $scope.loadFile = true;

  var f = document.getElementById('file').files[0];
  var r = new FileReader();

  r.onload = function(e){
    $scope.filedata = e.currentTarget.result;
    $scope.filename = f.name;

    $scope.file = f;
    $scope.loadFile = false;
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

    var filename = generateFileName();
    var filedata = $scope.filedata;

      BackandService.uploadFile(filename,filedata).then(function(result){

          console.log("Result From Upload Image to Backand");
          console.log(result);      

          if(result.status == 200)
          {
            $scope.file_link = result.data.url;
          }

        },function errorCallback(result){
            console.log(result);
        });  

  }  

 
  function generateFileName()
  {
    //supplier<id>_<create_at>
    var imageType = $scope.file.type.split(/[ /]+/)[1];
    var timeStamp = PublicService.getTimestampForFileName($scope.newProduct.created_at);

    var productName = "user"+$scope.userInSession.user_id +"_"+ timeStamp + "." + imageType;
    console.log(productName);
    return productName
  }

});
