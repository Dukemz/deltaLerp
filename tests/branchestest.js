"use strict";
console.log("what the branch");

let fpsList = [];
let fpsPush, avgFPS, avgDeltaTime;

let branchStructure;

function setup() {
  new Canvas(windowWidth - 100, windowHeight - 100);
  document.getElementById("canvasContainer").appendChild(canvas);
  document.getElementById("loadtext").innerHTML = "";

  // get the current fps 10 times a second
  fpsPush = setInterval(() => {
    fpsList.push(frameRate());
    if(fpsList.length > 30) fpsList.shift();
  }, 100);

  camera.pos = { x: 0, y: 0 };
  camera.zoom = 0;
  window.targetZoom = 1;
  window.zoomSpeed = 0.1;

  stroke(255);
  strokeWeight(2);

  window.things = new Group();
  things.drag = 5;
  things.rotationLock = true;
  things.textSize = 15;
  things.autoDraw = false;

  // automatic branch creation system
  // group as 1st argument, structure data as 2nd (optional base sprite as 3rd)
  branchMake(things, branchStructure);
  window.activeSpr = things[0];

  background(color("#242838"));
}

function draw() {
  // average deltatime, fps calcs
  avgFPS = fpsList.reduce((a, b) => a + b, 0)/fpsList.length || 0;
  avgDeltaTime = 1/avgFPS;

  // draw stuff
  background(color("#24283890"));
  camera.on();
  things.draw();
  camera.off();
  // temp hud
  push();
  noStroke();
  fill(255);
  textSize(20);
  textAlign(LEFT, BOTTOM);
  text(`${frameRate().toFixed(0)}fps, avg ${avgFPS.toFixed(0)}`, 10, height-40);
  text(`deltaTime = ${deltaTime}, avg ${Math.round(avgDeltaTime*1000)}`, 10, height-10);
  pop();

  // smooth zoom
  camera.zoom = lerp(camera.zoom, targetZoom, zoomSpeed);

  // list of all squares connected to active (middle) square
  window.connectedToActive = getConnectedSprites(activeSpr);
  // code to move each square in a circular motion
  connectedToActive.forEach(sub => {
    
    // set angle
    sub.bearing = sub.angleTo(activeSpr) + 90;
    sub.applyForceScaled(10);
    sub.text = `${sub.idNum}/${sub.speed.toFixed(2)}`;
  });

  // loop runs for every square
  things.forEach(thing => { // thing is the current square
    if(thing.mouse.hovers() && window.activeSpr !== thing) { // set hovered sprite to active
      window.activeSpr = thing;
      console.log("PONG")
    }
    // list not including this thing
    const thingsExceptThisThing = things.filter(x => x.idNum !== thing.idNum);
    // repel every other square from thing
    thingsExceptThisThing.forEach(t => {
      // why am i doing this lol
      const gravconst = 300;
      const distance = thing.distanceTo(t);
      let force = ((gravconst * thing.mass * t.mass) / distance);
      
      // anti stuck logic
      thing.stuckWith ||= [];
      if(!thing.stuckWith.includes(t)) { // are we stuck with this sprite?
        // if not stuck, check how long we've been touching it
        const secsColliding = thing.colliding(t)/avgFPS;
        if(secsColliding >= 0.5) { // if been touching for half a second or more...
          // add to the stuck list
          thing.stuckWith.push(t);
          t.stuckWith.push(thing);
          // phase through (overlap) it
          thing.overlaps(t);
        }
      } else { // we are stuck with this sprite
        if(thing.distanceTo(t) > 72) { // if far away enough...
          // then re-enable collision
          thing.collides(t);
          // remove 1 item from list at index
          const index = thing.stuckWith.indexOf(t);
          thing.stuckWith.splice(index, 1);
        }
      }
      if(thing.stuckWith.length > 0) { // colour outline
        thing.strokeColor = "red";
      } else {
        thing.strokeColor = "white";
      }
      thing.repelFrom(t, force);
    });
  });

  // activeSpr.moveTowards(mouse, 1);
  activeSpr.moveTowards(0, 0);

  // if(frameCount % 60 === 0) activeSpr = random(things);

  // activeSpr.scale.x = 2
  // activeSpr.scale.y = 2
}

// i don't completely know this but it works so
function getBranchedSprites(spr, ignore = null, visited = new Set()) {
  // spr is the sprite you want to get the branched sprites of
  // ignore is the sprite to ignore along the branch line
  let branchedSprites = [];

  // Check if the sprite has already been visited
  if (visited.has(spr.idNum)) return [];

  // add the current sprite to visited
  visited.add(spr.idNum);
  // add the current sprite to the list of branched sprites
  branchedSprites.push(spr);
  // get connected sprites, ignoring the specified sprite
  const subspr = getConnectedSprites(spr).filter(s => !ignore || s.idNum !== ignore.idNum);

  // recursive call for each connected sprite
  subspr.forEach(s => {
    const subbr = getBranchedSpritesC(s, spr, visited);
    branchedSprites.push(...subbr);
  });
  return branchedSprites;
}


function getConnectedSprites(spr) { // gets all sprites connected
  const connected = [];
  spr.joints.forEach(joint => {
    if(spr.idNum !== joint.spriteA.idNum) connected.push(joint.spriteA);
    if(spr.idNum !== joint.spriteB.idNum) connected.push(joint.spriteB);
  });
  return connected;
}

function branchMake(maingroup, data, basespr) {
  // this func will be run recursively
  // branchmake will be called again for each of the sub branches once a complete set is made
  let spr;

  if(basespr instanceof Sprite) { // create a sprite below the provided base sprite
    spr = new maingroup.Sprite(basespr.x, basespr.y + 100);
    // join them with a distance joint
    new DistanceJoint(basespr, spr);    
  } else { // no base sprite data provided, make one
    spr = new maingroup.Sprite(0, 0);
  }
  // copy current data, except subsprite info, to the sprite
  const { subc, ...copied } = data;
  Object.assign(spr, copied);

  // for each of the subsprite data
  // call the function again
  if(subc) subc.forEach(sub => branchMake(maingroup, sub, spr));
}

branchStructure = {
  text: "MAIN",
  colour: "white",
  subc: [
    {
      text: "PLAY",
      subc: [
        {
          text: "yo",
          subc: [
            {
              text: "sq"
            }
          ]
        }
      ]
    },
    {
      text: "OPTIONS",
      subc: [
        {
          text: "GRAPHICS"
        },
        {
          text: "CONTRO"
        },
        {
          text: "BOMB",
          subc: [
            {
              text: "boom 1"
            }
          ]
        }
      ]
    },
    {
      text: "CREDITS",
      subc: [
        {
          text: "dukemz"
        },
        {
          text: "steak"
        }
      ]
    },
    {
      text: "ACHIEV",
      subc: [
        {
          text: "how",
          subc: [
            {
              text: "idk lol"
            },
            {
              text: "or do i..."
            }
          ]
        }
      ]
    },
  ]
}

function deltaLerp(a, b, f) { // lerp with deltatime
  // f is the factor between 0 and 1 deciding how quickly it catches up
  // e.g. if f = 0.25, it will cover 75% the remaining distance every second
  return lerp(a, b, 1 - pow(f, avgDeltaTime));
}

function windowResized() {
  canvas.resize(windowWidth - 100, windowHeight - 100);
  background(color("#242838"));
  camera.pos = { x: 0, y: 0 };
}