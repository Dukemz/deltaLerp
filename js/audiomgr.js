"use strict";

class AudioManager {
  // audio manager - should be like a replaceable module
  // i know this is a super weird and inefficient way of doing this. but whatever
  constructor(data) {
    console.log("[AUDIO MANAGER]")
    Object.assign(this, data);

    // note: audiocontexts can't start unless the user has interacted with the document
    // navigator.userActivation stores two properties: hasBeenActive and isActive
    // if hasBeenActive is false then audio can't play
    this.audiocontext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.bufferLength ||= 512;


    // this bit here basically allows you to do new audiomanager.AudioAsset()
    // might change this cause it's kinda stupid
    const _this = this;
    this.AudioAsset = class extends AudioAsset {
      constructor() {
        super(_this, ...arguments);
      }
    }
  }

  createAnalysers() { // stuff for vectorscope
    // splitter - splits stereo audio into 2 mono channels 
    this.splitter = this.audiocontext.createChannelSplitter(2);
    // create an analyser for each channel
    this.analyserL = this.audiocontext.createAnalyser();
    this.analyserR = this.audiocontext.createAnalyser();
    this.analyserL.fftSize = this.bufferLength;
    this.analyserR.fftSize = this.bufferLength;

    // data arrays that the analyser data will be copied into
    this.dataArrayL = new Float32Array(this.bufferLength);
    this.dataArrayR = new Float32Array(this.bufferLength);

    // connect the splitter to the analysers
    this.splitter.connect(this.analyserL, 0, 0);
    this.splitter.connect(this.analyserR, 1, 0);
  }
}

class AudioAsset { // adapt to audio asset
  constructor(manager, data) {
    this.mgr = manager;

    Object.assign(this, data);

    this.audio = new Audio(`data:audio/${this.format};base64,${this.data}`);
    const ctx = this.mgr.audiocontext;

    // create source node from audio object
    this.audioSourceNode = ctx.createMediaElementSource(this.audio);
    // connect to play through speakers
    this.audioSourceNode.connect(ctx.destination);
    // connect to analyser
    this.audioSourceNode.connect(splitter); // note - when removing audio, run splitter.disconnect()
  }

  remove() {
    this.sourceNode.disconnect();
  }
}