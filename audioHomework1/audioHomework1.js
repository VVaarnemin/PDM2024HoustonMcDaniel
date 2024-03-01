let soundFX = new Tone.Players({ //Define sounds
  'vineBoom': "assets/vineBoom.mp3",
  'clashLaugh': "assets/clashLaugh.mp3",
  'rizzWow': "assets/rizzWow.mp3",
  'tacoBell': "assets/tacoBell.mp3"
});

let vineButton; //Define click things
let laughButton;
let wowButton;
let bellButton;
let distSlider;

let distObj = new Tone.Distortion(0.5); //Sound effects
soundFX.connect(distObj);
distObj.toDestination();

function setup() {
  createCanvas(400, 400);

  vineButton = createButton('Vine');  //Vine button
  vineButton.position(50, 50);
  vineButton.mousePressed(() => soundFX.player('vineBoom').start());

  laughButton = createButton('Laugh');  //Laugh button
  laughButton.position(300, 50);
  laughButton.mousePressed(() => soundFX.player('clashLaugh').start());

  wowButton = createButton('Wow');  //Wow button
  wowButton.position(50, 300);
  wowButton.mousePressed(() => soundFX.player('rizzWow').start());

  bellButton = createButton('Bell');  //Bell button
  bellButton.position(300, 300);
  bellButton.mousePressed(() => soundFX.player('tacoBell').start());

  distSlider = createSlider(0, 0.9, 0, 0.05); //Slider
  distSlider.position(125, 175);
  distSlider.mouseMoved(() => distObj.distortion = distSlider.value());
}

function draw() {
  background(100, 100, 200);

  fill(255);  //Label
  textSize(25);
  text("Distortion Slider", 105, 170);
}
