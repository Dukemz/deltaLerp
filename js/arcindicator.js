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
    this.start = 0;
    this.stop = 0;
    this.autoDraw = false;
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

  update() {
    // using normal lerp for this since the time difference doesn't matter so much
    this.stop = lerp(this.stop, 180, 0.1);
  }
}