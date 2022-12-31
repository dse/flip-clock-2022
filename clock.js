'use strict';
/*global SplitFlap */

function FlipClock2022(element) {
    this.element = element;
    if (typeof this.element === 'string') {
        this.element = document.getElementById(this.element);
    }
    if (!this.element) {
        return;
    }
    this.elements = {};
    this.elements.year    = this.element.querySelector('[data-clock-year]');
    this.elements.month   = this.element.querySelector('[data-clock-month]');
    this.elements.day     = this.element.querySelector('[data-clock-day]');
    this.elements.weekday = this.element.querySelector('[data-clock-weekday]');
    this.elements.hour    = this.element.querySelector('[data-clock-hour]');
    this.elements.minute  = this.element.querySelector('[data-clock-minute]');
    this.elements.second  = this.element.querySelector('[data-clock-second]');

    var startYear = 1970;

    // 2020 ... 2029 => 2039, 2030 ... 2039 => 2049, etc.
    var endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;

    this.splitflaps = {};
    this.splitflaps.year    = new SplitFlap(this.elements.year,    startYear, endYear);
    this.splitflaps.month   = new SplitFlap(this.elements.month,   0, 11, FlipClock2022.month3);
    this.splitflaps.day     = new SplitFlap(this.elements.day,     1, 31);
    this.splitflaps.weekday = new SplitFlap(this.elements.weekday, 0, 6, FlipClock2022.weekday3);
    this.splitflaps.hour    = new SplitFlap(this.elements.hour,    0, 59, FlipClock2022.h12);
    this.splitflaps.minute  = new SplitFlap(this.elements.minute,  0, 59, SplitFlap.pad00);
    this.splitflaps.second  = new SplitFlap(this.elements.second,  0, 59, SplitFlap.pad00);
}

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
