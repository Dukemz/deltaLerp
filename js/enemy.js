"use strict";

class Enemy {
  // note to self: maybe make a projectile class or something?
  // this way for enemies, to fire bullets they can simply do "new Projectile"
  // and the projectile's constructor will auto assign it to the projectiles group in game
  // maybe w a projectile manager or something...?

  constructor(data) {
    Object.assign(this, data);
    this.game ||= game;

    // this.x ||= camera.x + 500;
    this.x ||= 0;
    this.y ||= 0;

    // array of arguments passed to base sprite constructor
    this.baseConstructor ||= [this.x, this.y];
    this.sprites = new this.game.enemyObjects.Group();
    
    this.sprites.stroke ||= "white";
    this.sprites.strokeWeight ||= 2;
  }

  create() {
    this.projectiles = new this.game.enemyProjectiles.Group();
    this.baseSprite = new this.sprites.Sprite(...this.baseConstructor);
    this.baseSprite.enemyInstance = this;
    this.game.enemies.push(this)
    // this.baseSprite.pos = { x: this.x, y: this.y };
  }
}