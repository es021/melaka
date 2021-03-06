Number.prototype.getUserType = function() {
    if(this == 1)
      return "Supplier";    
    if(this == 2)
      return "Stockist";    
    if(this == 3)
      return "Dropship";
}

String.prototype.getUserType = function() {
    if(this == "1")
      return "Supplier";    
    if(this == "2")
      return "Stockist";    
    if(this == "3")
      return "Dropship";
}

Number.prototype.getUserTypeLogo = function(){
    if(this == 1)
      return "fa-home";    
    if(this == 2)
      return "fa-archive";    
    if(this == 3)
      return "fa-users";
}

Number.prototype.getEmptyStar = function(){
  return Math.ceil(5-this);
}

Number.prototype.getUserTypeLower = function() {
    if(this == 1)
      return "supplier";    
    if(this == 2)
      return "stockist";    
    if(this == 3)
      return "dropship";
}

Number.prototype.getTransType = function(){
  if(this == 1)
    return "Pick Up";
  if(this > 1)
    return "Delivery"
}

String.prototype.getDate = function(){

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

  //2016-06-04T21:06:16
  //console.log(this);

  var date =  this;
  var dateArr = date.split("T")[0].split("-");

  //console.log(dateArr);

  var year = dateArr[0];
  var month =  monthNumToString(dateArr[1]);
  var day = Number(dateArr[2]);

  var date = month + " " + day + " , " + year;

  return date;
}

String.prototype.getTime = function(){

  //2016-06-04T21:06:16
  var datetimeArr =  this.split("T");
  var timeArr = datetimeArr[1].split(":");

  var hour = parseInt(timeArr[0]);
  var AM_PM = "AM";
  if(hour > 11)
  {
    AM_PM = "PM";
    if(hour > 12)
    {
      hour = hour - 12;
    }
  }
  var minute = timeArr[1];

  var time = hour+":"+minute+" "+AM_PM;

  return time;
}

String.prototype.getHttpLink = function(){

  return this.replace("https","http");
}

String.prototype.getFirstPicture = function(){

  if(this[0] == "[")
  {
    var JSONObject = JSON.parse(this);

    //console.log(JSONObject);
    console.log(JSONObject[0]);

    return JSONObject[0];
  }
  else
  {
    console.log(this+"");
    return this+"";
  }

}