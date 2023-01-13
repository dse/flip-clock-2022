'use strict';

import { clamp, isHidden } from './utils';
import { sprintf } from 'sprintf-js';

/**
 * const splitFlap = new SplitFlap(<element>, <arrayOfString>, [<options>]);
 * const splitFlap = new SplitFlap(<element>, <startValue>, <endValue>, [<stringFn>], [<options>]);
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

export default class SplitFlap {
    constructor() {
        /**
         * Process command line arguments.
         */
        const args = Array.from(arguments);
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
                this.startValue = this.startValue ?? 0;
                this.endValue = this.endValue ?? this.strings.length - 1;
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
            if (this.printf) {
                this.stringFn = (value) => {
                    return sprintf(this.printf, value);
                };
                this.setStrings(this.stringFn);
            } else if (this.stringFn) {
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

        this.state       = this.startValue;
        this.nextstate   = this.startValue;
        this.targetState = this.startValue;
        this.stateA = this.startValue;
        this.stateB = this.startValue;
        this.stateC = null;
        this.stateD = null;

        this.delay          = this.delay          ?? 0; // milliseconds
        this.randomness     = this.randomness     ?? 2;
        this.animation      = this.animation      ?? 2;
        this.enableTicking  = this.enableTicking  ?? true;
        this.duration       = this.duration       ?? 150; // milliseconds
        this.hurryFactor    = this.hurryFactor    ?? 0.75;
        this.flickTimeoutMs = this.flickTimeoutMs ?? 2000;

        this.setupFlicking();
    }
    goTo(state, options) {
        if (this.delay) {
            setTimeout(this.goToNow.bind(this, state, options), this.delay);
        } else {
            this.goToNow(state, options);
        }
    }
    goToNow(state, options) {
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
    run() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.runAnimation();
    }
    runAnimation() {
        if (document.visibilityState !== 'visible') {
            this.noAnimation();
            return;
        }
        if (isHidden(this.element)) {
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
    noAnimation() {
        delete this.isRunning;
        this.state = this.targetState;
        this.nextState = this.targetState;
        this.targetState = this.targetState;
        this.flapA.innerHTML = this.strings[(this.stateA = this.state) - this.startValue];
        this.flapB.innerHTML = this.strings[(this.stateB = this.state) - this.startValue];
        this.stateC = null;
        this.flapC.innerHTML = '';
        this.flapC.style.display = 'none';
        this.flapC.style.transform = '';
        this.stateD = null;
        this.flapD.innerHTML = '';
        this.flapD.style.display = 'none';
        this.flapD.style.transform = '';
    }
    animation1() {
        if (!this.beforeAnimationStart()) {
            return;
        }
        let duration = this.duration;
        if (this.hurry()) {
            duration = duration * this.hurryFactor;
        }

        let step1;
        let step2;
        let step3;
        step1 = (function () {
            this.step(0.2 + (Math.random() - 0.5) * 0.02 * this.randomness);
            setTimeout(step2, duration / 3);
        }.bind(this));
        step2 = (function () {
            this.step(4/6 + (Math.random() - 0.5) * 0.04 * this.randomness);
            setTimeout(step3, duration / 3);
        }.bind(this));
        step3 = (function () {
            this.beforeAnimationEnd();
            this.step(1);
            setTimeout(this.animation1.bind(this), duration / 3);
        }.bind(this));
        this.tick();
        step1();
    }
    animation2() {
        if (!this.beforeAnimationStart()) {
            return;
        }
        let duration = this.duration;
        if (this.hurry()) {
            duration = duration * this.hurryFactor;
        }

        const start = Date.now();
        const end = start + duration;
        const frame = (function () {
            const time = Date.now();
            let x = (time - start) / (end - start);
            x = Math.pow(x, 1.5);
            if (x >= 1) {
                this.beforeAnimationEnd();
                this.step(1);
                this.animation2();
            } else {
                this.step(x);
                setTimeout(frame, 10);
            }
        }.bind(this));
        this.tick();
        frame();
    }
    beforeAnimationStart() {
        let targetState = this.targetState;
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
    beforeAnimationEnd() {
        this.state = this.nextState;
    }

    // view an animation frame, with a real number from 0 to 1 specified.
    step(x) {
        x = clamp(x, 0, 1);
        const angle = x * Math.PI;
        const scaleY = Math.abs(Math.cos(angle));

        // C then A then D then B seemed to be the best order.

        if (x > 0 && x < 0.5) {
            this.flapC.style.display = '';
            this.flapC.style.transform = 'scaleY(' + scaleY + ')';
            this.flapC.innerHTML = this.strings[(this.stateC = this.state) - this.startValue];
        } else {
            this.stateC = null;
            this.flapC.innerHTML = '';
            this.flapC.style.display = 'none';
            this.flapC.style.transform = '';
        }
        if (x > 0 && x < 1) {
            this.flapA.innerHTML = this.strings[(this.stateA = this.nextState) - this.startValue];
        } else {
            this.flapA.innerHTML = this.strings[(this.stateA = this.state) - this.startValue];
        }
        if (x > 0.5 && x < 1) {
            this.flapD.style.display = '';
            this.flapD.style.transform = 'scaleY(' + scaleY + ')';
            this.flapD.innerHTML = this.strings[(this.stateD = this.nextState) - this.startValue];
        } else {
            this.stateD = null;
            this.flapD.innerHTML = '';
            this.flapD.style.display = 'none';
            this.flapD.style.transform = '';
        }
        if (x === 1) {
            this.flapB.innerHTML = this.strings[(this.stateB = this.state) - this.startValue];
        }
    }
    setStrings(arg) {
        let i;
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
    updateStrings() {
        if (this.flapC != null) { this.flapC.innerHTML = this.strings[this.stateC - this.startValue]; }
        if (this.flapA != null) { this.flapA.innerHTML = this.strings[this.stateA - this.startValue]; }
        if (this.flapD != null) { this.flapD.innerHTML = this.strings[this.stateD - this.startValue]; }
        if (this.flapB != null) { this.flapB.innerHTML = this.strings[this.stateB - this.startValue]; }
    }
    tick() {
        if (!this.ticker || !this.enableTicking) {
            return;
        }
        if (isHidden(this.element)) {
            return;
        }
        if (this.ticker instanceof HTMLMediaElement) {
            if (this.tickVolume == null || typeof this.tickVolume !== 'number') {
                this.ticker.volume = 1;
            } else {
                this.ticker.volume = clamp(this.tickVolume, 0, 1);
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
    setTicker(ticker) {
        this.ticker = ticker;
    }
    setupFlicking() {
        if (this.hasFlicking) {
            return;
        }
        this.hasFlicking = true;
        this.element.addEventListener('click', this.flick.bind(this));
    }
    flick() {
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
    flickReset() {
        delete this.flickTargetState;
        this.run();
    }
    hurry() {
        // unless next state is the target state, flick faster.
        let targetState = this.targetState;
        if (this.flickTargetState != null) {
            targetState = this.flickTargetState;
        }
        const a = targetState - this.startValue;
        const b = this.nextState - this.startValue;
        const modulo = this.endValue - this.startValue + 1;
        const hurry = a % modulo !== b % modulo;
        return hurry;
    }
}
