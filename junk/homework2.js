let chosenColor = 'black';

function setup() {
  createCanvas(1000, 800);
  background(245);

}

function draw() { //Create pallette buttons
  noStroke();

  fill('red');
  square(5,5,50);

  fill('orange');
  square(5,60,50);

  fill('yellow');
  square(5,115,50);

  fill('lime');
  square(5,170,50);

  fill('cyan');
  square(5,225,50);

  fill('blue');
  square(5,280,50);

  fill('magenta');
  square(5,335,50);

  fill('brown');
  square(5,390,50);

  fill(255);
  square(5,445,50);

  fill(0);
  square(5,500,50); 

  strokeWeight(5);

  if(mouseIsPressed) {
    if(mouseX > 55 || mouseY > 555) { //Inside canvas
      stroke(chosenColor);
      line(pmouseX,pmouseY,mouseX,mouseY); //Paint lines

    } else { //Inside pallette
      if(mouseY > 500) { //BLACK
        chosenColor = 'black';

      } else if(mouseY > 445) { //WHITE
        chosenColor = 'white';

      } else if(mouseY > 390) { //BROWN
        chosenColor = 'brown';

      } else if(mouseY > 335) { //MAGENTA
        chosenColor = 'magenta';

      } else if(mouseY > 280) { //BLUE
        chosenColor = 'blue';

      } else if(mouseY > 225) { //CYAN
        chosenColor = 'cyan';

      } else if(mouseY > 170) { //LIME
        chosenColor = 'lime';

      } else if(mouseY > 115) { //YELLOW
        chosenColor = 'yellow';

      } else if(mouseY > 60) { //ORANGE
        chosenColor = 'orange';

      } else { //RED
        chosenColor = 'red';

      }
    }
  }
}
