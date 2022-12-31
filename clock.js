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

/**
 * The names of weekdays.  The first two characters of each are unique
 * abbreviations, as are the first three characters.
 */
SplitFlap.WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

/**
 * The names of months.  The first three characters of each are unique
 * abbreviations.  For unique two-character abbreviations, use
 * SplitFlap.MONTHS_ABBR_2.
 */
SplitFlap.MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

/**
 * Unique two-character abbreviations for the months.  For
 * three-character abbreviations or the full months, use
 * SplitFlap.MONTHS.
 */
SplitFlap.MONTHS_ABBR_2 = [
    'Ja',
    'Fe',
    'Mr',
    'Ap',
    'My',
    'Jn',
    'Jl',
    'Au',
    'Se',
    'Oc',
    'No',
    'De',
];

/**
 * Pad a number to the left with zeroes until it's two characters
 * long.
 *
 * Useful for minutes and seconds, this function generates '00'
 * through '59' for the numbers 0 through 59.
 */
SplitFlap.pad00 = function (str) {
    str = String(str);
    while (str.length < 2) {
        str = '0' + str;
    }
    return str;
};

/**
 * Generates and returns an hour string for a 12-hour clock in the
 * form:
 *
 *     <span class="clock__hour12">11</span>
 *     <span class="clock__ampm clock__ampm--pm">pm</span>
 *
 * (The two segments are concatenated without spaces or other
 * characters in between.  They are line-broken here for readability.)
 *
 * Usage:
 *
 *     const hour12 = SplitFlap.hour12(<hour24>, <amString>, <pmString>,
 *                                     <format>);
 *
 * <hour24>, an hour number from 0 to 23, is the only required argument.
 *
 * <amString> and <pmString>, optional strings to display for "am" and
 * "pm", default to "am" and "pm".
 *
 * <format>, an optional format specification for the string, defaults
 * to a format to display a string like the above.
 *
 *     {hour12} in the string is replaced with '1' through '12'.
 *     This is not padded with zeroes to the left, as display of
 *     strings like "05:48" is not customary in 12-hour time.
 *
 *     {ampmClass} in the string is replaced with 'am' or 'pm'.
 *     This was created for generating CSS class names, and is
 *     not changeable.
 *
 *     {ampmString} in the string is replaced with the <amString> or
 *     the <pmString> to this function, or with the default value of
 *     one of them.
 *
 * Example format:
 *
 *     var format = '<span class="{ampmClass}">{hour12} {ampmString}</span>';
 *
 * when the following is called:
 *
 *     const hour12 = SplitFlap.hour12(hour24, 'AM', 'PM', format);
 *
 * might be replaced with something like:
 *
 *     <span class="am">5 AM</span>
 *     <span class="pm">11 PM</span>
 */
SplitFlap.hour12 = function (hour24, amString, pmString, format) {
    if (format == null) {
        format = '<span class="clock__hour12">{hour12}</span>' +
            '<span class="clock__ampm clock__ampm--{ampmClass}">{ampmString}</span>';
    }
    if (amString == null) { amString = 'am'; }
    if (pmString == null) { pmString = 'pm'; }
    var hour12 = (hour24 + 11) % 12 + 1;
    var ampmClass = hour24 < 12 ? 'am' : 'pm';
    var ampmString = hour24 < 12 ? amString : pmString;
    var str = format;
    str = str.replace(/{hour12}/g, String(hour12));
    str = str.replace(/{ampmClass}/g, ampmClass);
    str = str.replace(/{ampmString}/g, ampmString);
    return str;
};
