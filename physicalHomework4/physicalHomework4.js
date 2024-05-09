var sprite;
var controllerSprite;
let cursorX = 0, cursorY = 0;
let sensorData = {};
let cursorSpeed = 3;
let writer, reader;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let arduinoMessage = { active: false };
var infestation = [];  //Bug array

var bugCel; //Bug images
var madBug;
var soyBug;

var animations = {  //Assigning sprites
  stand: {row: 0, frames: 1},
  skitter: {row: 0, col: 1, frames: 8},
  squished: {row: 1, frames: 1}
};

var crossAnimations = {
  cross: {row: 0, frames: 1}
};

var gameState = 0; //0 for main menu, 1 for game proper, 2 for game over
var bugSpawned = false; //Whether or not there are bugs on the field

var randomX = 0;  //Defining variables for random coordinates
var randomY = 0;  

var timeLeft = 1800;  //Setting up timer
var bugsSquished = 0; //Setting up squish counter
var totalBugSquish = false; //Victory variable

function preload() {  //Laying the groundwork
  soundtrack = new Tone.Players({
    squish: "assets/squishNoise.mp3",
    ding: "assets/cartoonyDing.mp3",
    titleMusic: "assets/epicMusic.mp3",
    gameMusic: "assets/vidyaMusic.mp3",
    overMusic: "assets/overMusic.mp3",
    happyMusic: "assets/happyMusic.mp3"
  }).toDestination();

  bugCel = loadImage('assets/bugCel.png');
  madBug = loadImage('assets/madBug.png');
  soyBug = loadImage('assets/soyBug.png');
}

function bugSpawn() { //Spawns in a bug
  randomX = Math.random() * 800;  //Random coordinates between 0 and 800
  randomY = Math.random() * 800;
  infestation.push(new Bug(randomX,randomY,64,64,'assets/bugBig.png',animations,false,1));
}

/*/ Mouse
function mouseClicked() { //Runs each time mouse is clicked
  infestation.forEach((bug) => {  //Bug death routine
    if (((mouseX <= bug.sprite.x+32) && (mouseX >= bug.sprite.x-32)) && //If mouse is close enough to the bug and it's not already dead
    ((mouseY <= bug.sprite.y+32) && (mouseY >= bug.sprite.y-32)) &&
    bug.squished == false) {  
      bug.squish(); //Assume death sprite
      bug.squished = true;  //Set to dead
      bugsSquished++; //Increment squish counter

      soundtrack.player("squish").start();
      soundtrack.player("ding").start();

      infestation.forEach((bug) => {  //Make the remaining bugs faster
        bug.speed = bug.speed + 0.4;  
      })
    }
  })
}
/*/

/*/ Keyboard
function keyPressed() { //Press any key to continue type beat
  if (gameState == 0) {
    gameState = 1;

    soundtrack.player("titleMusic").stop();
    soundtrack.player("gameMusic").start();
    soundtrack.player("gameMusic").volume.value = -10;
  } else if (gameState == 2) {
    gameState = 0;

    soundtrack.player("overMusic").stop();
    soundtrack.player("happyMusic").stop();
    soundtrack.player("titleMusic").start();
  }
}
/*/

function serialRead() {
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

function serialWrite(jsonObject) {
  if (writer) {
    writer.write(encoder.encode(JSON.stringify(jsonObject)+"\n"));
  }
}

async function connect() {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate: 38400 }); 

  writer = port.writable.getWriter();

  reader = port.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TransformStream(new LineBreakTransformer()))
    .getReader();
}

function setup() { //Backdrop and frame rate
  createCanvas(800, 800);

  frameRate(60);

  world.gravity.y = 0;
  world.gravity.x = 0;

  controllerSprite = new Sprite();
  controllerSprite.diameter = 40;
  controllerSprite.color = 'red';
  controllerSprite.color.setAlpha(150);

  if ("serial" in navigator) {
    // The Web Serial API is supported.
    connectButton = createButton("connect");
    connectButton.position(730, 770);
    connectButton.mousePressed(connect);
  }
}

function draw() { //Loop running at 60fps
  background(0);

  //clear();

  serialRead();

  if (sensorData.x) {
    cursorX = sensorData.x / 10;
  }

  if (sensorData.y) {
    cursorY = sensorData.y / 10;
  }

  controllerSprite.x = constrain(controllerSprite.x, 0, 800);
  controllerSprite.y = constrain(controllerSprite.y, 0, 800);

  if (sensorData.x != 0) {
    controllerSprite.vel.x = (cursorX / 5);
  } else {
    controllerSprite.vel.x = 0;
    cursorX = 0;
  }

  if (sensorData.y != 0) {
    controllerSprite.vel.y = (cursorY / 5);
  } else {
    controllerSprite.vel.y = 0;
    cursorY = 0;
  }
  

  if (gameState == 0) { //Menu
    stroke(255);
    strokeWeight(5);
    textSize(100);

    fill(204,68,0);
    text("Bug",150,100);

    fill(179,0,0);
    text("SQUISH",350,100);

    textSize(50);
    fill(0);
    text("Press a bug to start",200,200);

    image(madBug,-150,400,400,400);
    image(madBug,200,400,400,400);
    image(madBug,550,400,400,400);

    if((sensorData.sw == 1) && (controllerSprite.y >= 500)) {
      gameState = 1;

      soundtrack.player("titleMusic").stop();
      soundtrack.player("gameMusic").start();
      soundtrack.player("gameMusic").volume.value = -10;
    }

  } else if (gameState == 1) { //Game
    fill(0);  //Setting text format
    stroke(255);
    strokeWeight(5);
    textSize(75);

    text((Math.round(timeLeft/60)),25,75);  //Timer

    text(bugsSquished,700,75);  //Squish count

    if (infestation.length < 30) {
      bugSpawn();
    }

    if (timeLeft == 0) {  //Ends game when time's up
      gameState = 2;

      soundtrack.player("gameMusic").stop();
      soundtrack.player("overMusic").start();
    }

    if (bugsSquished == 30) {
      totalBugSquish = true;
      gameState = 2;

      soundtrack.player("gameMusic").stop();
      soundtrack.player("happyMusic").start();
    }

    if(sensorData.sw == 1) {
      infestation.forEach((bug) => {  //Bug death routine
        if (((controllerSprite.x <= bug.sprite.x+32) && (controllerSprite.x >= bug.sprite.x-32)) && //If mouse is close enough to the bug and it's not already dead
        ((controllerSprite.y <= bug.sprite.y+32) && (controllerSprite.y >= bug.sprite.y-32)) &&
        bug.squished == false) {  
          bug.squish(); //Assume death sprite
          bug.squished = true;  //Set to dead
          bugsSquished++; //Increment squish counter

          if(bugsSquished == 30) {
            arduinoMessage.active = true;
            serialWrite(arduinoMessage);
          }
  
          soundtrack.player("squish").start();
          soundtrack.player("ding").start();

          infestation.forEach((bug) => {  //Make the remaining bugs faster
            bug.speed = bug.speed + 0.4;  
          })
        }
      })
    }

    timeLeft--; //Decrement time left

    infestation.forEach((bug) => {  //Routine for living bug movement
      if (bug.squished == false) {  //Checks that bug is alive
      
        let lazyRoll = (100*(Math.random())); //Roll for wanting to change direction
        let moveRoll = (100*(Math.random())); //Roll for which direction to change to

        if(lazyRoll <= 1) { //1% chance every frame to change directions
          if (moveRoll <= 25) { //25% chance to change to any direction, including current
            bug.skitterDown();
          } else if (moveRoll <= 50) {
            bug.skitterRight();
          } else if (moveRoll <= 75) {
            bug.skitterLeft();
          } else if (moveRoll <= 100) {
            bug.skitterUp();
          } 
        }

        if (bug.sprite.x + bug.sprite.width/4 > width) { //Keeps bugs from leaving screen
          bug.skitterLeft();
        } else if (bug.sprite.x - bug.sprite.width/4 < 0) {
          bug.skitterRight();
        } else if (bug.sprite.y + bug.sprite.height/4 > height) {
          bug.skitterUp();
        } else if (bug.sprite.y - bug.sprite.height/4 < 0) {
          bug.skitterDown();
        }
      }
    })
  } else { //Game over
    stroke(255);
    strokeWeight(5);
    textSize(100);

    if (totalBugSquish) { //Victory
      textSize(90);
      fill(95,174,32);
      text("Total Bug SQUISH!",10,100);

      image(bugCel,200,400,400,400);
    } else {  //Bugs survived
      fill(204,68,0);
      text("It's over...",200,100);

      image(soyBug,-10,400,400,400);
      image(soyBug,410,400,400,400);
    }

    textSize(50);
    fill(0);
    text("Press ",50,200);
    fill(95,174,32);
    text("HERE",200,200);
    fill(0);
    text(" to return to menu",350,200);

    infestation.forEach((bug) => { 
      bug.decompose();
    })

    for (let i = 0; i < 30; i++) { //Clearing out infestation
      infestation.pop();
    }

    timeLeft = 1800;
    bugsSquished = 0;

    //rect(200, 150, 150, 50);

    if ((sensorData.sw == 1) && (controllerSprite.y >= 150) && (controllerSprite.y <= 200)
    && (controllerSprite.x >= 200) && (controllerSprite.x <= 350)) {
      gameState = 0;

      soundtrack.player("overMusic").stop();
      soundtrack.player("happyMusic").stop();
      soundtrack.player("titleMusic").start();

      arduinoMessage.active = false;
      serialWrite(arduinoMessage);
    }
  }
}

class LineBreakTransformer {
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

class Bug { //Bug class
  constructor(x,y,width,height,spriteSheet,animations,squished,speed) { //Setting up bug sprite
    this.sprite = new Sprite(x,y,width,height);
    this.sprite.spriteSheet = spriteSheet;
    this.sprite.collider = 'none';
    this.sprite.anis.frameDelay = 6;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('stand');
    this.squished = squished; //True when dead
    this.speed = speed; //Movement speed
  }

  stop() { //Standing still
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.sprite.changeAni('stand');
  }

  squish() { //Dead
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.sprite.changeAni('squished');
  }

  skitterRight() { //Walking right
    this.sprite.changeAni('skitter');
    this.sprite.vel.x = this.speed;
    this.sprite.rotation = 90
    this.sprite.vel.y = 0;
  }

  skitterLeft() { //Walking left
    this.sprite.changeAni('skitter');
    this.sprite.vel.x = (-1 *this.speed);
    this.sprite.rotation = 270
    this.sprite.vel.y = 0;
  }

  skitterUp() { //Walking up
    this.sprite.changeAni('skitter');
    this.sprite.vel.x = 0;
    this.sprite.rotation = 0;
    this.sprite.vel.y = (-1 *this.speed);
  }

  skitterDown() { //Walking down
    this.sprite.changeAni('skitter');
    this.sprite.vel.x = 0;
    this.sprite.rotation = 180;
    this.sprite.vel.y = this.speed;
  }

  decompose() {
    this.sprite.remove();
  }
}
