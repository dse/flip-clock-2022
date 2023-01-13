'use strict';

import SplitFlap from './splitflap';
import dayjs from 'dayjs';
import { sprintf } from 'sprintf-js';

const maxYear = Math.floor(new Date().getFullYear() / 10) * 10 + 19;
// 2020 => 2039
// 2029 => 2039
// 2030 => 2049
// 2039 => 2049

const FORMATS = {
    'YY': {
        min: 0,
        max: 99,
        dateToValueFn: d => d.getFullYear() % 100,
        printfFormat: '%02d',
    },
    'YYYY': {
        min: 1970,
        max: maxYear,
        dateToValueFn: d => d.getFullYear(),
        printfFormat: '%04d',
    },
    'M': {
        min: 0,
        max: 11,
        dateToValueFn: d => d.getMonth(),
        strings: monthStrings('M'),
    },
    'MM': {
        min: 0,
        max: 11,
        dateToValueFn: d => d.getMonth(),
        strings: monthStrings('MM'),
    },
    'MMM': {
        min: 0,
        max: 11,
        dateToValueFn: d => d.getMonth(),
        strings: monthStrings('MMM'),
    },
    'MMMM': {
        min: 0,
        max: 11,
        dateToValueFn: d => d.getMonth(),
        strings: monthStrings('MMMM'),
    },
    'D': {
        min: 1,
        max: 31,
        dateToValueFn: d => d.getDate(),
        printfFormat: '%d',
    },
    'DD': {
        min: 1,
        max: 31,
        dateToValueFn: d => d.getDate(),
        printfFormat: '%02d',
    },
    'd': {
        min: 0,
        max: 6,
        dateToValueFn: d => d.getDay(),
        strings: dayStrings('d'),
    },
    'dd': {
        min: 0,
        max: 6,
        dateToValueFn: d => d.getDay(),
        strings: dayStrings('dd'),
    },
    'ddd': {
        min: 0,
        max: 6,
        dateToValueFn: d => d.getDay(),
        strings: dayStrings('ddd'),
    },
    'dddd': {
        min: 0,
        max: 6,
        dateToValueFn: d => d.getDay(),
        strings: dayStrings('dddd'),
    },
    'H': {
        min: 0,
        max: 23,
        dateToValueFn: d => d.getHours(),
        printfFormat: '%d',
    },
    'HH': {
        min: 0,
        max: 23,
        dateToValueFn: d => d.getHours(),
        printfFormat: '%02d',
    },
    'h': {
        min: 0,
        max: 23,
        dateToValueFn: d => d.getHours(),
        printfFormat: '%d',
    },
    'hh': {
        min: 0,
        max: 23,
        dateToValueFn: d => d.getHours(),
        printfFormat: '%02d',
    },
    'm': {
        min: 0,
        max: 59,
        dateToValueFn: d => d.getMinutes(),
        printfFormat: '%d',
    },
    'mm': {
        min: 0,
        max: 59,
        dateToValueFn: d => d.getMinutes(),
        printfFormat: '%02d',
    },
    's': {
        min: 0,
        max: 59,
        dateToValueFn: d => d.getSeconds(),
        printfFormat: '%d',
    },
    'ss': {
        min: 0,
        max: 59,
        dateToValueFn: d => d.getSeconds(),
        printfFormat: '%02d',
    },
    'A': {                      // AM or PM
        min: 0,
        max: 1,
        dateToValueFn: d => d.getHours() < 12,
        strings: ['AM', 'PM'],
    },
    'a': {                      // am or pm
        min: 0,
        max: 1,
        dateToValueFn: d => d.getHours() < 12,
        strings: ['am', 'pm'],
    },
};

export default class DateSplitFlap extends SplitFlap {
    constructor(element, format, options = {}) {
        if (element == null) {
            throw new Error(`element argument not supplied`);
        }
        if (format == null) {
            throw new Error(`format argument not supplied`);
        }
        const formatData = FORMATS[format];
        if (formatData == null) {
            throw new Error(`unsupported format: ${format}`);
        }

        if (formatData.dateToValueFn != null) {
            this.dateToValueFn = formatData.dateToValueFn;
        }

        let stringFn;
        if (formatData.printfFormat != null) {
            stringFn = value => sprintf(formatData.printfFormat, value);
        }

        const superArgs = [element];
        if (formatData.min != null && formatData.max != null) {
            superArgs.push(formatData.min, formatData.max);
        }
        if (formatData.strings != null) {
            superArgs.push(formatData.strings);
        }
        if (formatData.stringFn != null) {
            superArgs.push(formatData.stringFn);
        }
        superArgs.push(options);
        super(...superArgs);
    }
    goTo(state, options) {
        if (state instanceof Date) {
            state = this.dateToValueFn(state);
        }
        super.goTo(state, options);
    }
    goToNow(state, options) {
        if (state instanceof Date) {
            state = this.dateToValueFn(state);
        }
        super.goTo(state, options);
    }
}

function monthStrings(format) {
    const d = new Date(2023, 0, 1, 0, 0, 0, 0);
    const strings = [];
    for (let i = 0; i < 12; i += 1) {
        d.setMonth(i);
        strings.push(dayjs(d).format(format));
    }
    return strings;
}

function dayStrings(format) {
    const d = new Date(2023, 0, 1, 0, 0, 0, 0);
    const strings = [];
    for (let i = 0; i < 7; i += 1) {
        d.setDay(i);
        strings.push(dayjs(d).format(format));
    }
    return strings;
}
