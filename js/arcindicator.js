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
  }

  draw() {
    // set position to parent
    this.pos = this.parent.pos;

    noFill();
    arc(this.x, this.y, this.diameter, this.diameter, 0, 180);
  }
}