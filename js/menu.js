"use strict";

class Menu {
  constructor() {
    console.log("[MENU]");

  }

  draw() {
    background(0)
    
    push();
    noStroke();
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Title", canvas.hw, canvas.hh);
    pop();
  }
}