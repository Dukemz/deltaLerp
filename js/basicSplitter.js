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
    this.baseSprite.drag = 1;
    this.baseSprite.rotationDrag = 1;

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

    // triggered on a collision that should cause the splitter to separate
    const separateCallback = () => {
      if(!this.separated) {
        this.separated = true;
        this.spikeJoints.forEach(j => j.remove());
        this.spikeJoints = [];
        
        // applying force in a single frame rather than over time seems to break - use set velocity instead
        // this.sprites.attractTo(this.baseSprite, -500);
      }
    }
    // separate when a player bullet hits
    this.sprites.collides(this.game.playerProjectiles, separateCallback);
  }

  update() {
    // uhhhh
    // if(frameCount < 3) console.log("hi");
  }
}