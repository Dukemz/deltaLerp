"use strict";
// note: probably won't use this class

class SimpleEnemy extends Sprite { // this class is for enemies that are just one sprite as opposed to multiple
  constructor(data) {
    super(...data?.baseConstructor || []);
    Object.assign(this, data);

    this.game ||= game;
    this.stroke ||= "white";
    this.strokeWeight ||= 2;
    this.parentGroup ||= this.game.enemyObjects;

    if(data.pos) this.pos = data.pos;

    // enemy attributes
    this.health = 10;

    this.parentGroup.push(this);
  }
}