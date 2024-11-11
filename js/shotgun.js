class Shotgun {
  constructor() {
    this.fireRate = 600;
    this.bulletSpread = 7; // number of bullets in each spread shot
    this.spreadAngle = 20; // spread angle range in degrees
    this.velocityMin = 10; // minimum bullet speed
    this.velocityMax = 14; // maximum bullet speed
    this.damage = 1;

    this.lastFired = 0;
    this.shotsFired = 0;
  }

  initialise(player) {
    this.group = new player.projectiles.Group();

    // projectile properties
    this.group.diameter = 10;
    this.group.x = () => player.x + 5;
    this.group.y = () => player.y;
    this.group.mass = 0.2;
    this.bounciness = 1;

    this.group.fill = player.fill;
    this.group.stroke = 255;
    this.group.strokeWeight = 2;
    this.group.overlaps(this.group);

    // remove bullet on collision with game objects
    player.game.objects.collides(this.group, (_o, p) => {
      p.remove();
    });

    // remove and decrease enemy health
    player.game.enemyObjects.collides(this.group, (e, p) => {
      e.enemyInstance.health -= this.damage;
      // p.remove();
    });
  }

  fire() {
    const elapsed = world.physicsTime * 1000 - this.lastFired;
    if(elapsed > this.fireRate) {
      for(let i = 0; i < this.bulletSpread; i++) {
        const bullet = new this.group.Sprite();

        // Calculate random angle offset within spread range
        const angleOffset = (Math.random() - 0.5) * this.spreadAngle;
        const radians = (angleOffset * Math.PI) / 180;

        // Randomize bullet speed within the specified range
        const bulletSpeed = this.velocityMin + Math.random() * (this.velocityMax - this.velocityMin);

        // Set bullet velocity with angle adjustment for spread and random speed
        bullet.vel.x = Math.cos(radians) * bulletSpeed;
        bullet.vel.y = Math.sin(radians) * bulletSpeed;

        bullet.update = () => {
          if(bullet.speed < 10) bullet.remove();
          if(bullet.x > camera.x + 2000 || bullet.x < camera.x - 2000) bullet.remove();
        };
      }

      this.shotsFired += this.bulletSpread;
      this.lastFired = world.physicsTime * 1000;

      // Limit the number of bullets on screen to prevent overflow
      if(this.group.amount > 20) {
        // this.group[0].remove();
      }
    }
  }
}
