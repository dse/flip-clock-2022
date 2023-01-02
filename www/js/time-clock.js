'use strict';
/*global FlipClock2022, SplitFlap, clamp */

function TimeClock2022(element, options) {
    FlipClock2022.call(this, element, options);
}
TimeClock2022.prototype = Object.create(FlipClock2022.prototype);
TimeClock2022.prototype.constructor = TimeClock2022;

TimeClock2022.prototype.initOptions = function () {
};
TimeClock2022.prototype.initPreferences = function () {
    FlipClock2022.prototype.initPreferences.apply(this);
    this.is24Hour             = JSON.parse(localStorage.getItem('FlipClock2022.is24Hour'));
    this.enableSecondsTicking = JSON.parse(localStorage.getItem('FlipClock2022.enableSecondsTicking'));
    if (this.is24Hour == null)             { this.is24Hour = false; }
    if (this.enableSecondsTicking == null) { this.enableSecondsTicking = false; }
};
TimeClock2022.prototype.initElements = function () {
    this.elements.year    = this.element.querySelector('[data-clock-year]');
    this.elements.month   = this.element.querySelector('[data-clock-month]');
    this.elements.day     = this.element.querySelector('[data-clock-day]');
    this.elements.weekday = this.element.querySelector('[data-clock-weekday]');
    this.elements.hour    = this.element.querySelector('[data-clock-hour]');
    this.elements.minute  = this.element.querySelector('[data-clock-minute]');
    this.elements.second  = this.element.querySelector('[data-clock-second]');
};
TimeClock2022.prototype.initSplitFlaps = function () {
    var startYear = 1970;
    var endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;
    if (this.elements.year)    { this.splitFlaps.year    = new SplitFlap(this.elements.year,    'year',    startYear, endYear);           this.splitFlapArray.push({ splitFlap: this.splitFlaps.year });    }
    if (this.elements.month)   { this.splitFlaps.month   = new SplitFlap(this.elements.month,   'month',   0, 11, FlipClock2022.month3);  this.splitFlapArray.push({ splitFlap: this.splitFlaps.month });   }
    if (this.elements.day)     { this.splitFlaps.day     = new SplitFlap(this.elements.day,     'day',     1, 31);                        this.splitFlapArray.push({ splitFlap: this.splitFlaps.day });     }
    if (this.elements.weekday) { this.splitFlaps.weekday = new SplitFlap(this.elements.weekday, 'weekday', 0, 6, FlipClock2022.weekday3); this.splitFlapArray.push({ splitFlap: this.splitFlaps.weekday }); }
    if (this.elements.hour)    { this.splitFlaps.hour    = new SplitFlap(this.elements.hour,    'hour',    0, 23, FlipClock2022.h12);     this.splitFlapArray.push({ splitFlap: this.splitFlaps.hour });    }
    if (this.elements.minute)  { this.splitFlaps.minute  = new SplitFlap(this.elements.minute,  'minute',  0, 59, SplitFlap.pad00);       this.splitFlapArray.push({ splitFlap: this.splitFlaps.minute });  }
    if (this.elements.second)  { this.splitFlaps.second  = new SplitFlap(this.elements.second,  'second',  0, 59, SplitFlap.pad00);       this.splitFlapArray.push({ splitFlap: this.splitFlaps.second });  }
};
TimeClock2022.prototype.initInterSplitFlapDelay = function () {
    this.interSplitFlapDelay = 20;
    var i;
    var delay;
    for (i = 0; i < this.splitFlapArray.length; i += 1) {
        delay = 1 + this.interSplitFlapDelay * (this.splitFlapArray.length - i - 1);
        this.splitFlapArray[i].splitFlap.delay = delay;
    }
};
TimeClock2022.prototype.set24Hour = function (flag) {
    if (flag == null) { flag = true; }
    this.is24Hour = flag;
    localStorage.setItem('FlipClock2022.is24Hour', JSON.stringify(this.is24Hour));
    if (!this.splitFlaps.hour) {
        return;
    }
    this.updateFromPreferences();
};
TimeClock2022.prototype.setSecondsTicking = function (flag) {
    if (flag == null) { flag = true; }
    this.enableSecondsTicking = flag;
    localStorage.setItem('FlipClock2022.enableSecondsTicking',
                         JSON.stringify(this.enableSecondsTicking));
    this.updateFromPreferences();
};
TimeClock2022.prototype.updateFromPreferences = function () {
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
TimeClock2022.prototype.updateSplitFlaps = function () {
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
};
TimeClock2022.prototype.setTicker = function (ticker) {
    var i;
    for (i = 0; i < this.splitFlapArray.length; i += 1) {
        this.splitFlapArray[i].splitFlap.setTicker(ticker);
    }
};
