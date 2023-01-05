'use strict';
/*global AudioContext */

import { clamp } from './utils';

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
            if (!window.AudioContext) {
                window.AudioContext = window.webkitAudioContext;
            }
            if (!window.AudioContext) {
                return;
            }
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
            };
            request.send();
        }
        this.workAroundNoAutoPlay();
    }
    workAroundNoAutoPlay() {
        // you have to interact with the page to play audio.
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
            if (isNaN(value)) {
                value = 1;
            }
        }
        this.tickVolume = clamp(value, 0, 1);
        if (this.gainNode) {
            this.gainNode.gain.value = this.tickVolume;
        }
    }
    play() {
        if (document.visibilityState !== 'visible') {
            return;
        }
        if (this.element) {
            // do nothing
        } else if (this.url) {
            if (!this.context || this.context.state !== 'running' || !this.buffer) {
                // don't play when audio context is not running as
                // sound play operations apparently queue up.
                return;
            }
            const source = this.context.createBufferSource();
            source.connect(this.gainNode);
            source.buffer = this.buffer;
            source.start(0);
        }
    }
}
