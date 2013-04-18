/*
  Copyright 2010 Google Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/**
 * @fileoverview Bookmark bubble library. This is meant to be included in the
 * main JavaScript binary of a mobile web application.
 *
 * Supported browsers: iPhone / iPod / iPad Safari 3.0+
 */

var google = google || {};
google.bookmarkbubble = google.bookmarkbubble || {};


/**
 * Binds a context object to the function.
 * @param {Function} fn The function to bind to.
 * @param {Object} context The "this" object to use when the function is run.
 * @return {Function} A partially-applied form of fn.
 */
google.bind = function(fn, context) {
  return function() {
    return fn.apply(context, arguments);
  };
};


/**
 * Function used to define an abstract method in a base class. If a subclass
 * fails to override the abstract method, then an error will be thrown whenever
 * that method is invoked.
 */
google.abstractMethod = function() {
  throw Error('Unimplemented abstract method.');
};



/**
 * The bubble constructor. Instantiating an object does not cause anything to
 * be rendered yet, so if necessary you can set instance properties before
 * showing the bubble.
 * @constructor
 */
google.bookmarkbubble.Bubble = function() {
  /**
   * Handler for the scroll event. Keep a reference to it here, so it can be
   * unregistered when the bubble is destroyed.
   * @type {function()}
   * @private
   */
  this.boundScrollHandler_ = google.bind(this.setPosition, this);

  /**
   * The bubble element.
   * @type {Element}
   * @private
   */
  this.element_ = null;

  /**
   * Whether the bubble has been destroyed.
   * @type {boolean}
   * @private
   */
  this.hasBeenDestroyed_ = false;
};


/**
 * Shows the bubble if allowed. It is not allowed if:
 * - The browser is not Mobile Safari, or
 * - The user has dismissed it too often already, or
 * - The hash parameter is present in the location hash, or
 * - The application is in fullscreen mode, which means it was already loaded
 *   from a homescreen bookmark.
 * @return {boolean} True if the bubble is being shown, false if it is not
 *     allowed to show for one of the aforementioned reasons.
 */
google.bookmarkbubble.Bubble.prototype.showIfAllowed = function() {
  if (!this.isAllowedToShow_()) {
    return false;
  }

  this.show_();
  return true;
};


/**
 * Shows the bubble if allowed after loading the icon image. This method creates
 * an image element to load the image into the browser's cache before showing
 * the bubble to ensure that the image isn't blank. Use this instead of
 * showIfAllowed if the image url is http and cacheable.
 * This hack is necessary because Mobile Safari does not properly render
 * image elements with border-radius CSS.
 * @param {function()} opt_callback Closure to be called if and when the bubble
 *        actually shows.
 * @return {boolean} True if the bubble is allowed to show.
 */
google.bookmarkbubble.Bubble.prototype.showIfAllowedWhenLoaded =
    function(opt_callback) {
  if (!this.isAllowedToShow_()) {
    return false;
    
  }

  var self = this;
  // Attach to self to avoid garbage collection.
  var img = self.loadImg_ = document.createElement('img');
  img.src = self.getIconUrl_();
  img.onload = function() {
    if (img.complete) {
      delete self.loadImg_;
      img.onload = null;  // Break the circular reference.

      self.show_();
      opt_callback && opt_callback();
    }
  };
  img.onload();

  return true;
};


/**
 * Sets the parameter in the location hash. As it is
 * unpredictable what hash scheme is to be used, this method must be
 * implemented by the host application.
 *
 * This gets called automatically when the bubble is shown. The idea is that if
 * the user then creates a bookmark, we can later recognize on application
 * startup whether it was from a bookmark suggested with this bubble.
 */
google.bookmarkbubble.Bubble.prototype.setHashParameter = google.abstractMethod;


/**
 * Whether the parameter is present in the location hash. As it is
 * unpredictable what hash scheme is to be used, this method must be
 * implemented by the host application.
 *
 * Call this method during application startup if you want to log whether the
 * application was loaded from a bookmark with the bookmark bubble promotion
 * parameter in it.
 *
 * @return {boolean} Whether the bookmark bubble parameter is present in the
 *     location hash.
 */
google.bookmarkbubble.Bubble.prototype.hasHashParameter = google.abstractMethod;


/**
 * The number of times the user must dismiss the bubble before we stop showing
 * it. This is a public property and can be changed by the host application if
 * necessary.
 * @type {number}
 */
google.bookmarkbubble.Bubble.prototype.NUMBER_OF_TIMES_TO_DISMISS = 5;


/**
 * Time in milliseconds. If the user does not dismiss the bubble, it will auto
 * destruct after this amount of time.
 * @type {number}
 */
google.bookmarkbubble.Bubble.prototype.TIME_UNTIL_AUTO_DESTRUCT = 15000;


/**
 * The prefix for keys in local storage. This is a public property and can be
 * changed by the host application if necessary.
 * @type {string}
 */
google.bookmarkbubble.Bubble.prototype.LOCAL_STORAGE_PREFIX = 'BOOKMARK_';


/**
 * The key name for the dismissed state.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.DISMISSED_ = 'DISMISSED_COUNT';


/**
 * The arrow image in base64 data url format.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.IMAGE_ARROW_DATA_URL_ = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAATCAMAAABSrFY3AAABKVBMVEUAAAD///8AAAAAAAAAAAAAAAAAAADf398AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD09PQAAAAAAAAAAAC9vb0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD19fUAAAAAAAAAAAAAAADq6uoAAAAAAAAAAAC8vLzU1NTT09MAAADg4OAAAADs7OwAAAAAAAAAAAD///+cueenwerA0vC1y+3a5fb5+/3t8vr4+v3w9PuwyOy3zO3h6vfh6vjq8Pqkv+mat+fE1fHB0/Cduuifu+iuxuuivemrxOvC1PDz9vzJ2fKpwuqmwOrb5vapw+q/0vDf6ffK2vLN3PPprJISAAAAQHRSTlMAAAEGExES7FM+JhUoQSxIRwMbNfkJUgXXBE4kDQIMHSA0Tw4xIToeTSc4Chz4OyIjPfI3QD/X5OZR6zzwLSUPrm1y3gAAAQZJREFUeF5lzsVyw0AURNE3IMsgmZmZgszQZoeZOf//EYlG5Yrhbs+im4Dj7slM5wBJ4OJ+undAUr68gK/Hyb6Bcp5yBR/w8jreNeAr5Eg2XE7g6e2/0z6cGw1JQhpmHP3u5aiPPnTTkIK48Hj9Op7bD3btAXTfgUdwYjwSDCVXMbizO0O4uDY/x4kYC5SWFnfC6N1a9RCO7i2XEmQJj2mHK1Hgp9Vq3QBRl9shuBLGhcNtHexcdQCnDUoUGetxDD+H2DQNG2xh6uAWgG2/17o1EmLqYH0Xej0UjHAaFxZIV6rJ/WK1kg7QZH8HU02zmdJinKZJaDV3TVMjM5Q9yiqYpUwiMwa/1apDXTNESjsAAAAASUVORK5CYII=';


/**
 * The close image in base64 data url format.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.IMAGE_CLOSE_DATA_URL_ = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAALVBMVEXM3fm+1Pfb5/rF2fjw9f23z/aavPOhwfTp8PyTt/L3+v7T4vqMs/K7zP////+qRWzhAAAAXElEQVQIW2O4CwUM996BwVskxtOqd++2rwMyPI+ve31GD8h4Madqz2mwms5jZ/aBGS/mHIDoen3m+DowY8/hOVUgxusz+zqPg7SvPA1UxQfSvu/du0YUK2AMmDMA5H1qhVX33T8AAAAASUVORK5CYII=';


/**
 * The link used to locate the application's home screen icon to display inside
 * the bubble. The default link used here is for an iPhone home screen icon
 * without gloss. If your application uses a glossy icon, change this to
 * 'apple-touch-icon'.
 * @type {string}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.REL_ICON_ =
    'apple-touch-icon-precomposed';


/**
 * Regular expression for detecting an iPhone or iPod or iPad.
 * @type {!RegExp}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.MOBILE_SAFARI_USERAGENT_REGEX_ =
    /iPhone|iPod|iPad/;


/**
 * Determines whether the bubble should be shown or not.
 * @return {boolean} Whether the bubble should be shown or not.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.isAllowedToShow_ = function() {
  return this.isMobileSafari_() &&
      !this.hasBeenDismissedTooManyTimes_() &&
      !this.isFullscreen_() &&
      !this.hasHashParameter();
};


/**
 * Builds and shows the bubble.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.show_ = function() {
  this.element_ = this.build_();

  document.body.appendChild(this.element_);

  this.setHashParameter();

  window.setTimeout(this.boundScrollHandler_, 1);
  window.addEventListener('scroll', this.boundScrollHandler_, false);

  // If the user does not dismiss the bubble, slide out and destroy it after
  // some time.
  window.setTimeout(google.bind(this.autoDestruct_, this),
      this.TIME_UNTIL_AUTO_DESTRUCT);
};


/**
 * Destroys the bubble by removing its DOM nodes from the document.
 */
google.bookmarkbubble.Bubble.prototype.destroy = function() {
  if (this.hasBeenDestroyed_) {
    return;
  }
  window.removeEventListener('scroll', this.boundScrollHandler_, false);
  if (this.element_ && this.element_.parentNode == document.body) {
    document.body.removeChild(this.element_);
    this.element_ = null;
  }
  this.hasBeenDestroyed_ = true;
};


/**
 * Remember that the user has dismissed the bubble once more.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.rememberDismissal_ = function() {
  if (window.localStorage) {
    try {
      var key = this.LOCAL_STORAGE_PREFIX + this.DISMISSED_;
      var value = Number(window.localStorage[key]) || 0;
      window.localStorage[key] = String(value + 1);
    } catch (ex) {
      // Looks like we've hit the storage size limit. Currently we have no
      // fallback for this scenario, but we could use cookie storage instead.
      // This would increase the code bloat though.
    }
  }
};


/**
 * Whether the user has dismissed the bubble often enough that we will not
 * show it again.
 * @return {boolean} Whether the user has dismissed the bubble often enough
 *     that we will not show it again.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.hasBeenDismissedTooManyTimes_ =
    function() {
  if (!window.localStorage) {
    // If we can not use localStorage to remember how many times the user has
    // dismissed the bubble, assume he has dismissed it. Otherwise we might end
    // up showing it every time the host application loads, into eternity.
    return true;
  }
  try {
    var key = this.LOCAL_STORAGE_PREFIX + this.DISMISSED_;

    // If the key has never been set, localStorage yields undefined, which
    // Number() turns into NaN. In that case we'll fall back to zero for
    // clarity's sake.
    var value = Number(window.localStorage[key]) || 0;

    return value >= this.NUMBER_OF_TIMES_TO_DISMISS;
  } catch (ex) {
    // If we got here, something is wrong with the localStorage. Make the same
    // assumption as when it does not exist at all. Exceptions should only
    // occur when setting a value (due to storage limitations) but let's be
    // extra careful.
    return true;
  }
};


/**
 * Whether the application is running in fullscreen mode.
 * @return {boolean} Whether the application is running in fullscreen mode.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.isFullscreen_ = function() {
  return !!window.navigator.standalone;
};


/**
 * Whether the application is running inside Mobile Safari.
 * @return {boolean} True if the current user agent looks like Mobile Safari.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.isMobileSafari_ = function() {
  return this.MOBILE_SAFARI_USERAGENT_REGEX_.test(navigator.userAgent);
};


/**
 * Positions the bubble at the bottom of the viewport using an animated
 * transition.
 */
google.bookmarkbubble.Bubble.prototype.setPosition = function() {
  this.element_.style.WebkitTransition = '-webkit-transform 0.7s ease-out';
  this.element_.style.WebkitTransform = 'translateY(' +
      (window.pageYOffset + window.innerHeight - this.element_.offsetHeight -
      17) + 'px)';
};


/**
 * Destroys the bubble by removing its DOM nodes from the document, and
 * remembers that it was dismissed.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.closeClickHandler_ = function() {
  this.destroy();
  this.rememberDismissal_();
};


/**
 * Gets called after a while if the user ignores the bubble.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.autoDestruct_ = function() {
  if (this.hasBeenDestroyed_) {
    return;
  }
  this.element_.style.WebkitTransition = '-webkit-transform 0.7s ease-in';
  this.element_.style.WebkitTransform = 'translateY(' +
      (window.pageYOffset + window.innerHeight) + 'px)';
  window.setTimeout(google.bind(this.destroy, this), 700);
};


/**
 * The url of the app's bookmark icon.
 * @type {string|undefined}
 * @private
 */
google.bookmarkbubble.Bubble.prototype.iconUrl_;


/**
 * Scrapes the document for a link element that specifies an Apple favicon and
 * returns the icon url. Returns an empty data url if nothing can be found.
 * @return {string} A url string.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.getIconUrl_ = function() {
  if (!this.iconUrl_) {
    var link = this.getLink(this.REL_ICON_);
    if (!link || !(this.iconUrl_ = link.href)) {
        this.iconUrl_ = 'data:image/png;base64,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';
    }
  }
  return this.iconUrl_;
};


/**
 * Gets the requested link tag if it exists.
 * @param {string} rel The rel attribute of the link tag to get.
 * @return {Element} The requested link tag or null.
 */
google.bookmarkbubble.Bubble.prototype.getLink = function(rel) {
  rel = rel.toLowerCase();
  var links = document.getElementsByTagName('link');
  for (var i = 0; i < links.length; ++i) {
    var currLink = /** @type {Element} */ (links[i]);
    if (currLink.getAttribute('rel').toLowerCase() == rel) {
      return currLink;
    }
  }
  return null;
};


/**
 * Creates the bubble and appends it to the document.
 * @return {Element} The bubble element.
 * @private
 */
google.bookmarkbubble.Bubble.prototype.build_ = function() {
  var bubble = document.createElement('div');
  bubble.style.position = 'absolute';
  bubble.style.zIndex = 1000;
  bubble.style.width = '100%';
  bubble.style.left = '0';
  bubble.style.top = '0';
  bubble.style.WebkitTransform = 'translateY(' +
      (window.pageYOffset + window.innerHeight) + 'px)';

  var bubbleInner = document.createElement('div');
  bubbleInner.style.position = 'relative';
  bubbleInner.style.width = '214px';
  bubbleInner.style.margin = '0 auto';
  bubbleInner.style.border = '2px solid #fff';
  bubbleInner.style.padding = '20px 20px 20px 10px';
  bubbleInner.style.WebkitBorderRadius = '8px';
  bubbleInner.style.WebkitBoxShadow = '0 0 8px rgba(0, 0, 0, 0.7)';
  bubbleInner.style.WebkitBackgroundSize = '100% 8px';
  bubbleInner.style.backgroundColor = '#b0c8ec';
  bubbleInner.style.background = '#cddcf3 -webkit-gradient(linear, ' +
      'left bottom, left top, from(#b3caed), to(#cddcf3)) no-repeat bottom';
  bubbleInner.style.font = '13px/17px sans-serif';
  bubble.appendChild(bubbleInner);

  // The "Add to Home Screen" text is intended to be the exact same size text
  // that is displayed in the menu of Mobile Safari on iPhone.
  bubbleInner.innerHTML = 'Install this web app on your phone.  Tap the send icon below and <b>\'Add to Home Screen\'</b>';

  var icon = document.createElement('div');
  icon.style['float'] = 'left';
  icon.style.width = '55px';
  icon.style.height = '55px';
  icon.style.margin = '-2px 7px 3px 5px';
  icon.style.background =
      '#fff url(' + this.getIconUrl_() + ') no-repeat -1px -1px';
  icon.style.WebkitBorderRadius = '10px';
  icon.style.WebkitBackgroundSize = '57px';
  icon.style.WebkitBoxShadow = '0 2px 5px rgba(0, 0, 0, 0.4)';
  bubbleInner.insertBefore(icon, bubbleInner.firstChild);

  var arrow = document.createElement('div');
  arrow.style.backgroundImage = 'url(' + this.IMAGE_ARROW_DATA_URL_ + ')';
  arrow.style.width = '25px';
  arrow.style.height = '19px';
  arrow.style.position = 'absolute';
  arrow.style.bottom = '-19px';
  arrow.style.left = '111px';
  bubbleInner.appendChild(arrow);

  var close = document.createElement('a');
  close.onclick = google.bind(this.closeClickHandler_, this);
  close.style.position = 'absolute';
  close.style.display = 'block';
  close.style.top = '2px';
  close.style.right = '2px';
  close.style.width = '26px';
  close.style.height = '26px';
  close.style.border = '10px solid transparent';
  close.style.background =
      'url(' + this.IMAGE_CLOSE_DATA_URL_ + ') no-repeat';
  bubbleInner.appendChild(close);

  return bubble;
};
