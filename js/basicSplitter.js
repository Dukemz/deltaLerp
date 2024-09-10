"use strict";

class basicSplitter extends Enemy {
  constructor(data) {
    super(data);

    this.sideLength ||= 30;
    this.sprites.fill ||= "orange";
    this.splitterShape ||= "hexagon";
    this.splitterSpikeSize ||= 60;

    this.spikeJoints = [] // change this when sprite.joints.removeAll() gets fixed
    this.separated = false;
    this.baseConstructor = [this.x, this.y, this.sideLength, this.splitterShape];
    this.create();

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
      // two corners attached to the base shape
      const v1 = this.baseSprite.vertices[i];
      const v2 = this.baseSprite.vertices[i+1];

      const tipX = this.baseSprite.x + spikeVector.x;
      const tipY = this.baseSprite.y + spikeVector.y;
     
      const newSpike = new this.sprites.Sprite([[tipX, tipY], [v1.x, v1.y], [v2.x, v2.y], [tipX, tipY]]);
      const spikeJoint = new GlueJoint(this.baseSprite, newSpike);
      this.spikeJoints.push(spikeJoint);

      spikeVector.rotate(rotateAngle);
    }

    // collision detector for bullets
    this.sprites.collides(this.game.playerProjectiles, () => {
      if(!this.separated) {
        this.separated = true;
        this.spikeJoints.forEach(j => j.remove());
        this.spikeJoints = [];
        // note - all forces seem to behave differently if applied once in a single frame in a different timescale and i have no idea why
        // lower framerate makes the force stronger, lower timescale makes the force weaker???
        this.sprites.attractTo(this.baseSprite, -100);
      }
    });
  }

  update() {
    // uhhhh
    // if(frameCount < 3) console.log("hi");
  }
}