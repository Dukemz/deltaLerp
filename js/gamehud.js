class GameHUD extends Sprite {
  constructor() {
    super();
    this.collider = "none";
    this.x = 0;
    this.y = 0;
    this.autoDraw = false;
  }

  draw() {
    push();
    translate(this.x, this.y);
    noStroke();
    fill(255);
    textSize(20);
    
    // top left HUD
    textAlign(LEFT, TOP);
    text(`frames: ${frameCount}`, 10, 10);
    text(`realtime: ${world.realTime.toFixed(3)}, physics: ${world.physicsTime.toFixed(3)}`, 10, 40);
    // top right HUD
    textAlign(RIGHT, TOP);
    text(`player: ${Math.round(game.player.x)}, ${Math.round(game.player.y)} || mouse: ${Math.round(mouse.x)}, ${Math.round(mouse.y)}`, width-10, 10);
    text(`bullets fired: ${game.player.weapons[game.player.activeWeapon].bulletsFired}, total ${game.player.projectiles.amount}`, width-10, 40);
    // bottom left HUD
    textAlign(LEFT, BOTTOM);
    text(`${frameRate().toFixed(0)}fps, avg ${avgFPS.toFixed(0)}`, 10, height-40);
    text(`deltaTime = ${deltaTime.toFixed(0)}, avg ${Math.round(avgDeltaTime*1000)}`, 10, height-10);
    // bottom right HUD
    textAlign(RIGHT, BOTTOM);
    text(`speed: ${game.player.speed.toFixed(3)}`, width-10, height-70);
    text(`seek: ${game.funnysound.seek().toFixed(3)}`, width-10, height-40);
    text(`direction: ${game.player.direction.toFixed(3)}`, width-10, height-10);
    pop();
  }
}