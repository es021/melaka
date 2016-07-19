var myApp = angular.module('sample.service', [
  'ui.router',
  'backand'
]);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// BackandService ////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// BackandService ////////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('BackandService', function ($http, Backand, auth, USER_TYPE){
  var baseUrl = '/1/objects/';

  function getUrl(objectName){
    return Backand.getApiUrl() + baseUrl + objectName + "/";
  }

  //BASIC QUERY /////////////////////////////////////////////////

  getAllObjects = function(objectName){
    return $http.get(getUrl(objectName));
  }

  getObjectById = function(objectName,id){
    console.log(getUrl(objectName) + id);
    return $http.get(getUrl(objectName) + id);
  }

  addObject = function(objectName,object){
    return $http.post(getUrl(objectName)+"?returnObject=true", object);
  }

  deleteObject = function(objectName,id){
    return $http.delete(getUrl(objectName) + id);
  }

  //CUSTOM QUERY /////////////////////////////////////////////////

  getAllProductByUserId = function (user_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAllProductByUserId',
        params: {
          parameters: {
            user_id: user_id
          }
        }
      })
  }  

  getUserLink = function (from_user_id, to_user_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserLinkByBothId',
        params: {
          parameters: {
            from_user_id: from_user_id,
            to_user_id: to_user_id
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

  editUserLinkById = function (id,type,updated_at){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editUserLinkById',
        params: {
          parameters: {
            id: id,
            type : type,
            updated_at : updated_at
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

  getUserByAuthId = function(auth_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserByAuthId',
        params: {
          parameters: {
            auth_id: auth_id
          }
        }
      })
  }  


  getAgentActiveListing = function(agent_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAgentActiveListing',
        params: {
          parameters: {
            agent_id: agent_id
          }
        }
      })
  }  

  getSupplierActiveListing = function(supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierActiveListing',
        params: {
          parameters: {
            supplier_id: supplier_id
          }
        }
      })
  }    

  getAgentCompletedTransaction = function(agent_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAgentCompletedTransaction',
        params: {
          parameters: {
            agent_id: agent_id
          }
        }
      })
  }    

  getSupplierCompletedTransaction = function(supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierCompletedTransaction',
        params: {
          parameters: {
            supplier_id: supplier_id
          }
        }
      })
  }  

  getSupplierNameById = function(supplier_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getSupplierNameById',
        params: {
          parameters: {
            supplier_id: supplier_id
          }
        }
      })
  }  

  editTransactionStatus = function(id,status,timeUpdated){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editTransactionStatus',
        params: {
          parameters: {
            id: id,
            status : status,
            timeUpdated : timeUpdated
          }
        }
      })
  }  

  getUserByType = function(user_type,limit){
    if(limit != "all")
    {
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserByType',
        params: {
          parameters: {
            user_type: user_type,
            limit: limit
          }
        }
      })
    }
    else
    {
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAllUserByType',
        params: {
          parameters: {
            user_type: user_type
          }
        }
      })
    }
  }  

  editTransactionPaymentStatus = function(id,payment_status,timeUpdated){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editTransactionPaymentStatus',
        params: {
          parameters: {
            id: id,
            payment_status : payment_status,
            timeUpdated : timeUpdated
          }
        }
      })
  }

  getLinkedUserById = function(id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getLinkedUserById',
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  getRequestToUserById = function(id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getRequestToUserById',
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  getRequestFromUserById = function(id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getRequestFromUserById',
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  getShowProductById = function(id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getShowProductById',
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  sendEmailNotificationCustom = function(notification_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/action/notifications/'+notification_id+'?name=sendEmailNotificationCustom',
        params: {
          parameters: {
          }
        }
      })
  }

  sendEmailToInnovaSeeds = function(email_from,message){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/action/notifications/137?name=emailToInnovaSeeds',
        params: {
          parameters: {
            email_from: email_from,
            message : message
          }
        }
      })
  }

  getProductQuantity = function(id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getProductQuantity',
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  editProductQuantity = function(id,quantity){
    return $http ({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/query/data/editProductQuantity',
        params: {
          parameters: {
            id: id,
            quantity: quantity
          }
        }
      })
  }

  getUserNameById = function(id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserNameById',
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  getLinkByFromIdToIdType = function(user1,user2,type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getLinkByFromIdToIdType',
        params: {
          parameters: {
            user1: user1,
            user2: user2,
            type : type
          }
        }
      })
  }

  getUserActiveListing = function(user_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserActiveListing',
        params: {
          parameters: {
            user_id: user_id
          }
        }
      })
  }

  getUserCompletedTransaction = function(user_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserCompletedTransaction',
        params: {
          parameters: {
            user_id: user_id
          }
        }
      })
  }

  editUserById = function 
    (id,
    first_name,
    last_name,
    address_line_1,
    address_line_2,
    city,
    state,
    postal_code,
    email,
    phone_number,
    about,
    updated_at)
  {
    return $http ({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/query/data/editUserById',
        params: {
          parameters: {
            id: id,
            first_name : first_name,
            last_name : last_name,
            address_line_1 : address_line_1,
            address_line_2 : address_line_2,
            city : city,
            state : state,
            postal_code : postal_code,
            email : email,
            phone_number : phone_number,
            about : about,
            updated_at : updated_at
          }
        }
      })
  }

  editProductById = function (id,name,category,price_per_unit,description,picture,quantity,custom_pricing, updated_at){
    return $http ({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/query/data/editProductById',
        params: {
          parameters: {
            id: id,
            name : name,
            category : category,
            price_per_unit : price_per_unit,
            description : description,
            picture : picture,
            quantity : quantity,
            custom_pricing : custom_pricing,
            updated_at : updated_at
          }
        }
      })
  }

  setNotificationIsReadTrue = function (id){
    return $http ({
        method: 'POST',
        url: Backand.getApiUrl() + '/1/query/data/setNotificationIsReadTrue',
        params: {
          parameters: {
            id: id          
          }
        }
      })
  }

  getUserCountByUserType = function (user_type){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserCountByUserType',
        params: {
          parameters: {
            user_type: user_type,
          }
        }
      })
  }

  getAllNotificationByUserId = function (user_id,limit){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getAllNotificationByUserId',
        params: {
          parameters: {
            user_id: user_id,
            limit : limit
          }
        }
      })
  }

  getAllNotificationByUserId_page = function (user_id,pageNumber){
    return $http ({
      method: 'GET',
      url: Backand.getApiUrl() + '/1/objects/notifications',
      params: {
        pageSize: 10,
        pageNumber: pageNumber,
        filter: [
          {
            fieldName: 'user_id',
            operator: 'in',
            value: user_id
          }
        ],
        sort: '[{fieldName:\'created_at\', order:\'desc\'}]'
      }
    });
  }  

  getTransById = function (id,other_user_id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getTransById',
        params: {
          parameters: {
            id: id,
            other_user_id : other_user_id
          }
        }
      })
  }

  editDeliveryDetailByTransId = function (trans_id,delivery_detail,updated_at){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editDeliveryDetailByTransId',
        params: {
          parameters: {
            trans_id: trans_id,
            delivery_detail : delivery_detail,
            updated_at : updated_at
          }
        }
      })
  }

  editPaymentDetailByTransId = function (trans_id,payment_detail,updated_at){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/editPaymentDetailByTransId',
        params: {
          parameters: {
            trans_id: trans_id,
            payment_detail : payment_detail,
            updated_at : updated_at            
          }
        }
      })
  }

  getUserEmailById = function (id){
    return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/getUserEmailById',
        params: {
          parameters: {
            id: id
          }
        }
      })
  }

  var filesActionName = 'files';
  var objectName = 'products';
  uploadFile = function (filename,filedata){
    // By calling the files action with POST method in will perform
    // an upload of the file into Backand Storage
    return $http({
      method: 'POST',
      url : Backand.getApiUrl() + '/1/objects/action/' +  objectName,
      params:{
        "name": filesActionName
      },
      headers: {
        'Content-Type': 'application/json'
      },
      // you need to provide the file name and the file data
      data: {
        "filename": filename,
        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
      }
    });
  }

  createNotification = function (user_id,text,link,category){
    var newNotification = {};

    newNotification.user_id = user_id;
    newNotification.link = link;
    newNotification.text = text;
    newNotification.category = category;
    
    newNotification.isRead = 0;
    newNotification.created_at = getTimestampinMysql();
    newNotification.updated_at = getTimestampinMysql();

    console.log("newNotification");
    console.log(newNotification);

    addObject("notifications",newNotification).then(function(result){
      console.log(result);
      if(result.status == 200)
      {
        console.log("sending email notification to user");
        sendEmailNotificationCustom(result.data.id);
      }

    },function errorCallback(result){
      console.log(result);
    });
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

    //other
    getTimestampinMysql : getTimestampinMysql,

    //loginQuery
    getUserByAuthId : getUserByAuthId,
    getUserbyEmail : getUserbyEmail,

    //userRelatedQuery
    getUserByType : getUserByType,
    getSupplierNameById : getSupplierNameById,
    getUserNameById : getUserNameById,
    editUserById : editUserById,
    getUserCountByUserType : getUserCountByUserType,

    //user link
    getUserLink : getUserLink,
    getLinkByFromIdToIdType : getLinkByFromIdToIdType,
    getLinkedUserById : getLinkedUserById,
    getRequestToUserById : getRequestToUserById,
    getRequestFromUserById : getRequestFromUserById,
    editUserLinkById : editUserLinkById,
    deleteUserLink : deleteUserLink,

    //productQuery
    getAllProductByUserId : getAllProductByUserId,
    getShowProductById : getShowProductById,
    editProductById : editProductById,
    getProductQuantity : getProductQuantity,    
    editProductQuantity : editProductQuantity,

    //transactionQuery
    getUserActiveListing : getUserActiveListing,
    editTransactionStatus : editTransactionStatus,
    editTransactionPaymentStatus : editTransactionPaymentStatus,
    getUserCompletedTransaction : getUserCompletedTransaction,
    getTransById : getTransById,
    editDeliveryDetailByTransId : editDeliveryDetailByTransId,
    editPaymentDetailByTransId : editPaymentDetailByTransId,

    //notification
    getAllNotificationByUserId : getAllNotificationByUserId,
    setNotificationIsReadTrue : setNotificationIsReadTrue,
    createNotification : createNotification,

    uploadFile : uploadFile ,
    sendEmailToInnovaSeeds: sendEmailToInnovaSeeds,

    getAllNotificationByUserId_page : getAllNotificationByUserId_page
  }

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('DropboxService', function ($http){
  var access_token = "H6PJA3e1IJMAAAAAAAA7s9vlI9ZyuZA8KVF49yanXNjRnRAicsDBPFauFoEIz42A";

  getFullUrl = function(url){
    return $http({
        method: 'POST',
        url: url
    }).success(function(data, status, headers, config) {
        console.log(data);
        console.log(headers);
        console.log('get full url successfully');
    }).error(function(data, status, headers, config) {
      
        console.log('get full url failed');
    });
  }  

  uploadFile = function(pathFile,data){
    return $http({
        method: 'PUT',
        url: 'https://api-content.dropbox.com/1/files_put/dropbox/' + pathFile+ '?access_token=' + access_token,
        data: data
    }).success(function(data, status, headers, config) {
        console.log('file uploaded successfully');
        console.log(data);           
        console.log(status);           
        console.log(headers);           
        console.log(config);  
    }).error(function(data, status, headers, config) {

    });
  }

//https://api.dropboxapi.com/1/shares/auto/<path>
  getShareLink = function(pathFile){
    return $http({
          method: 'POST',
          url: 'https://api.dropboxapi.com/1/shares/auto/' + pathFile
                +'?access_token=' + access_token
                +'&short_url=false'

      }).success(function(data, status, headers, config) {
          console.log('share link successfully'); 
          console.log(config);
          
      }).error(function(data, status, headers, config) {
          console.log('file share failed');
          console.log(data);           
          console.log(status);           
          console.log(headers);           
          console.log(config);           
    });
  }  



  return{
    //basic query
    uploadFile : uploadFile,
    getShareLink : getShareLink,
    getFullUrl : getFullUrl
  }

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// DropboxService ///////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('FileReaderService', function ($q, $log){

  var onLoad = function(reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.resolve(reader.result);
          });
      };
  };

  var onError = function (reader, deferred, scope) {
      return function () {
          scope.$apply(function () {
              deferred.reject(reader.result);
          });
      };
  };

  var onProgress = function(reader, scope) {
      return function (event) {
          scope.$broadcast("fileProgress",
              {
                  total: event.total,
                  loaded: event.loaded
              });
      };
  };

  var getReader = function(deferred, scope) {
      var reader = new FileReader();
      reader.onload = onLoad(reader, deferred, scope);
      reader.onerror = onError(reader, deferred, scope);
      reader.onprogress = onProgress(reader, scope);
      return reader;
  };

  var readAsDataURL = function (file, scope) {
      var deferred = $q.defer();
       
      var reader = getReader(deferred, scope);         
      reader.readAsDataURL(file);
       
      return deferred.promise;
  };

  return {
      readAsDataURL: readAsDataURL  
  };
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// PublicService ///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// PublicService ///////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('PublicService', function ($http,growl){


  getTimestampForFileName = function(timestamp)
  {
    return timestamp.replace(':', '-').replace(':', '-').replace(' ','-');
  }

  getTimestampinMysql = function(){
    var formatedMysqlTimestamp = (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
    return formatedMysqlTimestamp;
  }

  getAgoTime = function(timestamp)
  {
    var ago = jQuery.timeago(timestamp);
    return ago; 
  }

  function monthNumToString(month)
  {
    var toReturn;
    
    if(month == "01")
      toReturn = "January";    
    if(month == "02")
      toReturn = "February";    
    if(month == "03")
      toReturn = "March";    
    if(month == "04")
      toReturn = "April";    
    if(month == "05")
      toReturn = "May";    
    if(month == "06")
      toReturn = "June";    
    if(month == "07")
      toReturn = "July";    
    if(month == "08")
      toReturn = "August";    
    if(month == "09")
      toReturn = "September";    
    if(month == "10")
      toReturn = "October";    
    if(month == "11")
      toReturn = "November";    
    if(month == "12")
      toReturn = "December";

    return toReturn;
  }

  getDate = function(timestamp)
  {
    //2016-06-04T21:06:16
    var date =  timestamp;
    var dateArr = date.split("T")[0].split("-");
  
    var year = dateArr[0];
    var month =  monthNumToString(dateArr[1]);
    var day = Number(dateArr[2]);

    var date = month + " " + day + " , " + year;

    return date;
   }

  setFooter = function (type)
  {
    
    var footer = "footer_newUser";
    var footerList = ["footer_stockist","footer_supplier","footer_newUser","footer_dropship"];

    if(type != "")
    {
      footer = "footer_"+ type;
    }



    for (var i = 0; i < footerList.length; i++)
    { 

      var element = document.getElementById(footerList[i]);
      //console.log(element);
      if(element != null)
      {
        if(footerList[i] == footer)
        {
          //console.log(footerList[i]);
          element.setAttribute("style","display:default");
        }
        else
        {
          //console.log(footerList[i]);
          element.setAttribute("style","display:none");
        }
      }
    }
  }

  setHeader = function (type)
  {
    var headerList = ["header_logout","header_login","header_newUser"];
    var header = "header_"+ type;

    for (var i = 0; i < headerList.length; i++)
    { 
      if(headerList[i] == header)
      {
        document.getElementById(headerList[i]).setAttribute("style","display:default");
      }
      else
      {
        document.getElementById(headerList[i]).setAttribute("style","display:none");
      }
    }

  }

  initHeaderFooter = function (authProfile,userInSession)
  {
    console.log(userInSession);
    console.log(authProfile);

    if(authProfile != null && userInSession != null)
    {
      setHeader("login");
      setFooter("newUser");
    }

    if(authProfile != null )
    {
      
      //console.log($scope.authProfile);
      if(userInSession != null)//registered
      {
        setHeader("logout");
        setFooter(userInSession.user_type.getUserTypeLower());
      }
      else//newUser
      {
        setFooter("newUser");
        setHeader("newUser");
      }    
    }
  }

  logout = function(){
    var returnUrl = window.location.href.split("#")[0];
    //console.log(returnUrl);
    window.location = 'https://wzs21.auth0.com/v2/logout?returnTo='+returnUrl;
  }

  initSideMenu = function()
  {
    console.log("init side bar");
    var authProfile = JSON.parse(window.localStorage.getItem("AuthProfile"));
    var userInSession = JSON.parse(window.localStorage.getItem("UserInSession"));
    
    $( ".profile .image" ).attr( "src", authProfile.picture );
    $( ".profile #name" ).text(authProfile.nickname );

    if(userInSession != null)
    {
      $(".profile #user_type").text(userInSession.user_type.getUserType());
    }
    else{
      $( ".profile #user_type").text("New User");
    }
  }

  errorCallbackFunction = function(error, title)
  {
    if(title == "default")
    {
      title = "Opps! Something went wrong";
    }
    
    console.log(error);
    growl.error(''+error.data,{title: title});
  }

  return {
      getTimestampForFileName : getTimestampForFileName,
      getTimestampinMysql : getTimestampinMysql ,
      setFooter : setFooter ,
      setHeader : setHeader,
      initHeaderFooter : initHeaderFooter,
      getAgoTime : getAgoTime,
      getDate : getDate,
      logout : logout,
      initSideMenu : initSideMenu,
      errorCallbackFunction : errorCallbackFunction
  };
});


myApp.service('UserService', function ($state){
  
  showUser = function(id){
    $state.go("showUser",{id:id});
  }

  return{
    showUser : showUser
  }

});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// SearchService ////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////// SearchService ////////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.service('SearchService', function ($http, Backand, USER_TYPE){
  var baseUrl = '/1/objects/';

  function getUrl(objectName){
    return Backand.getApiUrl() + baseUrl + objectName + "/";
  }

  searchUserByNameByType = function (key,type)
  {
  

      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/query/data/searchUserByName',
        params: {
          parameters: {
            key: key
          }
        }
      })
    
    

  }

  return{
      searchUserByNameByType:searchUserByNameByType
  }

});
