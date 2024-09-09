"use strict";

class Enemy {
  // note to self: maybe make a projectile class or something?
  // this way for enemies, to fire bullets they can simply do "new Projectile"
  // and the projectile's constructor will auto assign it to the projectiles group in game
  // maybe w a projectile manager or something...?

  constructor(data) {
    Object.assign(this, data);
    this.game ||= game;

    this.x ||= camera.x + 500;
    this.y ||= 0;

    // array of arguments passed to base sprite constructor
    this.baseConstructor ||= [this.x, this.y];
    this.sprites = new this.game.enemies.Group();
  }

  create() {
    this.baseSprite = new this.sprites.Sprite(...this.baseConstructor);

    this.baseSprite.stroke ||= "white";
    this.baseSprite.strokeWeight ||= 2;
  }
}