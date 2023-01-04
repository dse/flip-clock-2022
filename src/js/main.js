'use strict';

import initClockPage from './components/clock-page';

if (document.readyState === 'complete') {
    initClockPage();
} else {
    window.addEventListener('load', initClockPage);
}
