"use strict";

class MachineGun {
  // machine gun weapon - fires multiple small bullets in quick succession
  constructor() {
    this.fireRate = 80; // time between firing in ms

    // stores timestamp of last time a bullet was fired
    this.lastFired = 0;
    // total bullets fired
    this.shotsFired = 0;
    this.active = false;
  }

  initialise(player) {
    // this group represents all the bullets
    this.group = new player.projectiles.Group();

    // ~~ PROPERTIES ~~ //
    // sprite soft & dynamic inheritance properties
    // these set the properties of the bullet sprites to be created
    this.group.diameter = 10;
    this.group.x = () => player.x + 15;
    this.group.y = () => player.y;
    this.group.vel.x = 20; // bullet velocity
    this.group.mass = 0;
    // bouncy for ricochets!
    this.group.bounciness = 0.8;

    this.group.fill = player.fill; // this.group.fill = () => player.fill;
    this.group.stroke = 255;
    this.group.strokeWeight = 2;
    this.group.overlaps(this.group);

    // TODO: figure out how to make bullets always shoot from the tip of the player
    // and travel in the right direction accordingly
    
    // remove bullet on collision with game objects, like walls
    player.game.objects.collides(this.group, (_o, p) => {
      p.remove();
    });

    // remove when touching enemies
    player.game.enemyObjects.collides(this.group, (e, p) => {
      p.remove();
      // reduce the enemy's health
      e.enemyInstance.health -= 1;
    });
  } 

  fire() { // FIRE IN THE HOLE
    // note that a bullet may not always be fired every time this function is called
    // this is just called at the end of player update if the player is currently requesting to fire

    // calculate time since last bullet fired
    const elapseFired = world.physicsTime*1000 - this.lastFired;
    if(elapseFired > this.fireRate) {
      // create a bullet
      const bullet = new this.group.Sprite();
      // set bullet's update function
      bullet.update = () => {
        // bullet also deletes itself if its speed drops below 10
        if(bullet.speed < 10) bullet.remove();
      }
      // increase amount of shots fired
      this.shotsFired++;
      // set new last fired time
      this.lastFired = world.physicsTime*1000;
      if(this.group.amount > 25) {
        // remove excess bullets if there's too many
        this.group[0].remove();
      }
    }
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