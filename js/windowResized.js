function windowResized() {
  // resize canvas to fit the new window size
  canvas.resize(windowWidth - 100, windowHeight - 100);

  // move the camera to center - change/fix later when scroll logic is added
  camera.pos = {x: 0, y: 0};
  // set the bg colour again to avoid that weird messy effect
  background("#242838");
}