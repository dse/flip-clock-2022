'use strict';

function clamp(x, y, z) {
    if (x < y) {
        return y;
    }
    if (x > z) {
        return z;
    }
    return x;
}

function isHidden(element) {
    var style;
    if (!element) {
        return;
    }
    for (; element && element.style; element = element.parentNode) {
        style = window.getComputedStyle(element);
        if (style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.opacity === 0) {
            return true;
        }
    }
    return false;
}
