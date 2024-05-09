var sprite;
var nickScaleSprite;
let cursorX = 0, cursorY = 0;
let sensorData = {};
let cursorSpeed = 3;
let writer, reader;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let arduinoMessage = { active: false };

var nickScaleAnimations = {  //Assigning Nick Scale sprites
  //Need sprite info here
};

var rockAnimations = {  //Assigning rock slide sprites
  //Need rock slide sprite info here
};

var gameState = 0; //0 for main menu, 1 for game proper, 2 for game over

var randomX = 0;  //Defining variables for random coordinates (rock slides?)
var randomY = 0;  

var metersScaled = 0; //Progress tracker

function preload() {  //Loading sound/visual assets
  soundtrack = new Tone.Players({
    //Sound assets here
  }).toDestination();

  //loadImage() functions here
}

function serialRead() { //Arduino interaction
  (async () => {
    while (reader) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      try {
        sensorData = JSON.parse(value);
        //console.log(value);
      }
      catch (e) {
        console.log("bad json parse: " + e);
      }
    }
  })();
}

function serialWrite(jsonObject) {  //Arduino interaction
  if (writer) {
    writer.write(encoder.encode(JSON.stringify(jsonObject)+"\n"));
  }
}

async function connect() {  //Arduino interaction
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 38400 }); 

  writer = port.writable.getWriter();

  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
}

function setup() { //Backdrop, frame rate, sprite
  createCanvas(800, 800);

  frameRate(60);

  world.gravity.y = 9.8;  //Gravity

  nickScaleSprite = new Sprite();

  if ("serial" in navigator) {  //Adds button to connect Arduino
    // The Web Serial API is supported.
    connectButton = createButton("connect");
    connectButton.position(730, 770);
    connectButton.mousePressed(connect);
  }
}

function draw() { //Loop running at 60fps
  background(0);

  //clear();

  serialRead(); //Joystick interaction

  if (sensorData.x) {
    cursorX = sensorData.x / 10;
  }

  if (sensorData.y) {
    cursorY = sensorData.y / 10;
  }

  nickScaleSprite.x = constrain(nickScaleSprite.x, 0, 800);
  nickScaleSprite.y = constrain(nickScaleSprite.y, 0, 800);

  if (sensorData.x != 0) {
    nickScaleSprite.vel.x = (cursorX / 5);
  } else {
    nickScaleSprite.vel.x = 0;
    cursorX = 0;
  }

  if (sensorData.y != 0) {
    nickScaleSprite.vel.y = (cursorY / 5);
  } else {
    nickScaleSprite.vel.y = 0;
    cursorY = 0;
  }
  

  if (gameState == 0) { //Menu
    //Menu appearance

    if((sensorData.sw == 1) && (controllerSprite.y >= 500)) { //Button starting game (keep?)
      gameState = 1;

      soundtrack.player("titleMusic").stop();
      soundtrack.player("gameMusic").start();
      soundtrack.player("gameMusic").volume.value = -10;
    }

  } else if (gameState == 1) { //Game
    //Actual gameplay
  } else { //Game over
    //Game over / Win
  }
}

class LineBreakTransformer {  //Arduino interaction
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
