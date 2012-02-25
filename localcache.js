Function.prototype.bind = function(scope) {
  var _function = this;
  
  return function() {
    return _function.apply(scope, arguments);
  }
}

localcache = {};

localcache.hasLocal = (('localStorage' in window) && typeof localStorage.getItem === 'function') ? true : false;

localcache._image_loaded = function () {
  localcache.canvas.width = this.width;
  localcache.canvas.height = this.height;
  localcache.ctx.drawImage(this, 0, 0);
  try {
    var dataURL = localcache.canvas.toDataURL("image/png");
  } catch (exc) {
    console.error("Error! Maybe you were trying to load an image from another origin. Please do not try to cache such images.");
    return
  }
  try {
    localStorage.setItem("cached-"+this.getAttribute("data-src"),JSON.stringify({data:dataURL,date:new Date().toString()}));
  } catch(e) {
    console.error("localStorage error! (Maybe, quota)");
  }
};

localcache.load = function (params) {
  var params = params || {};
  params.load = params.load || false;
  params.minDate = params.minDate || false;
  if (!params.load) {
    localcache.canvas = document.createElement("canvas");
    localcache.ctx = localcache.canvas.getContext("2d");
  }
  if (!params.load && localcache.hasLocal) {
    var all = document.getElementsByClassName("cache");
    for (var i=0; i<all.length; i++) {
      var img = all[i];
      if (!params.load && localcache.hasLocal) {
        var cached = localStorage.getItem("cached-"+img.getAttribute("data-src"));
        if (cached != null) {
          var parsed = JSON.parse(cached);
          var cached_date = new Date(parsed.date);
          if (!params.minDate || (cached_date > params.minDate)) {
            img.setAttribute("src",parsed.data);
          }
          continue;
        }
      }
      img.setAttribute("src",img.getAttribute("data-src"));
      img.onload = localcache._image_loaded.bind(img);
      img.onerror = function () { console.error("Image could not be loaded"); };
    }
  }
}
