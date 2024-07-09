function windowResized() {
  const oldWidth = canvas.w;
  const oldHeight = canvas.h;
  const oldZoom = camera.zoom;
  // resize canvas to fit the new window size
  canvas.resize(windowWidth - 50, windowHeight - 50);

  if(crashHandler.crashed) {
    console.log("Redrawing crash handler data.");
    crashHandler.draw();
  } else {
    // change zoom
    // const setZoom = canvas.w / 1400;
    const setZoom = calculateZoom(canvas.w, canvas.h, 1500);
    camera.zoom = setZoom;
    console.log(`Resized! [${oldWidth}, ${oldHeight}] => [${canvas.w}, ${canvas.h}]\nZoom: [${oldZoom.toFixed(3)}] => [${setZoom.toFixed(3)}]`);
    
    // set the bg colour again to avoid that weird messy effect
    const opaquebgcol = color(red(bgcol), green(bgcol), blue(bgcol));
    background(opaquebgcol);
  }
}

function calculateZoom(currentWidth, currentHeight, maxWidth) {
  const defaultWidth = 1000;
  const defaultHeight = 652;
  // Calculate the width and height ratios
  const widthRatio = currentWidth / defaultWidth;
  const heightRatio = currentHeight / defaultHeight;
  
  // Calculate the initial zoom based on the average ratio
  let newZoom = (widthRatio + heightRatio) / 2;

  // Calculate the visible width based on the new zoom
  let visibleWidth = currentWidth / newZoom;

  // If the visible width exceeds the maximum allowed width, adjust the zoom
  if (visibleWidth > maxWidth) {
    newZoom = currentWidth / maxWidth;
  }

  return newZoom;
}

// calculate camera bounds
function calculateBounds(canvasWidth, canvasHeight, zoom) {
  // calculate the visible width and height based on the zoom level
  const visibleWidth = canvasWidth / zoom;
  const visibleHeight = canvasHeight / zoom;

  // assuming the camera is centered, calculate the bounds
  const halfVisibleWidth = visibleWidth / 2;
  const halfVisibleHeight = visibleHeight / 2;

  // define the bounds as top-left and bottom-right coordinates
  const bounds = {
    topLeft: {
      x: -halfVisibleWidth,
      y: -halfVisibleHeight
    },
    bottomRight: {
      x: halfVisibleWidth,
      y: halfVisibleHeight
    }
  };

  return bounds;
}