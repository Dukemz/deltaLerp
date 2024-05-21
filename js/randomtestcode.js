// mouse cursor
if(this.mouse.hovering()) {
  mouse.cursor = 'grab';
} else {
  mouse.cursor = 'default';
}

// boundary.js
"use strict";
// temp test class may not use
class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);

  }

  draw() {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }
}


// ray.js
"use strict";
// temp test class may not use
class Ray {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.dir = createVector(0, 1);

  }

  draw() {
    push();
    translate(this.pos.x);
    translate(this.pos.y)
    line(0, 0, dir.x, dir.y)
    pop();
  }
}