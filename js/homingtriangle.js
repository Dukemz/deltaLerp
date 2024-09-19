"use strict";

class HomingTriangle extends Enemy {
  constructor(data) {
    super(data);

    this.activeHoming ??= true;
    this.baseConstructor ??= [this.x, this.y, 10, "triangle"];
    this.enemyType = "HomingTriangle";
  }

  postCreate() { // function called after create is run
    // todo: colour lerping (maybe make that a class too)
    this.inactiveColour = this.baseSprite.fill;
    this.baseSprite.drag = 1;
  }

  update() {
    if(this.activeHoming) { // note to self: this is all very temporary
      // need to figure out how to make this all customisable in constructors and such
      // also maybe rather than activehoming being a variable it could be a function to enable/disable
      // allowing changing of behaviour and stuff when homing triangles start and stop homing

      // list of players ordered by distance
      // in future for optimisation, don't create and sort this list every frame, it's not very performant
      // instead pick the closest player on creation and just follow them constantly, or pick the closest player every x frames
      const playerList = game.players.toSorted((a, b) => {
        return a.distanceTo(this.baseSprite) - b.distanceTo(this.baseSprite);
      });

      if(playerList[0]) {
        this.baseSprite.rotateTowards(playerList[0], 0.01, this.vectorHeading);
        this.baseSprite.bearing = this.baseSprite.rotation - this.vectorHeading;
        this.baseSprite.applyForce(3);
      }
    }
  }
}