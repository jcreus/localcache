Function.prototype.bind = function(scope) {
  var _function = this;
  
  return function() {
    return _function.apply(scope, arguments);
  }
}

localcache = {};

localcache.hasLocal = (('localStorage' in window) && typeof localStorage.getItem === 'function') ? true : false;

localcache._image_loaded = function () {
  var error = false;
  localcache.canvas.width = this.width;
  localcache.canvas.height = this.height;
  localcache.ctx.drawImage(this, 0, 0);
  try {
    var dataURL = localcache.canvas.toDataURL("image/png");
  } catch (exc) {
    console.error("Error! Maybe you were trying to load an image from another origin. Please do not try to cache such images.");
    error = true;
  }
  var t = document.getElementsByClassName("cache");
  for (var i=0; i<t.length; i++) {
     var e = t[i];
     if ((!error) && (e.getAttribute("data-src") == this.originalsrc)) {
       e.setAttribute("src",dataURL);
     } else {
       e.setAttribute("src",e.getAttribute("data-src"));
     }
  }
  try {
    localStorage.setItem("cached-"+this.originalsrc,JSON.stringify({data:dataURL,date:new Date().toString()}));
  } catch(e) {
    console.error("localStorage error! (Maybe, quota)");
  }
};

localcache.load = function (images, params) {
  var params = params || {};
  params.load = params.load || false;
  params.minDate = params.minDate || false;
  if (!params.load) {
    localcache.canvas = document.createElement("canvas");
    localcache.ctx = localcache.canvas.getContext("2d");
  }
  if (!params.load && localcache.hasLocal) {
    for (var i=0; i<images.length; i++) {
      var url = images[i];
      var cached = localStorage.getItem("cached-"+url);
      if (cached != null) {
        var parsed = JSON.parse(cached);
        var cached_date = new Date(parsed.date);
        if (!params.minDate || (cached_date > params.minDate)) {
          var t = document.getElementsByClassName("cache");
          for (var y=0; y<t.length; y++) {
            var e = t[y];
            if (e.getAttribute("data-src") == url) {
              e.setAttribute("src",parsed.data);
            }
          }
          continue;
        }
      }
      var image = new Image();
      image.src = url;
      image.originalsrc = url;
      image.onload = localcache._image_loaded.bind(image);
      image.onerror = function () { console.error("No s'ha pogut carregar la imatge"); };
    }
  } else {
    var t = document.getElementsByClassName("cache");
    for (var i=0; i<t.length; i++) {
       var e = t[i];
       e.setAttribute("src",e.getAttribute("data-src"));
    }
  }
}
