const video = document.getElementById('video');

const app = new PIXI.Application({ transparent: true, width: video.width, height: video.height });

document.getElementById('show').appendChild(app.view);

// Face (change to any other img)
const texture = PIXI.Texture.from('./img/pepe.png');

// create a new Sprite using the video texture (yes it's that easy)
const char = new PIXI.Sprite(texture);
char.anchor.set(0.45);
char.x = 0;
char.y = 0;
let state_add = false;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
]).then(startVideo);

async function startVideo() {
  let stream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });

  video.srcObject = stream;
}

video.addEventListener('play', () => {
  // // const canvas = faceapi.createCanvasFromMedia(video);
  // // document.body.append(canvas);
  // // const displaySize = { width: video.width, height: video.height };
  // faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    //console.log(detections);

    // canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    // create a video texture from a path

    // Stetch the fullscreen
    if (detections[0] != undefined) {
      console.log(detections[0]);
      console.log(detections[0].alignedRect._box);
      let face_size = detections[0].alignedRect._box;

      char.width = face_size._width * 2;
      char.height = face_size._height * 2;

      let pos_x = (detections[0].landmarks.positions[33]._x + detections[0].landmarks.positions[32]._x) / 2;
      let pos_y = (detections[0].landmarks.positions[33]._y + detections[0].landmarks.positions[32]._y) / 2;

      console.log(pos_x, pos_y);

      char.x = pos_x;
      char.y = pos_y;

      if (state_add == false) {
        app.stage.addChild(char);
      }

    }

  }, 1000 / 25);
});