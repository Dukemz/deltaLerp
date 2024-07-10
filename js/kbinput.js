"use strict";

class kbInput {
  constructor(data) {
    Object.assign(this, data);
    // data = {
    //   up: "W",
    //   down: "S"
    //   // etc...
    // }
    this.up ||= "up";
    this.down ||= "down";
    this.left ||= "left";
    this.right ||= "right";
    this.slow ||= "shift";

    // todo: migrate other actions to here too, like shoot, autofire, etc
  }

  isMoving() {
    return (kb.pressing(this.up) || kb.pressing(this.down) || kb.pressing(this.left) || kb.pressing(this.right))
  }

  getMoveVel(currentVel, targetSpeed) { // get vector for velocity
    let vector = createVector(targetSpeed, 0);

    if(kb.pressing(this.up) && kb.pressing(this.right)) {
      vector.setHeading(-45);
    } else if(kb.pressing(this.up) && kb.pressing(this.left)) {
      vector.setHeading(-135);
    } else if(kb.pressing(this.down) && kb.pressing(this.right)) {
      vector.setHeading(45);
    } else if(kb.pressing(this.down) && kb.pressing(this.left)) {
      vector.setHeading(135);
    } else if(kb.pressing(this.up)) {
      vector.setHeading(-90);
    } else if(kb.pressing(this.down)) {
      vector.setHeading(90);
    } else if(kb.pressing(this.right)) {
      vector.setHeading(0);
    } else if(kb.pressing(this.left)) {
      vector.setHeading(180);
    }

    // there's probably a much more efficient way to do this but whatever
    if(!kb.pressing(this.left) && !kb.pressing(this.right)) {
      vector.x = deltaLerp(currentVel.x, 0, 0.99999);
    }
    if(!kb.pressing(this.up) && !kb.pressing(this.down)) {
      vector.y = deltaLerp(currentVel.y, 0, 0.99999);
    }
    if(kb.pressing(this.slow)) { // hold shift to slow down
      // decrease the vector's magnitude
      vector.setMag(vector.mag()/2);
    }
    return vector;
  }
}