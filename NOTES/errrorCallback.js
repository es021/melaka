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