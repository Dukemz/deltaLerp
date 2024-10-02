"use strict";

class AudioManager {
  // audio manager - should be like a replaceable module
  // i know this is a super weird and inefficient way of doing this. but whatever
  constructor(data) {
    console.log("[AUDIO MANAGER]")
    Object.assign(this, data);

    this.audiocontext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.bufferLength ||= 512;

    // stuff for vectorscope
    this.splitter = this.audiocontext.createChannelSplitter(2);
    this.analyserL = this.audiocontext.createAnalyser();
    this.analyserR = this.audiocontext.createAnalyser();

    this.analyserL.fftSize = this.bufferLength;
    this.analyserR.fftSize = this.bufferLength;

    this.dataArrayL = new Float32Array(this.bufferLength);
    this.dataArrayR = new Float32Array(this.bufferLength);

    // this bit here basically allows you to do new audiomanager.AudioTrack()
    const _this = this;
    this.AudioTrack = class extends AudioTrack {
      constructor() {
        super(_this, ...arguments);
      }
    }
  }
}

class AudioTrack { // adapt to audio asset
  constructor(manager, url) {
    this.mgr = manager;

    this.audio = new Audio(url);
    const ctx = this.mgr.audiocontext;

    // create analytical stuff
    this.sourceNode = ctx.createMediaElementSource(this.audio);

  }

  remove() {
    this.sourceNode.disconnect();
  }
}