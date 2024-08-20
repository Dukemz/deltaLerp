// prototype for menu branch system
// when item is selected as active, increase the springiness of all its joints and increase its size

"use strict";
console.log("what the branch");

let fpsList = [];
let fpsPush, avgFPS, avgDeltaTime;

let branchStructure;

const baseSpringiness = 0.05;
const stretchSpringiness = 0.3;

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
  things.mass = 3;
  // things.rotation = 45;

  // automatic branch creation system
  // group as 1st argument, structure data as 2nd (optional base sprite as 3rd)
  branchMake(things, branchStructure);
  setActiveSprite(things[0]);

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
  textAlign(LEFT, TOP);
  text(`${connectedToActive.length} connected`, 10, 10);
  text(`sploink`, 10, 40);
  textAlign(LEFT, BOTTOM);
  text(`${frameRate().toFixed(0)}fps, avg ${avgFPS.toFixed(0)}`, 10, height-40);
  text(`deltaTime = ${Math.round(deltaTime)}, avg ${Math.round(avgDeltaTime*1000)}`, 10, height-10);
  pop();

  // smooth zoom
  camera.zoom = lerp(camera.zoom, targetZoom, zoomSpeed);

  // code to move each square in a circular motion
  // connectedToActive.forEach(sub => {
  //   const distToActive = sub.distanceTo(activeSpr);
  //   // rotation speed is based on distance to active sprite
  //   const baseForce = 500;
  //   const adjustedForce = baseForce / (distToActive + 1);

  //   // set angle
  //   sub.bearing = sub.angleTo(activeSpr) + 90;
  //   // apply force based on total branch mass
  //   sub.applyForce(sub.totalBranchMass * adjustedForce);
  //   sub.text = `${sub.totalBranchMass.toFixed(1)}/${sub.speed.toFixed(2)}`;

  //   // visualisation
  //   const visvec = createVector(0, sub.totalBranchMass * adjustedForce);
  //   visvec.setHeading(sub.bearing);
  //   push();
  //   strokeWeight(3);
  //   stroke(255, 0, 255);
  //   line(sub.canvasPos.x, sub.canvasPos.y, sub.canvasPos.x+visvec.x*5, sub.canvasPos.y+visvec.y*5);
  //   pop();
  // });

  // loop runs for every square
  things.forEach(thing => { // thing is the current square
    if(thing.mouse.hovers() && window.activeSpr !== thing) {
      setActiveSprite(thing);
    }
    // list not including this thing
    const thingsExceptThisThing = things.filter(x => x.idNum !== thing.idNum);
    // repel every other square from thing
    thingsExceptThisThing.forEach(t => {
      // why am i doing this lol
      const gravconst = 300;
      const distance = thing.distanceTo(t);
      let force = ((gravconst * thing.mass * t.mass) / distance);
      // increase repulsion force if nodes are too close
      if(distance < 50) force *= 5;
      
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
      t.repelFrom(thing, force);
    });
  });

  if(false) {
    activeSpr.moveTowards(mouse, 1);
  } else {
    activeSpr.moveTowards(0, 0);
  }

  // if(frameCount % 60 === 0) activeSpr = random(things);

  // activeSpr.scale.x = 2
  // activeSpr.scale.y = 2
}

function setActiveSprite(thing) {
  // unspringy the joints of the currently active sprite
  if(window.activeSpr) window.activeSpr.joints.forEach(j => j.springiness = baseSpringiness);
  // set hovered sprite to active
  window.activeSpr = thing;
  // springy the new ones
  window.activeSpr.joints.forEach(j => j.springiness = stretchSpringiness);
  // list of all squares connected to active (middle) square
  window.connectedToActive = getConnectedSprites(thing);
  
  connectedToActive.forEach(con => {
    // mass calculation for each branch
    const branched = getBranchedSprites(con, activeSpr);
    con.totalBranchMass = branched.reduce((accumulator, currentValue) => {
      // this adds up the mass of all the objects
      return accumulator + currentValue.mass;
    }, 0);
  });
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
    const subbr = getBranchedSprites(s, spr, visited);
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
    const j = new DistanceJoint(basespr, spr);
    j.springiness = baseSpringiness;
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