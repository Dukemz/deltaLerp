"use strict";

class MachineGun {
  // should probably make this extend weapon huh?
  // machine gun weapon - fires multiple small bullets in quick succession
  // this group represents all the bullets
  constructor() {
    // ~~ TRACKING ~~ //
    // stores timestamp of last time a bullet was fired
    this.lastFired = 0;
    // total bullets fired
    this.shotsFired = 0;
    this.fireRate = 80; // time between firing in ms
  }

  initialise(player) {
    this.group = new player.projectiles.Group();

    // ~~ PROPERTIES ~~ //
    // sprite soft & dynamic inheritance properties
    this.group.diameter = 10;
    this.group.x = () => player.x + 15;
    this.group.y = () => player.y;
    this.group.vel.x = 20; // bullet velocity
    this.group.mass = 0;
    // bouncy
    this.bounciness = 1;
    // visual properties
    // this.group.fill = () => player.fill;
    this.group.fill = player.fill;
    this.group.stroke = 255;
    this.group.strokeWeight = 2;
    this.group.overlaps(this.group);

    // todo: figure out how to make bullets always shoot from the tip of the player
    // and travel in the right direction accordingly
    
    // remove when touching game objects
    // player.game.objects.collides(this.group, (_o, p) => p.remove());

    // bullets overlap with the player
    // this.group.overlaps(player);
    // // thing to remove bullets if they touch player, but it's unnecessary
    // {
    //   const life = 2147483647 - b.life;
    //   if(life > 10) b.remove();
    // }
  } 

  fire() { // FIRE IN THE HOLE
    // note that a bullet may not always be fired every time this function is called
    // this is just called at the end of player update if the player is currently requesting to fire

    // elapsed time since last bullet fired
    const elapseFired = world.physicsTime*1000 - this.lastFired;
    if(elapseFired > this.fireRate) {
      const bullet = new this.group.Sprite();
      // set bullet's update function since for some reason you can't define it before
      bullet.update = () => {
        if(bullet.speed < 10) bullet.remove();
        if(bullet.x > camera.x + 2000 || bullet.x < camera.x - 2000) bullet.remove();
        // bullet.speed = 20;
      }
      this.bulletsFired++;
      this.lastFired = world.physicsTime*1000;
      if(this.group.amount > 20) {
        this.group[0].remove();
      }
    }
    // culling - remove bullets if they go more than 10 units offscreen
    // note - if screen size is changed then cull boundary changes too
    // this.group.cull(50, 50, 50, 50);
  }
}

// old method of parent checking
// this = new Group();
// this.weapons.subgroups.push(this);
// this.parent = this.weapons.idNum;