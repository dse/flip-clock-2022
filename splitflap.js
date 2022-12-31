'use strict';
/**
 * const splitFlap = new SplitFlap(<element>, <arrayOfString>, <stringFn>);
 * const splitFlap = new SplitFlap(<element>, <startValue>, <endValue>);
 *
 * <element> is a reference to a DOM element.  It can be a string or
 * an HTMLElement object.
 *
 * <startValue> and <endValue> specifies a range of numeric values.
 * The range includes both the <startValue> and the <endValue>.
 * Examples:
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
 */
function SplitFlap() {
    var args = Array.from(arguments);
    var i;
    this.element = args.shift();
    if (typeof this.element === 'string') {
        this.element = document.getElementById(this.element);
    }
    if (!this.element) {
        return;
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
    if (!this.strings) {
        this.strings = [];
        if (this.stringFn) {
            for (i = this.startValue; i <= this.endValue; i += 1) {
                this.strings.push(this.stringFn.call(null, i));
            }
        } else {
            for (i = this.startValue; i <= this.endValue; i += 1) {
                this.strings.push(String(i));
            }
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
    this.flapA.innerHTML = this.strings[0];
    this.flapB.innerHTML = this.strings[0];
    this.delay = 40;
    return this;
}
SplitFlap.prototype.goTo = function (state) {
    this.targetState = state;
    if (this.isRunning) {
        return;
    }
    this.isRunning = true;
    this.step1();
};
SplitFlap.prototype.step1 = function () {
    if (this.state === this.targetState) {
        delete this.running;
        return;
    }
    this.nextState = this.state + 1;
    if (this.nextState > this.endValue) {
        this.nextState = this.startValue;
    }
    this.flapC.style.display = '';
    this.flapC.style.transform = 'scaleY(0.8)';
    this.flapC.innerHTML = this.strings[this.state - this.startValue];
    this.flapA.innerHTML = this.strings[this.nextState - this.startValue];
    setTimeout(this.step2.bind(this), this.delay);
};
SplitFlap.prototype.step2 = function () {
    this.flapC.style.display = 'none';
    this.flapC.style.transform = '';
    this.flapD.style.display = '';
    this.flapD.style.transform = 'scaleY(0.5)';
    this.flapD.innerHTML = this.strings[this.nextState - this.startValue];
    setTimeout(this.step3.bind(this), this.delay);
};
SplitFlap.prototype.step3 = function () {
    this.flapD.style.display = 'none';
    this.flapD.style.transform = '';
    this.flapB.innerHTML = this.strings[this.nextState - this.startValue];
    this.state = this.nextState;
    setTimeout(this.step1.bind(this), this.delay);
};
