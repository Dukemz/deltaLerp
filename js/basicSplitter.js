"use strict";

class basicSplitter extends Enemy {
  constructor(data) {
    super(data);

    this.sideLength ||= 30;
    this.sprites.fill ||= "red";

    this.baseConstructor = [this.x, this.y, this.sideLength, 'pentagon'];
    this.create();

    // this.pvertices = this.baseSprite.vertices.map(vr => {
    //   const x = vr.x// - this.baseSprite.x;
    //   const y = vr.y// - this.baseSprite.y;
    //   return { x, y };
    // });
    // this.pvertices.pop();

    this.baseSprite.mass = 10;

    const v1 = this.baseSprite.vertices[2];
    const v2 = this.baseSprite.vertices[3];

    // on generating spikes, rotate the vector by increments of 72 degrees
    // also when done make it a const rather than a property of this, to free up space
    this.calcVec = createVector(0, 60);
    const calcX = this.baseSprite.x+this.calcVec.x;
    const calcY = this.baseSprite.y+this.calcVec.y;

    this.testspike = new this.sprites.Sprite([[calcX, calcY], [v1.x, v1.y], [v2.x, v2.y], [calcX, calcY]]);
  }

  update() {

  }
}