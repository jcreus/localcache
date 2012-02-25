Function.prototype.bind = function(scope) {
  var _function = this;
  
  return function() {
    return _function.apply(scope, arguments);
  }
}

localcache = {};

localcache.clear = function () {
  for (var i in localStorage) {
    if (i.indexOf("cached-") == 0) {
      localStorage.removeItem(i);
    }
  }
};

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
    localStorage.setItem("cached-img-"+this.getAttribute("data-src"),JSON.stringify({data:dataURL,date:new Date().toString()}));
  } catch(e) {
    console.error("localStorage error! (Maybe, quota)");
  }
};

localcache.loadImages = function (params) {
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
        var cached = localStorage.getItem("cached-img-"+img.getAttribute("data-src"));
        if (cached != null) {
          var parsed = JSON.parse(cached);
          var cached_date = new Date(parsed.date);
          if (!params.minDate || (cached_date > params.minDate)) {
            img.setAttribute("src",parsed.data);
            continue;
          }
        }
      }
      img.setAttribute("src",img.getAttribute("data-src"));
      img.onload = localcache._image_loaded.bind(img);
      img.onerror = function () { console.error("Image could not be loaded"); };
    }
  }
}
localcache.loadJS = function (scripts,params) {
  var params = params || {};
  params.load = params.load || false;
  params.minDate = params.minDate || false;
  var xmlhttp = new XMLHttpRequest();
  for (var i=0; i<scripts.length; i++) {
    var script = scripts[i];
    if (localcache.hasLocal && !params.load) {
      var cached = JSON.parse(localStorage.getItem("cached-js-"+script));
      if (cached != null) {
        if (!params.minDate || (new Date(cached.date) > params.minDate)) {
          eval.call(null,cached.data);
          continue;
        }
      }
    }
    xmlhttp.overrideMimeType('text/plain');
    xmlhttp.open("GET", script, true);
    xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      var contents = xmlhttp.responseText;
      eval.call(null, contents);
      localStorage.setItem("cached-js-"+script,JSON.stringify({data:contents,date:new Date().toString()}));
      }
    }
    xmlhttp.send(null);
  }
};
