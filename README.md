How it works
============
It uses the HTML5 localStorage to cache resources as requested. In case it's not suported, it just loads them. It allows to set minimum dates for the objects, sort of expiration dates. It supports CSS, JavaScript and images. To use it with images, it needs a browser supporting canvas, yet it'll work anyway.

Library
=======
The use is straightforward; everything is namespaced under `localcache`. Everything should be called when the page loads, either with `window.onload` or placing it just before `body` closes. Options, common to all modes, is a map; possible values are: `load`, by default false (if it's true, it will force loading of images without getting the cached version) and `minDate`, a `Date` object setting the minimum date a cached copy must have to be used. Else, it's just loaded.

Cross-site resource caching is NOT supported due to browser limitations. Just cache what you have in your own domain.

Images
------
`localcache.loadImages({options});`

All the images must have the `cache` class and have their source located at data-src instead of src. Note that this is (Javascript-disabled)-unfriendly!

JavaScript
----------
`localcache.loadJS([array_of_scripts],{options});`

CSS
---
`localcache.loadCSS([array_of_sheets],{options});`
