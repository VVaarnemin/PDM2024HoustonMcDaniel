#include <Arduino_JSON.h>

const int joyXPin = A0;
const int joyYPin = A1;
const int switchPin = 3;
const int buttonPin = 5;
const int ledPin = 7;
int buttonState = 0;
const int maxCalibrationFrames = 3;

float xValue, yValue;
int startX, startY;
float pXValue = -1, pYValue = -1;
float alpha = 0.2;
int calibrationFrames = 0;

JSONVar sensorData;
bool active;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(38400);

  pinMode(switchPin, INPUT);
  pinMode(buttonPin, INPUT);
  pinMode(ledPin, OUTPUT);
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
        active = (bool) serialInput["active"];
      }
    }
  }

  if (active) {
    digitalWrite(ledPin, HIGH);
  } else {
    digitalWrite(ledPin, LOW);
  }

  xValue = analogRead(joyXPin);
  yValue = analogRead(joyYPin);
  buttonState = digitalRead(buttonPin);

  if (pXValue == -1) {
    pXValue = xValue;
    pYValue = yValue;
  }

  xValue = pXValue + alpha*(xValue - pXValue);
  yValue = pYValue + alpha*(yValue - pYValue);
  
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