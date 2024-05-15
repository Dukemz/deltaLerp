"use strict";

function draw() {
  background(color("#24283880"));

  // average deltatime, fps calcs
  avgFPS = fpsList.reduce((a, b) => a + b, 0)/fpsList.length || 0;
  avgDeltaTime = 1/avgFPS;

  noStroke();

  // behold: the texting
  fill(255);
  textSize(20);
  // top left HUD
  textAlign(LEFT, TOP);
  text(`PLACEHOLDER`, 10, 10);
  text(`PLACEHOLDER`, 10, 40);
  // right HUD
  textAlign(RIGHT, TOP);
  text(`PLACEHOLDER`, width-10, 10);
  text(`PLACEHOLDER`, width-10, 40);
  // bottom left HUD
  noStroke()
  textAlign(LEFT, BOTTOM);
  text(`${frameRate().toFixed(0)}fps, avg ${avgFPS.toFixed(0)}`, 10, height-40);
  text(`deltaTime = ${deltaTime}, avg ${Math.round(avgDeltaTime*1000)}`, 10, height-10);

  stroke(255);
  strokeWeight(2);
  // line(mouse.canvasPos.x, 0, mouse.canvasPos.x, height);
  // line(0, mouse.canvasPos.y, width, mouse.canvasPos.y);
  // ellipse(mouse.canvasPos.x, mouse.canvasPos.y, 10)
}
// after this the draw functions of sprites are called
// by default sprites are drawn in the order they were created in