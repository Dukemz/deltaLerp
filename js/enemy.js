"use strict";

class Enemy {
  // note to self: maybe make a projectile class or something?
  // this way for enemies, to fire bullets they can simply do "new Projectile"
  // and the projectile's constructor will auto assign it to the projectiles group in game
  // maybe w a projectile manager or something...?

  // also, some enemies could have their own projectile groups
  // which means when they die all the projectiles they fired disappear
  // but most enemies should probably not have their own groups
  // though this means their projectiles remain after their death

  constructor(data) {
    Object.assign(this, data);
    this.game ||= game;

    // NOTE TO SELF: move most things out of this constructor into create?
    // since inherited properties should ideally take priority
    // priority level should be data -> subclass -> base class, not sure best way to do this

    // this.x ||= camera.x + 500;
    this.x ||= 0;
    this.y ||= 0;

    this._health = 10;
    this.enemyType = "none";

    // array of arguments passed to base sprite constructor
    
    this.parentGroup ||= this.game.enemyObjects;
    this.sprites = new this.parentGroup.Group();
    this.subenemies = [];
    // copy sprites info passed from instance construction
    if(data?.sprites) Object.assign(this.sprites, data.sprites);
    
    // this.sprites.stroke ??= "white";
    // this.sprites.strokeWeight ??= 0;
  }

  create() {
    // this.projectiles = new this.game.enemyProjectiles.Group();

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

  delete() {
    console.log(`[GAME] deleting enemy type ${this.enemyType} with ${this.subenemies.length} subenemies and ${this.sprites.length} subsprites`);

    // delete all subenemies first in reverse order
    for(let i = this.subenemies.length - 1; i >= 0; i--) {
      this.subenemies[i].delete(); // recursive call
    }

    this.baseSprite.joints.removeAll();
    // remove sprites
    this.sprites.remove();

    // remove this enemy from the game's enemies list
    const enemindex = this.game.enemies.indexOf(this);
    if(enemindex > -1) {
      this.game.enemies.splice(enemindex, 1);
    }
  }

  update() {
    if(this.sprites.length < 1) {
      this.delete();
    }

    this.baseSprite.text = this.health;

    // if individual sprite extension needs an update function this calls it
    // maybe have some kind of get/set thing that chains functionality on instead of replacing it..?
    if(typeof this.postUpdate === "function") this.postUpdate();
  }

  get health() {
    return this._health;
  }

  set health(value) {
    if(typeof value !== "number" || isNaN(value)) throw TypeError("Enemy health must be a valid number");
    this._health = value;
    if(this._health === 0) this.delete();
  }

  // OLD DELETE FUNCTION(S). study this in detail to see why it didn't work later

  // delete() {
  //   console.log(`[GAME] deleting enemy type ${this.enemyType} with ${this.subenemies.length} subenemies and ${this.sprites.length} subsprites`);
    
  //   // NOTE: the below commented code recursed and froze the page, somehow. unsure exactly why
  //   // remove the base sprite from the group to avoid recursion
  //   // this.sprites.remove(this.baseSprite);
    
  //   // for(let subspr of this.sprites) {
  //   //   if(subspr.enemyInstance) { // delete subsprites with an enemy instance
  //   //     // subspr.enemyInstance.update = () => {};
  //   //     // recurse
  //   //     // console.log(subspr.enemyInstance)
  //   //     // subspr.enemyInstance.delete();
  //   //   }
  //   // }
  //   // // remove base sprite entirely
  //   // // this.baseSprite.remove();
  //   // this.sprites.remove();

  //   for(let subenemy of this.subenemies) {
  //     // recurse. hoo boy this better not go badly
  //     subenemy.delete();
  //   }
  //   this.sprites.remove();
    
  //   const enemindex = this.game.enemies.indexOf(this);
  //   this.game.enemies.splice(enemindex, 1);
  //   // this.game.enemies[enemindex].markedForDeletion = true;
  // }
}