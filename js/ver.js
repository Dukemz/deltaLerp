"use strict";

class Version {
  constructor(verstring) { // "x.x.x"
    const versionParts = verstring.split('.');

    if(versionParts.length !== 3 || versionParts.some(part => isNaN(part))) {
      throw new Error('Invalid version format. Use "x.x.x" where x is a number.');
    }

    this._major = parseInt(versionParts[0], 10);
    this._minor = parseInt(versionParts[1], 10);
    this._patch = parseInt(versionParts[2], 10);
  }

  // this method should return the version string "x.x.x"
  toString() {
    return `${this._major}.${this._minor}.${this._patch}`;
  }

  compare(otherVersion) { // possibly not the most efficient way to do this?
    // returns -1 if supplied version is greater
    // returns 1 if current version is greater
    // returns 0 if both versions are equal
    if(!(otherVersion instanceof Version)) {
      throw new Error('Parameter must be an instance of Version.');
    }

    if(this.major > otherVersion.major) return 1;
    if(this.major < otherVersion.major) return -1;

    if(this.minor > otherVersion.minor) return 1;
    if(this.minor < otherVersion.minor) return -1;

    if(this.patch > otherVersion.patch) return 1;
    if(this.patch < otherVersion.patch) return -1;

    return 0; // if all parts are equal
  }


  get patch() {
    return this._patch;
  }
  set patch(value) {
    if(typeof value === 'number' && value >= 0) {
      this._patch = value;
    } else {
      throw new Error('Patch version must be a non-negative number.');
    }
  }

  get minor() {
    return this._minor;
  }
  set minor(value) {
    if(typeof value === 'number' && value >= 0) {
      this._minor = value;
      // reset patch when minor is updated
      // this._patch = 0;
    } else {
      throw new Error('Minor version must be a non-negative number.');
    }
  }

  get major() {
    return this._major;
  }
  set major(value) {
    if(typeof value === 'number' && value >= 0) {
      this._major = value;
      // reset minor and patch when major is updated
      // this._minor = 0;
      // this._patch = 0;
    } else {
      throw new Error('Major version must be a non-negative number.');
    }
  }
}

// Example usage:
// const v = new Version("1.5.2");
// console.log(v.toString());  // Outputs: "1.5.2"

// v.patch = 3;
// console.log(v.toString());  // Outputs: "1.5.3"

// v.minor = 6;
// console.log(v.toString());  // Outputs: "1.6.0"

// v.major = 2;
// console.log(v.toString());  // Outputs: "2.0.0"