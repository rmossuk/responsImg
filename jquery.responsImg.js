/*
# responsImg jQuery Plugin
# Turn your <img> tags into responsive images with retina alternatives
# version 1.4.0, July 12th, 2013
# by Etienne Talbot
*/


(function() {

  jQuery.responsImg = function(element, settings) {
    var checkSizes, config, defineWidth, determineSizes, getMobileWindowWidth, init, largestSize, resizeDetected, resizeTimer, retinaDisplay, rimData, setImage, theWindow;
    config = {
      allowDownsize: false,
      elementQuery: false,
      delay: 200,
      breakpoints: null,
      considerDevice: false
    };
    if (settings) {
      jQuery.extend(config, settings);
    }
    theWindow = jQuery(window);
    element = jQuery(element);
    rimData = {};
    resizeTimer = null;
    largestSize = 0;
    retinaDisplay = false;
    init = function() {
      rimData[0] = new Array(element.attr('src'));
      if (window.devicePixelRatio >= 1.5) {
        retinaDisplay = true;
      }
      theWindow.on('resize.responsImg orientationchange.responsImg', resizeDetected);
      determineSizes();
    };
    determineSizes = function() {
      var breakKey, breakValue, elData, key, newKey, pattern, value, _ref;
      elData = element.data();
      pattern = /^responsimg/;
      for (key in elData) {
        value = elData[key];
        if (pattern.test(key)) {
          newKey = key.replace('responsimg', '');
          if (isNaN(newKey)) {
            newKey = newKey.toLowerCase();
            _ref = config.breakpoints;
            for (breakKey in _ref) {
              breakValue = _ref[breakKey];
              if (newKey === breakKey) {
                newKey = breakValue;
              }
            }
          } else {
            newKey = parseInt(newKey, 10);
          }
          rimData[newKey] = value.replace(' ', '').split(',');
        }
      }
      checkSizes();
    };
    resizeDetected = function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkSizes, config.delay);
    };
    defineWidth = function() {
      var definedWidth, mobileWindowWidth, windowWidth;
      definedWidth = null;
      if (config.elementQuery === true) {
        definedWidth = element.width();
        if ((window.orientation != null) && config.considerDevice) {
          windowWidth = theWindow.width();
          mobileWindowWidth = getMobileWindowWidth();
          definedWidth = Math.ceil(mobileWindowWidth * definedWidth / windowWidth);
        }
      } else {
        if ((window.orientation != null) && config.considerDevice) {
          definedWidth = getMobileWindowWidth();
        } else {
          definedWidth = theWindow.width();
        }
      }
      return definedWidth;
    };
    getMobileWindowWidth = function() {
      var mobileWindowWidth;
      if (window.orientation === 0) {
        mobileWindowWidth = window.screen.width;
      } else {
        mobileWindowWidth = window.screen.height;
      }
      if (navigator.userAgent.indexOf('Android') >= 0 && window.devicePixelRatio) {
        mobileWindowWidth = mobileWindowWidth / window.devicePixelRatio;
      }
      return mobileWindowWidth;
    };
    checkSizes = function() {
      var currentSelection, doIt, key, newSrc, theWidth, value;
      theWidth = defineWidth();
      currentSelection = 0;
      largestSize = 0;
      doIt = true;
      newSrc = '';
      if (theWidth > largestSize) {
        largestSize = theWidth;
      } else if (config.allowDownsize === false) {
        doIt = false;
      }
      if (doIt === true) {
        for (key in rimData) {
          value = rimData[key];
          if (parseInt(key, 10) <= theWidth && parseInt(key, 10) >= currentSelection) {
            currentSelection = parseInt(key, 10);
            newSrc = rimData[currentSelection][0];
          }
        }
        if (retinaDisplay === true && (rimData[currentSelection][1] != null)) {
          newSrc = rimData[currentSelection][1];
        }
        setImage(newSrc);
      }
    };
    setImage = function(newSrc) {
      var oldSrc;
      oldSrc = element.attr('src');
      if (newSrc !== oldSrc) {
        element.attr('src', newSrc);
      }
    };
    init();
    this.recheck = function() {
      checkSizes();
    };
    return this;
  };

  jQuery.fn.responsImg = function(options) {
    return this.each(function() {
      var plugin;
      if (jQuery(this).data('responsImg') === void 0) {
        plugin = new jQuery.responsImg(this, options);
        jQuery(this).data('responsImg', plugin);
      }
    });
  };

}).call(this);
