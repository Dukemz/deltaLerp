// oscilloscope.js but blur filter is applied and then removed using ctx.filter
// increases performance a ton but doesn't look as cool

let audio, audioContext, analyserL, analyserR, sourceNode, splitter;
let dataArrayL, dataArrayR;
let size;
let followMouse = false;
let oscColour;

const bufferLength = 512;
let lastfps = 0;

function setup() {
  console.log("oscilloscope test, music by nukegameplay")
  createCanvas(windowWidth - 50, windowHeight - 50);
  document.getElementById("canvasContainer").appendChild(canvas);
  size = min(width, height);

  // initialize the audio context and set up audio processing
  audio = new Audio('starchaser_wip_new.mp3');
  audio.crossOrigin = 'anonymous';
  audio.loop = true;

  oscColour = color(0, 50, 255);

  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  sourceNode = audioContext.createMediaElementSource(audio);

  splitter = audioContext.createChannelSplitter(2);

  analyserL = audioContext.createAnalyser();
  analyserR = audioContext.createAnalyser();
  analyserL.fftSize = bufferLength;
  analyserR.fftSize = bufferLength;

  splitter.connect(analyserL, 0, 0);
  splitter.connect(analyserR, 1, 0);

  // connect to play audio
  sourceNode.connect(audioContext.destination);
  // connect to analyser
  sourceNode.connect(splitter);

  dataArrayL = new Float32Array(bufferLength);
  dataArrayR = new Float32Array(bufferLength);

  document.getElementById("loadtext").innerHTML = "";

  background(0, 0, 0);
  noStroke()
  fill(255, 255, 255)
  text(`click to start\nmusic by nukegameplay`, 10, 20);
}

function draw() {
  // beginShape();
  // for (let i = 0; i < bufferLength; i++) {
  //   let x = map(dataArrayL[i], -1, 1, width / 2 - size / 2, width / 2 + size / 2);
  //   let y = map(dataArrayR[i], -1, 1, height / 2 + size / 2, height / 2 - size / 2);
  //   vertex(x, y);
  // }
  // endShape();

  // circle(250,height/2, 50);

  if(!audio.paused) {

    // Get waveform data
    analyserL.getFloatTimeDomainData(dataArrayL);
    analyserR.getFloatTimeDomainData(dataArrayR);

    stroke(oscColour);
    strokeWeight(2);
    noFill();

    let prevX;
    let prevY;

    blendMode(BLEND);
    background(0, 0, 0, 100);
    blendMode(ADD);

    // calculate mouse angle
    const mx = mouseX - width / 2;
    const my = mouseY - height / 2;
    const mouseAngle = atan2(my, mx);

    // rotate by mouse angle
    if(followMouse) rotate(mouseAngle);

    ctx.filter = 'blur(10px)'; // look into if pixeldensity is necessary
    // strokeWeight(5);
    // initial backdrop..? shape
    beginShape();
    for(let i = 0; i < bufferLength; i++) {
      let x = map(dataArrayL[i], -1, 1, (width / 2) - (size / 2), (width / 2) + (size / 2));
      let y = map(dataArrayR[i], -1, 1, (height / 2) + (size / 2), (height / 2) - (size / 2));
      // let x = map(dataArrayL[i], -1, 1, -(size / 2), (size / 2));
      // let y = map(dataArrayR[i], -1, 1, (size / 2), -(size / 2));
      // draw actual line
      vertex(x, y);
    }
    endShape();
    // filter(BLUR, 5); // for high quality ig?

    ctx.filter = 'none';
    // strokeWeight(2);

    // main vectorscope shape
    for(let i = 0; i < bufferLength; i++) {
      let x = map(dataArrayL[i], -1, 1, (width / 2) - (size / 2), (width / 2) + (size / 2));
      let y = map(dataArrayR[i], -1, 1, (height / 2) + (size / 2), (height / 2) - (size / 2));
      // let x = map(dataArrayL[i], -1, 1, -(size / 2), (size / 2));
      // let y = map(dataArrayR[i], -1, 1, (size / 2), -(size / 2));
      // draw actual line
      if(prevX) line(prevX, prevY, x, y);
      prevX = x;
      prevY = y;
    }

    noStroke()
    fill(255, 255, 255);

    if(frameRate() > 30) {
      if(frameCount % 10 === 0) lastfps = Math.round(frameRate());
    } else {
      lastfps = Math.round(frameRate());
    }

    text(`${Math.round(lastfps)}fps`, 10, 20);
    text(`buffer length: ${bufferLength}`, 10, 40);
    text(`audio time: ${audio.currentTime.toFixed(2)} / ${audio.duration}`, 10, 60);
  }
}

function mouseClicked() {
  if(audio.paused) {
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