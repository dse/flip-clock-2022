/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/components/audio.js":
/*!************************************!*\
  !*** ./src/js/components/audio.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ ClockTicker; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/components/utils.js");


/*global AudioContext */
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


// SAFARI NOTES
//
// - When using file:// protocol and <audio> element there is lag.
//
// - When using file:// protocol, XMLHttpRequests will not work
//   so we can't do the Web Audio API unless we can find a way
//   to get an audio buffer from an <audio> element.
var ClockTicker = /*#__PURE__*/function () {
  function ClockTicker(audio) {
    var _this = this;
    _classCallCheck(this, ClockTicker);
    if (audio && audio instanceof HTMLMediaElement) {
      this.element = audio;
    } else if (typeof audio === 'string') {
      this.url = audio;
    } else {
      throw new Error("no audio specified");
    }
    if (this.element) {
      // do nothing for now
    } else if (this.url) {
      if (!window.AudioContext) {
        window.AudioContext = window.webkitAudioContext;
      }
      if (!window.AudioContext) {
        return;
      }
      this.context = new AudioContext();
      this.gainNode = this.context.createGain();
      this.gainNode.gain.value = 1;
      this.gainNode.connect(this.context.destination);
      var request = new XMLHttpRequest();
      request.open('GET', this.url, true);
      request.responseType = 'arraybuffer';
      request.onload = function () {
        _this.context.decodeAudioData(request.response, function (buffer) {
          _this.buffer = buffer;
        });
      };
      request.send();
    }
    this.workAroundNoAutoPlay();
  }
  _createClass(ClockTicker, [{
    key: "workAroundNoAutoPlay",
    value: function workAroundNoAutoPlay() {
      var _this2 = this;
      var tempHandler = function tempHandler() {
        document.body.removeEventListener('click', tempHandler);
        document.body.removeEventListener('tap', tempHandler);
        document.body.removeEventListener('touchstart', tempHandler);
        _this2.context.resume();
      };
      document.body.addEventListener('click', tempHandler);
      document.body.addEventListener('tap', tempHandler);
      document.body.addEventListener('touchstart', tempHandler);
    }
  }, {
    key: "setTickVolume",
    value: function setTickVolume() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      if (typeof value === 'string') {
        value = Number(value);
        if (isNaN(value)) {
          value = 1;
        }
      }
      this.tickVolume = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(value, 0, 1);
      if (this.gainNode) {
        this.gainNode.gain.value = this.tickVolume;
      }
    }
  }, {
    key: "play",
    value: function play() {
      if (this.element) {
        // do nothing
      } else if (this.url) {
        if (!this.context || this.context.suspended || !this.buffer) {
          return;
        }
        var source = this.context.createBufferSource();
        source.connect(this.gainNode);
        source.buffer = this.buffer;
        source.start(0);
      }
    }
  }]);
  return ClockTicker;
}();


/***/ }),

/***/ "./src/js/components/calendar-clock.js":
/*!*********************************************!*\
  !*** ./src/js/components/calendar-clock.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ CalendarClock2022; }
/* harmony export */ });
/* harmony import */ var _splitflap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./splitflap */ "./src/js/components/splitflap.js");
/* harmony import */ var _clock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clock */ "./src/js/components/clock.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/js/components/utils.js");


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var CalendarClock2022 = /*#__PURE__*/function (_FlipClock) {
  _inherits(CalendarClock2022, _FlipClock);
  var _super = _createSuper(CalendarClock2022);
  function CalendarClock2022() {
    _classCallCheck(this, CalendarClock2022);
    return _super.apply(this, arguments);
  }
  _createClass(CalendarClock2022, [{
    key: "initOptions",
    value: function initOptions() {
      _get(_getPrototypeOf(CalendarClock2022.prototype), "initOptions", this).call(this);
      this.flickTimeoutMs = 5000;
    }
  }, {
    key: "initElements",
    value: function initElements() {
      this.elements.calendarMonth = this.element.querySelector('[data-clock-calendar-month]');
      this.elements.calendarYear = this.element.querySelector('[data-clock-calendar-year]');
    }
  }, {
    key: "initSplitFlaps",
    value: function initSplitFlaps() {
      var startYear = 1970;
      var endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;
      this.calendarSplitFlaps = {};
      this.calendarSplitFlapArray = [];
      if (this.elements.calendarMonth) {
        this.splitFlaps.calendarMonth = new _splitflap__WEBPACK_IMPORTED_MODULE_0__["default"](this.elements.calendarMonth, 'calendarMonth', 0, 11, _utils__WEBPACK_IMPORTED_MODULE_2__.MONTHS, {
          flickTimeoutMs: this.flickTimeoutMs
        });
        this.calendarSplitFlapArray.push({
          splitFlap: this.splitFlaps.calendarMonth
        });
      }
      if (this.elements.calendarYear) {
        this.splitFlaps.calendarYear = new _splitflap__WEBPACK_IMPORTED_MODULE_0__["default"](this.elements.calendarYear, 'calendarYear', startYear, endYear, {
          flickTimeoutMs: this.flickTimeoutMs
        });
        this.calendarSplitFlapArray.push({
          splitFlap: this.splitFlaps.calendarYear
        });
      }
      var calendarDayElements = Array.from(document.querySelectorAll('[data-clock-calendar-day]'));
      this.elements.calendarDays = [];
      this.splitFlaps.calendarDays = [];
      for (var i = 0; i < calendarDayElements.length; i += 1) {
        var elt = calendarDayElements[i];
        this.elements.calendarDays.push(elt);
        var sf = new _splitflap__WEBPACK_IMPORTED_MODULE_0__["default"](elt, 0, 31, function (state) {
          return state ? state : '';
        }, {
          flickTimeoutMs: this.flickTimeoutMs
        });
        this.splitFlaps.calendarDays.push(sf);
        this.calendarSplitFlapArray.push({
          splitFlap: sf
        });
      }
    }
  }, {
    key: "initInterSplitFlapDelay",
    value: function initInterSplitFlapDelay() {
      this.interSplitFlapDelay = 5;
      for (var i = 0; i < this.calendarSplitFlapArray.length; i += 1) {
        var delay = 1 + this.interSplitFlapDelay * i;
        this.calendarSplitFlapArray[i].splitFlap.delay = delay;
      }
    }
  }, {
    key: "updateFromPreferences",
    value: function updateFromPreferences() {
      if (this.splitFlaps.calendarMonth) {
        this.splitFlaps.calendarMonth.enableTicking = this.enableTicking;
        this.splitFlaps.calendarMonth.tickVolume = this.tickVolume;
      }
      if (this.splitFlaps.calendarYear) {
        this.splitFlaps.calendarYear.enableTicking = this.enableTicking;
        this.splitFlaps.calendarYear.tickVolume = this.tickVolume;
      }
    }
  }, {
    key: "updateSplitFlaps",
    value: function updateSplitFlaps() {
      this.date = new Date();
      var month;
      var year;
      var flick = false;
      if (this.splitFlaps.calendarMonth) {
        this.splitFlaps.calendarMonth.goTo(this.date.getMonth());
        month = this.splitFlaps.calendarMonth.flickTargetState;
        if (month == null) {
          month = this.splitFlaps.calendarMonth.targetState;
        } else {
          flick = true;
        }
      }
      if (this.splitFlaps.calendarYear) {
        this.splitFlaps.calendarYear.goTo(this.date.getFullYear());
        year = this.splitFlaps.calendarYear.flickTargetState;
        if (year == null) {
          year = this.splitFlaps.calendarYear.targetState;
        } else {
          flick = true;
        }
      }
      this.updateCalendarSplitFlaps(year, month, flick);
    }
  }, {
    key: "setTicker",
    value: function setTicker(ticker) {
      if (this.splitFlaps.calendarMonth) {
        this.splitFlaps.calendarMonth.setTicker(ticker);
      }
      if (this.splitFlaps.calendarYear) {
        this.splitFlaps.calendarYear.setTicker(ticker);
      }
    }
  }, {
    key: "updateCalendarSplitFlaps",
    value: function updateCalendarSplitFlaps(year, month, flick) {
      var _year, _month;
      if (!this.splitFlaps.calendarDays) {
        return;
      }
      if (flick == null) {
        flick = false;
      }
      var date = new Date();
      year = (_year = year) !== null && _year !== void 0 ? _year : date.getFullYear();
      month = (_month = month) !== null && _month !== void 0 ? _month : date.getMonth();
      var startMonth = new Date(year, month, 1); // first day of the month
      var endMonth = new Date(year, month + 1, 0); // last day of the month
      var startWeekday = startMonth.getDay(); // from 0 to 6 inclusive
      var dayCount = endMonth.getDate(); // from 28 to 31 inclusive

      // blank out some of the splitflaps on the first line
      for (var i = 0; i < startWeekday; i += 1) {
        var sf = this.splitFlaps.calendarDays[i];
        if (sf) {
          sf.goTo(0);
        }
      }

      // fill out the calendar days (from 0 to (27..30) inclusive)
      for (var _i = 0; _i < dayCount; _i += 1) {
        var _sf = this.splitFlaps.calendarDays[_i + startWeekday];
        if (_sf) {
          _sf.goTo(_i + 1); // from 1 to (28..31) inclusive
        }
      }

      // blank out remaining splitflaps
      for (var _i2 = startWeekday + dayCount; _i2 < this.splitFlaps.calendarDays.length; _i2 += 1) {
        var _sf2 = this.splitFlaps.calendarDays[_i2];
        if (_sf2) {
          _sf2.goTo(0);
        }
      }
    }
  }]);
  return CalendarClock2022;
}(_clock__WEBPACK_IMPORTED_MODULE_1__["default"]);


/***/ }),

/***/ "./src/js/components/clock.js":
/*!************************************!*\
  !*** ./src/js/components/clock.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ FlipClock2022; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/components/utils.js");


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var FlipClock2022 = /*#__PURE__*/function () {
  function FlipClock2022(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, FlipClock2022);
    Object.assign(this, options);
    this.element = element;
    if (typeof this.element === 'string') {
      this.element = document.getElementById(this.element);
    }
    if (!this.element) {
      throw new Error('element not specified or not found');
    }
    this.initOptions();
    this.initPreferences();
    this.elements = {};
    this.initElements();
    this.splitFlaps = {};
    this.splitFlapArray = [];
    this.initSplitFlaps();
    this.initInterSplitFlapDelay();
    this.updateFromPreferences();
  }
  _createClass(FlipClock2022, [{
    key: "initOptions",
    value: function initOptions() {
      this.updateEveryMs = 1000;
      this.flickTimeoutMs = 2000;
    }
  }, {
    key: "initPreferences",
    value: function initPreferences() {
      var _JSON$parse, _JSON$parse2;
      this.enableTicking = (_JSON$parse = JSON.parse(localStorage.getItem('FlipClock2022.enableTicking'))) !== null && _JSON$parse !== void 0 ? _JSON$parse : false;
      this.tickVolume = (_JSON$parse2 = JSON.parse(localStorage.getItem('FlipClock2022.tickVolume'))) !== null && _JSON$parse2 !== void 0 ? _JSON$parse2 : 1;
    }
  }, {
    key: "setTicking",
    value: function setTicking() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.enableTicking = flag;
      localStorage.setItem('FlipClock2022.enableTicking', JSON.stringify(this.enableTicking));
      this.updateFromPreferences();
    }
  }, {
    key: "setTickVolume",
    value: function setTickVolume() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.tickVolume = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(value, 0, 1);
      localStorage.setItem('FlipClock2022.tickVolume', JSON.stringify(this.tickVolume));
      this.updateFromPreferences();
    }
  }, {
    key: "start",
    value: function start() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      this.run();
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.isRunning) {
        return;
      }
      delete this.isRunning;
      if (this.timeout) {
        clearTimeout(this.timeout);
        delete this.timeout;
      }
    }
  }, {
    key: "run",
    value: function run() {
      this.updateSplitFlaps();
      var msecs = this.updateEveryMs - this.date.getMilliseconds() % this.updateEveryMs;
      this.timeout = setTimeout(this.run.bind(this), msecs);
    }
  }]);
  return FlipClock2022;
}();


/***/ }),

/***/ "./src/js/components/splitflap.js":
/*!****************************************!*\
  !*** ./src/js/components/splitflap.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ SplitFlap; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/js/components/utils.js");


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }


/**
 * const splitFlap = new SplitFlap(<element>, <arrayOfString>, [<stringFn>], [<options>]);
 * const splitFlap = new SplitFlap(<element>, <startValue>, <endValue>, [<options>]);
 *
 * <element> is a reference to a DOM element.  It can be a string id
 * or an HTMLElement object.
 *
 * <startValue> and <endValue> specify a range of numeric values.  The
 * range includes both the <startValue> and the <endValue>.  Examples:
 *
 *     0, 23
 *     1, 12
 *     1970, 2030
 *
 * <arrayOfStrings> specifies a series of HTML strings to display.
 * Their corresponding numeric state values start at 0 and are indices
 * into this array.
 *
 * <stringFn> is an optional function that transforms a numeric value
 * into an HTML string to display.  Examples:
 *
 *     x => x.padStart(2, '0')
 *
 *     function (hour24) {
 *         const hour12 = (hour24 + 11) % 12 + 1;
 *         const ampm = hour24 < 12 ? 'am' : 'pm';
 *         return `${hour12} <span class="ampm ${ampm}">${ampm}</span>`;
 *     }
 *
 * <options> is an optional object argument from which additional
 * properties are assigned.
 */
var SplitFlap = /*#__PURE__*/function () {
  function SplitFlap() {
    _classCallCheck(this, SplitFlap);
    /**
     * Process command line arguments.
     */
    var args = Array.from(arguments);
    this.element = args.shift();
    if (typeof this.element === 'string') {
      this.element = document.getElementById(this.element);
    }
    if (!this.element) {
      if (typeof arguments[0] === 'string') {
        throw new Error('element not found: #' + arguments[0]);
      } else {
        throw new Error('element not found');
      }
    }
    while (args.length) {
      if (Array.isArray(args[0])) {
        this.strings = args.shift();
        this.startValue = 0;
        this.endValue = this.strings.length - 1;
      } else if (args.length >= 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
        this.startValue = args.shift();
        this.endValue = args.shift();
      } else if (typeof args[0] === 'function') {
        this.stringFn = args.shift();
      } else if (Object.prototype.toString.call(args[0]) === '[object Object]') {
        // plain object
        Object.assign(this, args.shift());
      } else if (typeof args[0] === 'string') {
        this.name = args[0];
        args.shift();
      } else {
        break;
      }
    }

    /**
     * Sanity check: make sure required arguments are specified.
     */
    if (this.startValue == null && this.endValue == null && this.strings == null) {
      throw new Error('string array or numeric range must be specified');
    }
    if (this.name != null) {
      this.element.setAttribute('data-name', this.name);
    }
    if (!this.strings) {
      this.strings = [];
      if (this.stringFn) {
        this.setStrings(this.stringFn);
      } else {
        this.setStrings();
      }
    }
    this.element.innerHTML = '';
    this.flapA = document.createElement('span');
    this.flapB = document.createElement('span');
    this.flapC = document.createElement('span');
    this.flapD = document.createElement('span');
    this.flapA.classList.add('clock__flap', 'clock__top-flap');
    this.flapB.classList.add('clock__flap', 'clock__bottom-flap');
    this.flapC.classList.add('clock__flap', 'clock__top-flap', 'clock__top-flap--temp');
    this.flapD.classList.add('clock__flap', 'clock__bottom-flap', 'clock__bottom-flap--temp');
    this.element.appendChild(this.flapA);
    this.element.appendChild(this.flapB);
    this.element.appendChild(this.flapC);
    this.element.appendChild(this.flapD);
    this.flapC.style.display = 'none';
    this.flapD.style.display = 'none';
    this.flapA.innerHTML = this.strings[0];
    this.flapB.innerHTML = this.strings[0];
    this.state = this.startValue;
    this.nextstate = this.startValue;
    this.targetState = this.startValue;
    this.stateA = 0;
    this.stateB = 0;
    this.stateC = null;
    this.stateD = null;
    if (this.delay == null) {
      this.delay = 0; // milliseconds
    }

    if (this.randomness == null) {
      this.randomness = 2;
    }
    if (this.animation == null) {
      this.animation = 2;
    }
    if (this.enableTicking == null) {
      this.enableTicking = true;
    }
    if (this.duration == null) {
      this.duration = 150; // milliseconds
    }

    if (this.hurryFactor == null) {
      this.hurryFactor = 0.75;
    }
    if (this.flickTimeoutMs == null) {
      this.flickTimeoutMs = 2000;
    }
    this.setupFlicking();
  }
  _createClass(SplitFlap, [{
    key: "goTo",
    value: function goTo(state, options) {
      if (this.delay) {
        setTimeout(this.goToNow.bind(this, state, options), this.delay);
      } else {
        this.goToNow(state, options);
      }
    }
  }, {
    key: "goToNow",
    value: function goToNow(state, options) {
      if (options && options.flick) {
        this.hasFlicking = true;
        this.flickTargetState = state;
        if (this.flickTimeout) {
          clearTimeout(this.flickTimeout);
        }
        this.flickTimeout = setTimeout(this.flickReset.bind(this), this.flickTimeoutMs);
        this.run();
      } else {
        this.targetState = state;
        this.run();
      }
    }
  }, {
    key: "run",
    value: function run() {
      if (this.isRunning) {
        return;
      }
      this.isRunning = true;
      this.runAnimation();
    }
  }, {
    key: "runAnimation",
    value: function runAnimation() {
      if (document.visibilityState !== 'visible') {
        this.noAnimation();
        return;
      }
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHidden)(this.element)) {
        this.noAnimation();
        return;
      }
      if (this.animation === 0) {
        this.noAnimation();
      } else if (this.animation === 1) {
        this.animation1();
      } else if (this.animation === 2) {
        this.animation2();
      }
    }
  }, {
    key: "noAnimation",
    value: function noAnimation() {
      delete this.isRunning;
      this.state = this.targetState;
      this.nextState = this.targetState;
      this.targetState = this.targetState;
      this.flapA.innerHTML = this.strings[this.stateA = this.state - this.startValue];
      this.flapB.innerHTML = this.strings[this.stateB = this.state - this.startValue];
      this.stateC = null;
      this.flapC.innerHTML = '';
      this.flapC.style.display = 'none';
      this.flapC.style.transform = '';
      this.stateD = null;
      this.flapD.innerHTML = '';
      this.flapD.style.display = 'none';
      this.flapD.style.transform = '';
    }
  }, {
    key: "animation1",
    value: function animation1() {
      if (!this.beforeAnimationStart()) {
        return;
      }
      var duration = this.duration;
      if (this.hurry()) {
        duration = duration * this.hurryFactor;
      }
      var step1;
      var step2;
      var step3;
      step1 = function () {
        this.step(0.2 + (Math.random() - 0.5) * 0.02 * this.randomness);
        setTimeout(step2, duration / 3);
      }.bind(this);
      step2 = function () {
        this.step(4 / 6 + (Math.random() - 0.5) * 0.04 * this.randomness);
        setTimeout(step3, duration / 3);
      }.bind(this);
      step3 = function () {
        this.beforeAnimationEnd();
        this.step(1);
        setTimeout(this.animation1.bind(this), duration / 3);
      }.bind(this);
      this.tick();
      step1();
    }
  }, {
    key: "animation2",
    value: function animation2() {
      if (!this.beforeAnimationStart()) {
        return;
      }
      var duration = this.duration;
      if (this.hurry()) {
        duration = duration * this.hurryFactor;
      }
      var start = Date.now();
      var end = start + duration;
      var frame = function () {
        var time = Date.now();
        var x = (time - start) / (end - start);
        x = Math.pow(x, 1.5);
        if (x >= 1) {
          this.beforeAnimationEnd();
          this.step(1);
          this.animation2();
        } else {
          this.step(x);
          setTimeout(frame, 10);
        }
      }.bind(this);
      this.tick();
      frame();
    }
  }, {
    key: "beforeAnimationStart",
    value: function beforeAnimationStart() {
      var targetState = this.targetState;
      if (this.flickTargetState != null) {
        targetState = this.flickTargetState;
      }
      if (this.state === targetState) {
        delete this.isRunning;
        return false;
      }
      this.nextState = this.state + 1;
      if (this.nextState > this.endValue) {
        this.nextState = this.startValue;
      }
      return true;
    }
  }, {
    key: "beforeAnimationEnd",
    value: function beforeAnimationEnd() {
      this.state = this.nextState;
    }

    // view an animation frame, with a real number from 0 to 1 specified.
  }, {
    key: "step",
    value: function step(x) {
      x = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(x, 0, 1);
      var angle = x * Math.PI;
      var scaleY = Math.abs(Math.cos(angle));

      // C then A then D then B seemed to be the best order.

      if (x > 0 && x < 0.5) {
        this.flapC.style.display = '';
        this.flapC.style.transform = 'scaleY(' + scaleY + ')';
        this.flapC.innerHTML = this.strings[this.stateC = this.state - this.startValue];
      } else {
        this.stateC = null;
        this.flapC.innerHTML = '';
        this.flapC.style.display = 'none';
        this.flapC.style.transform = '';
      }
      if (x > 0 && x < 1) {
        this.flapA.innerHTML = this.strings[this.stateA = this.nextState - this.startValue];
      } else {
        this.flapA.innerHTML = this.strings[this.stateA = this.state - this.startValue];
      }
      if (x > 0.5 && x < 1) {
        this.flapD.style.display = '';
        this.flapD.style.transform = 'scaleY(' + scaleY + ')';
        this.flapD.innerHTML = this.strings[this.stateD = this.nextState - this.startValue];
      } else {
        this.stateD = null;
        this.flapD.innerHTML = '';
        this.flapD.style.display = 'none';
        this.flapD.style.transform = '';
      }
      if (x === 1) {
        this.flapB.innerHTML = this.strings[this.stateB = this.state - this.startValue];
      }
    }
  }, {
    key: "setStrings",
    value: function setStrings(arg) {
      var i;
      if (arg == null) {
        delete this.stringFn;
        this.strings = [];
        for (i = this.startValue; i <= this.endValue; i += 1) {
          this.strings.push(String(i));
        }
      } else if (typeof arg === 'function') {
        this.stringFn = arg;
        this.strings = [];
        for (i = this.startValue; i <= this.endValue; i += 1) {
          this.strings.push(arg.call(null, i));
        }
      } else if (Array.isArray(arg)) {
        delete this.stringFn;
        this.strings = arg;
      } else {
        throw new Error('invalid argument');
      }
    }
  }, {
    key: "updateStrings",
    value: function updateStrings() {
      if (this.flapC != null) {
        this.flapC.innerHTML = this.strings[this.stateC];
      }
      if (this.flapA != null) {
        this.flapA.innerHTML = this.strings[this.stateA];
      }
      if (this.flapD != null) {
        this.flapD.innerHTML = this.strings[this.stateD];
      }
      if (this.flapB != null) {
        this.flapB.innerHTML = this.strings[this.stateB];
      }
    }
  }, {
    key: "tick",
    value: function tick() {
      if (!this.ticker || !this.enableTicking) {
        return;
      }
      if (document.visibilityState !== 'visible') {
        return;
      }
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_0__.isHidden)(this.element)) {
        return;
      }
      if (this.ticker instanceof HTMLMediaElement) {
        if (this.tickVolume == null || typeof this.tickVolume !== 'number') {
          this.ticker.volume = 1;
        } else {
          this.ticker.volume = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.clamp)(this.tickVolume, 0, 1);
        }
        this.ticker.currentTime = 0;
        this.ticker.play();
        return;
      }
      if (typeof this.ticker === 'function') {
        this.ticker.apply(null, this.tickVolume);
        return;
      }
      if (typeof this.ticker.play === 'function') {
        this.ticker.setTickVolume(this.tickVolume);
        this.ticker.play();
      }
    }
  }, {
    key: "setTicker",
    value: function setTicker(ticker) {
      this.ticker = ticker;
    }
  }, {
    key: "setupFlicking",
    value: function setupFlicking() {
      if (this.hasFlicking) {
        return;
      }
      this.hasFlicking = true;
      this.element.addEventListener('click', this.flick.bind(this));
    }
  }, {
    key: "flick",
    value: function flick() {
      if (this.flickTargetState == null) {
        this.flickTargetState = this.targetState;
      }
      this.flickTargetState = this.flickTargetState + 1;
      if (this.flickTargetState > this.endValue) {
        this.flickTargetState = this.startValue;
      }
      if (this.flickTimeout) {
        clearTimeout(this.flickTimeout);
      }
      this.flickTimeout = setTimeout(this.flickReset.bind(this), this.flickTimeoutMs);
      this.run();
    }
  }, {
    key: "flickReset",
    value: function flickReset() {
      delete this.flickTargetState;
      this.run();
    }
  }, {
    key: "hurry",
    value: function hurry() {
      // unless next state is the target state, flick faster.
      var targetState = this.targetState;
      if (this.flickTargetState != null) {
        targetState = this.flickTargetState;
      }
      var a = targetState - this.startValue;
      var b = this.nextState - this.startValue;
      var modulo = this.endValue - this.startValue + 1;
      var hurry = a % modulo !== b % modulo;
      return hurry;
    }
  }]);
  return SplitFlap;
}();


/***/ }),

/***/ "./src/js/components/time-clock.js":
/*!*****************************************!*\
  !*** ./src/js/components/time-clock.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ TimeClock2022; }
/* harmony export */ });
/* harmony import */ var _clock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clock */ "./src/js/components/clock.js");
/* harmony import */ var _splitflap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./splitflap */ "./src/js/components/splitflap.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "./src/js/components/utils.js");


function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var TimeClock2022 = /*#__PURE__*/function (_FlipClock) {
  _inherits(TimeClock2022, _FlipClock);
  var _super = _createSuper(TimeClock2022);
  function TimeClock2022() {
    _classCallCheck(this, TimeClock2022);
    return _super.apply(this, arguments);
  }
  _createClass(TimeClock2022, [{
    key: "initOptions",
    value: function initOptions() {}
  }, {
    key: "initPreferences",
    value: function initPreferences() {
      var _JSON$parse, _JSON$parse2;
      _get(_getPrototypeOf(TimeClock2022.prototype), "initPreferences", this).call(this);
      this.is24Hour = (_JSON$parse = JSON.parse(localStorage.getItem('FlipClock2022.is24Hour'))) !== null && _JSON$parse !== void 0 ? _JSON$parse : false;
      this.enableSecondsTicking = (_JSON$parse2 = JSON.parse(localStorage.getItem('FlipClock2022.enableSecondsTicking'))) !== null && _JSON$parse2 !== void 0 ? _JSON$parse2 : false;
    }
  }, {
    key: "initElements",
    value: function initElements() {
      this.elements.year = this.element.querySelector('[data-clock-year]');
      this.elements.month = this.element.querySelector('[data-clock-month]');
      this.elements.day = this.element.querySelector('[data-clock-day]');
      this.elements.weekday = this.element.querySelector('[data-clock-weekday]');
      this.elements.hour = this.element.querySelector('[data-clock-hour]');
      this.elements.minute = this.element.querySelector('[data-clock-minute]');
      this.elements.second = this.element.querySelector('[data-clock-second]');
    }
  }, {
    key: "initSplitFlaps",
    value: function initSplitFlaps() {
      var startYear = 1970;
      var endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;
      if (this.elements.year) {
        this.splitFlaps.year = new _splitflap__WEBPACK_IMPORTED_MODULE_1__["default"](this.elements.year, 'year', startYear, endYear);
        this.splitFlapArray.push({
          splitFlap: this.splitFlaps.year
        });
      }
      if (this.elements.month) {
        this.splitFlaps.month = new _splitflap__WEBPACK_IMPORTED_MODULE_1__["default"](this.elements.month, 'month', 0, 11, _utils__WEBPACK_IMPORTED_MODULE_2__.month3);
        this.splitFlapArray.push({
          splitFlap: this.splitFlaps.month
        });
      }
      if (this.elements.day) {
        this.splitFlaps.day = new _splitflap__WEBPACK_IMPORTED_MODULE_1__["default"](this.elements.day, 'day', 1, 31);
        this.splitFlapArray.push({
          splitFlap: this.splitFlaps.day
        });
      }
      if (this.elements.weekday) {
        this.splitFlaps.weekday = new _splitflap__WEBPACK_IMPORTED_MODULE_1__["default"](this.elements.weekday, 'weekday', 0, 6, _utils__WEBPACK_IMPORTED_MODULE_2__.weekday3);
        this.splitFlapArray.push({
          splitFlap: this.splitFlaps.weekday
        });
      }
      if (this.elements.hour) {
        this.splitFlaps.hour = new _splitflap__WEBPACK_IMPORTED_MODULE_1__["default"](this.elements.hour, 'hour', 0, 23, _utils__WEBPACK_IMPORTED_MODULE_2__.h12);
        this.splitFlapArray.push({
          splitFlap: this.splitFlaps.hour
        });
      }
      if (this.elements.minute) {
        this.splitFlaps.minute = new _splitflap__WEBPACK_IMPORTED_MODULE_1__["default"](this.elements.minute, 'minute', 0, 59, _utils__WEBPACK_IMPORTED_MODULE_2__.pad00);
        this.splitFlapArray.push({
          splitFlap: this.splitFlaps.minute
        });
      }
      if (this.elements.second) {
        this.splitFlaps.second = new _splitflap__WEBPACK_IMPORTED_MODULE_1__["default"](this.elements.second, 'second', 0, 59, _utils__WEBPACK_IMPORTED_MODULE_2__.pad00);
        this.splitFlapArray.push({
          splitFlap: this.splitFlaps.second
        });
      }
    }
  }, {
    key: "initInterSplitFlapDelay",
    value: function initInterSplitFlapDelay() {
      this.interSplitFlapDelay = 20;
      for (var i = 0; i < this.splitFlapArray.length; i += 1) {
        var delay = 1 + this.interSplitFlapDelay * (this.splitFlapArray.length - i - 1);
        this.splitFlapArray[i].splitFlap.delay = delay;
      }
    }
  }, {
    key: "set24Hour",
    value: function set24Hour() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.is24Hour = flag;
      localStorage.setItem('FlipClock2022.is24Hour', JSON.stringify(this.is24Hour));
      if (!this.splitFlaps.hour) {
        return;
      }
      this.updateFromPreferences();
    }
  }, {
    key: "setSecondsTicking",
    value: function setSecondsTicking() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      this.enableSecondsTicking = flag;
      localStorage.setItem('FlipClock2022.enableSecondsTicking', JSON.stringify(this.enableSecondsTicking));
      this.updateFromPreferences();
    }
  }, {
    key: "updateFromPreferences",
    value: function updateFromPreferences() {
      if (this.is24Hour) {
        this.splitFlaps.hour.setStrings(_utils__WEBPACK_IMPORTED_MODULE_2__.pad00);
      } else {
        this.splitFlaps.hour.setStrings(_utils__WEBPACK_IMPORTED_MODULE_2__.h12);
      }
      this.splitFlaps.hour.updateStrings();
      if (this.splitFlaps.year) {
        this.splitFlaps.year.enableTicking = this.enableTicking;
        this.splitFlaps.year.tickVolume = this.tickVolume;
      }
      if (this.splitFlaps.month) {
        this.splitFlaps.month.enableTicking = this.enableTicking;
        this.splitFlaps.month.tickVolume = this.tickVolume;
      }
      if (this.splitFlaps.day) {
        this.splitFlaps.day.enableTicking = this.enableTicking;
        this.splitFlaps.day.tickVolume = this.tickVolume;
      }
      if (this.splitFlaps.weekday) {
        this.splitFlaps.weekday.enableTicking = this.enableTicking;
        this.splitFlaps.weekday.tickVolume = this.tickVolume;
      }
      if (this.splitFlaps.hour) {
        this.splitFlaps.hour.enableTicking = this.enableTicking;
        this.splitFlaps.hour.tickVolume = this.tickVolume;
      }
      if (this.splitFlaps.minute) {
        this.splitFlaps.minute.enableTicking = this.enableTicking;
        this.splitFlaps.minute.tickVolume = this.tickVolume;
      }
      if (this.splitFlaps.second) {
        this.splitFlaps.second.enableTicking = this.enableSecondsTicking;
        this.splitFlaps.second.tickVolume = this.tickVolume;
      }
    }
  }, {
    key: "updateSplitFlaps",
    value: function updateSplitFlaps() {
      this.date = new Date();
      var year = this.date.getFullYear();
      var month = this.date.getMonth();
      var day = this.date.getDate();
      var weekday = this.date.getDay();
      var hour = this.date.getHours();
      var minute = this.date.getMinutes();
      var second = this.date.getSeconds();
      if (this.splitFlaps.year) {
        this.splitFlaps.year.goTo(year);
      }
      if (this.splitFlaps.month) {
        this.splitFlaps.month.goTo(month);
      }
      if (this.splitFlaps.day) {
        this.splitFlaps.day.goTo(day);
      }
      if (this.splitFlaps.weekday) {
        this.splitFlaps.weekday.goTo(weekday);
      }
      if (this.splitFlaps.hour) {
        this.splitFlaps.hour.goTo(hour);
      }
      if (this.splitFlaps.minute) {
        this.splitFlaps.minute.goTo(minute);
      }
      if (this.splitFlaps.second) {
        this.splitFlaps.second.goTo(second);
      }
    }
  }, {
    key: "setTicker",
    value: function setTicker(ticker) {
      for (var i = 0; i < this.splitFlapArray.length; i += 1) {
        this.splitFlapArray[i].splitFlap.setTicker(ticker);
      }
    }
  }]);
  return TimeClock2022;
}(_clock__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/js/components/utils.js":
/*!************************************!*\
  !*** ./src/js/components/utils.js ***!
  \************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MONTHS": function() { return /* binding */ MONTHS; },
/* harmony export */   "MONTHS_ABBR_2": function() { return /* binding */ MONTHS_ABBR_2; },
/* harmony export */   "WEEKDAYS": function() { return /* binding */ WEEKDAYS; },
/* harmony export */   "clamp": function() { return /* binding */ clamp; },
/* harmony export */   "h12": function() { return /* binding */ h12; },
/* harmony export */   "hour12": function() { return /* binding */ hour12; },
/* harmony export */   "isHidden": function() { return /* binding */ isHidden; },
/* harmony export */   "month3": function() { return /* binding */ month3; },
/* harmony export */   "pad00": function() { return /* binding */ pad00; },
/* harmony export */   "weekday3": function() { return /* binding */ weekday3; }
/* harmony export */ });


/**
 * The names of weekdays.  The first two characters of each are unique
 * abbreviations, as are the first three characters.
 */
var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * The names of months.  The first three characters of each are unique
 * abbreviations.  For unique two-character abbreviations, use
 * MONTHS_ABBR_2.
 */
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Unique two-character abbreviations for the months.  For
 * three-character abbreviations or the full months, use
 * MONTHS.
 */
var MONTHS_ABBR_2 = ['Ja', 'Fe', 'Mr', 'Ap', 'My', 'Jn', 'Jl', 'Au', 'Se', 'Oc', 'No', 'De'];

/**
 * Pad a number to the left with zeroes until it's two characters
 * long.
 *
 * Useful for minutes and seconds, this function generates '00'
 * through '59' for the numbers 0 through 59.
 */
function pad00(str) {
  str = String(str);
  while (str.length < 2) {
    str = '0' + str;
  }
  return str;
}

/**
 * Generates and returns an hour string for a 12-hour clock in the
 * form:
 *
 *     <span class="clock__hour12">11</span>
 *     <span class="clock__ampm clock__ampm--pm">pm</span>
 *
 * (The two segments are concatenated without spaces or other
 * characters in between.  They are line-broken here for readability.)
 *
 * Usage:
 *
 *     const hour12 = hour12(<hour24>, <amString>, <pmString>,
 *                           <format>);
 *
 * <hour24>, an hour number from 0 to 23, is the only required argument.
 *
 * <amString> and <pmString>, optional strings to display for "am" and
 * "pm", default to "am" and "pm".
 *
 * <format>, an optional format specification for the string, defaults
 * to a format to display a string like the above.
 *
 *     {hour12} in the string is replaced with '1' through '12'.
 *     This is not padded with zeroes to the left, as display of
 *     strings like "05:48" is not customary in 12-hour time.
 *
 *     {ampmClass} in the string is replaced with 'am' or 'pm'.
 *     This was created for generating CSS class names, and is
 *     not changeable.
 *
 *     {ampmString} in the string is replaced with the <amString> or
 *     the <pmString> to this function, or with the default value of
 *     one of them.
 *
 * Example format:
 *
 *     var format = '<span class="{ampmClass}">{hour12} {ampmString}</span>';
 *
 * when the following is called:
 *
 *     const hour12 = hour12(hour24, 'AM', 'PM', format);
 *
 * might be replaced with something like:
 *
 *     <span class="am">5 AM</span>
 *     <span class="pm">11 PM</span>
 */

var DEFAULT_FORMAT = '<span class="clock__hour12">{hour12}</span>' + '<span class="clock__ampm clock__ampm--{ampmClass}">{ampmString}</span>';
function hour12(hour24) {
  var amString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'am';
  var pmString = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'pm';
  var format = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : DEFAULT_FORMAT;
  var hour12 = (hour24 + 11) % 12 + 1;
  var ampmClass = hour24 < 12 ? 'am' : 'pm';
  var ampmString = hour24 < 12 ? amString : pmString;
  var str = format;
  str = str.replace(/{hour12}/g, String(hour12));
  str = str.replace(/{ampmClass}/g, ampmClass);
  str = str.replace(/{ampmString}/g, ampmString);
  return str;
}
function clamp(x, y, z) {
  if (x < y) {
    return y;
  }
  if (x > z) {
    return z;
  }
  return x;
}
function isHidden(element) {
  if (!element) {
    return;
  }
  for (; element && element.style; element = element.parentNode) {
    var style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === 0) {
      return true;
    }
  }
  return false;
}
function weekday3(weekday) {
  // 0 = Sunday ... 6 = Saturday
  return WEEKDAYS[weekday].slice(0, 3);
}
function month3(month) {
  // 0 = January ... 11 = December
  return MONTHS[month].slice(0, 3);
}
function h12(hour24) {
  // 0 = January ... 11 = December
  return hour12(hour24, 'a', 'p');
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_audio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/audio */ "./src/js/components/audio.js");
/* harmony import */ var _components_time_clock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/time-clock */ "./src/js/components/time-clock.js");
/* harmony import */ var _components_calendar_clock__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/calendar-clock */ "./src/js/components/calendar-clock.js");





var tick;
var clock;
var calendarClock;
var logs;
if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
function init() {
  tick = new _components_audio__WEBPACK_IMPORTED_MODULE_0__["default"]('sounds/tick2.wav');
  clock = new _components_time_clock__WEBPACK_IMPORTED_MODULE_1__["default"](document.getElementById('clock'));
  clock.setTicker(tick);
  clock.start();
  calendarClock = new _components_calendar_clock__WEBPACK_IMPORTED_MODULE_2__["default"](document.getElementById('clock'));
  calendarClock.setTicker(tick);
  calendarClock.start();
  initEvents();
  initLogs();
  initCheckboxEvents();
  initVolumeSlider();
  if (/(?:^|[?&])helv(?:etica)?-?bold-?cond(?:ensed)?(?:$|[?&=])/i.test(location.search)) {
    useFontClass('font--helvetica-bold-condensed--apple');
  }
  if (/(?:^|[?&])arial(?:$|[?&=])/i.test(location.search)) {
    useFontClass('font--arial');
  }
  if (/(?:^|[?&])arial-?black(?:$|[?&=])/i.test(location.search)) {
    useFontClass('font--arial-black');
  }
  if (/(?:^|[?&])poppins(?:$|[?&=])/i.test(location.search)) {
    useFontClass('font--poppins');
  }
  if (/(?:^|[?&])poppins(?:$|[?&=])/i.test(location.search)) {
    useFontClass('font--lato');
  }
  if (/(?:^|[?&])times(?:$|[?&=])/i.test(location.search)) {
    useFontClass('font--times');
  }
}
function useFontClass(className) {
  var classList = document.documentElement.classList;
  var classes = [];
  for (var i = 0; i < classList.length; i += 1) {
    classes.push(classList.item(i));
  }
  for (var _i = 0; _i < classes.length; _i += 1) {
    if (/^font--/.test(classes[_i])) {
      classList.remove(classes[_i]);
    }
  }
  classList.add(className);
}
function initLogs() {
  logs = document.getElementById('logs');
  if (/\b(?:iPhone|iPad|mac os x)\b/i.test(navigator.userAgent)) {
    ['debug', 'log', 'warn', 'info', 'error'].forEach(function (level) {
      var fn = console[level];
      console[level] = function () {
        fn.apply(console, arguments);
        logs.innerHTML = logs.innerHTML + level.toUpperCase() + ': ' + Array.from(arguments).join(' ') + '\n';
      };
    });
  }
}
function initEvents() {
  var toggle = document.getElementById('controlPanelToggle');
  var logsToggle = document.getElementById('logsToggle');
  var panel = document.getElementById('controlPanel');
  toggle.addEventListener('click', function () {
    panel.classList.toggle('hide');
    if (panel.classList.contains('hide')) {
      logs.classList.add('hide');
    }
  });
  logsToggle.addEventListener('click', function () {
    logs.classList.toggle('hide');
  });
}
function initCheckboxEvents() {
  var is24Hour = document.getElementById('is24Hour');
  if (is24Hour) {
    is24Hour.checked = clock.is24Hour;
    is24Hour.addEventListener('change', function () {
      clock.set24Hour(is24Hour.checked);
    });
  }
  var enableTicking = document.getElementById('enableTicking');
  if (enableTicking) {
    enableTicking.checked = clock.enableTicking;
    enableTicking.addEventListener('change', function () {
      clock.setTicking(enableTicking.checked);
      calendarClock.setTicking(enableTicking.checked);
    });
  }
  var enableSecondsTicking = document.getElementById('enableSecondsTicking');
  if (enableSecondsTicking) {
    enableSecondsTicking.checked = clock.enableSecondsTicking;
    enableSecondsTicking.addEventListener('change', function () {
      clock.setSecondsTicking(enableSecondsTicking.checked);
    });
  }
}
function initVolumeSlider() {
  var tickVolume = document.getElementById('tickVolume');
  if (!tickVolume) {
    return;
  }
  tickVolume.value = clock.tickVolume;
  tickVolume.addEventListener('change', function () {
    clock.setTickVolume(tickVolume.value);
    calendarClock.setTickVolume(tickVolume.value);
  });
}
}();
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map