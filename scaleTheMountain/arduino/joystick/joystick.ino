#include <Arduino_JSON.h>

const int joyXPin = A0;
const int joyYPin = A1;
const int switchPin = 3;
const int buttonPin = 5;
const int redPin = 11;
const int greenPin = 12;
const int bluePin = 13;
int buttonState = 0;
const int maxCalibrationFrames = 3;

float xValue, yValue;
int startX, startY;
float pXValue = -1, pYValue = -1;
float alpha = 0.2;
int calibrationFrames = 0;

JSONVar sensorData;
int health;

void setColor(int r, int g, int b) {
  analogWrite(redPin, r);
  analogWrite(greenPin, g);
  analogWrite(bluePin, b);
}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(38400);

  pinMode(switchPin, INPUT);
  pinMode(buttonPin, INPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  digitalWrite(switchPin, HIGH);
}

void loop() {
  if (Serial.available() > 0) {
    String jsonString = Serial.readStringUntil("\n");
    if (jsonString != '\n') {
      JSONVar serialInput = JSON.parse(jsonString);

      if (JSON.typeof(serialInput) == "undefined") {
        Serial.println("JSON parsing failed!");
      } else {
        health = (int) serialInput["health"];
      }
    }
  }

  if (health == 3) {
    setColor(0, 0, 255);
  } else if (health == 2) {
    setColor(0, 255, 0);
  } else if (health == 1) {
    setColor(255, 0, 0);
  } else {
    setColor(0, 0, 0);
  }

  xValue = analogRead(joyXPin);
  yValue = analogRead(joyYPin);
  buttonState = digitalRead(buttonPin);

  /*/
  if (pXValue == -1) {
    pXValue = xValue;
    pYValue = yValue;
  }

  xValue = pXValue + alpha*(xValue - pXValue);
  yValue = pYValue + alpha*(yValue - pYValue);
  /*/
  
  if (calibrationFrames < maxCalibrationFrames) {
    calibrationFrames++;
    startX = xValue;
    startY = yValue;
  }
  else {
    sensorData["x"] = (int) (xValue - startX);
    sensorData["y"] = (int) (yValue - startY);
    sensorData["sw"] = (int) buttonState;

    Serial.println(sensorData);
  }

  pXValue = xValue;
  pYValue = yValue;
}