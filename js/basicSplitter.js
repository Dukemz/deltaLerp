"use strict";

class basicSplitter extends Enemy {
  constructor(data) {
    super(data);

    this.sideLength ||= 100;
    this.sprites.fill ||= "red";

    this.baseConstructor = [this.x, this.y, this.sideLength, 'pentagon'];
    this.create();

    this.pvertices = this.baseSprite.vertices.map(vr => {
      const x = vr.x - this.baseSprite.x;
      const y = vr.y - this.baseSprite.y;
      return { x, y };
    });
    // this.pvertices.pop();

    this.baseSprite.mass = 10;
    // this.testy = new this.sprites.Sprite();
  }

  update() {
    this.pvertices = this.pvertices.map(pv => {
      
    });
  }
}