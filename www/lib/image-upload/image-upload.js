(function(AWS) {

  // Establish a reference to the `window` object, and save the previous value
  // of the `ImageUpload` variable.
  var root = this,
      previousImageUpload = root.ImageUpload;

  var UploadConfig = function(){
    var res = {
      accessKeyId: "AKIAJDDLMBIFFIUWYCEA",
      secretAccessKey: "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",
      bucketName: "com.thinkcrazy.ionicimageupload",
      bucketUrl: "https://s3.amazonaws.com/com.thinkcrazy.ionicimageupload/",
      region: "us-east-1",
      bucket: {},
      file: {},
      uploadProgress: 0,
      sizeLimit: 10485760 // 10MB in Bytes
    };
    return res;
  };

  function configAWS(imageUpload){
    var config = new UploadConfig();
    AWS.config.update({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region
    });
    return config;
  }

  function ImageUpload(){
    var self = this;
    var config = configAWS();
    self._accessKeyId = config.accessKeyId;
    self._secretAccessKey = config.secretAccessKey;
    self._region = config.region;
    self._bucketName = config.bucketName;
    self._bucketUrl = config.bucketUrl;
    self._file = config.file;
    self._uploadProgress = config.uploadProgress;
    self._sizeLimit = config.sizeLimit;
    self._bucket = new AWS.S3({
      params: {
        Bucket: self._bucketName
      }
    });
    return self;
  }

  root.ImageUpload = ImageUpload;

  ImageUpload.prototype = {
    _requireFile: function(file){
      var self = this;
      // Check that file exists and its size is greater than 0
      if(!file.size) {
        console.error({message: 'Missing file argument', code: 'No File'});
        return false;
      }
      // Check that file size is above 0
      if(file.size <= 0){
        console.error({message: 'File has size of 0', code: 'Erroneous File'});
        return false;
      }
      // Check that file size is below size limit
      if (Math.round(parseInt(file.size)) > self._sizeLimit) {
        console.error({code: 'File Too Large', message: 'Sorry, your attachment is too big. <br/> Maximum '+fileSizeLabel()+' file attachment allowed'});
        return false;
      }
      return true;
    },
    _clearProgress: function(){
      this._uploadProgress = 0;
    },
    _updateProgress: function(progress){
      console.debug('Upload Progress: ' + progress);
      this._uploadProgress = progress;
    },
    _resetUploadProgress: function(){
      var self = this;
      root.setTimeout(function() {
        ImageUpload.prototype._clearProgress();
      }, 100);
    }
  };

  ImageUpload.prototype.push = function(file, callback){
    var self = this;
    if(!self._requireFile(file)){
      return false;
    }
    var uniqueFileName = encodeURI(uniqueString() + '-' + file.name);
    var params = {
      Bucket: self._bucketName,
      Key: uniqueFileName, 
      ContentType: file.type,
      Body: file,
      ServerSideEncryption: 'AES256',
      ACL: 'public-read'
    };
    self._updateProgress(0);
    self._bucket.putObject(params, function(err, data) {
      if(err) {
        err.data = data;
        console.error('Error uploading file', err);
        return false;
      }
      else {
        self._resetUploadProgress();
        data.filename = uniqueFileName;
        data.url = self._bucketUrl + uniqueFileName;
        callback(data);
        return true;
      }
    })
    .on('httpUploadProgress',function(progress) {
      var p = Math.round(progress.loaded / progress.total * 100);
      self._updateProgress(p);
    });
  };

  function fileSizeLabel() {
    return Math.round($scope.sizeLimit / 1024 / 1024) + 'MB'; // Convert Bytes To MB
  };

  function uniqueString() {
    var text     = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i=0; i<8; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };


})(AWS);