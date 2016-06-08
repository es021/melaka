var myApp = angular.module('sample.constant', [
  'ui.router',
  'backand'
]);

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
        "RECEIVED": 5
});

myApp.constant("PAYMENT_STATUS", {
        "PAID": 1,
        "COMFIRMED": 2
});

myApp.constant("PICTURE_CONSTANT", {
        "UNAVAILABLE": "https://www.dropbox.com/s/rdg50p8jvdktnfy/sorry-image-not-available.png?raw=1",
        "TEST":"https://www.dropbox.com/s/mul2zkl4rqnbuxt/image-test.jpeg?raw=0"
});