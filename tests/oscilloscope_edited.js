// version of oscilloscope.js without blur filter for better performance

let audio, audioContext, analyserL, analyserR, sourceNode, splitter;
let dataArrayL, dataArrayR;
let size;
let followMouse = false;
let oscColour;
let oscColour2;

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
  oscColour2 = color(oscColour.levels);
  oscColour2.a = 45;

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

  // Get waveform data
  analyserL.getFloatTimeDomainData(dataArrayL);
  analyserR.getFloatTimeDomainData(dataArrayR);

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

  if(!audio.paused) {
    blendMode(BLEND);
    background(0, 0, 0, 100);
    // blendMode(ADD);

    // calculate mouse angle
    const mx = mouseX - width / 2;
    const my = mouseY - height / 2;
    const mouseAngle = atan2(my, mx);

    push();
    // rotate by mouse angle
    if(followMouse) rotate(mouseAngle);

    // draw initial shape to be blurred
    stroke(oscColour2);
    strokeWeight(10);
    translate(width / 2, height / 2);
    for(let i = 0; i < bufferLength; i++) {
      // let x = map(dataArrayL[i], -1, 1, (width / 2) - (size / 2), (width / 2) + (size / 2));
      // let y = map(dataArrayR[i], -1, 1, (height / 2) + (size / 2), (height / 2) - (size / 2));
      let x = map(dataArrayL[i], -1, 1, -(size / 2), (size / 2));
      let y = map(dataArrayR[i], -1, 1, (size / 2), -(size / 2));
      // draw actual line
      if(prevX) line(prevX, prevY, x, y);
      prevX = x;
      prevY = y;
    }
    pop();
    prevX = undefined;
    prevY = undefined;
    push();
    // beginShape();
    // for(let i = 0; i < bufferLength; i++) {
    //   let x = map(dataArrayL[i], -1, 1, (width / 2) - (size / 2), (width / 2) + (size / 2));
    //   let y = map(dataArrayR[i], -1, 1, (height / 2) + (size / 2), (height / 2) - (size / 2));
    //   // let x = map(dataArrayL[i], -1, 1, -(size / 2), (size / 2));
    //   // let y = map(dataArrayR[i], -1, 1, (size / 2), -(size / 2));
    //   // draw actual line
    //   vertex(x, y);
    // }
    // endShape();
    // blur disabled for test
    // filter(BLUR, 5);


    // secondary shape
    blendMode(ADD);
    stroke(oscColour);
    strokeWeight(2);
    translate(width / 2, height / 2);
    // second shape, will not be blurred
    for(let i = 0; i < bufferLength; i++) {
      // let x = map(dataArrayL[i], -1, 1, (width / 2) - (size / 2), (width / 2) + (size / 2));
      // let y = map(dataArrayR[i], -1, 1, (height / 2) + (size / 2), (height / 2) - (size / 2));
      let x = map(dataArrayL[i], -1, 1, -(size / 2), (size / 2));
      let y = map(dataArrayR[i], -1, 1, (size / 2), -(size / 2));
      // draw actual line
      if(prevX) line(prevX, prevY, x, y);
      prevX = x;
      prevY = y;
    }
    pop();

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