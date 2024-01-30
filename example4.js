function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  //Blue backdrop
  noStroke();
  fill(0,0,150);
  rect(0,0,200,200); 

  //White Circle
  fill(255);
  ellipse(100,100,98,98);

  //Green Circle
  fill(21,128,0);
  ellipse(100,100,90,90);

  //White Star
  fill(255);
  triangle(100,50,130,140,90,110); //Right
  triangle(50,90,100,115,150,90); //Center
  triangle(100,50,70,140,110,110); //Left

  //Red Star
  fill(255,0,0);
  triangle(100,60,122,130,100,112); //Right
  triangle(60,92,100,112,140,92); //Center
  triangle(100,60,78,130,100,112); //Left
}
