var myApp = angular.module('sample.users', [
  'ui.router',
  'backand',
  'auth0',
  'ngCookies'
]);

myApp.config(function($stateProvider) {
  $stateProvider
    .state('agents', {
      url: '/agents',
      controller: 'UserController',
      templateUrl: 'users/agents.html',
      data: {
        requiresLogin: false
      }
    });

  $stateProvider
    .state('suppliers', {
      url: '/suppliers',
      controller: 'UserController',
      templateUrl: 'users/suppliers.html',
      data: {
        requiresLogin: false
      }
  });

  $stateProvider
    .state('allUsers', {
      url: '/allUsers',
      controller: 'UserController',
      templateUrl: 'users/allUsers.html',
      data: {
        requiresLogin: false
      }
  });


  $stateProvider
    .state('showAgent', {
      url: '/showAgent',
      controller: 'ShowUserController',
      templateUrl: 'users/showAgent.html',
      params : {
        id : 0,
        objectName : ""
      },
      data: {
        requiresLogin: false
      }
  });

  $stateProvider
    .state('showSupplier', {
      url: '/showSupplier',
      controller: 'ShowUserController',
      templateUrl: 'users/showSupplier.html',
      params : {
        id : 0,
        objectName : ""
      },
      data: {
        requiresLogin: false
      }
  }); 




  
});



myApp.controller('UserController', function($scope, BackandService, auth, $state, $stateParams){
  
  //console.log($state.current.name);

  $scope.agents = [];
  $scope.suppliers = [];
  $scope.name = "init";
  $scope.showObject = $stateParams.showObject;

  $scope.auth = auth;

  if(auth.isAuthenticated)
  {
    var userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
    if(userInSession != null)
    {
      $scope.agentId = userInSession.agent_id;
      $scope.supplierId = userInSession.supplier_id;
      $scope.userType = userInSession.user_type;
    }
  }

  function getAllObjects(objectName){
      BackandService.getAllObjects(objectName).then(function(result){
        console.log("Getting all "+objectName);
        if(objectName == "agents")
          $scope.agents = result.data.data;

        if(objectName == "suppliers")
          $scope.suppliers = result.data.data;


        //console.log(result.status);
        //console.log("Data from returned objects");
        //console.log(result.data.data);

      });
    }

  $scope.showObjectFunction = function(objectName, id)
  {
    if(objectName == "agents")
      $state.go('showAgent', {id:id, objectName:objectName});

    if(objectName == "suppliers")
      $state.go('showSupplier', {id:id, objectName:objectName});
  };

  if($state.current.name == "allUsers")
  {
    getAllObjects("agents");
    getAllObjects("suppliers");
  }

  if($state.current.name == "agents")
  {
    getAllObjects("agents");
  }

  if($state.current.name == "suppliers")
  {
    getAllObjects("suppliers");
  }



});

myApp.controller('ShowUserController', function($scope, BackandService, auth, growl, $state, $stateParams, USER_LINK_TYPE){
  
  $scope.id = $stateParams.id;
  $scope.objectName = $stateParams.objectName;
  $scope.showObject = $stateParams.showObject;

  $scope.userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));;
  $scope.linkObject = {};

  $scope.userLinkType = USER_LINK_TYPE.NOT_REQUESTED;
  $scope.USER_LINK_TYPE = USER_LINK_TYPE;

  $scope.linkUser = function(operation)
  {

    var agent_id = 0;
    var supplier_id = 0;

    if($scope.userInSession.user_type == "supplier")
    {
      agent_id = $scope.id;
      supplier_id= $scope.userInSession.supplier_id;
    }
    else if($scope.userInSession.user_type == "agent")
    {
      agent_id = $scope.userInSession.agent_id;
      supplier_id = $scope.id;
    }

    if(operation == "sendRequest")
    {
      var newLink = {};
      newLink.agent_id = agent_id;
      newLink.supplier_id = supplier_id;

      if($scope.userInSession.user_type == "supplier")
      {
        //sendRequestBySupplier
        newLink.type = USER_LINK_TYPE.REQUESTED_BY_S;
      }
      else if($scope.userInSession.user_type == "agent")
      {
        //sendRequestByAgent
        newLink.type = USER_LINK_TYPE.REQUESTED_BY_A;
      }

      newLink.created_at = BackandService.getTimestampinMysql();
      addObject("userLinks",newLink);
    }

    if(operation == "cancelRequest" || operation == "ignoreRequest" || operation == "removeFromList")
    {
      deleteUserLink(agent_id, supplier_id);
    }    

    if(operation == "confirmRequest")
    {
      editUserLink(agent_id, supplier_id, USER_LINK_TYPE.LINKED);
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

  function addObject(objectName, object)
  {
    BackandService.addObject(objectName,object).then(function(result){
    console.log("Return Result from Adding to "+objectName);
    console.log(result);

      if(result.status == 200)
      {
        growl.success("" ,{title: 'Successfully Added New Record!'});
        refreshPage();
      }

    });
  }

  function getObjectById(objectName, id)
  {
    BackandService.getObjectById(objectName,id).then(function(result){
    console.log("Data from show object");
    $scope.showObject = result.data;

    });
  }

  function editUserLink(agent_id, supplier_id,type)
  {
      BackandService.editUserLink(agent_id,supplier_id,type).then(function(result){
      console.log("Data from edit link object");
      console.log(result);
      /*
      if(result.data.length > 0)
      {
        $scope.linkObject = result.data[0];
        $scope.userLinkType = result.data[0].type;
      }
      */

      if(result.status == 200)
      {
        growl.success("" ,{title: 'Successfully Edit Record!'});
        refreshPage();
      }

    });
  }

  function deleteUserLink(agent_id, supplier_id)
  {
      BackandService.deleteUserLink(agent_id,supplier_id).then(function(result){
      console.log("Data from delete link object");
      console.log(result);
      /*
      if(result.data.length > 0)
      {
        $scope.linkObject = result.data[0];
        $scope.userLinkType = result.data[0].type;
      }
      */

      if(result.status == 200)
      {
        growl.success("" ,{title: 'Successfully Delete Record!'});
        refreshPage();
      }

    });
  }

  function getUserLink(agent_id, supplier_id)
  {
      BackandService.getUserLink(agent_id,supplier_id).then(function(result){
      console.log("Data from get link object");
      console.log(result);
      if(result.data.length > 0)
      {
        $scope.linkObject = result.data[0];
        $scope.userLinkType = result.data[0].type;
      }
    });
  }

  function getUserLinkType()
  {
    if($scope.userInSession == null)
    {
      $scope.userLinkType = USER_LINK_TYPE.NOT_AUTH;
      return;
    }


     if($state.current.name == "showAgent")
     {
        if($scope.userInSession.user_type == "supplier")
        {
            getUserLink($scope.id, $scope.userInSession.supplier_id);
        }
        else if($scope.userInSession.user_type == "agent")
        {
          $scope.userLinkType = USER_LINK_TYPE.SAME_TYPE;
        }
     } 

     if($state.current.name == "showSupplier")
     {
        if($scope.userInSession.user_type == "agent")
        {
            getUserLink($scope.userInSession.agent_id, $scope.id);
        }
        else if($scope.userInSession.user_type == "supplier")
        {
          $scope.userLinkType = USER_LINK_TYPE.SAME_TYPE;
        }
     }
  }

  getObjectById($scope.objectName,$scope.id);
  getUserLinkType();




});

myApp.service('BackandService', function ($http, Backand, auth){
  var baseUrl = '/1/objects/';

  function getUrl(objectName){
    return Backand.getApiUrl() + baseUrl + objectName + "/";
  }

  //BASIC QUERY /////////////////////////////////////////////////

  getAllObjects = function(objectName){
    return $http.get(getUrl(objectName));
  }

  getObjectById = function(objectName,id){
    return $http.get(getUrl(objectName) + id);
  }

  addObject = function(objectName,object){
    return $http.post(getUrl(objectName)+"?returnObject=true", object);
  }

  deleteObject = function(objectName,id){
    return $http.delete(getUrl(objectName) + id);
  }

  //CUSTOM QUERY /////////////////////////////////////////////////

  getSupplierLinkByAgentIdAndType = function (agent_id,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierLinkByAgentIdAndType',
        params: {
          parameters: {
            agent_id: agent_id,
            type : type
          }
        }
      })
  }    

  getAgentLinkBySupplierIdAndType = function (supplier_id,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAgentLinkBySupplierIdAndType',
        params: {
          parameters: {
            supplier_id: supplier_id,
            type : type
          }
        }
      })
  }  

  getUserLink = function (agent_id,supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserLinkByBothId',
        params: {
          parameters: {
            agent_id: agent_id,
            supplier_id: supplier_id
          }
        }
      })
  }  

  deleteUserLink = function (agent_id,supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/deleteUserLink',
        params: {
          parameters: {
            agent_id: agent_id,
            supplier_id: supplier_id
          }
        }
      })
  }  

  editUserLink = function (agent_id,supplier_id,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editUserLink',
        params: {
          parameters: {
            agent_id: agent_id,
            supplier_id: supplier_id,
            type : type
          }
        }
      })
  }

  getUserbyEmail = function(email){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserbyEmail',
        params: {
          parameters: {
            email: email
          }
        }
      })
  }

  getTimestampinMysql = function(){
    var formatedMysqlTimestamp = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
    return formatedMysqlTimestamp;
  }
  ////////////////////////////////////////////////////////////////

  return{
    //basic query
    getAllObjects: getAllObjects,
    getObjectById: getObjectById,
    addObject: addObject,
    deleteObject: deleteObject,
    deleteUserLink:deleteUserLink,

    //custom query
    getUserbyEmail : getUserbyEmail,
    getUserLink : getUserLink,
    getTimestampinMysql : getTimestampinMysql,
    editUserLink : editUserLink,
    getSupplierLinkByAgentIdAndType : getSupplierLinkByAgentIdAndType,
    getAgentLinkBySupplierIdAndType : getAgentLinkBySupplierIdAndType
  }

});
