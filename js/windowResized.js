function windowResized() {
  // resize canvas to fit the new window size
  canvas.resize(windowWidth - 50, windowHeight - 50);

  // move the camera to center - change/fix later when scroll logic is added
  camera.pos = {x: 0, y: 0};
  // set the bg colour again to avoid that weird messy effect
  const opaquebgcol = color(red(bgcol), green(bgcol), blue(bgcol));
  background(opaquebgcol);
}