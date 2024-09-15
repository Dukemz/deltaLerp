"use strict";

let audio;

document.getElementById('loadFileButton').addEventListener('click', () => {
  if(audio) audio.pause();
  const file = document.getElementById('encodedFile').files[0];
  const progressText = document.getElementById('progressText');
  const playbackControls = document.getElementById('playbackControls');

  if(!file) {
    alert('Please select a file first.');
    return;
  }
  progressText.textContent = 'Loading audio...';

  try {
    // read the uploaded file when load button is clicked
    const reader = new FileReader();
    reader.onload = function(e) {
      const compressedData = e.target.result;

      const encoding = document.getElementById('encodingSelect').value;
      let audioData;

      // decompress/decode using lz-string/compressedData
      if(encoding === "b64-compressed") {
        console.log(`decompressing ${file.name} with b64-compressed`);
        audioData = Base64String.decompress(compressedData);
      } else if(encoding === "b64-utf16-compressed") {
        console.log(`decompressing ${file.name} with b64-utf16-compressed`);
        audioData = Base64String.decompressFromUTF16(compressedData);
      } else if(encoding === "lz-compressed") {
        console.log(`decompressing ${file.name} with lz-compressed`);
        audioData = LZString.decompress(compressedData);
      } else if(encoding === "lz-utf16-compressed") {
        console.log(`decompressing ${file.name} with lz-utf16-compressed`);
        audioData = LZString.decompressFromUTF16(compressedData);
      } else { // standard base64
        console.log(`decoding ${file.name} with b64`);
        audioData = compressedData;
      }

      // create a new Audio object with the base64 data URL
      audio = new Audio(audioData);
      audio.loop = true;

      // display the playback controls once the audio is ready
      playbackControls.style.display = 'flex';

      progressText.textContent = 'Audio loaded!';

      // update the time display as the audio plays
      audio.addEventListener('timeupdate', () => {
        const currentTime = audio.currentTime.toFixed(2);
        const duration = audio.duration ? audio.duration.toFixed(2) : '...';  // handle case where duration isn't known yet
        timeDisplay.textContent = `Current Time: ${currentTime} / Duration: ${duration}`;
      });

      // Set up playback controls
      document.getElementById('playButton').addEventListener('click', () => {
        audio.play();
      });

      document.getElementById('pauseButton').addEventListener('click', () => {
        audio.pause();
      });

      document.getElementById('stopButton').addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0; // Reset playback position to the start
      });
    };

    reader.readAsText(file); // Read the Base64 data from the uploaded .txt file
  } catch(error) {
    console.error(error);
    alert('Error loading audio file: ' + error.message);
    progressText.textContent = 'Error loading audio file!'; // Clear progress text on error
  }
});