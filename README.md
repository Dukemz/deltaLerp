# deltaLerp (Scroller Game Test)

WORK IN PROGRESS!

This is a prototype scroller/shooter game using only simple polygons and lines as sprites.

I initially made this game for a school project, but also as a challenge to make a completely offline HTML/JS game that works without a live server.

All the code is by me, all the music is by my friend B0omBringer/nukegameplay.

If you'd like to know more about this project or give any feedback or suggestions, please contact me on Discord.

## Try the game

You can run the latest build [here](https://dukemz.github.io/deltaLerp/), or clone/[download](https://github.com/Dukemz/deltaLerp/archive/refs/heads/main.zip) the repository and open index.html.

Be aware that the latest build is considered bleeding-edge and will likely be unstable.

A live server shouldn't be necessary to run the game - just opening the downloaded html file in your browser should work.

View the controls [here](https://github.com/Dukemz/deltaLerp/blob/main/CONTROLS.md). The game supports most standard gamepads/controllers through use of the Gamepad API, but I've only properly tested DualShock 4 and DualSense controllers.

### Recommendations

Chromium-based browsers (this includes Edge and Opera) generally have the best canvas performance. However, due to CORS limitations with local files, error messages may be vague. The best way to solve this is to use Firefox, which usually provides more comprehensive error information.

## Libraries Used

- [p5.js](https://p5js.org/)

- [q5.js](https://q5js.org/) (higher performance replacement for p5)

- [p5play](https://p5play.org/)

- [planck.js](https://piqnt.com/planck.js)

<!-- - [lz-string](https://github.com/pieroxy/lz-string/) -->

## Offline Single File Demo (Outdated)

I very much recommend against this, but to try the single-file proof of concept, download dlpoffline.min.html from the offlinemode folder and open it in your browser - no additional setup needed.

You can also optionally download the quackmp3.mp3 file and place it into a folder named assets in the same directory as the HTML, to test if audio is working.
