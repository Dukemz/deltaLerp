"use strict";

class Shotgun {
  constructor() {
    this.fireRate = 800;
    this.bulletSpread = 9; // number of bullets in each spread shot
    this.spreadAngle = 55; // total spread angle range in degrees
    this.bulletSpeed = 20;
    this.killSpeed = 5; // speed at which the bullet is removed
    this.damage = 1;

    this.lastFired = 0;
    this.shotsFired = 0;
    this._active = false;
  }

  initialise(player) {
    this.player = player;
    this.group = new this.player.projectiles.Group();

    // ammo indicator
    this.indicator = new ArcIndicator(this.player, {
      diameter: 210,
      stroke: this.player.stroke,
      startArc: new LerpController(0, 0, 0.9999),
      endArc: new LerpController(180, 180, 1),
      disabled: true
    });
    this.player.arcindics.push(this.indicator);
    

    // projectile properties
    this.group.diameter = 10;
    this.group.x = () => this.player.x + 5;
    this.group.y = () => this.player.y;
    this.group.mass = 1;
    this.group.bounciness = 1;
    this.group.drag = 4;

    this.group.fill = this.player.fill;
    this.group.stroke = 255;
    this.group.strokeWeight = 2;
    this.group.overlaps(this.group);

    // remove bullet on collision with game objects
    // player.game.objects.collides(this.group, (_o, p) => p.remove());

    // damage enemies on collision
    this.player.game.enemyObjects.collides(this.group, (e, p) => {
      e.enemyInstance.health -= this.damage;
      // test - if enemy gets killed, bullet speed is readded
      if(e.enemyInstance.health <= 0) p.speed += this.killSpeed;
      // p.remove();
    });
  }

  fire() {
    const elapsed = world.physicsTime * 1000 - this.lastFired;
    if(elapsed > this.fireRate) {
      // calculate the angle increment between each bullet
      const angleIncrement = this.spreadAngle / (this.bulletSpread - 1);
      const startAngle = -this.spreadAngle / 2; // center the spread

      for(let i = 0; i < this.bulletSpread; i++) {
        const bullet = new this.group.Sprite();

        // calculate the specific angle for each bullet
        const angle = startAngle + i * angleIncrement;
        const radians = (angle * Math.PI) / 180;

        // set bullet velocity based on calculated angle and consistent speed
        bullet.vel.x = Math.cos(radians) * this.bulletSpeed;
        bullet.vel.y = Math.sin(radians) * this.bulletSpeed;

        // add player's current velocity
        bullet.vel.y += this.player.vel.y;
        bullet.vel.x += this.player.vel.x;

        bullet.update = () => {
          if(bullet.speed < this.killSpeed) bullet.remove();
        };
      }

      this.shotsFired += this.bulletSpread;
      this.lastFired = world.physicsTime * 1000;
      // knockback - currently doesn't work very well if movement keys are being held down
      this.player.vel.x -= 10;

      // limit the number of bullets for performance
      if(this.group.amount > 30) {
        this.group[0].remove();
      }
    }
  }

  get active() {
    return this._active;
  }
  set active(value) {
    if(typeof value !== "boolean") throw TypeError("Property active of weapon must be either true or false");
    this._active = value;

    // toggle ammo indicator visibility
    this.indicator.disabled = !value;
  }
}