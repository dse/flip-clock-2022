'use strict';
/*global SplitFlap, clamp */

function FlipClock2022(element, options) {
    if (Object.prototype.toString.call(options) === '[object Object]') {
        Object.assign(this, options);
    }
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

FlipClock2022.prototype.initOptions = function () {
    this.updateEveryMs = 1000;
    this.flickTimeoutMs = 2000;
};

FlipClock2022.prototype.initPreferences = function () {
    this.enableTicking        = JSON.parse(localStorage.getItem('FlipClock2022.enableTicking'));
    this.tickVolume           = JSON.parse(localStorage.getItem('FlipClock2022.tickVolume'));
    if (this.enableTicking == null)        { this.enableTicking = false; }
    if (this.tickVolume == null)           { this.tickVolume = 1; }
};

FlipClock2022.prototype.setTicking = function (flag) {
    if (flag == null) { flag = true; }
    this.enableTicking = flag;
    localStorage.setItem('FlipClock2022.enableTicking', JSON.stringify(this.enableTicking));
    this.updateFromPreferences();
};

FlipClock2022.prototype.setTickVolume = function (value) {
    if (value == null) {
        this.tickVolume = 1;
    } else {
        this.tickVolume = clamp(value, 0, 1);
    }
    localStorage.setItem('FlipClock2022.tickVolume', JSON.stringify(this.tickVolume));
    this.updateFromPreferences();
};

FlipClock2022.prototype.start = function () {
    if (this.isRunning) {
        return;
    }
    this.isRunning = true;
    this.run();
};

FlipClock2022.prototype.stop = function () {
    if (!this.isRunning) {
        return;
    }
    delete this.isRunning;
    if (this.timeout) {
        clearTimeout(this.timeout);
        delete this.timeout;
    }
};

FlipClock2022.prototype.run = function () {
    this.updateSplitFlaps();
    var msecs = this.updateEveryMs - this.date.getMilliseconds() % this.updateEveryMs;
    this.timeout = setTimeout(this.run.bind(this), msecs);
};

FlipClock2022.weekday3 = function (weekday) {
    // 0 = Sunday ... 6 = Saturday
    return SplitFlap.WEEKDAYS[weekday].slice(0, 3);
};

FlipClock2022.month3 = function (month) {
    // 0 = January ... 11 = December
    return SplitFlap.MONTHS[month].slice(0, 3);
};

FlipClock2022.h12 = function (hour24) {
    // 0 = January ... 11 = December
    return SplitFlap.hour12(hour24, 'a', 'p');
};

// https://cldr.unicode.org/translation/date-time/date-time-names
