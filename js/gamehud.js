"use strict";

class GameHUD {
  constructor(data) {
    Object.assign(this, data);
    this.tophudoffset = 0;
  }

  draw() {
    push();
    noStroke();
    fill(255);
    textSize(20);
    
    // top left HUD
    textAlign(LEFT, TOP);
    text(`frames: ${frameCount}, timedrift: ${(world.realTime-world.physicsTime).toFixed(3)}`, 10, 10);
    text(`realtime: ${world.realTime.toFixed(3)}, physics: ${world.physicsTime.toFixed(3)}`, 10, 40);
    // top right HUD
    textAlign(RIGHT, TOP);
    text(`player: ${Math.round(player.x)}, ${Math.round(player.y)} || mouse: ${Math.round(mouse.x)}, ${Math.round(mouse.y)}`, width-10, 10);
    text(`bullets fired: ${player.weapons[player.activeWeapon].shotsFired}, total active ${player.projectiles.amount}`, width-10, 40);
    // bottom left HUD
    const q5fps = window.Q5 ? `(q5: avg ${manager.q5avgFPS.toFixed(0)}, c ${getFPS()})` : "";
    textAlign(LEFT, BOTTOM);
    text(`${frameRate().toFixed(0)}fps, avg ${manager.avgFPS.toFixed(0)} ${q5fps}`, 10, height-40);
    text(`deltaTime = ${deltaTime.toFixed(0)}, avg ${Math.round(manager.avgDeltaTime*1000)}`, 10, height-10);
    // bottom right HUD
    textAlign(RIGHT, BOTTOM);
    // text(`seek: ${this.game.funnysound.seek().toFixed(3)}`, width-10, height-70);
    text(`speed: ${player.speed.toFixed(3)}`, width-10, height-40);
    text(`total sprites: ${allSprites.length}`, width-10, height-10);

    if(this.game.paused) {
      textAlign(CENTER, CENTER);
      text("[Paused - press P to unpause]", canvas.hw, canvas.hh);
    } else if(!this.game.players[0]) {
      textAlign(CENTER, CENTER);
      text("lol you died", canvas.hw, canvas.hh);
    }
    pop();
  }
}