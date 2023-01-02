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
