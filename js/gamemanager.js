"use strict";

class GameManager {
  constructor() {
    this.crashed = false;
    this.errdata = {};

    this.fpsList = [];
    this.avgFPS = 0;
    this.avgDeltaTime = 0;
    // get the current fps 10 times a second
    // used to get average FPS over the last 3 seconds
    this.fpsPush = setInterval(() => {
      this.fpsList.push(frameRate());
      if (this.fpsList.length > 30) this.fpsList.shift();
    }, 100);

    // set error handling
    window.onerror = (event, source, lineno, colno, error) => {
      this.crash({
        type: "error",
        eventmsg: event,
        source, lineno, colno, error
      });
    };

    // unhandled promise rejection
    addEventListener("unhandledrejection", (event) => {
      this.crash({ type: "promiseReject", event });
    });
  }

  crash(data) { // data is an object, should contain error
    this.crashed = true;
    this.errdata = data;
    noLoop();
    
    this.setMessage();
    this.crashlog();
    this.crashdraw();
  }

  setMessage() { // set this.errmsg based on data in this handler
    let msg = ``;
    // error type
    if(this.errdata.type === "promiseReject") {
      msg += `Unhandled promise rejection: ${this.errdata.event.reason}`;
    } else if(this.errdata.type === "setupError") {
      msg += `Game setup failed to complete.\n${this.errdata.error.name}: ${this.errdata.error.message}\n`;
    } else if(this.errdata.type === "error") {
      msg += `An uncaught exception occurred.\n${this.errdata.error.name}: ${this.errdata.error.message}\n`
    }

    if(this.eventmsg) {
      msg += `Event message: ${this.eventmsg}\n`;
    }
    if(this.errdata.error) {
      if(this.errdata.fileName) {
        msg += `Source: ${this.errdata.fileName}\nLine ${this.errdata.lineNumber}, col ${this.errdata.columnNumber}`;
      } else if(this.errdata.error.fileName) {
        msg += `Source: ${this.errdata.error.fileName}\nLine ${this.errdata.error.lineNumber}, col ${this.errdata.error.columnNumber}`;
      } else if(this.source) {
        msg += `Source: ${this.source}`
      } else {
        msg += `Unable to provide more info - try running the game in Firefox.`;
      }
    }
    this.errmsg = msg;
  }

  crashlog() {
    let msg = `%coh no\n%c${this.errmsg}`;
    console.error(msg, "font-size: 27px", "");
    if(this.errdata.error) console.error(this.errdata.error.stack);
  }

  crashdraw() {
    camera.off();

    push();
    background(0, 0, 0, 200);
    noStroke();
    fill(255, 90, 100);
    textAlign(LEFT, TOP);
    textStyle(BOLD);
    textWrap(WORD);
    textSize(20);

    const maxtextwidth = canvas.w - 20;
    let msg = `${this.errmsg}\n\nPlease check the console for more details.`;
    text(`Whoops, looks like something went wrong.`, 10, 10, maxtextwidth);
    textStyle(NORMAL);
    text(msg, 10, 40, maxtextwidth);

    pop();
  }
}