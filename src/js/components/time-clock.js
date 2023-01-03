'use strict';

import FlipClock2022 from './clock';
import SplitFlap from './splitflap';
import { month3, weekday3, h12, pad00 } from './utils';

export default class TimeClock2022 extends FlipClock2022 {
    initOptions() {
    }
    initPreferences() {
        super.initPreferences();
        this.is24Hour             = JSON.parse(localStorage.getItem('FlipClock2022.is24Hour')) ?? false;
        this.enableSecondsTicking = JSON.parse(localStorage.getItem('FlipClock2022.enableSecondsTicking')) ?? false;
    }
    initElements() {
        this.elements.year    = this.element.querySelector('[data-clock-year]');
        this.elements.month   = this.element.querySelector('[data-clock-month]');
        this.elements.day     = this.element.querySelector('[data-clock-day]');
        this.elements.weekday = this.element.querySelector('[data-clock-weekday]');
        this.elements.hour    = this.element.querySelector('[data-clock-hour]');
        this.elements.minute  = this.element.querySelector('[data-clock-minute]');
        this.elements.second  = this.element.querySelector('[data-clock-second]');
    }
    initSplitFlaps() {
        const startYear = 1970;
        const endYear = Math.floor((new Date().getFullYear() + 10) / 10) * 10 + 9;
        if (this.elements.year)    { this.splitFlaps.year    = new SplitFlap(this.elements.year,    'year',    startYear, endYear);           this.splitFlapArray.push({ splitFlap: this.splitFlaps.year });    }
        if (this.elements.month)   { this.splitFlaps.month   = new SplitFlap(this.elements.month,   'month',   0, 11, month3);  this.splitFlapArray.push({ splitFlap: this.splitFlaps.month });   }
        if (this.elements.day)     { this.splitFlaps.day     = new SplitFlap(this.elements.day,     'day',     1, 31);                        this.splitFlapArray.push({ splitFlap: this.splitFlaps.day });     }
        if (this.elements.weekday) { this.splitFlaps.weekday = new SplitFlap(this.elements.weekday, 'weekday', 0, 6, weekday3); this.splitFlapArray.push({ splitFlap: this.splitFlaps.weekday }); }
        if (this.elements.hour)    { this.splitFlaps.hour    = new SplitFlap(this.elements.hour,    'hour',    0, 23, h12);     this.splitFlapArray.push({ splitFlap: this.splitFlaps.hour });    }
        if (this.elements.minute)  { this.splitFlaps.minute  = new SplitFlap(this.elements.minute,  'minute',  0, 59, pad00);       this.splitFlapArray.push({ splitFlap: this.splitFlaps.minute });  }
        if (this.elements.second)  { this.splitFlaps.second  = new SplitFlap(this.elements.second,  'second',  0, 59, pad00);       this.splitFlapArray.push({ splitFlap: this.splitFlaps.second });  }
    }
    initInterSplitFlapDelay() {
        this.interSplitFlapDelay = 20;
        for (let i = 0; i < this.splitFlapArray.length; i += 1) {
            const delay = 1 + this.interSplitFlapDelay * (this.splitFlapArray.length - i - 1);
            this.splitFlapArray[i].splitFlap.delay = delay;
        }
    }
    set24Hour(flag = true) {
        this.is24Hour = flag;
        localStorage.setItem('FlipClock2022.is24Hour', JSON.stringify(this.is24Hour));
        if (!this.splitFlaps.hour) {
            return;
        }
        this.updateFromPreferences();
    }
    setSecondsTicking(flag = true) {
        this.enableSecondsTicking = flag;
        localStorage.setItem('FlipClock2022.enableSecondsTicking',
                             JSON.stringify(this.enableSecondsTicking));
        this.updateFromPreferences();
    }
    updateFromPreferences() {
        if (this.is24Hour) {
            this.splitFlaps.hour.setStrings(pad00);
        } else {
            this.splitFlaps.hour.setStrings(h12);
        }
        this.splitFlaps.hour.updateStrings();
        if (this.splitFlaps.year)    { this.splitFlaps.year   .enableTicking = this.enableTicking;        this.splitFlaps.year   .tickVolume = this.tickVolume; }
        if (this.splitFlaps.month)   { this.splitFlaps.month  .enableTicking = this.enableTicking;        this.splitFlaps.month  .tickVolume = this.tickVolume; }
        if (this.splitFlaps.day)     { this.splitFlaps.day    .enableTicking = this.enableTicking;        this.splitFlaps.day    .tickVolume = this.tickVolume; }
        if (this.splitFlaps.weekday) { this.splitFlaps.weekday.enableTicking = this.enableTicking;        this.splitFlaps.weekday.tickVolume = this.tickVolume; }
        if (this.splitFlaps.hour)    { this.splitFlaps.hour   .enableTicking = this.enableTicking;        this.splitFlaps.hour   .tickVolume = this.tickVolume; }
        if (this.splitFlaps.minute)  { this.splitFlaps.minute .enableTicking = this.enableTicking;        this.splitFlaps.minute .tickVolume = this.tickVolume; }
        if (this.splitFlaps.second)  { this.splitFlaps.second .enableTicking = this.enableSecondsTicking; this.splitFlaps.second .tickVolume = this.tickVolume; }
    }
    updateSplitFlaps() {
        this.date = new Date();
        const year    = this.date.getFullYear();
        const month   = this.date.getMonth();
        const day     = this.date.getDate();
        const weekday = this.date.getDay();
        const hour    = this.date.getHours();
        const minute  = this.date.getMinutes();
        const second  = this.date.getSeconds();
        if (this.splitFlaps.year)    { this.splitFlaps.year   .goTo(year);    }
        if (this.splitFlaps.month)   { this.splitFlaps.month  .goTo(month);   }
        if (this.splitFlaps.day)     { this.splitFlaps.day    .goTo(day);     }
        if (this.splitFlaps.weekday) { this.splitFlaps.weekday.goTo(weekday); }
        if (this.splitFlaps.hour)    { this.splitFlaps.hour   .goTo(hour);    }
        if (this.splitFlaps.minute)  { this.splitFlaps.minute .goTo(minute);  }
        if (this.splitFlaps.second)  { this.splitFlaps.second .goTo(second);  }
    }
    setTicker(ticker) {
        for (let i = 0; i < this.splitFlapArray.length; i += 1) {
            this.splitFlapArray[i].splitFlap.setTicker(ticker);
        }
    }
}
