"use strict";

class machineGun {
  // machine gun weapon - fires multiple small bullets in quick succession
  // this group represents all the bullets
  constructor() {
    // ~~ TRACKING ~~ //
    // stores timestamp of last time a bullet was fired
    this.lastFired = 0;
    // total bullets fired
    this.bulletsFired = 0;
    // remove bullet when it collides/overlaps with random object (temporary)
    // this.group.collides(allSprites, b => b.remove());
  }

  initialise(player) {
    this.group = new player.projectiles.Group();

    // ~~ PROPERTIES ~~ //
    this.fireRate = 100; // time between firing
    // sprite soft inheritance properties
    this.group.diameter = 10;
    // todo: figure out how to make bullets always shoot from the tip of the player
    // and travel in the right direction accordingly
    this.group.x = () => player.x + 41;
    this.group.y = () => player.y;
    this.group.vel.x = 20; // bullet velocity
    // kinematic collider - will not be affected by other objects
    // this.group.collider = "kinematic";
    // bouncy
    this.bounciness = 1;
    // visual properties
    this.group.stroke = 255;
    this.group.strokeWeight = 2;

    this.group.update = (a) => {
      // a is amount of sprites in group
      // note: this doesn't seem to be useful
    }
  } 

  fire() { // FIRE IN THE HOLE
    // note that a bullet may not always be fired every time this function is called
    // this is just called at the end of player update if the player is currently requesting to fire

    // elapsed time since last bullet fired
    const elapseFired = Date.now() - this.lastFired;
    if(elapseFired > this.fireRate) {
      const bullet = new this.group.Sprite();
      // set bullet's update function since for some reason you can't define it before
      bullet.update = () => {
        if(bullet.speed < 3) bullet.remove();
      }
      this.bulletsFired++;
      this.lastFired = Date.now();
      if(this.group.amount > 15) {
        this.group[0].remove();
      }
    }
    // culling - remove bullets if they go more than 10 units offscreen
    // note - if screen size is changed then cull boundary changes too
    this.group.cull(50, 50, 50, 50);
  }
}

// old method of parent checking
// this = new Group();
// this.weapons.subgroups.push(this);
// this.parent = this.weapons.idNum;