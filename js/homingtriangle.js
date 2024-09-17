"use strict";

class HomingTriangle extends Enemy {
  constructor(data) {
    super(data);

    this.activeHoming ??= true;
    this.baseConstructor ??= [this.x, this.y]
  }

  postCreate() { // function called after create is run
    // todo: colour lerping
    this.inactiveColour = this.baseSprite.fill;
  }

  update() {
    if(this.activeHoming) { // note to self: this is all very temporary
      // need to figure out how to make this all customisable in constructors and such
      // also maybe rather than activehoming being a variable it could be a function to enable/disable
      // allowing changing of behaviour and stuff when homing triangles start and stop homing
      this.baseSprite.drag = 1;
      this.baseSprite.rotateTowards(player, 0.01, this.vectorHeading);
      this.baseSprite.bearing = this.baseSprite.rotation - this.vectorHeading;
      this.baseSprite.applyForce(3);
    }
  }
}