How it works
============
It uses the HTML5 localStorage to cache images as requested. In case it's not suported, it just loads them. It allows to set minimum dates for the objects, sort of expiration dates. Internally, it loads the image, outputs it to a hidden canvas and gets the data:uri-form of the image. That is stored in localStorage, and then accessed.

Library
=======
The use is straightforward; everything is namespaced under `localcache`. It is called that way. `localcache.load({options});`. That should be called when the page loads, either with `window.onload` or placing it just before `body` closes. Options is a map; possible values are: `load`, by default false (if it's true, it will force loading of images without getting the cached version) and `minDate`, a `Date` object setting the minimum date a cached copy must have to be used. Else, it's just loaded.

All the images must have the `cache` attribute and have their source located at data-src instead of src. Note that this is (Javascript-disabled)-unfriendly!
