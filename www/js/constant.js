var myApp = angular.module('sample.constant', [
  'ui.router',
  'backand'
]);

myApp.constant("APP_CONSTANT",{
        "EMAIL": "innovaseedssolutions@gmail.com",
        "COMPANY": "InnovaSeeds Solution",
        "NAME" : "DropBug",
        "TAGLINE" : "Your One-Stop Bussiness App",
        "INNOVASEEDS_LOGO" : "img/innovaseeds.png",
        "INNOVASEEDS_FACEBOOK" : "https://www.facebook.com/innova.seeds.9",
        "WEBSITE" : "http://www.dropbug-seeds.com/",
        "FACEBOOK" : "https://www.facebook.com/DropBug-895228623915581/",
        "TWITTER" : "https://twitter.com/DropbugApp?lang=en",
        "TWITTER_NAME" : "DropbugApp",
        "LOGO_SMALL" : "img/logo_small.png",
        "LOGO_ONLY_SMALL" : "img/logo_only_small.png",
        "LOADER" : "img/AjaxLoader.gif",
        "DOMAIN" : "http://hosting.backand.io/dropbug/#/",
        "DOMAIN_SIMPLE" : "hosting.backand.io/dropbug",
        "BACKAND_APP_NAME" : "dropbug",
        "BACKAND_TOKEN" : "5ee54b6c-f992-4a78-b789-0a36721791c7"
});

myApp.constant("USER_STATUS", {
        "DEACTIVATED" : 0,
        "ACTIVE": 1
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
        "ALL":0,
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

myApp.constant("TRANS_TYPE", {
        "PICK_UP": 1,
        "DELIVER_TO_ME": 2,
        "DELIVER_TO_OTHER": 3
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
        "PAYMENT": 6,
        "REVIEW": 7
});

myApp.constant("OFFSET", {
        "PAGE": 6,
        "THUMBNAIL" : 6
});

myApp.constant("PICTURE_CONSTANT", {
        "UNAVAILABLE": "img/sorry-image-not-available.png",
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
            "first_name":"Nik Al-Zawier",
            "last_name":"Nik Mohd Zaim",
            "email":"nikalzawier@gmail.com",
            "role":"Marketing Director",
            "facebook":"https://www.facebook.com/alzawier.nik?fref=ts",
            "linkedin":"https://www.linkedin.com/in/nik-al-zawier-nik-mohd-zaim-988b9baa",
            "twitter":"https://twitter.com/AlZawier",
            "picture":"img/zawier.jpg",
            "phone":"+6 019-6262500",
            "description":"Iâ€™m an open door. Reach me anytime, anywhere"
        }, 
        
        {
            "first_name":"Muhammad Raffiq",
            "last_name":"Mohd Khalil",
            "email":"muhammadraffiq@gmail.com",
            "role":"Public Relation Director",
            "facebook":"https://www.facebook.com/raffiq28?fref=ts",
            "linkedin":"",
            "twitter":"https://twitter.com/muhdraffiqq",
            "picture":"img/raffik.jpg",
            "phone":"+6 0111-1808838", //+1 (515) 708-1734            
            "description":"Diamonds are made under the weight of mountains"
        }, 
      
        {
            "first_name":"Aiman Azfar",
            "last_name":"A Rahman",
            "email":"aiman_azfar95@gmail.com",
            "role":"Business Development Director",
            "facebook":"https://www.facebook.com/aiman.azfar.37?ref=bookmarks",
            "linkedin":"",
            "twitter":"https://twitter.com/aimanazfar",
            "picture":"img/aiman.jpg",
            "phone":"+1 (267) 455-2750",  
            "description":"Bolehland"
        }, 
        {
            "first_name":"Wan Zulsarhan",
            "last_name":"Wan Shaari",
            "email":"zulsarhan.shaari@gmail.com",
            "role":"Lead Developer",
            "facebook":"https://www.facebook.com/wan.zulsarhan",
            "linkedin":"https://www.linkedin.com/in/wan-zulsarhan-wan-shaari-3b0569110",
            "twitter":"https://twitter.com/es021",
            "picture":"img/zul.jpg",
            "phone":"+1 (515) 708-3630",  
            "description":"Unlimited possibilities"
        },
        {
            "first_name":"Faizul",
            "last_name":"Jasmi",
            "email":"faizul.jasmi95@gmail.com",
            "role":"User Experience Director",
            "facebook":"https://www.facebook.com/faizuljasmi?fref=ts",
            "linkedin":"",
            "twitter":"",
            "picture":"img/faizul.jpg",
            "phone":"+6 019-2232018",  //+1515708665
            "description":"A big soul & mind within a small body"
        } 
    ]}
);