"use strict";

class SimpleEnemy extends Sprite { // enemies that are just one sprite as opposed to multiple
  constructor(data) {
    super(...data?.baseConstructor || []);
    Object.assign(this, data);

    this.game ||= game;
    this.stroke ||= "white";
    this.strokeWeight ||= 2;

    // enemy attributes
    this.health = 10;

    console.log(this.x, this.y)
  }
}