'use strict';
/*global FlipClock2022, SplitFlap, clamp */

function CalendarClock2022(element, options) {
    FlipClock2022.call(this, element, options);
}
CalendarClock2022.prototype = Object.create(FlipClock2022.prototype);
CalendarClock2022.prototype.constructor = CalendarClock2022;

CalendarClock2022.prototype.initOptions = function () {
    FlipClock2022.prototype.initOptions.apply(this);
    this.flickTimeoutMs = 5000;
};
CalendarClock2022.prototype.initPreferences = function () {
    FlipClock2022.prototype.initPreferences.apply(this);
};
CalendarClock2022.prototype.initElements = function () {
    this.elements.calendarMonth = this.element.querySelector('[data-clock-calendar-month]');
    this.elements.calendarYear  = this.element.querySelector('[data-clock-calendar-year]');
};
CalendarClock2022.prototype.initSplitFlaps = function () {
    var startYear = 1970;

    // 2020 ... 2029 => 2039, 2030 ... 2039 => 2049, etc.
    var endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;

    this.calendarSplitFlaps = {};
    this.calendarSplitFlapArray = [];

    if (this.elements.calendarMonth) {
        this.splitFlaps.calendarMonth = new SplitFlap(this.elements.calendarMonth, 'calendarMonth', 0, 11, SplitFlap.MONTHS,
                                                      { flickTimeoutMs: this.flickTimeoutMs });
        this.calendarSplitFlapArray.push({ splitFlap: this.splitFlaps.calendarMonth });
    }
    if (this.elements.calendarYear) {
        this.splitFlaps.calendarYear = new SplitFlap(this.elements.calendarYear, 'calendarYear', startYear, endYear,
                                                     { flickTimeoutMs: this.flickTimeoutMs });
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
        sf = new SplitFlap(elt, 0, 31, function (state) { return state ? state : ''; }, { flickTimeoutMs: this.flickTimeoutMs });
        this.splitFlaps.calendarDays.push(sf);
        this.calendarSplitFlapArray.push({ splitFlap: sf });
    }
};
CalendarClock2022.prototype.initInterSplitFlapDelay = function () {
    var i;
    this.interSplitFlapDelay = 5;
    var delay;
    for (i = 0; i < this.calendarSplitFlapArray.length; i += 1) {
        delay = 1 + this.interSplitFlapDelay * i;
        this.calendarSplitFlapArray[i].splitFlap.delay = delay;
    }
};
CalendarClock2022.prototype.updateFromPreferences = function () {
    if (this.splitFlaps.calendarMonth) {
        this.splitFlaps.calendarMonth.enableTicking = this.enableTicking;
        this.splitFlaps.calendarMonth.tickVolume = this.tickVolume;
    }
    if (this.splitFlaps.calendarYear) {
        this.splitFlaps.calendarYear.enableTicking = this.enableTicking;
        this.splitFlaps.calendarYear.tickVolume = this.tickVolume;
    }
};
CalendarClock2022.prototype.updateSplitFlaps = function () {
    this.date = new Date();
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
