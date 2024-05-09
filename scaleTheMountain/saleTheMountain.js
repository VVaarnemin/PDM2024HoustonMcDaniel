let nickScale, gameState, groundSensor;
let titleScreenImg, victoryScreenImg, itsOverImg, backgroundImg, rockSlideImg;
let ledgeLeftImg, ledgeLeftRockImg, ledgeMidImg, ledgeRightImg, ledgeRightRockImg, stoneSolidImg, stoneBottomImg, rockSolidImg, rockTopImg, stoneClimbableImg;
let tileMap;
let tileSize = 32;
let cursorX = 0, cursorY = 0;
let writer, reader;
const encoder = new TextEncoder();
const decoder = new TextDecoder();
let sensorData = {};
let arduinoMessage = { health: 3 };
let targetMeters = 1400;
let randomX = 0;
let slideChance = 0;
let rockSlide;
let nickHealth;
let synth = new Tone.PolySynth(Tone.Synth).toDestination();

function preload() {
    nickScale = new Sprite(10,900,128,128);
    
    nickScale.collider = 'dynamic';
    nickScale.rotationLock = true;
    nickScale.friction = 0;

    nickScale.addAnimation('stand', 'assets/nsStand.png');
    nickScale.addAnimation('run', 'assets/nsRun00.png', 'assets/nsRun07.png');
    nickScale.addAnimation('jump', 'assets/nsJump00.png', 'assets/nsJump04.png');
    nickScale.addAnimation('backStand', 'assets/nsBack.png');
    nickScale.addAnimation('climb', 'assets/nsClimb00.png', 'assets/nsClimb01.png');
    nickScale.addAnimation('hang', 'assets/nsHang.png');
    nickScale.addAnimation('hurt', 'assets/nsHurt.png');

    nickScale.ani = 'stand';

    rockSlide = new FallingRock(0);
    rockSlide.sprite.visible = false;

    titleScreenImg = loadImage('assets/titleScreen.png');
    victoryScreenImg = loadImage('assets/victoryScreen.png');
    itsOverImg = loadImage('assets/itsOver.png');
    backgroundImg = loadImage('assets/backgroundMountains.png');
    rockSlideImg = loadImage('assets/rockSlide.png');

    ledgeLeftImg = loadImage('assets/ledgeLeft.png');
    ledgeLeftRockImg = loadImage('assets/ledgeLeftRock.png');
    ledgeMidImg = loadImage('assets/ledgeMid.png');
    ledgeRightImg = loadImage('assets/ledgeRight.png');
    ledgeRightRockImg = loadImage('assets/ledgeRightRock.png');
    stoneSolidImg = loadImage('assets/stoneSolid.png');
    stoneBottomImg = loadImage('assets/stoneBottom.png');
    rockSolidImg = loadImage('assets/rockSolid.png');
    rockTopImg = loadImage('assets/rockTop.png');
    stoneClimbableImg = loadImage('assets/stoneClimbable.png');

    soundtrack = new Tone.Players({
        titleMusic: "assets/titleMusic.mp3",
        gameMusic: "assets/gameMusic.mp3",
        overMusic: "assets/itsOverMusic.mp3",
        victoryMusic: "assets/victoryMusic.mp3"
    }).toDestination();
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    if ("serial" in navigator) {  //Adds button to connect Arduino
        // The Web Serial API is supported.
        connectButton = createButton("connect");
        connectButton.position(windowWidth-100, windowHeight-50);
        connectButton.mousePressed(connect);
    }

    gameState = 0;
    world.gravity.y = 9.8;
    world.autoStep = false;
    nickScale.scale = 0.5;
    nickScale.w = 16;
    nickScale.h = 62;
    nickScale.layer = 2;

    nickHealth = 3;

    walkable = new Group();
    walkable.layer = 1;

    climbable = new Group();
    climbable.layer = 1;
    
    ledgeLeft = new walkable.Group();
    ledgeLeft.w = tileSize;
    ledgeLeft.h = tileSize;
    ledgeLeft.tile = "{";
    ledgeLeft.collider = 'static';
    ledgeLeft.image = ledgeLeftImg;

    ledgeLeftRock = new walkable.Group();
    ledgeLeftRock.w = tileSize;
    ledgeLeftRock.h = tileSize;
    ledgeLeftRock.tile = "[";
    ledgeLeftRock.collider = 'static';
    ledgeLeftRock.image = ledgeLeftRockImg;

    ledgeMid = new walkable.Group();
    ledgeMid.w = tileSize;
    ledgeMid.h = tileSize;
    ledgeMid.tile = "=";
    ledgeMid.collider = 'static';
    ledgeMid.image = ledgeMidImg;

    ledgeRight = new walkable.Group();
    ledgeRight.w = tileSize;
    ledgeRight.h = tileSize;
    ledgeRight.tile = "}";
    ledgeRight.collider = 'static';
    ledgeRight.image = ledgeRightImg;

    ledgeRightRock = new walkable.Group();
    ledgeRightRock.w = tileSize;
    ledgeRightRock.h = tileSize;
    ledgeRightRock.tile = "]";
    ledgeRightRock.collider = 'static';
    ledgeRightRock.image = ledgeRightRockImg;

    stoneSolid = new walkable.Group();
    stoneSolid.w = tileSize;
    stoneSolid.h = tileSize;
    stoneSolid.tile = "#";
    stoneSolid.collider = 'static';
    stoneSolid.image = stoneSolidImg;

    stoneBottom = new walkable.Group();
    stoneBottom.w = tileSize;
    stoneBottom.h = tileSize;
    stoneBottom.tile = "v";
    stoneBottom.collider = 'none';
    stoneBottom.image = stoneBottomImg;

    rockSolid = new walkable.Group();
    rockSolid.w = tileSize;
    rockSolid.h = tileSize;
    rockSolid.tile = "*";
    rockSolid.collider = 'none';
    rockSolid.image = rockSolidImg;

    rockTop = new walkable.Group();
    rockTop.w = tileSize;
    rockTop.h = tileSize;
    rockTop.tile = "^";
    rockTop.collider = 'none';
    rockTop.image = rockTopImg;

    stoneClimbable = new climbable.Group();
    stoneClimbable.w = tileSize;
    stoneClimbable.h = tileSize;
    stoneClimbable.tile = "%";
    stoneClimbable.collider = 'static';
    stoneClimbable.image = stoneClimbableImg;

    tileMap = new Tiles(
        [
"..................................................................................................................................................{==%==}.",
".................................................................................................................................................{##v%###.",
"................................................................................................................................................^v#v%%v##.",
".............................................................................................................................................^^^**v*%%%##.",
"...........................................................................................................................{===}............^%%******%%##.",
"...........................................................................................................................#####............*%[=]***%%[##.",
".......................................................^^^................................................................{#####}..........^*%###=====###.",
".......................................................***^^^...................................{===============}......{#########^^.......^*%%###########.",
"......................................................^******^.............................{====##########vvv###v......##########**^^^.^^^**%%###########.",
"......................................................***%****^^.......................{===##############v***vv#*......v#########]**%%^%%**%%%###########]",
".....................................................^***%%*****^^...................{=##################******v*^.....*##########==]%%%[=====############",
"....................................................^***%%[=====]*^..................vv#################v*********^..^^*###########vv*%%v#################",
"...............................................^^^^^****%%#######=====}..............**v##v############v***%*******^^***vv#########**%%%*v################",
".......................................^^^^^^^^*********%%v############===}........^^***vv*vv#########v****%%*************vv######v*%%%***v###############",
"...................................^^^^******************%%################==}...^^**********vv######v****%%[===]***********######***%*****###############",
"..................................^**********************%%v##################.^^**************v#####*****%%#####]**********######***%%%***v##############",
".................................^************************%%##################^*****************vvv#v*****%[######**********v####v****%%%***##############",
"..............................^^^*************************%%##################*******************.*v*****%%#######***********####******%%**[##############",
".........................^^^^^*****%%***********[==]******%%##################*********[=]******....*****%%#######=]*********v#vv******%***###############",
".....................^^^^*********%%[=====]**[==###v***[====#################v**[===]**v#v*****^....^****%%#########**********v*******%%***###############",
"..................{===]**********%%%#######**v#####****v#####################***v####***v*******^^.^****%%[#########]****************%%****###############",
"..............{===#####**[=]*****%%[#######***####v*****#####################****vv#v*************^*****%%###########***************%%%%%*[###############",
"..{=}...{=}.{=#########]*vvv*****%%#######v***v###******v###################v******v********[===]*******%[###########]**************%%%%%%################",
"{=###^.{###^############*****[=====######v*****vv#*******v##################****************###vv******%%#############=]***********%%%%%%[################",
"#####*^####*############****[############********v********##################****************v#v********%%###############=]*******[=======#################",
"#####**####*############****#############*****************v#################*****************v******[====#################=======#########################",
"#####**####*############****############v******************v################***********************[######################################################",


        ],
            0,
            200,
            (tileSize),
            (tileSize)
    )
    
}

function draw() {
    clear();

    serialRead(); //Joystick interaction

    if(gameState == 1) {
        background(backgroundImg);
        camera.x = (nickScale.x + 52);
        camera.y = nickScale.y;
        camera.zoom = 2.5;
        nickScale.visible = true;
        walkable.visible = true;
        climbable.visible = true;
        rockSlide.sprite.visible = true;

        fill(0);  //Setting text format
        stroke(255);
        strokeWeight(5);
        textSize(75);

        progressMeters = Math.round((targetMeters - nickScale.y) - 36)
        text("Elevation: " + progressMeters, 50, 100);

        randomX = (nickScale.x + (Math.random() * 100) - (Math.random() * 100));
        slideChance = (Math.random() * 100);

        if(slideChance > 99 && (rockSlide.sprite.vel.y == 0) || (rockSlide.sprite.y > 1111)) {
            rockSlide.respawn(randomX);
        }

        if(rockSlide.sprite.overlaps(nickScale) && (rockSlide.sprite.vel.y > 3 || rockSlide.sprite.vel.x > 3)) {
            nickHealth--;
            arduinoMessage.health--;
            serialWrite(arduinoMessage);
            rockSlide.respawn(randomX);
            synth.triggerAttack("C3, 8n");
            synth.triggerRelease("C3, 8n");
        }
        
        movementJoy();
        movement();

        if((nickScale.y >= 1100) || (nickHealth == 0)) {
            gameState = 3;
            nickScale.x = 10;
            nickScale.y = 100;
            nickScale.vel.x = 0;
            nickScale.vel.y = 0;
            synth.triggerAttack("C5, 8n");
            synth.triggerRelease("C5, 8n");

            soundtrack.player("gameMusic").stop();
            soundtrack.player("overMusic").start();
            soundtrack.player("overMusic").volume.value = -10;
        }

        if(progressMeters == 1212) {
            gameState = 2;
            nickScale.x = 10;
            nickScale.y = 100;
            nickScale.vel.x = 0;
            nickScale.vel.y = 0;

            soundtrack.player("gameMusic").stop();
            soundtrack.player("victoryMusic").start();
            soundtrack.player("victoryMusic").volume.value = -10;
        }

    } else if(gameState == 0) { //Title Screen
        background(titleScreenImg);
        nickScale.visible = false;
        walkable.visible = false;
        climbable.visible = false;
        rockSlide.sprite.visible = false;
        nickHealth = 3;

        //Logic for input starting game
        
        if(kb.presses('q')) {
            gameState = 1;
            rockSlide.respawn(100);
            nickScale.x = 10;
            nickScale.y = 880;

            soundtrack.player("titleMusic").stop();
            soundtrack.player("gameMusic").start();
            soundtrack.player("gameMusic").volume.value = -10;
        }

        if(sensorData.sw == 1) {    //Start game
            gameState = 1;
            rockSlide.respawn(100);
            nickScale.x = 10;
            nickScale.y = 880;

            arduinoMessage.health = 3;
            serialWrite(arduinoMessage);

            soundtrack.player("titleMusic").stop();
            soundtrack.player("gameMusic").start();
            soundtrack.player("gameMusic").volume.value = -10;
        }

    } else if(gameState == 2) { //Victory Screen
        background(victoryScreenImg);
        nickScale.visible = false;
        walkable.visible = false;
        climbable.visible = false;
        rockSlide.sprite.visible = false;

        
        if(kb.presses('q')) {   //Return to menu
            gameState = 0;

            soundtrack.player("victoryMusic").stop();
            soundtrack.player("titleMusic").start();
            soundtrack.player("titleMusic").volume.value = -10;
        }
        

        if(sensorData.sw == 1) { 
            gameState = 0;

            soundtrack.player("victoryMusic").stop();
            soundtrack.player("titleMusic").start();
            soundtrack.player("titleMusic").volume.value = -10;
        }

    } else if(gameState == 3) { //Game over
        background(itsOverImg);
        nickScale.visible = false;
        walkable.visible = false;
        climbable.visible = false;
        rockSlide.sprite.visible = false;

        
        if(kb.presses('q')) {   //Return to menu
            gameState = 0;

            soundtrack.player("overMusic").stop();
            soundtrack.player("titleMusic").start();
            soundtrack.player("titleMusic").volume.value = -10;
        }
        

        if(sensorData.sw == 1) { 
            gameState = 0;

            soundtrack.player("overMusic").stop();
            soundtrack.player("titleMusic").start();
            soundtrack.player("titleMusic").volume.value = -10;
        }
    }
}

function movement() {   //Handles player movement
    if(kb.pressing('a')) {
        nickScale.vel.x = -2;
        nickScale.changeAni('run');
        nickScale.mirror.x = true;
    } else if(kb.pressing('d')) {
        nickScale.vel.x = 2;
        nickScale.changeAni('run');
        nickScale.mirror.x = false;
    } else if(kb.pressing('w')) {
        nickScale.vel.x = 0;

        if(nickScale.overlapping(climbable)) {
            nickScale.changeAni('climb');
            nickScale.vel.y = -1;
        } else {
            nickScale.changeAni('backStand');
        }
    } else {
        if(nickScale.ani != 'hurt') {
            nickScale.changeAni('stand');
        }
        nickScale.vel.x = 0;
    } 
    
    if(kb.pressing('space')) {
        nickScale.changeAni('jump');
        
        if(nickScale.vel.y == 0) {
            nickScale.vel.y = 20;
        }
    }
}

function movementJoy() {
    if (sensorData.x) {
        cursorX = sensorData.x / 10;
    }

    if (sensorData.y) {
        cursorY = sensorData.y / 10;
    }

    if (sensorData.x < -50) {
        nickScale.vel.x = -2;
        nickScale.changeAni('run');
        nickScale.mirror.x = true;
    } else if(sensorData.x > 50) {
        nickScale.vel.x = 2;
        nickScale.changeAni('run');
        nickScale.mirror.x = false;
    } else {
        nickScale.changeAni('stand');
        nickScale.vel.x = 0;
    }

    if(sensorData.y < -50) {
        nickScale.vel.x = 0;

        if(nickScale.overlapping(climbable)) {
            nickScale.changeAni('climb');
            nickScale.vel.y = -1;
        } else {
            nickScale.changeAni('backStand');
        }
    }
    
    if(sensorData.sw == 1) {
        nickScale.changeAni('jump');
        
        if(nickScale.vel.y == 0) {
            nickScale.vel.y = 20;
        }
    }
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

class FallingRock {
    constructor(x) { //Setting up bug sprite
        this.sprite = new Sprite(x,0,64,64);
        this.sprite.collider = 'dynamic';
        //this.sprite.anis.frameDelay = 60;
        this.sprite.addAnimation('fall', 'assets/betterFall.png');
        //this.sprite.addAnimation('shatter', 'assets/shatter00.png', 'assets/shatter05.png');
        this.sprite.changeAni('fall');
        this.sprite.w = 16;
        this.sprite.h = 16;
        this.sprite.vel.y = 4;
        this.sprite.bounciness = 0.2;
    }

    respawn(randomX) {
        this.sprite.x = randomX;
        this.sprite.y = (nickScale.y - 300);
        this.sprite.vel.y = 0.5;
        if(Math.random() > 0.5) {
            this.sprite.vel.x = 2;
        } else {
            this.sprite.vel.x = -2;
        }
        //this.sprite.collider = 'dynamic';
        //this.sprite.changeAni('fall');
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