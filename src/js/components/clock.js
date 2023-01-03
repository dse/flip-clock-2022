'use strict';

import { clamp } from './utils';

export default class FlipClock2022 {
    constructor(element, options = {}) {
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
    initOptions() {
        this.updateEveryMs = 1000;
        this.flickTimeoutMs = 2000;
    }
    initPreferences() {
        this.enableTicking = JSON.parse(localStorage.getItem('FlipClock2022.enableTicking')) ?? false;
        this.tickVolume    = JSON.parse(localStorage.getItem('FlipClock2022.tickVolume'))    ?? 1;
    }
    setTicking(flag = true) {
        this.enableTicking = flag;
        localStorage.setItem('FlipClock2022.enableTicking', JSON.stringify(this.enableTicking));
        this.updateFromPreferences();
    }
    setTickVolume(value = 1) {
        this.tickVolume = clamp(value, 0, 1);
        localStorage.setItem('FlipClock2022.tickVolume', JSON.stringify(this.tickVolume));
        this.updateFromPreferences();
    }
    start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.run();
    }
    stop() {
        if (!this.isRunning) {
            return;
        }
        delete this.isRunning;
        if (this.timeout) {
            clearTimeout(this.timeout);
            delete this.timeout;
        }
    }
    run() {
        this.updateSplitFlaps();
        const msecs = this.updateEveryMs - this.date.getMilliseconds() % this.updateEveryMs;
        this.timeout = setTimeout(this.run.bind(this), msecs);
    }
}
