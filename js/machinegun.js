"use strict";

// old method of parent checking
// this = new Group();
// this.weapons.subgroups.push(this);
// this.parent = this.weapons.idNum;

class machineGun {
  // machine gun weapon - fires multiple small bullets in quick succession
  // this group represents all the bullets
  constructor(player) {
    this.group = new player.projectiles.Group();

    // ~~ PROPERTIES ~~ //
    this.fireRate = 100; // time between firing
    // sprite soft inheritance properties
    this.group.diameter = 10;
    this.group.x = () => player.x + 45;
    this.group.y = () => player.y;
    this.group.vel.x = 30; // bullet velocity
    // kinematic collider - will not be affected by other objects
    this.group.collider = "kinematic";


    // stores timestamp of last time a bullet was fired
    this.lastFired = 0;
    // remove bullet when it overlaps with random object (temporary)
    // this.overlaps(randomObjs, b => b.remove());
  }

  fire() { // FIRE IN THE HOLE
    // note that a bullet may not always be fired every time this function is called
    // this is just called at the end of player update if the player is currently requesting to fire

    // elapsed time since last bullet fired
    const elapseFired = Date.now() - this.lastFired;
    if(elapseFired > this.fireRate) {
      new this.group.Sprite();
      this.lastFired = Date.now();
      if(this.group.amount > 10) {
        this.group[0].remove();
      }
    }
    // culling - remove bullets if they go more than 10 units offscreen
    this.group.cull(10, 10, 10, 10);
  }
}