/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	/* global AFRAME */

	if (typeof AFRAME === 'undefined') {
	  throw new Error('Component attempted to register before AFRAME was available.');
	}

	// document.body.clientWidth is the same as window.innerWidth
	// at this state, so we save this here to have that value
	// before A-FRAME changes it.
	var initialClientWidth = window.innerWidth;

	/**
	 * Always Fullscreen component for A-Frame.
	 */
	AFRAME.registerComponent('always-fullscreen', {
	  schema: {
	    platform: {
	      default: 'mobile',
	      oneOf: [
	          'mobile', 'desktop', 'all'
	      ]
	    },
	    debug: {default:false}
	  },

	  init: function () {
	    this.mask = this.mask.bind(this);
	    this.initialize = this.initialize.bind(this);
	    this.updateMasks = this.updateMasks.bind(this);
	    this.resizeHandler = this.resizeHandler.bind(this);
	    this.orientationChangeHandler = this.orientationChangeHandler.bind(this);
	    this.orientationChangeHelper = this.orientationChangeHelper.bind(this);
	    this.cancel = this.cancel.bind(this);

	    if (!platform) {
	      throw new Error("Platform dependency is not available");
	    }
	  },

	  update: function (oldData) {
	    if (this.el.sceneEl.hasLoaded) {
	      this.initialize();
	    } else {
	      this.el.sceneEl.addEventListener("loaded", this.initialize);
	    }
	  },

	  initialize: function() {

	    var fullscreenButton = document.querySelector('#fullscreenbutton');

	    if (fullscreenButton) {
	      fullscreenButton.parentNode.removeChild(fullscreenButton);
	    }

	    this.removeEventListeners();

	    if ((platform.os.family == 'iOS' && parseInt(platform.os.version, 10) > 8 || platform.ua.indexOf('like Mac OS X') != -1) && (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile))) {

	      this.makeTreadmill();
	      this.makeMask();

	      window.addEventListener("resize", this.resizeHandler);
	      window.addEventListener("orientationchange", this.orientationChangeHandler);

	    } else if (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile) || (this.data.platform === 'desktop' && !this.el.sceneEl.isMobile)) {

	      // If we are NOT on iOS, go Fullscreen with the Fullscreen API
	      this.makeFullscreenMask();

	      document.addEventListener("webkitfullscreenchange", this.updateMasks);
	      document.addEventListener("mozfullscreenchange", this.updateMasks);
	      document.addEventListener("msfullscreenchange", this.updateMasks);
	      document.addEventListener("webkitfullscreenchange", this.updateMasks);
	    }

	    this.updateMasks();

	  },

	  removeEventListeners: function() {
	    window.removeEventListener("resize", this.resizeHandler);
	    window.removeEventListener("orientationchange", this.orientationChangeHandler);
	    document.removeEventListener("webkitfullscreenchange", this.updateMasks);
	    document.removeEventListener("mozfullscreenchange", this.updateMasks);
	    document.removeEventListener("msfullscreenchange", this.updateMasks);
	    document.removeEventListener("webkitfullscreenchange", this.updateMasks);
	  },

	  remove: function () {
	    var mask = document.querySelector('#mask');

	    if (mask) {
	      mask.parentNode.removeChild(mask);
	    }

	    var treadmill = document.querySelector('#treadmill');

	    if (treadmill) {
	      treadmill.parentNode.removeChild(treadmill);
	    }

	    var fullscreenMask = document.querySelector('#fullscreenmask');

	    if (fullscreenMask) {
	      fullscreenMask.parentNode.removeChild(fullscreenMask);
	    }

	    var fullscreenButton = document.querySelector('#fullscreenbutton');

	    if (fullscreenButton) {
	      fullscreenButton.parentNode.removeChild(fullscreenMask);
	    }

	    this.removeEventListeners();

	    window.scrollTo(0, 0);
	    this.el.style.height = '100%';
	    this.el.sceneEl.resize();
	  },

	  makeMask: function () {
	    var mask = document.querySelector('#mask');

	    if (!mask) {
	      mask = document.createElement('div');
	      mask.id = 'mask';

	      document.body.appendChild(mask);
	    }

	    mask.style.position = 'fixed';
	    mask.style.zIndex = 9999999999;
	    mask.style.top = 0;
	    mask.style.left = 0;
	    mask.style.display = 'none';
	    mask.style.backgroundColor = '#663399';

	    this.appendCancelButton(mask);
	  },

	  makeTreadmill: function () {
	    var treadmill = document.querySelector('#treadmill');

	    if (!treadmill) {
	      treadmill = document.createElement('div');
	      treadmill.id = 'treadmill';

	      document.body.appendChild(treadmill);
	    }

	    treadmill.style.visibility = 'hidden';
	    treadmill.style.position = 'relative';
	    treadmill.style.zIndex = 10;
	    treadmill.style.left = 0;
	    treadmill.style.display = 'block';

	    // Why make it such a large number?
	    // Huge body height makes the size and position of the scrollbar fixed.
	    treadmill.style.width = '1px';
	    treadmill.style.height = '9999999999999999px';
	  },

	  makeFullscreenMask: function () {
	    var fullscreenMask = document.querySelector('#fullscreenmask');

	    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
	      if (!fullscreenMask) {
	        fullscreenMask = document.createElement('div');
	        fullscreenMask.id = 'fullscreenmask';

	        document.body.appendChild(fullscreenMask);

	        fullscreenMask.addEventListener("click", this.enterFullScreen);
	      }

	      fullscreenMask.style.position = 'fixed';
	      fullscreenMask.style.zIndex = 9999999999;
	      fullscreenMask.style.top = 0;
	      fullscreenMask.style.left = 0;
	      fullscreenMask.style.display = 'block';
	      fullscreenMask.style.width = window.innerWidth + 'px';
	      fullscreenMask.style.height = window.innerHeight + 'px';
	      fullscreenMask.style.backgroundColor = '#663399';

	      this.appendCancelButton(fullscreenMask);
	    }
	  },

	  makeFullscreenButton: function() {
	    var fullscreenButton = document.querySelector('#fullscreenbutton');

	    if (!fullscreenButton) {
	      fullscreenButton = document.createElement('button');
	      fullscreenButton.id = 'fullscreenbutton';

	      var container = document.querySelector("div.a-enter-vr");

	      if (!container) {
	        var container = document.createElement('div');
	        container.className = 'a-enter-vr';
	      }

	      container.appendChild(fullscreenButton);

	      fullscreenButton.addEventListener("click", this.initialize);
	    }

	    var marginRight = 5;
	    var height = '10vh';
	    var width = '10vh';

	    var enterVRButton = document.querySelector("button.a-enter-vr-button");

	    if (enterVRButton) {
	      marginRight = marginRight + enterVRButton.offsetWidth;
	      width = enterVRButton.offsetWidth;
	      height = enterVRButton.offsetHeight;
	    }

	    fullscreenButton.style.position = 'absolute';
	    fullscreenButton.style.zIndex = 9999;
	    fullscreenButton.style.bottom = 0;
	    fullscreenButton.style.right = marginRight + 'px';
	    fullscreenButton.style.display = 'block';
	    fullscreenButton.style.width = width;
	    fullscreenButton.style.height = height;
	  },

	  mask: function () {
	    var mask = document.querySelector('#mask');
	    var treadmill = document.querySelector('#treadmill');

	    if (this.isMinimalView()) {

	      if (mask && mask.style.display != 'none') {
	        mask.style.display = 'none';
	      }

	      if (treadmill) {
	        treadmill.style.display = 'none';
	      }

	      window.scrollTo(0, 0);
	      this.el.style.height = window.innerHeight;
	      this.el.sceneEl.resize();

	    } else {

	      if (mask) {

	        mask.style.display = 'block';

	        mask.style.width = window.innerWidth + 'px';
	        mask.style.height = window.innerHeight * 2 * this.changeFactor + 'px';

	        if (treadmill) {
	          treadmill.style.display = 'block';
	        }

	      } else {
	        this.makeFullscreenButton();
	      }

	    }

	    /*if (this.data.debug) {
	      mask.innerHTML += "<p> Height: " + window.innerHeight + " Min: " + this.getMinimalViewHeight() + " Min-AF: " + Math.round(this.getMinimalViewHeight() / this.changeFactor) + "</p>";
	    }*/

	  },

	  fullscreenMask: function() {
	    var fullscreenMask = document.querySelector('#fullscreenmask');

	    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
	      if (fullscreenMask) {
	        fullscreenMask.style.display = 'block';

	        fullscreenMask.style.width = window.innerWidth + 'px';
	        fullscreenMask.style.height = window.innerHeight + 'px';
	      } else {
	        this.makeFullscreenButton();
	      }
	    } else if (fullscreenMask) {
	      fullscreenMask.parentNode.removeChild(fullscreenMask);
	    }
	  },

	  isMinimalView: function () {
	    var windowHeight = window.innerHeight;
	    var zoom = Math.ceil(document.body.clientWidth / window.innerWidth * 10) / 10;

	    if (this.data.debug) {
	      console.log("Initial Client-Width: " + initialClientWidth);
	      console.log("window.innerHeight: " + windowHeight);
	      console.log("Zoom: " + zoom);
	      console.log("Change-Factor: " + this.changeFactor);
	      console.log("Minimal-ViewHeight: " + this.getMinimalViewHeight());
	      console.log("Minimal-ViewHeight AfterFactor: " + Math.round(this.getMinimalViewHeight() / this.changeFactor));
	    }

	    var currentHeight = windowHeight * zoom;
	    var minimalViewHeight = Math.round(this.getMinimalViewHeight() / this.changeFactor);

	    // Give it a 20px Threshold, because Chrome on iOS keeps the small Bar in Landscape-Mode
	    // But it's only necessary on Landscape
	    minimalViewHeight = this.getOrientation() === 'portrait' ? minimalViewHeight : minimalViewHeight - 20;

	    return !(currentHeight < minimalViewHeight);
	  },

	  getMinimalViewHeight: function () {

	    var orientation = this.getOrientation();

	    // innerHeight in Minimal portrait, landscape, ScreenWidth, Height, Model
	    var spec = [
	      //[1275, 320, 480, 'iPhone 4S'],
	      [1619, 552, 320, 568, 'iPhone 5, 5S'],
	      [1640, 551, 375, 667, 'iPhone 6, 6S, 7'],
	      [1648, 551, 414, 736, 'iPhone 6, 6S, 7 Plus']
	    ];

	    var index = null;

	    for (var i = 0; i < spec.length; i++) {
	      if (window.screen.width == spec[i][2] && window.screen.height == spec[i][3]) {
	        index = i;
	      }
	    }

	    if (!index) {
	      throw new Error("Couldn't detect iOS Device!");
	    }

	    if (orientation === 'portrait') {
	      return spec[index][0];
	    } else {
	      return spec[index][1];
	    }

	  },

	  enterFullScreen: function() {
	    var doc = window.document;
	    var docEl = doc.documentElement;

	    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

	    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
	      requestFullScreen.call(docEl);
	    }
	  },

	  getOrientation: function() {
	    return window.orientation === 0 || window.orientation === 180 ? 'portrait' : 'landscape';
	    //return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
	  },

	  updateMasks: function() {
	    // A-FRAME changes clientWidth during Rendering - So we need to get that Factor and apply it.
	    this.changeFactor = initialClientWidth / document.body.clientWidth;

	    if ((platform.os.family == 'iOS' && parseInt(platform.os.version, 10) > 8 || platform.ua.indexOf('like Mac OS X') != -1) && (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile))) {
	      // If we are on iOS do the magic...
	      this.mask();
	    } else if (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile) || (this.data.platform === 'desktop' && !this.el.sceneEl.isMobile)) {
	      // If we are NOT on iOS, go Fullscreen with the Fullscreen API
	      this.fullscreenMask();
	    }
	  },

	  resizeHandler: function() {

	    // This is so that we do things when scrolling ended
	    if (this.resizeTimeout) {
	      window.clearTimeout(this.resizeTimeout);
	    }

	    this.resizeTimeout = window.setTimeout(this.updateMasks, 50);

	    if (this.data.debug) {
	      console.log("Resize Event");
	    }
	  },

	  orientationChangeHandler: function() {

	    this.orientationChangeHelper();

	    // TODO: Resize-Handler should not run on orientation-change,
	    // but the following code seems useless
	    if (this.resizeTimeout) {
	      window.clearTimeout(this.resizeTimeout);
	    }

	    if (this.orientationTimeout) {
	      window.clearTimeout(this.orientationTimeout);
	    }

	    this.orientationTimeout = window.setTimeout(this.updateMasks, 500);

	  },

	  orientationChangeHelper: function () {

	    if ((this.lastInnerWidth && this.lastInnerHeight) && window.innerWidth === this.lastInnerWidth && window.innerHeight === this.lastInnerHeight) {
	      this.noChangeCount = this.noChangeCount ? this.noChangeCount + 1 : 1;

	      if (this.noChangeCount >= 50) {
	        if (this.orientationTimeout) {
	          window.clearTimeout(this.orientationTimeout);
	        }
	        if (this.orientationChangeHelperTimout) {
	          window.clearTimeout(this.orientationChangeHelperTimout);
	        }

	        if (this.data.debug) {
	          console.log("Updating Masks after Orientation-Change due to Count.")
	        }

	        this.noChangeCount = 1;

	        this.updateMasks();
	      } else {

	        if (this.orientationChangeHelperTimout) {
	          window.clearTimeout(this.orientationChangeHelperTimout);
	        }

	        this.orientationChangeHelperTimout = window.setTimeout(this.orientationChangeHelper, 1);
	      }
	    } else {
	      if (this.orientationChangeHelperTimout) {
	        window.clearTimeout(this.orientationChangeHelperTimout);
	      }

	      this.orientationChangeHelperTimout = window.setTimeout(this.orientationChangeHelper, 10);
	    }

	    this.lastInnerWidth = window.innerWidth;
	    this.lastInnerHeight = window.innerHeight;

	  },

	  cancel: function(evt) {
	    if (typeof evt.stopPropagation == "function") {
	      evt.stopPropagation();
	    } else {
	      evt.cancelBubble = true;
	    }

	    this.remove();
	    this.makeFullscreenButton();
	  },

	  appendCancelButton: function(element) {
	    var cancelButton = document.createElement('button');
	    cancelButton.className = 'alwaysfullscreencancelbutton';

	    element.appendChild(cancelButton);

	    cancelButton.addEventListener("click", this.cancel);
	  }

	});


/***/ }
/******/ ]);