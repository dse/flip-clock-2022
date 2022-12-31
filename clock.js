'use strict';
/*global SplitFlap */

function FlipClock2022(element, options) {
    if (Object.prototype.toString.call(options) === '[object Object]') {
        Object.assign(this, options);
    }
    this.element = element;
    if (typeof this.element === 'string') {
        this.element = document.getElementById(this.element);
    }
    if (!this.element) {
        throw new Error(`element not specified or not found`);
    }
    this.elements = {};
    this.elements.year    = this.element.querySelector('[data-clock-year]');
    this.elements.month   = this.element.querySelector('[data-clock-month]');
    this.elements.day     = this.element.querySelector('[data-clock-day]');
    this.elements.weekday = this.element.querySelector('[data-clock-weekday]');
    this.elements.hour    = this.element.querySelector('[data-clock-hour]');
    this.elements.minute  = this.element.querySelector('[data-clock-minute]');
    this.elements.second  = this.element.querySelector('[data-clock-second]');

    console.log(this.elements.year);

    var startYear = 1970;

    // 2020 ... 2029 => 2039, 2030 ... 2039 => 2049, etc.
    var endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;

    this.splitFlaps = {};
    this.splitFlapArray = [];
    if (this.elements.year)    { this.splitFlaps.year    = new SplitFlap(this.elements.year,    startYear, endYear);           this.splitFlapArray.push(this.splitFlaps.year);    }
    if (this.elements.month)   { this.splitFlaps.month   = new SplitFlap(this.elements.month,   0, 11, FlipClock2022.month3);  this.splitFlapArray.push(this.splitFlaps.month);   }
    if (this.elements.day)     { this.splitFlaps.day     = new SplitFlap(this.elements.day,     1, 31);                        this.splitFlapArray.push(this.splitFlaps.day);     }
    if (this.elements.weekday) { this.splitFlaps.weekday = new SplitFlap(this.elements.weekday, 0, 6, FlipClock2022.weekday3); this.splitFlapArray.push(this.splitFlaps.weekday); }
    if (this.elements.hour)    { this.splitFlaps.hour    = new SplitFlap(this.elements.hour,    0, 59, FlipClock2022.h12);     this.splitFlapArray.push(this.splitFlaps.hour);    }
    if (this.elements.minute)  { this.splitFlaps.minute  = new SplitFlap(this.elements.minute,  0, 59, SplitFlap.pad00);       this.splitFlapArray.push(this.splitFlaps.minute);  }
    if (this.elements.second)  { this.splitFlaps.second  = new SplitFlap(this.elements.second,  0, 59, SplitFlap.pad00);       this.splitFlapArray.push(this.splitFlaps.second);  }
}

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
    this.date = new Date();
    var year    = this.date.getFullYear();
    var month   = this.date.getMonth();
    var day     = this.date.getDate();
    var weekday = this.date.getDay();
    var hour    = this.date.getHours();
    var minute  = this.date.getMinutes();
    var second  = this.date.getSeconds();
    console.log(year, month, day, weekday, hour, minute, second);
    if (this.splitFlaps.year)    { this.splitFlaps.year   .goTo(year);    }
    if (this.splitFlaps.month)   { this.splitFlaps.month  .goTo(month);   }
    if (this.splitFlaps.day)     { this.splitFlaps.day    .goTo(day);     }
    if (this.splitFlaps.weekday) { this.splitFlaps.weekday.goTo(weekday); }
    if (this.splitFlaps.hour)    { this.splitFlaps.hour   .goTo(hour);    }
    if (this.splitFlaps.minute)  { this.splitFlaps.minute .goTo(minute);  }
    if (this.splitFlaps.second)  { this.splitFlaps.second .goTo(second);  }
    var msecs = 1000 - this.date.getMilliseconds() % 1000;
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
