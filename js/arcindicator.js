"use strict";

class ArcIndicator { // arc indicator thing
  // may be used to show health, forcefield or etc
  // multiple arc layers, each with their own color, size, etc?
  constructor(parent) {
    // parent sprite to attach to
    this.parent = parent;
    // set properties
    this.stroke = color(255);
    this.strokeWeight = 2;
    this.diameter = 85;

    this.start = 0;
    this.targetStart = 0;
    this.startLerpAmount = 0.8;
    this.stop = 0;
    this.targetStop = 180;
    this.stopLerpAmount = 0.8;
  }

  draw() {
    // do lerp stuff
    if(this.start !== this.targetStart) this.start = deltaLerp(this.start, this.targetStart, this.startLerpAmount);
    if(this.stop !== this.targetStop) this.stop = deltaLerp(this.stop, this.targetStop, this.stopLerpAmount);
    
    push();
    noFill();
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    arc(this.parent.x, this.parent.y, this.diameter, this.diameter, this.start, this.stop);
    pop();
  }
}

/*
"use strict";

class ArcIndicator extends Sprite { // arc indicator thing
  // may be used to show health, forcefield or etc
  // multiple arc layers, each with their own color, size, etc?
  constructor(parent) {
    // sprite constructor
    // x, y, width, height
    super(parent.x, parent.y, 85);
    // parent sprite to attach to
    this.parent = parent;
    // set properties
    this.collider = "none";
    this.layer = parent.layer - 1;
    this.stroke = color(255);
    this.strokeWeight = 2;
    this.autoDraw = false;

    this.start = 0;
    this.targetStart = 0;
    this.startLerpAmount = 0.8;
    this.stop = 0;
    this.targetStop = 180;
    this.stopLerpAmount = 0.8;
  }

  draw() {
    // set position to parent
    this.pos = this.parent.pos;
    
    push();
    noFill();
    stroke(this.stroke);
    strokeWeight(this.strokeWeight)
    arc(this.x, this.y, this.diameter, this.diameter, this.start, this.stop);
    pop();
  }

  runUpdate() {
    // using normal lerp for this since the time difference doesn't matter so much
    if(this.start !== this.targetStart) this.start = deltaLerp(this.start, this.targetStart, this.startLerpAmount);
    if(this.stop !== this.targetStop) this.stop = deltaLerp(this.stop, this.targetStop, this.stopLerpAmount);
  }
}
*/