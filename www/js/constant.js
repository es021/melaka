var myApp = angular.module('sample.constant', [
  'ui.router',
  'backand'
]);

myApp.constant("APP_CONSTANT",{
        "EMAIL": "zulsarhan.shaari@gmail.com",
        "NAME" : "InnovaSeeds",
        "TAGLINE" : "Something",
        "LOGO" : "img/logo.png",
        "FACEBOOK": "",
        "INSTAGRAM": "",

});

myApp.constant("USER_LINK_TYPE", {
        "LINKED": 1,
        "NOT_REQUESTED": 2,
        "REQUESTED_BY_A": 3,
        "REQUESTED_BY_S": 4,
        "SAME_TYPE":5,
        "NOT_AUTH":6
});

myApp.constant("USER_TYPE", {
        "AGENT": 1,
        "SUPPLIER": 2
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