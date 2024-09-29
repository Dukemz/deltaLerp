"use strict";

class Menu {
  constructor() {
    console.log("[MENU]");

    this.bgcol = color("#242838");
  }

  draw() {
    background(this.bgcol);
    
    push();
    noStroke();
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Title", canvas.hw, canvas.hh);
    pop();
  }
}