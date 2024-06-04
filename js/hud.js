class HUD extends Sprite {
  constructor() {
    super();
    this.layer = 999;
    this.stroke = "none";
    this.fill = 255;
    this.textSize = 20;
  }

  draw() {
    // top left HUD
    textAlign(LEFT, TOP);
    text(`frames: ${frameCount}`, 10, 10);
    text(`realtime: ${world.realTime}`, 10, 40);
    // right HUD
    textAlign(RIGHT, TOP);
    text(`player: ${Math.round(game.player.x)}, ${Math.round(game.player.y)} || mouse: ${Math.round(mouse.x)}, ${Math.round(mouse.y)}`, width-10, 10);
    text(`bullets fired: ${game.player.weapons[game.player.activeWeapon].bulletsFired}`, width-10, 40);
    // bottom left HUD
    noStroke()
    textAlign(LEFT, BOTTOM);
    text(`${frameRate().toFixed(0)}fps, avg ${avgFPS.toFixed(0)}`, 10, height-40);
    text(`deltaTime = ${deltaTime}, avg ${Math.round(avgDeltaTime*1000)}`, 10, height-10);
  }
}