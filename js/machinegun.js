"use strict";

class MachineGun {
  // should probably make this extend weapon huh?
  // machine gun weapon - fires multiple small bullets in quick succession
  // this group represents all the bullets
  constructor() {
    this.fireRate = 80; // time between firing in ms

    // ~~ TRACKING ~~ //
    // stores timestamp of last time a bullet was fired
    this.lastFired = 0;
    // total bullets fired
    this.shotsFired = 0;
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
    // bouncy for ricochets!
    this.group.bounciness = 0.8;

    // visual properties
    // this will set the fill every frame - disabled since that's pointless
    // this.group.fill = () => player.fill;
    this.group.fill = player.fill;
    this.group.stroke = 255;
    this.group.strokeWeight = 2;
    this.group.overlaps(this.group);

    // TODO: figure out how to make bullets always shoot from the tip of the player
    // and travel in the right direction accordingly
    
    // remove bullet on collision with game objects
    player.game.objects.collides(this.group, (_o, p) => {
      p.remove();
    });

    // remove when touching enemies
    player.game.enemyObjects.collides(this.group, (e, p) => {
      p.remove();
      e.enemyInstance.health -= 1;
    });
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
        // custom cull in favour of new one in player
        // if(bullet.x > camera.x + 2000 || bullet.x < camera.x - 2000) bullet.remove();
        // this would constantly set the bullet's speed every frame
        // disabled since it just makes the bullet richochet forever
        // bullet.speed = 20;
      }
      this.shotsFired++;
      this.lastFired = world.physicsTime*1000;
      if(this.group.amount > 25) {
        this.group[0].remove();
      }
    }
    // culling - remove bullets if they go more than 10 units offscreen
    // note - if screen size is changed then cull boundary changes too
    // this is currently disabled due to bugs
    // this.group.cull(50, 50, 50, 50);
  }
}

// bullets overlap with the player
// this.group.overlaps(player);
// thing to remove bullets if they touch player, but it's unnecessary
// {
//   const life = 2147483647 - b.life;
//   if(life > 10) b.remove();
// }

// old method of parent checking
// this = new Group();
// this.weapons.subgroups.push(this);
// this.parent = this.weapons.idNum;