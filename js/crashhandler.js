"use strict";

class CrashHandler {
  constructor() {
    this.crashed = false;
    this.data = {};
  }

  crash(data) { // data is an object, should contain error
    this.crashed = true;
    this.data = data;
    noLoop();
    
    this.setMessage();
    this.log();
    this.draw();
  }

  setMessage() { // set this.errmsg based on data in this handler
    let msg = ``;
    // error type
    if(this.data.type === "promiseReject") {
      msg += `Unhandled promise rejection: ${this.data.event.reason}`;
    } else if(this.data.type === "setupError") {
      msg += `Game setup failed to complete.\n${this.data.error.name}: ${this.data.error.message}\n`;
    } else if(this.data.type === "error") {
      msg += `An uncaught exception occurred.\n${this.data.error.name}: ${this.data.error.message}\n`
    }

    if(this.eventmsg) {
      msg += `Event message: ${this.eventmsg}\n`;
    }
    if(this.data.error) {
      if(this.data.fileName) {
        msg += `Source: ${this.data.fileName}\nLine ${this.data.lineNumber}, col ${this.data.columnNumber}`;
      } else if(this.data.error.fileName) {
        msg += `Source: ${this.data.error.fileName}\nLine ${this.data.error.lineNumber}, col ${this.data.error.columnNumber}`;
      } else if(this.source) {
        msg += `Source: ${this.source}`
      } else {
        msg += `Unable to provide more info - try running the game in Firefox.`;
      }
    }
    this.errmsg = msg;
  }

  log() {
    let msg = `%coh no\n%c${this.errmsg}`;
    console.error(msg, "font-size: 27px", "");
    if(this.data.error) console.error(this.data.error.stack);
  }

  draw() {
    let msg = `${this.errmsg}\n\nPlease check the console for more details.`;

    push();
    background(0, 0, 0, 170);
    noStroke();
    fill(255, 90, 100);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textWrap(WORD);
    textSize(20);

    const maxtextwidth = canvas.w - 20;
    text(`Whoops, looks like something went wrong.`, 10, 10, maxtextwidth);
    textStyle(NORMAL);
    text(msg, 10, 40, maxtextwidth);

    pop();
  }
}