function setup() {
  createCanvas(500, 400);
}

function draw() {
  background(220);
  
  //--------Example-4---------------------

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

  //--------Example-3-------------------------

  //Black backdrop
  noStroke();
  fill(0);
  rect(0,250,200,100); 

  //Pac-man
  fill(255,255,0)
  ellipse(50,300,80,80);

  fill(0);
  triangle(10,260,50,300,10,335);

  //Ghost
  fill(255,0,0);
  rect(110,300,80,40);
  ellipse(150,300,80,80);

  fill(255);
  ellipse(130,300,25,25);
  ellipse(170,300,25,25);

  fill(0,0,255);
  ellipse(130,300,15,15);
  ellipse(170,300,15,15);

  //------Example-2------------------------------

  //White backdrop
  noStroke();
  fill(255);
  rect(250,0,200,200); 
  
  //Red circle
  fill(255,0,0,100);
  ellipse(350,70,90,90);

  //Green circle
  fill(0,0,255,100);
  ellipse(320,125,90,90);

  //Blue circle
  fill(0,255,0,100);
  ellipse(380,125,90,90);

  //--------Example-1-------------------------------

  //Green backdrop
  noStroke();
  fill(51,255,51);
  rect(250,250,200,100); 
  
  //White circle and square
  stroke(0)
  fill(255);
  ellipse(300,300,80,80);
  square(360,260,80);
}
