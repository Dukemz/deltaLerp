"use strict";

class HomingTriangle extends Enemy {
  constructor(data) {
    super(data);

    this.activeHoming ??= true;
    this.baseConstructor ??= [this.x, this.y, 50, "triangle"];
    this.enemyType = "HomingTriangle";

    this.canSplit ??= true;
    this.health = 3;
    this.vectorHeading ??= 0;
  }

  postCreate() { // function called after create() in Enemy is run
    // todo: colour lerping (maybe make that a class too)
    this.inactiveColour = this.baseSprite.fill;
    this.baseSprite.drag = 0.5;
    this.baseSprite.rotationDrag = 0.1;

    this.baseSprite.collides(this.game.players, (_a, p) => {
      if(this.activeHoming) {
        this.delete();
        p.health -= this.damage;
      }
    });
  }

  postUpdate() { // called after update() in Enemy class
    if(this.activeHoming) { // note to self: this is all kinda temporary
      // need to figure out how to make this all customisable in constructors and such
      // also maybe rather than activehoming being a variable it could be a function to enable/disable
      // allowing changing of behaviour and stuff when homing triangles start and stop homing

      // list of players ordered by distance
      // in future for optimisation, don't create and sort this list every frame, it's not very performant
      // instead pick the closest player on creation and just follow them constantly, or pick the closest player every x frames
      const playerList = this.game.players.toSorted((a, b) => {
        return a.distanceTo(this.baseSprite) - b.distanceTo(this.baseSprite);
      });

      // repel from every other homing triangle
      for(let e of this.game.enemies) {
        const distanceToEnemy = this.baseSprite.distanceTo(e.baseSprite);
        if(e.enemyType === "HomingTriangle" && e.activeHoming && distanceToEnemy < 150) {
          this.baseSprite.repelFrom(e.baseSprite, 1);
          if(distanceToEnemy < 50) this.baseSprite.repelFrom(e.baseSprite, 2);
        }
      }

      if(playerList[0]) {
        // note: changing the rotation value slightly produces largely different effects
        this.baseSprite.rotateTowards(playerList[0], 0.05, this.vectorHeading);
        this.baseSprite.bearing = this.baseSprite.rotation - this.vectorHeading;
        this.baseSprite.applyForce(2.5);
      }

      // if(this.baseSprite.debug) {
      //   this.baseSprite.textFill = "white";
      //   this.baseSprite.text = Math.round(this.baseSprite.speed);
      // } else {
      //   this.baseSprite.text = "";
      // }
    }
  }
}