"use strict";

class basicSplitter extends Enemy {
  constructor(data) {
    super(data);

    this.sideLength ||= 30;
    // this.sprites.fill ||= "red";
    this.splitterShape ||= "pentagon";
    this.splitterSpikeSize ||= 60;

    this.baseConstructor = [this.x, this.y, this.sideLength, this.splitterShape];
    this.create();

    // this.pvertices = this.baseSprite.vertices.map(vr => {
    //   const x = vr.x// - this.baseSprite.x;
    //   const y = vr.y// - this.baseSprite.y;
    //   return { x, y };
    // });
    // this.pvertices.pop();

    this.baseSprite.mass = 10;

    // vector used to calculate outermost vertex of each triangle
    // offsetting the vector results in funny sawblade
    const spikeVector = createVector(0, this.splitterSpikeSize);
    const sides = this.baseSprite.vertices.length-1;
    const rotateAngle = 360/sides;

    // midpoint between first two vertices
    const startMidpointX = (this.baseSprite.vertices[0].x+this.baseSprite.vertices[1].x)/2;
    const startMidpointY = (this.baseSprite.vertices[0].y+this.baseSprite.vertices[1].y)/2;
    const angleToMidpoint = this.baseSprite.angleTo(startMidpointX, startMidpointY);
    spikeVector.setHeading(angleToMidpoint);

    for(let i = 0; i < this.baseSprite.vertices.length-1; i++) {
      const v1 = this.baseSprite.vertices[i];
      const v2 = this.baseSprite.vertices[i+1];

      const tipX = this.baseSprite.x + spikeVector.x;
      const tipY = this.baseSprite.y + spikeVector.y;
     
      new this.sprites.Sprite([[tipX, tipY], [v1.x, v1.y], [v2.x, v2.y], [tipX, tipY]]);

      spikeVector.rotate(rotateAngle);
    }

    // const v1 = this.baseSprite.vertices[2];
    // const v2 = this.baseSprite.vertices[3];

    // // on generating spikes, rotate the vector by increments of 72 degrees
    // // also when done make it a const rather than a property of this, to free up space
    // this.calcVec = createVector(0, this.splitterSpikeSize);
    // const calcX = this.baseSprite.x+this.calcVec.x;
    // const calcY = this.baseSprite.y+this.calcVec.y;

    // this.testspike = new this.sprites.Sprite([[calcX, calcY], [v1.x, v1.y], [v2.x, v2.y], [calcX, calcY]]);
  }

  update() {

  }
}