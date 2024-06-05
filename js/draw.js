"use strict";

function draw() {
  if(document.hidden) {
    window.lastHidden = Date.now();
  }
  background(bgcol);
  // background(color("#242838"))

  // average deltatime, fps calcs
  avgFPS = fpsList.reduce((a, b) => a + b, 0)/fpsList.length || frameRate();
  avgDeltaTime = 1/avgFPS;

  game.draw();
}
// after this the draw functions of sprites are called
// by default sprites are drawn in the order they were created in
// each sprite's update function is called after it is drawn
// will have to figure out how to make gui elements appear on top of objects
// (maybe i have to make them sprites too? that'll be annoying)