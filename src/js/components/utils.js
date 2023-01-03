'use strict';

export function clamp(x, y, z) {
    if (x < y) {
        return y;
    }
    if (x > z) {
        return z;
    }
    return x;
}

export function isHidden(element) {
    if (!element) {
        return;
    }
    for (; element && element.style; element = element.parentNode) {
        const style = window.getComputedStyle(element);
        if (style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.opacity === 0) {
            return true;
        }
    }
    return false;
}
