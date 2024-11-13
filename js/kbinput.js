"use strict";

class kbInput {
  constructor(data) {
    Object.assign(this, data);
    // data = {
    //   up: "w",
    //   down: "s"
    //   // etc...
    // }
    this.inputType = "kb";
    // note to self: potentially make both input classes extend a base input class?

    // directional movement
    this.c ||= {};
    this.c.up ||= "up";
    this.c.down ||= "down";
    this.c.left ||= "left";
    this.c.right ||= "right";
    this.c.slow ||= "shift";

    // fire controls
    this.c.fire ||= "space";
    this.c.autoFire ||= "e";
    this.c.cycleWeapon ||= "c";

    // misc controls
    this.c.pause ||= "p";

    this.autoFireEnabled = false;
    this.preciseMode = true;
  }

  // input checks //

  pause() { return kb.presses(this.c.pause) }

  firing() {
    // toggle autofire enabled
    if(kb.presses(this.c.autoFire)) this.autoFireEnabled = !this.autoFireEnabled;
    return this.autoFireEnabled || kb.pressing(this.c.fire);
  }

  cycleWeapon() { return kb.presses(this.c.cycleWeapon) }

  // TEST //

  presetWASD() {
    this.c.up = "w";
    this.c.down = "s";
    this.c.left = "a";
    this.c.right = "d";
  }

  presetArrows() {
    this.c.up = "arrowUp";
    this.c.down = "arrowDown";
    this.c.left = "arrowLeft";
    this.c.right = "arrowRight";
    this.c.fire = "enter";
    this.c.autoFire = "/";
    this.c.cycleWeapon = "]";
    this.c.pause = "";
  }

  // other methods //

  // what if when you hold down right shift for 5 seconds it opens the sticky keys popup
  
  isMoving() {
    return (kb.pressing(this.c.up) || kb.pressing(this.c.down) || kb.pressing(this.c.left) || kb.pressing(this.c.right))
  }

  getMoveVel(targetSpeed, currentVel) { // get vector for velocity
    let vector = createVector(targetSpeed, 0);

    if(kb.pressing(this.c.up) && kb.pressing(this.c.right)) {
      vector.setHeading(-45);
    } else if(kb.pressing(this.c.up) && kb.pressing(this.c.left)) {
      vector.setHeading(-135);
    } else if(kb.pressing(this.c.down) && kb.pressing(this.c.right)) {
      vector.setHeading(45);
    } else if(kb.pressing(this.c.down) && kb.pressing(this.c.left)) {
      vector.setHeading(135);
    } else if(kb.pressing(this.c.up)) {
      vector.setHeading(-90);
    } else if(kb.pressing(this.c.down)) {
      vector.setHeading(90);
    } else if(kb.pressing(this.c.right)) {
      vector.setHeading(0);
    } else if(kb.pressing(this.c.left)) {
      vector.setHeading(180);
    }

    // there's probably a much more efficient way to do this but whatever
    // when precisemode is on, these funcs ignore world.timeScale
    if(!kb.pressing(this.c.left) && !kb.pressing(this.c.right)) {
      vector.x = deltaLerp(currentVel.x, 0, 0.999995, this.preciseMode);
    }
    if(!kb.pressing(this.c.up) && !kb.pressing(this.c.down)) {
      vector.y = deltaLerp(currentVel.y, 0, 0.999995, this.preciseMode);
    }
    // if(kb.pressing(this.c.slow)) { // hold shift to slow down
    //   // decrease the vector's magnitude
    //   vector.setMag(vector.mag()/2);
    // }
    return vector;
  }
}