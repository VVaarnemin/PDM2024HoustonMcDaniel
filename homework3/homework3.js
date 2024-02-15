let sprite;
let characters = [];

function preload() { //Defining sprite images and creating characters
  let animations = {
    stand: {row: 0, frames: 1},
    walkRight: {row: 0, col: 1, frames: 8},
    walkUp: {row: 5, frames: 6},
    walkDown: {row: 5, col: 6, frames: 6},
    dance: {row: 9, col: 7, frames: 4}
  };

  characters.push(new Character(100,100,80,80,'assets/blue.png',animations));
  characters.push(new Character(200,200,80,80,'assets/robot.png',animations));
  characters.push(new Character(100,300,80,80,'assets/green.png',animations));
}

function setup() { //Backdrop
  createCanvas(800, 800);
}

function draw() { //Character movement
  background(0);

  characters.forEach((character) => {
    if (kb.pressing('w')) {
      character.walkUp();
    } else if (kb.pressing('s')) {
      character.walkDown();
    } else if (kb.pressing('d')) {
      character.walkRight();
    } else if (kb.pressing('a')) {
      character.walkLeft();
    } else if (kb.pressing('y')) {
      character.dance();
    } else {
      character.stop();
    }
  })
}

class Character { 
  constructor(x,y,width,height,spriteSheet,animations) { //Setting up character sprite
    this.sprite = new Sprite(x,y,width,height);
    this.sprite.spriteSheet = spriteSheet;
    this.sprite.collider = 'none';
    this.sprite.anis.frameDelay = 6;
    this.sprite.addAnis(animations);
    this.sprite.changeAni('stand');
  }

  stop() { //Stand
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.sprite.changeAni('stand');
  }

  dance() { //Break it down
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 0;
    this.sprite.changeAni('dance');
  }

  walkRight() { //Walk right
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = 1;
    this.sprite.scale.x = 1;
    this.sprite.vel.y = 0;
  }

  walkLeft() { //Walk left
    this.sprite.changeAni('walkRight');
    this.sprite.vel.x = -1;
    this.sprite.scale.x = -1;
    this.sprite.vel.y = 0;
  }

  walkUp() { //Walk away
    this.sprite.changeAni('walkUp');
    this.sprite.vel.x = 0;
    this.sprite.vel.y = -1;
  }

  walkDown() { //Walk closer
    this.sprite.changeAni('walkDown');
    this.sprite.vel.x = 0;
    this.sprite.vel.y = 1;
  }
}