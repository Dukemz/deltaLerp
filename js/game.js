"use strict";

class Game { // game class
  // in future, create instance for every new stage
  constructor(data) {
    Object.assign(this, data);

    this.player ||= new Player();


  }
}