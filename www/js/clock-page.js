'use strict';

var logs = document.getElementById('logs');
if (/\b(?:iPhone|iPad|mac os x)\b/i.test(navigator.userAgent)) {
    ['debug', 'log', 'warn', 'info', 'error'].forEach(function (level) {
        var fn = console[level];
        console[level] = function () {
            fn.apply(console, arguments);
            logs.innerHTML = logs.innerHTML + level.toUpperCase() + ': ' + Array.from(arguments).join(' ') + '\n';
        };
    });
}

var tick;
var clock;

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
    var is24Hour = document.getElementById('is24Hour');
    is24Hour.checked = clock.is24Hour;
    is24Hour.addEventListener('change', function () {
        clock.set24Hour(is24Hour.checked);
    });
}

function init() {
    tick = new ClockTicker('sounds/tick2.wav');
    clock = new FlipClock2022(document.getElementById('clock'));
    clock.setTicker(tick);
    clock.start();
    initEvents();
}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}
