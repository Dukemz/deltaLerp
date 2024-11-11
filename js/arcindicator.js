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

    // leftmost point is 180, rightmost point is 0
    this.startArc = new LerpController(0, 0, 0.9);
    this.endArc = new LerpController(0, 180, 0.9);
  }

  draw() {
    const start = this.startArc.update();
    const end = this.endArc.update();
    
    push();
    noFill();
    stroke(this.stroke);
    strokeWeight(this.strokeWeight);
    arc(this.parent.x, this.parent.y, this.diameter, this.diameter, start, end);
    pop();
  }
}