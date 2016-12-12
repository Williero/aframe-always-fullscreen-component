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
    this.orientationChange = this.orientationChange.bind(this);

    // A-FRAME changes clientWidth during Rendering - So we need to get that Factor and apply it.
    this.changeFactor = initialClientWidth / document.body.clientWidth;

    if (!platform) {
      throw new Error("Platform dependency is not available");
    }

    if (platform.os.family == 'iOS' && parseInt(platform.os.version, 10) > 8 || platform.ua.indexOf('like Mac OS X') != -1) {
      // If we are on iOS do the magic...

      window.addEventListener("scroll", this.mask);
      window.addEventListener("orientationchange", this.orientationChange);

      this.makeTreadmill();
      this.makeMask();
      this.mask();

    } else {
      // If we are NOT on iOS, go Fullscreen with the Fullscreen API
      if (this.data.platform === 'all' || (this.data.platform === 'mobile' && this.el.sceneEl.isMobile) || (this.data.platform === 'desktop' && !this.el.sceneEl.isMobile)) {
        this.makeFullscreenMask();
      }
    }

  },

  update: function (oldData) {

  },

  remove: function () {

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
  },

  makeTreadmill: function () {
    var treadmill = document.querySelector('#treadmill');

    if (treadmill) {
      throw new Error('There is an existing treadmill element.');
    }

    treadmill = document.createElement('div');
    treadmill.id = 'treadmill';

    document.body.appendChild(treadmill);

    treadmill.style.visibility = 'hidden';
    treadmill.style.position = 'relative';
    treadmill.style.zIndex = 10;
    treadmill.style.left = 0;

    // Why make it such a large number?
    // Huge body height makes the size and position of the scrollbar fixed.
    treadmill.style.width = '1px';
    treadmill.style.height = '9999999999999999px';
  },

  makeFullscreenMask: function () {
    var fullscreenMask = document.querySelector('#fullscreenmask');

    if (fullscreenMask) {
      throw new Error('There is an existing fullscreenmask element.');
    }

    fullscreenMask = document.createElement('div');
    fullscreenMask.id = 'fullscreenmask';

    document.body.appendChild(fullscreenMask);

    fullscreenMask.style.position = 'fixed';
    fullscreenMask.style.zIndex = 9999999999;
    fullscreenMask.style.top = 0;
    fullscreenMask.style.left = 0;
    fullscreenMask.style.display = 'block';
    fullscreenMask.style.width = window.innerWidth + 'px';
    fullscreenMask.style.height = window.innerHeight + 'px';
    fullscreenMask.style.backgroundColor = '#663399';

    fullscreenMask.addEventListener("click", this.enterFullScreen);
  },

  repaintElement: function (element) {
    element.style.webkitTransform = 'translateZ(0)';

    element.style.display = 'none';
    element.style.display = 'block';
  },

  mask: function () {
    var mask = document.querySelector('#mask');

    if (this.isMinimalView()) {
      mask.style.display = 'none';
      window.scrollTo(0, 0);
      this.el.style.height = window.innerHeight;
      this.el.sceneEl.resize();
    } else {
      mask.style.display = 'block';

      mask.style.width = window.innerWidth + 'px';
      mask.style.height = window.innerHeight * 2 + 'px';

      this.repaintElement(mask);
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

    //console.log("innerHeight:" + window.innerHeight + " Zoom:" + zoom + " (" + document.body.clientWidth + "/" + window.innerWidth + ")" + " Result:" + windowHeight * zoom + " MinimalViewHeight:" + getMinimalViewHeight());
    return !((windowHeight * zoom) < Math.round(this.getMinimalViewHeight() / this.changeFactor));
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
    var fullscreenMask = document.querySelector('#fullscreenmask');

    if (fullscreenMask) {
      fullscreenMask.parentNode.removeChild(fullscreenMask);
    }

    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
  },

  getOrientation: function() {
    return window.orientation === 0 || window.orientation === 180 ? 'portrait' : 'landscape';
  },

  orientationChange: function() {
    // A-FRAME changes clientWidth during Rendering - So we need to get that Factor and apply it.
    this.changeFactor = initialClientWidth / document.body.clientWidth;
    this.mask();
  }
});
