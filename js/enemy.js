"use strict";

class Enemy {
  // note to self: maybe make a projectile class or something?
  // this way for enemies, to fire bullets they can simply do "new Projectile"
  // and the projectile's constructor will auto assign it to the projectiles group in game
  // maybe w a projectile manager or something...?

  constructor(data) {
    Object.assign(this, data);
    this.game ||= game;

    // NOTE TO SELF: move most things out of this constructor into create?
    // since inherited properties should ideally take priority
    // priority level should be data -> subclass -> base class, not sure best way to do this

    // this.x ||= camera.x + 500;
    this.x ||= 0;
    this.y ||= 0;

    this.health = 20;
    this.enemyType = "none";

    // array of arguments passed to base sprite constructor
    
    this.parentGroup ||= this.game.enemyObjects;
    this.sprites = new this.parentGroup.Group();
    // copy sprites info passed from instance construction
    if(data?.sprites) Object.assign(this.sprites, data.sprites);
    
    this.sprites.stroke ||= "white";
    this.sprites.strokeWeight ||= 2;
  }

  create() {
    this.projectiles = new this.game.enemyProjectiles.Group();

    this.baseConstructor ||= [this.x, this.y];
    // store baseSprite info passed from instance construction
    let storedInfo = {};
    if(this.baseSprite) storedInfo = this.baseSprite;
    this.baseSprite = new this.sprites.Sprite(...this.baseConstructor);
    Object.assign(this.baseSprite, storedInfo);

    this.baseSprite.enemyInstance = this;
    this.game.enemies.push(this);
    // this.baseSprite.pos = { x: this.x, y: this.y };
    if(typeof this.postCreate === "function") this.postCreate();
  }
}