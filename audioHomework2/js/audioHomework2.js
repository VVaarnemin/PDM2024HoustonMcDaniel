const synth = new Tone.PolySynth(Tone.Synth); //Setting up variables
const bend = new Tone.PitchShift();
const delay = new Tone.PingPongDelay(0);
const reverb = new Tone.Reverb(0);

synth.connect(bend);  //Connecting effects to output
bend.connect(delay);
delay.connect(reverb);
reverb.toDestination();

let notes = { //Defining notes
  'a': 'C4',
  's': 'D4',
  'd': 'E4',
  'f': 'f4',
  'g': 'g4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5',
  'l': 'D5'
}

function setup() {
  createCanvas(400, 400);
  
  pitchSlider = createSlider (0., 12., 0.01, 1);  //Slider
  pitchSlider.position (125,150);
  pitchSlider.mouseMoved(() => {
    bend.pitch = pitchSlider.value();
  })

  delaySlider = createSlider ( 0, "16n", 0, 0.1); //Slider
  delaySlider.position (125,200);
  delaySlider.mouseMoved(() => {
    delay.delayTime.value = delaySlider.value();
  })

  rvrbSlider = createSlider (0, 1, 0, 0.001); //Slider
  rvrbSlider.position (125,250);
  rvrbSlider.mouseMoved(() => {
    reverb.decay = rvrbSlider.value();
  })
}

function keyPressed() { //Note playing functions
  let playNotes = notes[key];
  synth.triggerAttack(playNotes);
}

function keyReleased() {
  let playNotes = notes[key];
  synth.triggerRelease(playNotes, '+0.03');
}

function draw() {
  background(0, 120, 300);

  fill(0);
  rect(20, 20, 360, 360);

  fill(255);
  text("Notes A - L", 125, 100);
  text ('Pitchbend', 50, 155);
  text("Ping pong", 50, 205);
  text("Reverb", 50, 255);
}