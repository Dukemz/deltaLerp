let audio, audioContext, analyserL, analyserR, sourceNode, splitter;
let dataArrayL, dataArrayR;
let size;
let followMouse = false;

const bufferLength = 256;
let lastfps = 0;

function setup() {
  console.log("oscilloscope test, music by nukegameplay")
  createCanvas(windowWidth - 50, windowHeight - 50);
  document.getElementById("canvasContainer").appendChild(canvas);
  size = min(width, height);

  // initialize the audio context and set up audio processing
  audio = new Audio('starchaser_wip.ogg');
  audio.crossOrigin = 'anonymous';
  audio.loop = true;

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  sourceNode = audioContext.createMediaElementSource(audio);

  splitter = audioContext.createChannelSplitter(2);

  analyserL = audioContext.createAnalyser();
  analyserR = audioContext.createAnalyser();

  analyserL.fftSize = bufferLength;
  analyserR.fftSize = bufferLength;

  dataArrayL = new Float32Array(bufferLength);
  dataArrayR = new Float32Array(bufferLength);

  sourceNode.connect(splitter);
  splitter.connect(analyserL, 0, 0);
  splitter.connect(analyserR, 1, 0);

  sourceNode.connect(audioContext.destination);

  document.getElementById("loadtext").innerHTML = "";

  background(0,0,0);
  noStroke()
  fill(255, 255, 255)
  text(`click to start\nmusic by nukegameplay`, 10, 20);
}

function draw() {

  // Get waveform data
  analyserL.getFloatTimeDomainData(dataArrayL);
  analyserR.getFloatTimeDomainData(dataArrayR);

  stroke(0, 119, 255);
  strokeWeight(2);
  noFill();

  // beginShape();
  // for (let i = 0; i < bufferLength; i++) {
  //   let x = map(dataArrayL[i], -1, 1, width / 2 - size / 2, width / 2 + size / 2);
  //   let y = map(dataArrayR[i], -1, 1, height / 2 + size / 2, height / 2 - size / 2);
  //   vertex(x, y);
  // }
  // endShape();
  let prevX;
  let prevY;

  if (!audio.paused) {
    blendMode(BLEND);
    background(0, 0, 0, 100);
    blendMode(ADD);

    // calculate mouse angle
    const mx = mouseX - width/2;
    const my = mouseY - height/2;
    const mouseAngle = atan2(my, mx);

    push();
    translate(width/2, height/2);
    // rotate by mouse angle
    if(followMouse) rotate(mouseAngle);

    for (let i = 0; i < bufferLength; i++) {
      // let x = map(dataArrayL[i], -1, 1, (width / 2) - (size / 2), (width / 2) + (size / 2));
      // let y = map(dataArrayR[i], -1, 1, (height / 2) + (size / 2), (height / 2) - (size / 2));
      let x = map(dataArrayL[i], -1, 1, -(size / 2), (size / 2));
      let y = map(dataArrayR[i], -1, 1, (size / 2), -(size / 2));
      // draw actual line
      if (prevX) line(prevX, prevY, x, y);
      prevX = x;
      prevY = y;
    }
    pop();

    noStroke()
    fill(255, 255, 255);

    if (frameRate() > 30) {
      if (frameCount % 10 === 0) lastfps = Math.round(frameRate());
    } else {
      lastfps = Math.round(frameRate());
    }

    text(`${Math.round(lastfps)}fps`, 10, 20)
    text(`buffer length: ${bufferLength}`, 10, 40)
  }
}

function mouseClicked() {
  if (audio.paused) {
    audioContext.resume();
    audio.play();
    loop();
  } else {
    audio.pause();
    noLoop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 50, windowHeight - 50);
  size = min(width, height);
}