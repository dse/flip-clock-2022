'use strict';

import SplitFlap from './split-flap';
import FlipClock2022 from './clock';
import { MONTHS } from './utils';

export default class CalendarClock2022 extends FlipClock2022 {
    initOptions() {
        this.super();
        this.flickTimeoutMs = 5000;
    }
    initPreferences() {
        this.super();
    }
    initElements() {
        this.elements.calendarMonth = this.element.querySelector('[data-clock-calendar-month]');
        this.elements.calendarYear  = this.element.querySelector('[data-clock-calendar-year]');
    }
    initSplitFlaps() {
        const startYear = 1970;
        const endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;
        this.calendarSplitFlaps = {};
        this.calendarSplitFlapArray = [];
        if (this.elements.calendarMonth) {
            this.splitFlaps.calendarMonth = new SplitFlap(this.elements.calendarMonth, 'calendarMonth', 0, 11, MONTHS,
                                                          { flickTimeoutMs: this.flickTimeoutMs });
            this.calendarSplitFlapArray.push({ splitFlap: this.splitFlaps.calendarMonth });
        }
        if (this.elements.calendarYear) {
            this.splitFlaps.calendarYear = new SplitFlap(this.elements.calendarYear, 'calendarYear', startYear, endYear,
                                                         { flickTimeoutMs: this.flickTimeoutMs });
            this.calendarSplitFlapArray.push({ splitFlap: this.splitFlaps.calendarYear });
        }
        const calendarDayElements = Array.from(document.querySelectorAll('[data-clock-calendar-day]'));
        this.elements.calendarDays = [];
        this.splitFlaps.calendarDays = [];
        for (let i = 0; i < calendarDayElements.length; i += 1) {
            const elt = calendarDayElements[i];
            this.elements.calendarDays.push(elt);
            const sf = new SplitFlap(elt, 0, 31, function (state) { return state ? state : ''; }, { flickTimeoutMs: this.flickTimeoutMs });
            this.splitFlaps.calendarDays.push(sf);
            this.calendarSplitFlapArray.push({ splitFlap: sf });
        }
    }
    initInterSplitFlapDelay() {
        this.interSplitFlapDelay = 5;
        for (let i = 0; i < this.calendarSplitFlapArray.length; i += 1) {
            const delay = 1 + this.interSplitFlapDelay * i;
            this.calendarSplitFlapArray[i].splitFlap.delay = delay;
        }
    }
    updateFromPreferences() {
        if (this.splitFlaps.calendarMonth) {
            this.splitFlaps.calendarMonth.enableTicking = this.enableTicking;
            this.splitFlaps.calendarMonth.tickVolume = this.tickVolume;
        }
        if (this.splitFlaps.calendarYear) {
            this.splitFlaps.calendarYear.enableTicking = this.enableTicking;
            this.splitFlaps.calendarYear.tickVolume = this.tickVolume;
        }
    }
    updateSplitFlaps() {
        this.date = new Date();
        let month;
        let year;
        let flick = false;
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
    setTicker(ticker) {
        if (this.splitFlaps.calendarMonth) {
            this.splitFlaps.calendarMonth.setTicker(ticker);
        }
        if (this.splitFlaps.calendarYear) {
            this.splitFlaps.calendarYear.setTicker(ticker);
        }
    }
    updateCalendarSplitFlaps(year, month, flick) {
        if (!this.splitFlaps.calendarDays) {
            return;
        }
        if (flick == null) {
            flick = false;
        }
        const date = new Date();
        year = year ?? date.getFullYear();
        month = month ?? date.getMonth();
        const startMonth = new Date(year, month, 1);   // first day of the month
        const endMonth = new Date(year, month + 1, 0); // last day of the month
        const startWeekday = startMonth.getDay(); // from 0 to 6 inclusive
        const dayCount = endMonth.getDate();      // from 28 to 31 inclusive

        // blank out some of the splitflaps on the first line
        for (let i = 0; i < startWeekday; i += 1) {
            const sf = this.splitFlaps.calendarDays[i];
            if (sf) {
                sf.goTo(0);
            }
        }

        // fill out the calendar days (from 0 to (27..30) inclusive)
        for (let i = 0; i < dayCount; i += 1) {
            const sf = this.splitFlaps.calendarDays[i + startWeekday];
            if (sf) {
                sf.goTo(i + 1); // from 1 to (28..31) inclusive
            }
        }

        // blank out remaining splitflaps
        for (let i = startWeekday + dayCount;
             i < this.splitFlaps.calendarDays.length; i += 1) {
            const sf = this.splitFlaps.calendarDays[i];
            if (sf) {
                sf.goTo(0);
            }
        }
    }
}
