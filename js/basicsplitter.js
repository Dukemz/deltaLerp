"use strict";

class BasicSplitter extends Enemy { // splits into homing triangle things
  constructor(data) {
    super(data);

    this.sideLength ||= 30;
    this.sprites.fill ||= "orange";
    this.splitterShape ||= "hexagon";
    this.splitterSpikeSize ||= 60;
    this.enemyType = "BasicSplitter";

    this.spikeJoints = [] // change this when sprite.joints.removeAll() gets fixed
    this.separated = false;
    this.baseConstructor = [this.x, this.y, this.sideLength, this.splitterShape];
    this.create();

    this.baseSprite.mass = 10;
    this.baseSprite.drag = 1;
    this.baseSprite.rotationDrag = 1;

    this.generate();
  }

  generate() { // generate spikes
    // currently can only be used once on creation, until i figure out a way to get the EXACT verticies location
    // or maybe, set the rotation of the sprite to 0, then create all spikes, then set rotation back to what it was

    // vector used to calculate outermost vertex of each triangle
    // offsetting the vector results in a weird sawblade shape
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

      // determines the offset for the homing spikes to follow the player's direction
      const vectorHeading = -spikeVector.heading();
     
      // const newSpike = new this.sprites.Sprite([[tipX, tipY], [v1.x, v1.y], [v2.x, v2.y], [tipX, tipY]]);
      const newSpike = new HomingTriangle({
        game: this.game,
        baseConstructor: [[[tipX, tipY], [v1.x, v1.y], [v2.x, v2.y], [tipX, tipY]]],
        parentGroup: this.sprites,
        // this will be used as offset for rotateTowards
        vectorHeading,
        activeHoming: false
      });
      // initialise spiky dude
      newSpike.create();

      // join spike to the base shape
      const spikeJoint = new GlueJoint(this.baseSprite, newSpike.baseSprite);
      this.spikeJoints.push(spikeJoint);

      spikeVector.rotate(rotateAngle);

      // triggered on a collision that should cause the splitter to separate
      const separateCallback = () => {
        if(!this.separated) {
          this.separated = true;
          this.spikeJoints.forEach(j => { // activate homing on the spikies
            j.spriteB.enemyInstance.activeHoming = true;
            j.remove();
          });
          this.spikeJoints = [];
          
          // applying force in a single frame rather than over time seems to break - use set velocity instead
          // this.sprites.attractTo(this.baseSprite, -500);
        }
      }

      const enemyCollideCallback = (_a, b) => { // other active homing triangles can set separators off
        if(b?.enemyInstance.enemyType === "HomingTriangle" && b.enemyInstance.activeHoming) separateCallback();
      }

      // separate when a player bullet hits
      this.sprites.collides(this.game.playerProjectiles, separateCallback);
      this.sprites.collides(this.game.enemyObjects, enemyCollideCallback);
    }
  }

  update() {
    // uhhhh
    // if(frameCount < 3) console.log("hi");
  }
}
