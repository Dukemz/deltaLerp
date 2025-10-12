"use strict";

class ArcIndicator { // arc indicator thing
  // may be used to show health, forcefield or etc
  // multiple arc layers, each with their own color, size, etc?
  constructor(parent, data) {
    // parent sprite to attach to
    this.parent = parent;
    // set properties
    this.stroke = data?.stroke || color(255);
    this.understrokeAlpha = data?.understrokeAlpha || 50;
    this.strokeWeight = 2;
    this.diameter = (data?.diameter || 170) * parent.scale.x;

    // whether to actually show the indicator
    this.disabled = data?.disabled ?? false;

    this.understroke = color(this.stroke.levels);
    if(window.Q5) { this.understroke.a = this.understrokeAlpha } else { this.understroke.setAlpha(this.understrokeAlpha) }

    // leftmost point is 180, rightmost point is 0
    this.startArc = data?.startArc || new LerpController(0, 0, 0.9999);
    this.endArc = data?.endArc || new LerpController(0, 180, 0.8);
  }

  draw() {
    if(this.disabled) return;

    const start = this.startArc.update();
    const end = this.endArc.update();
    
    push();
    noFill();
    stroke(this.understroke);
    strokeWeight(this.strokeWeight);
    arc(this.parent.x, this.parent.y, this.diameter, this.diameter, 0, 180, OPEN);
    stroke(this.stroke);
    arc(this.parent.x, this.parent.y, this.diameter, this.diameter, start, end, OPEN);
    pop();
  }
}