'use strict';
/*global FlipClock2022, SplitFlap, clamp */

function CalendarClock2022(element, options) {
    FlipClock2022.call(this, element, options);
}
CalendarClock2022.prototype = Object.create(FlipClock2022.prototype);
CalendarClock2022.prototype.constructor = CalendarClock2022;

CalendarClock2022.prototype.initPreferences = function () {
};
CalendarClock2022.prototype.set24Hour = function (flag) {
};
CalendarClock2022.prototype.setTicking = function (flag) {
};
CalendarClock2022.prototype.setSecondsTicking = function (flag) {
};
CalendarClock2022.prototype.setTickVolume = function (value) {
};
CalendarClock2022.prototype.initElements = function () {
};
CalendarClock2022.prototype.initSplitFlaps = function () {
};
CalendarClock2022.prototype.initInterSplitFlapDelay = function () {
};
CalendarClock2022.prototype.updateFromPreferences = function () {
};
CalendarClock2022.prototype.updateSplitFlaps = function () {
};
