// code taken from https://editor.p5js.org/Rod1C/sketches/WHX_D1duQ

console.log("oscTest")
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var audio, audioContext, analyserl, analyserr, sourceNode, dataArrayl, dataArrayr, bufferLength, splitter, size;

const fps = 1;

audio = new Audio();
audio.crossOrigin = "anonymous";
audio.src = 'starchaser_wip.ogg';
audio.addEventListener("canplay", function(e) {
	setup();
}, false);

function setup() {
	audioContext = new AudioContext();
	splitter = audioContext.createChannelSplitter();

  if(!sourceNode) {
    console.log("connecting media element to media element source node");
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(splitter);
    sourceNode.connect(audioContext.destination);

    analyserl = audioContext.createAnalyser();
    analyserl.smoothingTimeConstant = 0.7;

    analyserr = audioContext.createAnalyser();
    analyserr.smoothingTimeConstant = 0.7;

    splitter.connect(analyserl,0,0);
    splitter.connect(analyserr,1,0);
  } else {
    console.log("Source node exists");
  }

	
	analyserl.fftSize = 4096;
	analyserr.fftSize = 4096;
	bufferLength = analyserl.fftSize;
	dataArrayl = new Float32Array(bufferLength);
	dataArrayr = new Float32Array(bufferLength);
	draw();
}

function draw() {
	setTimeout(function(){
		requestAnimationFrame(draw);
		analyserl.getFloatTimeDomainData(dataArrayl);
		analyserr.getFloatTimeDomainData(dataArrayr);
		ctx.fillStyle = 'rgba(0,0,0,0.7)'
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.moveTo(-(dataArrayl[0]+1)*size/2+size/2+canvas.width/2, -(dataArrayr[0]+1)*size/2+size);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(50,230,50,0.3)";
		for (var i = 0; i < dataArrayl.length; i++) {
			ctx.lineTo(-(dataArrayl[i]+1)*size/2+size/2+canvas.width/2, -(dataArrayr[i]+1)*size/2+size);
		}
		ctx.stroke();
	},1000/fps);
}

function mouseClicked() {
  audio.play();
}

window.onresize = function(){
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	if(canvas.width > canvas.height) size = canvas.height;
	else size = canvas.width;
}
window.onresize();



// broken stuff that uses p5.sound lol


// let audio, fft;
// let bufferLength;
// let size;

// function preload() {
//   audio = loadSound('starchaser_wip.ogg');
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   size = min(width, height);

//   fft = new p5.FFT(0.7, 4096);
//   fft.setInput(audio);

//   windowResized();
// }

// function draw() {
//   background(0, 0, 0);

//   let waveform = fft.waveform(); // Get the waveform data

//   stroke(50, 230, 50);
//   noFill();
//   beginShape();
//   for (let i = 0; i < waveform.length; i++) {
//     let x = map(i, 0, waveform.length, 0, width);
//     let y = map(waveform[i], -1, 1, height, 0);
//     vertex(x, y);
//   }
//   endShape();
// }

// function mouseClicked() {
//   if (audio.isPlaying()) {
//     audio.pause();
//   } else {
//     audio.play();
//   }
// }

// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   size = min(width, height);
// }
