"use strict";

class basicSplitter extends Enemy {
  constructor(data) {
    super(data);

    this.sideLength ||= 30;
    this.fill ||= "red";

    this.baseConstructor = [this.x, this.y, this.sideLength, 'pentagon'];

    this.create();
  }
}