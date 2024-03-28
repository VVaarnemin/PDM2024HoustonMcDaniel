let sprite;
let infestation = [];  //Bug array

let bugCel;
let madBug;
let soyBug;

let animations = {  //Assigning sprites
  stand: {row: 0, frames: 1},
  skitter: {row: 0, col: 1, frames: 8},
  squished: {row: 1, frames: 1}
};

function preload() {  //Laying the groundwork
  
  //let animations = {  //Assigning sprites
    //stand: {row: 0, frames: 1},
    //skitter: {row: 0, col: 1, frames: 8},
    //squished: {row: 1, frames: 1}
  //};
  
  frameRate(60);  //Setting frame rate to 60 for accurate countdown

  gameState = 0; //0 for main menu, 1 for game proper, 2 for game over
  bugSpawned = false; //Whether or not there are bugs on the field

  randomX = 0;  //Defining variables for random coordinates
  randomY = 0;  

  timeLeft = 1800;  //Setting up timer
  bugsSquished = 0; //Setting up squish counter
  totalBugSquish = false; //Victory variable

  /*/

  for (let i = 0; i < 30; i++) { //Spawning in da bugz
    randomX = Math.random() * 800;  //Random coordinates between 0 and 800
    randomY = Math.random() * 800;
    infestation.push(new Bug(randomX,randomY,64,64,'assets/bugBig.png',animations,false,1));
  }

  /*/
  
  bugCel = loadImage('assets/bugCel.png');
  madBug = loadImage('assets/madBug.png');
  soyBug = loadImage('assets/soyBug.png');
}

function bugSpawn() { //Spawns in a bug
  randomX = Math.random() * 800;  //Random coordinates between 0 and 800
  randomY = Math.random() * 800;
  infestation.push(new Bug(randomX,randomY,64,64,'assets/bugBig.png',animations,false,1));
}

function mouseClicked() { //Runs each time mouse is clicked
  infestation.forEach((bug) => {  //Bug death routine
    if (((mouseX <= bug.sprite.x+32) && (mouseX >= bug.sprite.x-32)) && //If mouse is close enough to the bug and it's not already dead
    ((mouseY <= bug.sprite.y+32) && (mouseY >= bug.sprite.y-32)) &&
    bug.squished == false) {  
      bug.squish(); //Assume death sprite
      bug.squished = true;  //Set to dead
      bugsSquished++; //Increment squish counter

      infestation.forEach((bug) => {  //Make the remaining bugs faster
        bug.speed = bug.speed + 0.4;  
      })
    }
  })
}

function keyPressed() { //Press any key to continue type beat
  if (gameState == 0) {
    gameState = 1;
  } else if (gameState == 2) {
    gameState = 0;
  }
}

function setup() { //Backdrop
  createCanvas(800, 800);
}

function draw() { //Loop running at 60fps
  background(0);

  if (gameState == 0) { //Menu
    stroke(255);
    strokeWeight(5);
    textSize(100);

    fill(204,68,0);
    text("Bug",150,100);

    fill(179,0,0);
    text("SQUISH",350,100);

    textSize(50)
    fill(0);
    text("Press any key to start",200,200);

    image(madBug,0,0);
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
    }

    if (bugsSquished == 30) {
      totalBugSquish = true;
      gameState = 2;
    }

    timeLeft--; //Decrement time left

    infestation.forEach((bug) => {  //Routine for living bug movement
      if (bug.squished == false) {  //Checks that bug is alive
      
        lazyRoll = (100*(Math.random())); //Roll for wanting to change direction
        moveRoll = (100*(Math.random())); //Roll for which direction to change to

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
      fill(95,174,32);
      text("Total Bug SQUISH!",200,100);

      image(bugCel,400,400);
    } else {  //Bugs survived
      fill(204,68,0);
      text("It's over...",200,100);

      image(soyBug,400,400);
    }

    textSize(50);
    fill(0);
    text("Press any key to return to menu",50,200);

    infestation.forEach((bug) => { 
      bug.decompose();
    })

    for (let i = 0; i < 30; i++) { //Clearing out infestation
      infestation.pop();
    }

    timeLeft = 1800;
    bugsSquished = 0;
  }
}

  /*/

  fill(0);  //Setting text format
  stroke(255);
  strokeWeight(5);
  textSize(75);

  text((Math.round(timeLeft/60)),25,75);  //Timer

  text(bugsSquished,700,75);  //Squish count

  if (timeLeft == 0) {  //Stops game when time runs out
    noLoop();
  }

  timeLeft--; //Decrement time left

  infestation.forEach((bug) => {  //Routine for living bug movement
    if (bug.squished == false) {  //Checks that bug is alive
      
      lazyRoll = (100*(Math.random())); //Roll for wanting to change direction
      moveRoll = (100*(Math.random())); //Roll for which direction to change to

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
}

/*/

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
