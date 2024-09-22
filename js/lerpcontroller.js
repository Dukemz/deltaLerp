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
}