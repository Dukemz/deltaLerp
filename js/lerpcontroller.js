"use strict";

/** Controller for numerical values that should be smoothly transitioned to a target value. */
class LerpController {
  /**
   * Creates an instance of LerpController.
   * @constructor
   * @param {number} defaultValue - Interpolation value to start with.
   * @param {number} targetValue - Target interpolation value.
   * @param {number} lerpAmount - Amount to interpolate by. Must be between 0 and 1.
   * @param {number} [tolerance=5] - Number of decimal points for tolerance comparison.
   * @param {boolean} ignoreTimeScale - Whether to ignore the current world time scale.
   */
  constructor(defaultValue, targetValue, lerpAmount, tolerance = 5, ignoreTimeScale) {
    this.currentValue = defaultValue || 0;
    this.targetValue = targetValue || 0;
    this.lerpAmount = lerpAmount || 0.5;
    this.ignoreTimeScale = ignoreTimeScale || false;
    this.tolerance = tolerance;
  }

  /**
   * Updates the current lerp controller value and returns it.
   * @returns {number} Updated LerpController value
   */
  update() {
    const roundedCurrent = this.currentValue.toFixed(this.tolerance);
    const roundedTarget = this.targetValue.toFixed(this.tolerance);
    if(roundedCurrent !== roundedTarget) {
      this.currentValue = deltaLerp(this.currentValue, this.targetValue, this.lerpAmount, this.ignoreTimeScale);
    }
    return this.currentValue;
  }

  /**
   * Sets both the target and current value.
   * @param {number} value
   */
  instantSet(value) {
    this.targetValue = this.currentValue = value;
  }
}


/**
 * Lerp controller for colour interpolation. Uses p5/q5 colour objects.
 * @extends {LerpController}
 */
class ColLerpController extends LerpController { // uses lerpColor to calculate
  /**
   * Creates an instance of ColLerpController.
   * @constructor
   * @param {*} colourA - First colour to interpolate.
   * @param {*} colourB - Second colour to interpolate.
   * @param {number} defaultValue - Interpolation value to start with. Must be between 0 and 1.
   * @param {number} targetValue - Target interpolation value. Must be between 0 and 1.
   * @param {number} lerpAmount - Amount to interpolate by. Must be between 0 and 1.
   * @param {number} [tolerance=5] - Number of decimal points for tolerance comparison.
   * @param {boolean} ignoreTimeScale - Whether to ignore the current world time scale.
   */
  constructor(colourA, colourB, defaultValue, targetValue, lerpAmount, tolerance = 5, ignoreTimeScale) {
    super(defaultValue, targetValue, lerpAmount, ignoreTimeScale, tolerance);
    // default/target value must be between 0 and 1

    this.colourA = colourA;
    this.colourB = colourB;
    this.currentColour = this.colourA;
  }

  /**
   * Update and return the current colour.
   * @returns {Object} - The updated colour object.
   */
  updateCol() {
    const roundedCurrent = this.currentValue.toFixed(this.tolerances);
    const roundedTarget = this.targetValue.toFixed(this.tolerance);
    if(roundedCurrent !== roundedTarget) {
      this.currentValue = deltaLerp(this.currentValue, this.targetValue, this.lerpAmount, this.ignoreTimeScale);
      this.currentColour = lerpColor(this.colourA, this.colourB, this.currentValue);
    }
    return this.currentColour;
    // note - with lerpColor, 0 is the first colour and 1 is the second
  }
}
