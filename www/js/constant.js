var myApp = angular.module('sample.constant', [
  'ui.router',
  'backand'
]);

myApp.constant("APP_CONSTANT",{
        "EMAIL": "innovaseedssolutions@gmail.com",
        "COMPANY": "InnovaSeeds Solution",
        "NAME" : "DropBug",
        "TAGLINE" : "Your One-Stop Bussiness App",
        "LOGO" : "img/logo.png",
        "WEBSITE" : "http://faizuljasmi.wix.com/dropbug",
        "FACEBOOK" : "https://www.facebook.com/DropBug-895228623915581/",
        "LOGO_SMALL" : "img/logo_small.png",
        "LOGO_ONLY_SMALL" : "img/logo_only_small.png",
        "LOADER" : "img/AjaxLoader.gif"
});

myApp.constant("USER_LINK_TYPE", {
        "LINKED": 1,
        "REQUESTED" : 2,
        "NOT_REQUESTED": 3,
        "REQUESTED_BY_USER": 4,
        "REQUESTED_TO_USER": 5,
        "SAME_TYPE":6,
        "NOT_AUTH":7
});

myApp.constant("USER_TYPE", {
        "SUPPLIER": 1,
        "STOCKIST": 2,
        "DROPSHIP": 3,
        
        "ION_COLOR" :{
            "SUPPLIER" : "positive",
            "STOCKIST": "royal",
            "DROPSHIP": "assertive",
        },

        "BOOT_COLOR":{

        }

});

myApp.constant("TRANS_STATUS", {
        "REQUESTED": 1,
        "DENIED": 2,
        "APPROVED": 3,
        "DELIVERED": 4,
        "RECEIVED": 5,
        "NOT_PAID" : 6,
        "PAID": 7,
        "COMFIRMED": 8
});

myApp.constant("NOTI_CATEGORY", {
        "GENERAL": 1,
        "PROFILE": 2,
        "LINK": 3,
        "PRODUCT": 4,
        "TRANSACTION": 5,
        "PAYMENT": 6
});

myApp.constant("PICTURE_CONSTANT", {
        "UNAVAILABLE": "https://www.dropbox.com/s/rdg50p8jvdktnfy/sorry-image-not-available.png?raw=1",
        "TEST":"https://www.dropbox.com/s/mul2zkl4rqnbuxt/image-test.jpeg?raw=0"
});

myApp.constant("AUTH_CONSTANT",{
    "AUTH0_DOMAIN" : 'wzs21.auth0.com',
    "AUTH0_CLIENT_ID" :'j2ucVyLG1pMqGZiKsGL00QAkHbW21siH',
    "AUTH0_DB_CONNECTION_NAME" : 'Username-Password-Authentication',
    "CALLBACK_URL" : "localhost:8100"
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.constant("TEAM_CONSTANT", 
    {"member":[
        {
            "first_name":"",
            "last_name":"",
            "email":"@gmail.com",
            "role":"",
            "facebook":"",
            "linkedin":"",
            "twitter":"",
            "picture":"",
            "phone":"",
            "description":""
        }, 
        
        {
            "first_name":"",
            "last_name":"",
            "email":"@gmail.com",
            "role":"",
            "facebook":"",
            "linkedin":"",
            "twitter":"",
            "picture":"",
            "phone":"",            
            "description":""
        }, 
      
        {
            "first_name":"",
            "last_name":"",
            "email":"@gmail.com",
            "role":"",
            "facebook":"",
            "linkedin":"",
            "twitter":"",
            "picture":"",
            "phone":"",  
            "description":""
        }, 
      
        {
            "first_name":"",
            "last_name":"",
            "email":"@gmail.com",
            "role":"",
            "facebook":"",
            "linkedin":"",
            "twitter":"",
            "picture":"",
            "phone":"",  
            "description":""
        }, 
      
        {
            "first_name":"Wan Zulsarhan",
            "last_name":"Wan Shaari",
            "email":"zulsarhan.shaari@gmail.com",
            "role":"Developer",
            "facebook":"https://www.facebook.com/wan.zulsarhan",
            "linkedin":"https://www.linkedin.com/in/wan-zulsarhan-wan-shaari-3b0569110",
            "twitter":"https://twitter.com/es021",
            "picture":"img/image_profile/zul.jpg",
            "phone":"+1 (515) 708-3630",  
            "description":"Senior in Software Engineering at Iowa State University."
        }
    ]}
);
