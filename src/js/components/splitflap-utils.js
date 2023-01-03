'use strict';

/**
 * The names of weekdays.  The first two characters of each are unique
 * abbreviations, as are the first three characters.
 */
export const WEEKDAYS = [
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
export const MONTHS = [
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
export const MONTHS_ABBR_2 = [
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
export function pad00(str) {
    str = String(str);
    while (str.length < 2) {
        str = '0' + str;
    }
    return str;
}

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

const DEFAULT_FORMAT =
      '<span class="clock__hour12">{hour12}</span>' +
      '<span class="clock__ampm clock__ampm--{ampmClass}">{ampmString}</span>';

export function hour12(hour24, amString = 'am', pmString = 'pm', format = DEFAULT_FORMAT) {
    const hour12 = (hour24 + 11) % 12 + 1;
    const ampmClass = hour24 < 12 ? 'am' : 'pm';
    const ampmString = hour24 < 12 ? amString : pmString;
    let str = format;
    str = str.replace(/{hour12}/g, String(hour12));
    str = str.replace(/{ampmClass}/g, ampmClass);
    str = str.replace(/{ampmString}/g, ampmString);
    return str;
}
