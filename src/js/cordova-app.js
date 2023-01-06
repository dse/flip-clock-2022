'use strict';

import initClockPage from './components/clock-page';

const app = {
    // Application Constructor
    initialize() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady() {
        if (document.readyState === 'complete') {
            initClockPage();
        } else {
            window.addEventListener('load', initClockPage);
        }
        document.addEventListener('pause', this.onPause.bind(this), false);
        document.addEventListener('resume', this.onResume.bind(this), false);
    },

    keepAwake() {
        if (!window.plugins?.insomnia) {
            return;
        }
        window.plugins.insomnia.keepAwake();
    },
    allowSleepAgain() {
        if (!window.plugins?.insomnia) {
            return;
        }
        window.plugins.insomnia.allowSleepAgain();
    },

    onPause() {
        this.allowSleepAgain();
    },
    onResume() {
        this.keepAwake();
    },
};

app.initialize();

window.app = app;
