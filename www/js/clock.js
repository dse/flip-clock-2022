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

    this.is24Hour             = JSON.parse(localStorage.getItem('FlipClock2022.is24Hour'));
    this.enableTicking        = JSON.parse(localStorage.getItem('FlipClock2022.enableTicking'));
    this.enableSecondsTicking = JSON.parse(localStorage.getItem('FlipClock2022.enableSecondsTicking'));
    this.tickVolume           = JSON.parse(localStorage.getItem('FlipClock2022.tickVolume'));
    if (this.is24Hour == null)             { this.is24Hour = false; }
    if (this.enableTicking == null)        { this.enableTicking = false; }
    if (this.enableSecondsTicking == null) { this.enableSecondsTicking = false; }
    if (this.tickVolume == null)           { this.tickVolume = 1; }

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

    this.splitFlaps = {};
    this.splitFlapArray = [];

    if (this.elements.year)    { this.splitFlaps.year    = new SplitFlap(this.elements.year,    'year',    startYear, endYear);           this.splitFlapArray.push({ splitFlap: this.splitFlaps.year });    }
    if (this.elements.month)   { this.splitFlaps.month   = new SplitFlap(this.elements.month,   'month',   0, 11, FlipClock2022.month3);  this.splitFlapArray.push({ splitFlap: this.splitFlaps.month });   }
    if (this.elements.day)     { this.splitFlaps.day     = new SplitFlap(this.elements.day,     'day',     1, 31);                        this.splitFlapArray.push({ splitFlap: this.splitFlaps.day });     }
    if (this.elements.weekday) { this.splitFlaps.weekday = new SplitFlap(this.elements.weekday, 'weekday', 0, 6, FlipClock2022.weekday3); this.splitFlapArray.push({ splitFlap: this.splitFlaps.weekday }); }
    if (this.elements.hour)    { this.splitFlaps.hour    = new SplitFlap(this.elements.hour,    'hour',    0, 23, FlipClock2022.h12);     this.splitFlapArray.push({ splitFlap: this.splitFlaps.hour });    }
    if (this.elements.minute)  { this.splitFlaps.minute  = new SplitFlap(this.elements.minute,  'minute',  0, 59, SplitFlap.pad00);       this.splitFlapArray.push({ splitFlap: this.splitFlaps.minute });  }
    if (this.elements.second)  { this.splitFlaps.second  = new SplitFlap(this.elements.second,  'second',  0, 59, SplitFlap.pad00);       this.splitFlapArray.push({ splitFlap: this.splitFlaps.second });  }

    this.interSplitFlapDelay = 20;

    var i;
    var delay;
    for (i = 0; i < this.splitFlapArray.length; i += 1) {
        delay = 1 + this.interSplitFlapDelay * (this.splitFlapArray.length - i - 1);
        this.splitFlapArray[i].splitFlap.delay = delay;
    }

    this.initCalendar();

    this.updateFromPreferences();
}

FlipClock2022.prototype.set24Hour = function (flag) {
    if (flag == null) { flag = true; }
    this.is24Hour = flag;
    localStorage.setItem('FlipClock2022.is24Hour', JSON.stringify(this.is24Hour));
    if (!this.splitFlaps.hour) {
        return;
    }
    this.updateFromPreferences();
};

FlipClock2022.prototype.setTicking = function (flag) {
    if (flag == null) { flag = true; }
    this.enableTicking = flag;
    localStorage.setItem('FlipClock2022.enableTicking', JSON.stringify(this.enableTicking));
    this.updateFromPreferences();
};

FlipClock2022.prototype.setSecondsTicking = function (flag) {
    if (flag == null) { flag = true; }
    this.enableSecondsTicking = flag;
    localStorage.setItem('FlipClock2022.enableSecondsTicking',
                         JSON.stringify(this.enableSecondsTicking));
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

FlipClock2022.prototype.updateFromPreferences = function () {
    if (this.is24Hour) {
        this.splitFlaps.hour.setStrings(SplitFlap.pad00);
    } else {
        this.splitFlaps.hour.setStrings(FlipClock2022.h12);
    }
    this.splitFlaps.hour.updateStrings();

    if (this.splitFlaps.year)    { this.splitFlaps.year   .enableTicking = this.enableTicking;        this.splitFlaps.year   .tickVolume = this.tickVolume; }
    if (this.splitFlaps.month)   { this.splitFlaps.month  .enableTicking = this.enableTicking;        this.splitFlaps.month  .tickVolume = this.tickVolume; }
    if (this.splitFlaps.day)     { this.splitFlaps.day    .enableTicking = this.enableTicking;        this.splitFlaps.day    .tickVolume = this.tickVolume; }
    if (this.splitFlaps.weekday) { this.splitFlaps.weekday.enableTicking = this.enableTicking;        this.splitFlaps.weekday.tickVolume = this.tickVolume; }
    if (this.splitFlaps.hour)    { this.splitFlaps.hour   .enableTicking = this.enableTicking;        this.splitFlaps.hour   .tickVolume = this.tickVolume; }
    if (this.splitFlaps.minute)  { this.splitFlaps.minute .enableTicking = this.enableTicking;        this.splitFlaps.minute .tickVolume = this.tickVolume; }
    if (this.splitFlaps.second)  { this.splitFlaps.second .enableTicking = this.enableSecondsTicking; this.splitFlaps.second .tickVolume = this.tickVolume; }
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
    this.date = new Date();
    var year    = this.date.getFullYear();
    var month   = this.date.getMonth();
    var day     = this.date.getDate();
    var weekday = this.date.getDay();
    var hour    = this.date.getHours();
    var minute  = this.date.getMinutes();
    var second  = this.date.getSeconds();

    if (this.splitFlaps.year)    { this.splitFlaps.year   .goTo(year);    }
    if (this.splitFlaps.month)   { this.splitFlaps.month  .goTo(month);   }
    if (this.splitFlaps.day)     { this.splitFlaps.day    .goTo(day);     }
    if (this.splitFlaps.weekday) { this.splitFlaps.weekday.goTo(weekday); }
    if (this.splitFlaps.hour)    { this.splitFlaps.hour   .goTo(hour);    }
    if (this.splitFlaps.minute)  { this.splitFlaps.minute .goTo(minute);  }
    if (this.splitFlaps.second)  { this.splitFlaps.second .goTo(second);  }
    var msecs = 1000 - this.date.getMilliseconds() % 1000;
    this.timeout = setTimeout(this.run.bind(this), msecs);

    this.runCalendar();
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

FlipClock2022.prototype.setTicker = function (ticker) {
    var i;
    for (i = 0; i < this.splitFlapArray.length; i += 1) {
        this.splitFlapArray[i].splitFlap.setTicker(ticker);
    }
};

FlipClock2022.prototype.initCalendar = function () {
    this.elements.calendarMonth = this.element.querySelector('[data-clock-calendar-month]');
    this.elements.calendarYear  = this.element.querySelector('[data-clock-calendar-year]');

    var startYear = 1970;

    // 2020 ... 2029 => 2039, 2030 ... 2039 => 2049, etc.
    var endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;

    this.calendarSplitFlaps = {};
    this.calendarSplitFlapArray = [];

    if (this.elements.calendarMonth) {
        this.splitFlaps.calendarMonth = new SplitFlap(this.elements.calendarMonth, 'calendarMonth', 0, 11, SplitFlap.MONTHS);
        this.calendarSplitFlapArray.push({ splitFlap: this.splitFlaps.calendarMonth });
    }
    if (this.elements.calendarYear) {
        this.splitFlaps.calendarYear = new SplitFlap(this.elements.calendarYear, 'calendarYear', startYear, endYear);
        this.calendarSplitFlapArray.push({ splitFlap: this.splitFlaps.calendarYear });
    }

    var calendarDayElements = Array.from(document.querySelectorAll('[data-clock-calendar-day]'));
    var i;
    var elt;
    var sf;

    this.elements.calendarDays = [];
    this.splitFlaps.calendarDays = [];
    for (i = 0; i < calendarDayElements.length; i += 1) {
        elt = calendarDayElements[i];
        this.elements.calendarDays.push(elt);
        sf = new SplitFlap(elt, 0, 31, function (state) { return state ? state : ''; });
        this.splitFlaps.calendarDays.push(sf);
        this.calendarSplitFlapArray.push({ splitFlap: sf });
    }

    this.calendarInterSplitFlapDelay = 5;

    var delay;
    for (i = 0; i < this.calendarSplitFlapArray.length; i += 1) {
        delay = 1 + this.calendarInterSplitFlapDelay * i;
        this.calendarSplitFlapArray[i].splitFlap.delay = delay;
    }
};

FlipClock2022.prototype.runCalendar = function () {
    if (this.splitFlaps.calendarMonth) {
        this.splitFlaps.calendarMonth.goTo(this.date.getMonth());
    }
    if (this.splitFlaps.calendarYear) {
        this.splitFlaps.calendarYear.goTo(this.date.getFullYear());
    }

    if (!this.splitFlaps.calendarDays) {
        return;
    }

    var startMonth = new Date(this.date);
    startMonth.setDate(1);      // first of this month
    var endMonth = new Date(startMonth);
    endMonth.setMonth(endMonth.getMonth() + 1); // first of next month
    endMonth.setDate(0);        // last day of prev month

    var startWeekday = startMonth.getDay(); // from 0 to 6 inclusive
    var dayCount = endMonth.getDate();      // from 28 to 31 inclusive

    var i;
    var sf;

    // blank out some of the splitflaps on the first line
    for (i = 0; i < startWeekday; i += 1) {
        sf = this.splitFlaps.calendarDays[i];
        if (sf) {
            sf.goTo(0);
        }
    }

    // fill out the calendar days (from 0 to (27..30) inclusive)
    for (i = 0; i < dayCount; i += 1) {
        sf = this.splitFlaps.calendarDays[i + startWeekday];
        if (sf) {
            sf.goTo(i + 1); // from 1 to (28..31) inclusive
        }
    }

    // blank out remaining splitflaps
    for (i = startWeekday + dayCount;
         i < this.splitFlaps.calendarDays.length; i += 1) {
        sf = this.splitFlaps.calendarDays[i];
        if (sf) {
            sf.goTo(0);
        }
    }
};

// https://cldr.unicode.org/translation/date-time/date-time-names
