// very cool particle thingy
// taken from https://editor.p5js.org/p5/sketches/Simulate:_Particle


/*
 * @name Particles
 * @arialabel Small light grey circles connected by thin lines floating around a black background
 * @description There is a light-weight JavaScript library named
 * particle.js which creates a very pleasing particle system.
 * This is an attempt to recreate that particle system using p5.js.
 * Inspired by Particle.js, contributed by Sagar Arora.
 */


/*
 * @name Particles
 * @arialabel Small light grey circles connected by thin lines floating around a black background
 * @description There is a light-weight JavaScript library named
 * particle.js which creates a very pleasing particle system.
 * This is an attempt to recreate that particle system using p5.js.
 * Inspired by Particle.js, contributed by Sagar Arora.
 */


// this class describes the properties of a single particle.
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
    constructor(){
      this.x = random(0,width);
      this.y = random(0,height);
      this.r = random(1,8);
      this.xSpeed = random(-2,2);
      this.ySpeed = random(-1,1.5);
    }
  
  // creation of a particle.
    createParticle() {
      // noStroke();
      // fill('rgba(0,0,0,0.5)');
      // circle(this.x,this.y,this.r);
    }
  
  // setting the particle in motion.
    moveParticle() {
      if(this.x < 0 || this.x > width)
        this.xSpeed*=-1;
      if(this.y < 0 || this.y > height)
        this.ySpeed*=-1;
      this.x+=this.xSpeed;
      this.y+=this.ySpeed;
    }
  
  // this function creates the connections(lines)
  // between particles which are less than a certain distance apart
    joinParticles(particles) {
      particles.forEach(element =>{
        let dis = dist(this.x,this.y,element.x,element.y);
        if(dis<85) {
          stroke(`rgba(${parseInt(random(0,255))},${parseInt(random(0,255))},255,0.1)`);
          line(this.x,this.y,element.x,element.y);
        }
      });
    }
  }
  
  // an array to add multiple particles
  let particles = [];
  
  function setup() {
    createCanvas(720, 400);
    for(let i = 0;i<width/10;i++){
      particles.push(new Particle());
    }
  }
  
  function draw() {
    background(0, 0, 0, 10);
    for(let i = 0;i<particles.length;i++) {
      // particles[i].createParticle();
      particles[i].moveParticle();
      particles[i].joinParticles(particles.slice(i));
    }
    noStroke();
    fill(255);
    ellipse(frameRate(), 10, 10)
    ellipse(30, 10, 5)
    ellipse(60, 10, 5)
  }
  