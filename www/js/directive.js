
var myApp = angular.module('sample.directive', [
  'ui.router',
  'backand'
]);

myApp.directive('fileInput', ['$parse',function($parse){
  console.log("init directive");

  return {
          restrict: "EA",
          template: "<input type='file' />",
          replace: true,          
          link: function (scope, element, attrs) {
   
              var modelGet = $parse(attrs.fileInput);
              var modelSet = modelGet.assign;
              var onChange = $parse(attrs.onChange);
   
              var updateModel = function () {
                  console.log("update model");
                  scope.$apply(function () {
                      modelSet(scope, element[0].files[0]);
                      onChange(scope);
                      //console.log(scope.file);
                  });                    
              };
               
              element.bind('change', updateModel);
          }
        }
}]);
