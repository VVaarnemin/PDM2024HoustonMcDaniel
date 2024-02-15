function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  //Black backdrop
  noStroke();
  fill(0);
  rect(0,0,200,100); 

  //Pac-man
  fill(255,255,0)
  ellipse(50,50,80,80);

  fill(0);
  triangle(10,10,50,50,10,85);

  //Ghost
  fill(255,0,0);
  rect(110,50,80,40);
  ellipse(150,50,80,80);

  fill(255);
  ellipse(130,50,25,25);
  ellipse(170,50,25,25);

  fill(0,0,255);
  ellipse(130,50,15,15);
  ellipse(170,50,15,15);
}
