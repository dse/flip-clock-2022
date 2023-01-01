'use strict';
/*global ClockTicker, FlipClock2022 */

var tick;
var clock;
var logs;

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}

function init() {
    tick = new ClockTicker('sounds/tick2.wav');
    clock = new FlipClock2022(document.getElementById('clock'));
    clock.setTicker(tick);
    clock.start();
    initEvents();
    initLogs();
    initCheckboxEvents();
    initVolumeSlider();
}

function initLogs() {
    logs = document.getElementById('logs');
    if (/\b(?:iPhone|iPad|mac os x)\b/i.test(navigator.userAgent)) {
        ['debug', 'log', 'warn', 'info', 'error'].forEach(function (level) {
            var fn = console[level];
            console[level] = function () {
                fn.apply(console, arguments);
                logs.innerHTML = logs.innerHTML + level.toUpperCase() +
                    ': ' + Array.from(arguments).join(' ') + '\n';
            };
        });
    }
}

function initEvents() {
    var toggle = document.getElementById('controlPanelToggle');
    var logsToggle = document.getElementById('logsToggle');
    var panel = document.getElementById('controlPanel');
    toggle.addEventListener('click', function () {
        panel.classList.toggle('hide');
        if (panel.classList.contains('hide')) {
            logs.classList.add('hide');
        }
    });
    logsToggle.addEventListener('click', function () {
        logs.classList.toggle('hide');
    });
}

function initCheckboxEvents() {
    var is24Hour = document.getElementById('is24Hour');
    if (is24Hour) {
        is24Hour.checked = clock.is24Hour;
        is24Hour.addEventListener('change', function () {
            clock.set24Hour(is24Hour.checked);
        });
    }
    var enableTicking = document.getElementById('enableTicking');
    if (enableTicking) {
        enableTicking.checked = clock.enableTicking;
        enableTicking.addEventListener('change', function () {
            clock.setTicking(enableTicking.checked);
        });
    }
    var enableSecondsTicking = document.getElementById('enableSecondsTicking');
    if (enableSecondsTicking) {
        enableSecondsTicking.checked = clock.enableSecondsTicking;
        enableSecondsTicking.addEventListener('change', function () {
            clock.setSecondsTicking(enableSecondsTicking.checked);
        });
    }
}

function initVolumeSlider() {
    var tickVolume = document.getElementById('tickVolume');
    if (!tickVolume) {
        return;
    }
    tickVolume.value = clock.tickVolume;
    tickVolume.addEventListener('change', function () {
        clock.setTickVolume(tickVolume.value);
    });
}
