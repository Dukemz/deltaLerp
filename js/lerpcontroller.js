"use strict";

class LerpController { // class for values that need deltalerping
  constructor(defaultValue, targetValue, lerpAmount, ignoreTimeScale) {
    this.currentValue = defaultValue || 0;
    this.targetValue = targetValue || 0;
    this.lerpAmount = lerpAmount || 0.5;
    this.ignoreTimeScale = ignoreTimeScale || false;
  }

  update() { // update the current value and return it
    if(this.currentValue !== this.targetValue) {
      this.currentValue = deltaLerp(this.currentValue, this.targetValue, this.lerpAmount, this.ignoreTimeScale);
    }
    return this.currentValue;
  }

  instantSet(value) {
    this.targetValue = this.currentValue = value;
  }
}


class ColLerpController extends LerpController { // uses lerpColor to calculate
  constructor(colourA, colourB, defaultValue, targetValue, lerpAmount, ignoreTimeScale) {
    super(defaultValue, targetValue, lerpAmount, ignoreTimeScale);
    // default/target value must be between 0 and 1

    this.colourA = colourA;
    this.colourB = colourB;
    this.currentColour = this.colourA;
  }

  updateCol() {
    if(this.currentValue !== this.targetValue) {
      this.currentValue = deltaLerp(this.currentValue, this.targetValue, this.lerpAmount, this.ignoreTimeScale);
      this.currentColour = lerpColor(this.colourA, this.colourB, this.currentValue);
    }
    return this.currentColour;
    // note - with lerpColor, 0 is the first colour and 1 is the second
  }
}