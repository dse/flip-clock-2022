'use strict';
/*global webkitAudioContext, AudioContext */

// NOTES: Safari delays audio when using file:// and <audio> element

function ClockTicker(audio) {
    if (audio && audio instanceof HTMLMediaElement) {
        this.element = audio;
    } else if (typeof audio === 'string') {
        this.url = audio;
    }
    if (this.element) {
        // do nothing for now
    } else if (this.url) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!window.AudioContext) { return; }
        this.context = new AudioContext();
        var request = new XMLHttpRequest();
        request.open('GET', this.url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
            this.context.decodeAudioData(request.response, function(buffer) {
                this.buffer = buffer;
            }.bind(this));
        }.bind(this);
        request.send();
    }
    this.workAroundNoAutoPlay();
}

ClockTicker.prototype.workAroundNoAutoPlay = function () {
    var tempHandler;
    tempHandler = function () {
        document.body.removeEventListener('click', tempHandler);
        document.body.removeEventListener('tap', tempHandler);
        document.body.removeEventListener('touchstart', tempHandler);
        this.context.resume();
    }.bind(this);
    document.body.addEventListener('click', tempHandler);
    document.body.addEventListener('tap', tempHandler);
    document.body.addEventListener('touchstart', tempHandler);
};

ClockTicker.prototype.play = function () {
    var source;
    if (this.element) {
        // do nothing
    } else if (this.url) {
        if (!this.context) { return; }
        if (this.context.suspended) { return; }
        if (!this.buffer) { return; }
        source = this.context.createBufferSource();
        source.buffer = this.buffer;
        source.connect(this.context.destination);
        source.start(0);
    }
};
