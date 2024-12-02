// thingy to convert audio files
"use strict";

// function to convert audio file to base64
async function audioToBase64(audioFile) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      let base64 = e.target.result;

      // remove the mime type string
      base64 = base64.replace(/^data:.*;base64,/, '');

      // force MIME type to audio/ogg if the file is an .ogg
      // if(audioFile.type === 'video/ogg') {
      //   base64 = base64.replace(/^data:video\/ogg/, 'data:audio/ogg');
      // }
      resolve(base64);
    };
    reader.readAsDataURL(audioFile);
  });
}

document.getElementById('convertButton').addEventListener('click', async () => {
  const audioFile = document.getElementById('audioFile').files[0];
  if (!audioFile) {
    alert('Please select a file first.');
    return;
  }
  progressText.textContent = 'Conversion in progress...';

  try {
    // convert the uploaded file to base64
    const base64str = await audioToBase64(audioFile);
    let fileData;
    let fileType = "application/octet-stream";
    let fileExt = ".txt";
    const encoding = document.getElementById('encodingSelect').value;

    // compress using lz-string/base64str
    if(encoding === "b64-compressed") {
      console.log(`compressing ${audioFile.name} with b64-compressed`);
      fileData = Base64String.compress(base64str);
    } else if(encoding === "b64-utf16-compressed") {
      console.log(`compressing ${audioFile.name} with b64-utf16-compressed`);
      fileData = Base64String.compressToUTF16(base64str);
    } else if(encoding === "lz-compressed") {
      console.log(`compressing ${audioFile.name} with lz-compressed`);
      fileData = LZString.compress(base64str);
    } else if(encoding === "lz-utf16-compressed") {
      console.log(`compressing ${audioFile.name} with lz-utf16-compressed`);
      fileData = LZString.compressToUTF16(base64str);
    } else { // standard base64
      console.log(`encoding ${audioFile.name} with b64`);
      fileData = base64str;
      fileExt = ".txt";
      fileType = 'text/plain';
    }

    // create a blob object for the base64 string
    const blob = new Blob([fileData], { type: fileType });
    const url = URL.createObjectURL(blob);

    // get the original file name and set it for the .txt file
    const fileName = audioFile.name.replace(/\.[^/.]+$/, ""); // removes extension
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${encoding}${fileExt}`;
    link.textContent = 'Download';

    // clear previous link and add the new one
    const downloadSection = document.getElementById('downloadSection');
    downloadSection.innerHTML = '';
    downloadSection.appendChild(link);

    progressText.textContent = 'Conversion complete!';

  } catch (error) {
    alert('Error converting audio file: ' + error.message);
    progressText.textContent = 'Error converting audio file.';
  }
});


