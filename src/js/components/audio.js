'use strict';
/*global AudioContext, clamp */

// SAFARI NOTES
//
// - When using file:// protocol and <audio> element there is lag.
//
// - When using file:// protocol, XMLHttpRequests will not work
//   so we can't do the Web Audio API unless we can find a way
//   to get an audio buffer from an <audio> element.

export default class ClockTicker {
    constructor(audio) {
        if (audio && audio instanceof HTMLMediaElement) {
            this.element = audio;
        } else if (typeof audio === 'string') {
            this.url = audio;
        } else {
            throw new Error(`no audio specified`);
        }
        if (this.element) {
            // do nothing for now
        } else if (this.url) {
            if (!window.AudioContext) { window.AudioContext = window.webkitAudioContext; }
            if (!window.AudioContext) { return; }
            this.context = new AudioContext();
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = 1;
            this.gainNode.connect(this.context.destination);
            const request = new XMLHttpRequest();
            request.open('GET', this.url, true);
            request.responseType = 'arraybuffer';
            request.onload = () => {
                this.context.decodeAudioData(request.response, (buffer) => {
                    this.buffer = buffer;
                });
            });
            request.send();
        }
        this.workAroundNoAutoPlay();
    }
    workAroundNoAutoPlay() {
        const tempHandler = () => {
            document.body.removeEventListener('click', tempHandler);
            document.body.removeEventListener('tap', tempHandler);
            document.body.removeEventListener('touchstart', tempHandler);
            this.context.resume();
        };
        document.body.addEventListener('click', tempHandler);
        document.body.addEventListener('tap', tempHandler);
        document.body.addEventListener('touchstart', tempHandler);
    }
    setTickVolume(value = 1) {
        if (typeof value === 'string') {
            value = Number(value);
        }
        if (typeof value !== 'number' || isNaN(value)) {
            this.tickVolume = 1;
        } else {
            this.tickVolume = clamp(value, 0, 1);
        }
        if (this.gainNode) {
            this.gainNode.gain.value = this.tickVolume;
        }
    }
    play() {
        if (this.element) {
            // do nothing
        } else if (this.url) {
            if (!this.context || this.context.suspended || !this.buffer) {
                return;
            }
            let source = this.context.createBufferSource();
            source.connect(this.gainNode);
            source.buffer = this.buffer;
            source.start(0);
        }
    }
}
