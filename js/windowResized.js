function windowResized() {
  const oldWidth = canvas.w;
  const oldHeight = canvas.h;
  const oldZoom = camera.zoom;
  // resize canvas to fit the new window size
  canvas.resize(windowWidth - 50, windowHeight - 50);

  // change zoom
  const setZoom = canvas.w / 1400;
  camera.zoom = setZoom;
  console.log(`Resized! [${oldWidth}, ${oldHeight}] => [${canvas.w}, ${canvas.h}]\nZoom: [${oldZoom.toFixed(3)}] => [${setZoom.toFixed(3)}]`);
  
  // set the bg colour again to avoid that weird messy effect
  const opaquebgcol = color(red(bgcol), green(bgcol), blue(bgcol));
  background(opaquebgcol);
}