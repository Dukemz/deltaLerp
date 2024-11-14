"use strict";

class Shotgun {
  constructor() {
    this.fireRate = 800;
    this.bulletSpread = 9; // number of bullets in each spread shot
    this.spreadAngle = 55; // total spread angle range in degrees
    this.bulletSpeed = 14;
    this.killSpeed = 5; // speed at which the bullet is removed
    this.damage = 1.5;

    this.lastFired = 0;
    this.shotsFired = 0;
  }

  initialise(player) {
    this.group = new player.projectiles.Group();

    // projectile properties
    this.group.diameter = 10;
    this.group.x = () => player.x + 5;
    this.group.y = () => player.y;
    this.group.mass = 5;
    this.group.bounciness = 1;
    this.group.drag = 2;

    this.group.fill = player.fill;
    this.group.stroke = 255;
    this.group.strokeWeight = 2;
    this.group.overlaps(this.group);

    // remove bullet on collision with game objects
    // player.game.objects.collides(this.group, (_o, p) => p.remove());

    // damage enemies on collision
    player.game.enemyObjects.collides(this.group, (e, p) => {
      e.enemyInstance.health -= this.damage;
      // p.remove();
    });
  }

  fire() {
    const elapsed = world.physicsTime * 1000 - this.lastFired;
    if(elapsed > this.fireRate) {
      // Calculate the angle increment between each bullet
      const angleIncrement = this.spreadAngle / (this.bulletSpread - 1);
      const startAngle = -this.spreadAngle / 2; // Center the spread

      for(let i = 0; i < this.bulletSpread; i++) {
        const bullet = new this.group.Sprite();

        // Calculate the specific angle for each bullet
        const angle = startAngle + i * angleIncrement;
        const radians = (angle * Math.PI) / 180;

        // Set bullet velocity based on calculated angle and consistent speed
        bullet.vel.x = Math.cos(radians) * this.bulletSpeed;
        bullet.vel.y = Math.sin(radians) * this.bulletSpeed;

        bullet.update = () => {
          if(bullet.speed < this.killSpeed) bullet.remove();
          // if(bullet.x > camera.x + 2000 || bullet.x < camera.x - 2000) bullet.remove();
        };
      }

      this.shotsFired += this.bulletSpread;
      this.lastFired = world.physicsTime * 1000;

      // Limit the number of bullets on screen to prevent overflow
      if(this.group.amount > 30) {
        this.group[0].remove();
      }
    }
  }
}