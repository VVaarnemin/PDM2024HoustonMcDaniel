function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);

  //White backdrop
  noStroke();
  fill(255);
  rect(0,0,200,200); 
  
  //Red circle
  fill(255,0,0,100);
  ellipse(100,70,90,90);

  //Green circle
  fill(0,0,255,100);
  ellipse(70,125,90,90);

  //Blue circle
  fill(0,255,0,100);
  ellipse(130,125,90,90);
}
