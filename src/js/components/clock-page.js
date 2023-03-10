'use strict';

import ClockTicker from './audio';
import TimeClock2022 from './time-clock';
import CalendarClock2022 from './calendar-clock';

let tick;
let clock;
let calendarClock;
let logs;

export default function initClockPage() {
    tick = new ClockTicker('sounds/tick2.wav');

    const timeClockOptions = {};
    const calendarClockOptions = {};
    if (/(?:^|[?&])anim(?:ation)?=?1(?:$|[?&=])/i.test(location.search)) {
        timeClockOptions.animation = 1;
        calendarClockOptions.animation = 1;
    }
    if (/(?:^|[?&])anim(?:ation)?=?0(?:$|[?&=])/i.test(location.search)) {
        timeClockOptions.animation = 0;
        calendarClockOptions.animation = 0;
    }

    clock = new TimeClock2022(document.getElementById('clock'), timeClockOptions);
    clock.setTicker(tick);
    clock.start();

    calendarClock = new CalendarClock2022(document.getElementById('clock'), calendarClockOptions);
    calendarClock.setTicker(tick);
    calendarClock.start();

    initEvents();
    initLogs();
    initCheckboxEvents();
    initVolumeSlider();

    if (/(?:^|[?&])arial(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--arial');
    }
    if (/(?:^|[?&])arial-?black(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--arial-black');
    }
    if (/(?:^|[?&])inter(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--inter');
    }
    if (/(?:^|[?&])times(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--times');
    }
    if (/(?:^|[?&])noto(?:-?sans)?(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--noto-sans');
    }

    if (/(?:^|[?&])helv(?:etica)?-?bold-?cond(?:ensed)?(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--helvetica-bold-condensed--apple');
    }
    if (/(?:^|[?&])iPad(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--helvetica-bold-condensed--apple');
    }

    if (/(?:^|[?&])futura(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--futura');
    }
    if (/(?:^|[?&])gill-?sans(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--gill-sans');
    }
    if (/(?:^|[?&])optima(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--optima');
    }
    if (/(?:^|[?&])palatino(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--palatino');
    }
    if (/(?:^|[?&])rockwell(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--rockwell');
    }
    if (/(?:^|[?&])verdana(?:$|[?&=])/i.test(location.search)) {
        useFontClass('font--verdana');
    }
}

function useFontClass(className) {
    const classList = document.documentElement.classList;
    const classes = [];
    for (let i = 0; i < classList.length; i += 1) {
        classes.push(classList.item(i));
    }
    for (let i = 0; i < classes.length; i += 1) {
        if (/^font--/.test(classes[i])) {
            classList.remove(classes[i]);
        }
    }
    classList.add(className);
}

function initLogs() {
    logs = document.getElementById('logs');
    if (/\b(?:iPhone|iPad|mac os x)\b/i.test(navigator.userAgent)) {
        hackConsoleMethods();
    }
    if (/\b(?:iPhone|iPad)\b/.test(navigator.userAgent)) {
        console.debug(navigator.userAgent);
        // Array.from(document.head.querySelectorAll('link[rel="stylesheet"]')).forEach(
        //     stylesheet => console.log(stylesheet.getAttribute('href'))
        // );
        // Array.from(document.head.querySelectorAll('script[src]')).forEach(
        //     stylesheet => console.log(stylesheet.getAttribute('src'))
        // );
    }
}

function hackConsoleMethods() {
    ['debug', 'log', 'warn', 'info', 'error'].forEach(function (level) {
        const fn = console[level];
        console[level] = function () {
            fn.apply(console, arguments);
            logs.innerHTML = logs.innerHTML + level.toUpperCase() +
                ': ' + Array.from(arguments).join(' ') + '\n';
        };
    });
}

function initEvents() {
    const toggle = document.getElementById('controlPanelToggle');
    const logsToggle = document.getElementById('logsToggle');
    const panel = document.getElementById('controlPanel');
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
    const is24Hour = document.getElementById('is24Hour');
    if (is24Hour) {
        is24Hour.checked = clock.is24Hour;
        is24Hour.addEventListener('change', function () {
            clock.set24Hour(is24Hour.checked);
        });
    }
    const enableTicking = document.getElementById('enableTicking');
    if (enableTicking) {
        enableTicking.checked = clock.enableTicking;
        enableTicking.addEventListener('change', function () {
            clock.setTicking(enableTicking.checked);
            calendarClock.setTicking(enableTicking.checked);
        });
    }
    const enableSecondsTicking = document.getElementById('enableSecondsTicking');
    if (enableSecondsTicking) {
        enableSecondsTicking.checked = clock.enableSecondsTicking;
        enableSecondsTicking.addEventListener('change', function () {
            clock.setSecondsTicking(enableSecondsTicking.checked);
        });
    }
}

function initVolumeSlider() {
    const tickVolume = document.getElementById('tickVolume');
    if (!tickVolume) {
        return;
    }
    tickVolume.value = clock.tickVolume;
    tickVolume.addEventListener('change', function () {
        clock.setTickVolume(tickVolume.value);
        calendarClock.setTickVolume(tickVolume.value);
    });
}

function reloadPage() {
    const url = new URL(window.location.href);
    url.searchParams.set('cacheBuster', Date.now());
    window.location.assign(url.toString());
}

window.reloadPage = reloadPage;
