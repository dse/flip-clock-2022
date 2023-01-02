'use strict';
/*global FlipClock2022, SplitFlap, clamp */

function TimeClock2022(element, options) {
    FlipClock2022.call(this, element, options);
}
TimeClock2022.prototype = Object.create(FlipClock2022.prototype);
TimeClock2022.prototype.constructor = TimeClock2022;

TimeClock2022.prototype.initPreferences = function () {
};
TimeClock2022.prototype.set24Hour = function (flag) {
};
TimeClock2022.prototype.setTicking = function (flag) {
};
TimeClock2022.prototype.setSecondsTicking = function (flag) {
};
TimeClock2022.prototype.setTickVolume = function (value) {
};
TimeClock2022.prototype.initElements = function () {
};
TimeClock2022.prototype.initSplitFlaps = function () {
};
TimeClock2022.prototype.initInterSplitFlapDelay = function () {
};
TimeClock2022.prototype.updateFromPreferences = function () {
};
TimeClock2022.prototype.updateSplitFlaps = function () {
};
