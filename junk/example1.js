function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  
  //Green backdrop
  noStroke();
  fill(51,255,51);
  rect(0,0,200,100); 
  
  //White circle and square
  stroke(0)
  fill(255);
  ellipse(50,50,80,80);
  square(110,10,80);
}
