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

Number.prototype.getUserTypeLower = function() {
    if(this == 1)
      return "supplier";    
    if(this == 2)
      return "stockist";    
    if(this == 3)
      return "dropship";
}
