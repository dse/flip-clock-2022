'use strict';

/**
 * const splitFlap = new SplitFlap(<element>, <arrayOfString>, [<stringFn>], [<options>]);
 * const splitFlap = new SplitFlap(<element>, <startValue>, <endValue>, [<options>]);
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
function SplitFlap() {
    var args = Array.from(arguments);
    var i;
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
    if (Array.isArray(args[0])) {
        this.strings = args.shift();
        this.startValue = 0;
        this.endValue = this.strings.length - 1;
    } else if (args.length >= 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
        this.startValue = args.shift();
        this.endValue = args.shift();
    } else {
        throw new Error('incorrect arguments');
    }
    if (typeof args[0] === 'function') {
        this.stringFn = args.shift();
    }
    if (Object.prototype.toString.call(args[0]) === '[object Object]') {
        // plain object
        Object.assign({}, args.shift());
    }
    if (!this.strings) {
        this.strings = [];
        if (this.stringFn) {
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
    this.state       = this.startValue;
    this.nextstate   = this.startValue;
    this.targetState = this.startValue;
    this.stateA = 0;
    this.stateB = 0;
    this.stateC = null;
    this.stateD = null;
    this.flapA.innerHTML = this.strings[0];
    this.flapB.innerHTML = this.strings[0];
    this.delay = 40;
    this.randomness = 2;
    this.animation = 2;
}

SplitFlap.prototype.goTo = function (state) {
    this.targetState = state;
    if (this.isRunning) {
        return;
    }
    this.isRunning = true;
    if (this.animation === 1) {
        this.animation1();
    } else if (this.animation === 2) {
        this.animation2();
    }
};

SplitFlap.prototype.animation1 = function () {
    if (!this.beforeAnimationStart()) {
        return;
    }
    var duration = 100;         // milliseconds
    var step1;
    var step2;
    var step3;
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
    step1();
};

SplitFlap.prototype.animation2 = function () {
    if (!this.beforeAnimationStart()) {
        return;
    }
    var duration = 100;         // milliseconds
    var start = Date.now();
    var end = start + duration;
    var frame = (function () {
        var time = Date.now();
        var x = (time - start) / (end - start);
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
    frame();
};

SplitFlap.prototype.beforeAnimationStart = function () {
    if (this.state === this.targetState) {
        delete this.isRunning;
        return false;
    }
    this.nextState = this.state + 1;
    if (this.nextState > this.endValue) {
        this.nextState = this.startValue;
    }
    return true;
};

SplitFlap.prototype.beforeAnimationEnd = function () {
    this.state = this.nextState;
};

// view an animation frame, with a real number from 0 to 1 specified.
SplitFlap.prototype.step = function (x) {
    function clamp(y, a, b) {
        return (y < a) ? a : (y > b) ? b : y;
    }
    x = clamp(x, 0, 1);
    var angle = x * Math.PI;
    var scaleY = Math.abs(Math.cos(angle));

    // C then A then D then B seemed to be the best order.

    if (x > 0 && x < 0.5) {
        this.flapC.style.display = '';
        this.flapC.style.transform = 'scaleY(' + scaleY + ')';
        this.flapC.innerHTML = this.strings[this.stateC = this.state - this.startValue];
    } else {
        this.stateC = null;
        this.flapC.innerHTML = '';
        this.flapC.style.display = 'none';
        this.flapC.style.transform = '';
    }
    if (x > 0 && x < 1) {
        this.flapA.innerHTML = this.strings[this.stateA = this.nextState - this.startValue];
    } else {
        this.flapA.innerHTML = this.strings[this.stateA = this.state - this.startValue];
    }
    if (x > 0.5 && x < 1) {
        this.flapD.style.display = '';
        this.flapD.style.transform = 'scaleY(' + scaleY + ')';
        this.flapD.innerHTML = this.strings[this.stateD = this.nextState - this.startValue];
    } else {
        this.stateD = null;
        this.flapD.innerHTML = '';
        this.flapD.style.display = 'none';
        this.flapD.style.transform = '';
    }
    if (x === 1) {
        this.flapB.innerHTML = this.strings[this.stateB = this.state - this.startValue];
    }
};

SplitFlap.prototype.setStrings = function (arg) {
    var i;
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
};

SplitFlap.prototype.updateStrings = function () {
    if (this.flapC != null) { this.flapC.innerHTML = this.strings[this.stateC]; }
    if (this.flapA != null) { this.flapA.innerHTML = this.strings[this.stateA]; }
    if (this.flapD != null) { this.flapD.innerHTML = this.strings[this.stateD]; }
    if (this.flapB != null) { this.flapB.innerHTML = this.strings[this.stateB]; }
};
