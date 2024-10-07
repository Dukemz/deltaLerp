"use strict";

class AudioManager {
  // audio manager - should be like a replaceable module
  // if i change audio libraries i should be able to replace this whole file
  // without having to change anything else in the code
  constructor(data) {
    console.log("[AUDIO MANAGER]");
    Object.assign(this, data);

    // note: audiocontexts can't start unless the user has interacted with the document
    // navigator.userActivation stores two properties: hasBeenActive and isActive
    // if hasBeenActive is false then audio can't play
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    this.bufferLength ||= 512;


    // this bit here basically allows you to do new audiomanager.AudioAsset()
    // might change this cause it's kinda stupid
    // const _this = this;
    // this.AudioAsset = class extends AudioAsset {
    //   constructor() {
    //     super(_this, ...arguments);
    //   }
    // }
  }

  initialiseAnalysers() { // stuff for vectorscope
    // splitter - splits stereo audio into 2 mono channels 
    this.splitter = this.audioContext.createChannelSplitter(2);
    // create an analyser for each channel
    this.analyserL = this.createAnalyser();
    this.analyserR = this.createAnalyser();

    // connect the splitter to the analysers
    this.splitter.connect(this.analyserL, 0, 0);
    this.splitter.connect(this.analyserR, 1, 0);
  }

  createAnalyser() { // singular analyser
    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = this.bufferLength;
    // data array that the analyser data will be copied into
    analyser.dataArray = new Float32Array(this.bufferLength);
    return analyser;
  }
}

class AudioAsset { // adapt to audio asset
  constructor(assetdata) {
    this.mgr = manager.audio;

    Object.assign(this, assetdata);

    this.id ||= "MISSINGID";

    // check if an asset with the same id already exists
    if(manager.assets.audio[this.id]) throw Error(`Audio asset with ID [${this.id}] already exists!`);

    if(!this.format) throw Error(`Audio format for asset [${this.id}] not specified!`);
    if(!this.data) throw Error(`Audio data for asset [${this.id}] not specified!`);

    this.audio = new Audio(`data:audio/${this.format};base64,${this.data}`);

    // audio should be loaded now so remove data to free up some memory!
    this.data = null;
    
    const ctx = this.mgr.audioContext;

    // create source node from audio object
    this.audioSourceNode = ctx.createMediaElementSource(this.audio);
    // connect to play through speakers
    this.audioSourceNode.connect(ctx.destination);
    
    // add asset to the asset thing
    console.log(`Audio asset [${this.id}] loaded!`);
    manager.assets.audio[this.id] = this;
    return this;
  }

  connectAnalysers() { // separate function, in case analysers are not created yet
    this.audioSourceNode.connect(this.mgr.splitter); // note - when removing audio, run splitter.disconnect()
  }

  delete() {
    if(this.mgr.splitter) this.mgr.splitter.disconnect(this.audioSourceNode);
    this.audioSourceNode.disconnect();
    this.audio.remove();
    this.audio.src = null;
    delete manager.assets.audio[this.id];
    console.log(`Audio asset [${this.id}] deleted!`);
  }
}