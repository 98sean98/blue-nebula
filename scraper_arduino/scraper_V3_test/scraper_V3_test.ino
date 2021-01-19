#include <TimerOne.h>
int rev;
uint8_t inByte = 0;
int pulsePerRevolution = 140;
long count;

class Motors{
  int dirPin1;
  int stepPin1;
  int enPin1;

  int lastState;
  unsigned long previousMillis;
  
  public:
  Motors(int dirPin, int stepPin, int enPin){
    dirPin1 = dirPin;
    stepPin1 = stepPin;
    enPin1 = enPin;
    lastState = LOW;
    previousMillis = 0;
    pinMode(stepPin1,OUTPUT); 
    pinMode(dirPin1,OUTPUT);
    pinMode(enPin1,OUTPUT);
    digitalWrite(enPin1,HIGH);
  }

  void Spin(int motorSpeed,float revolution, int dir){
    digitalWrite(enPin1,LOW);
    digitalWrite(dirPin1,dir);
    delay(500);
      for(int rev = 0; rev < revolution; rev++) {
        for(int x = 0; x < pulsePerRevolution; ){
          unsigned long currentMillis = micros();
          //Serial.println(currentMillis - previousMillis);
          if((currentMillis - previousMillis > motorSpeed)&& (lastState == LOW&& inByte != 0)){
            lastState = HIGH;
            previousMillis = currentMillis;
            digitalWrite(stepPin1,HIGH);
            x++;
            }
          else if((currentMillis - previousMillis > motorSpeed)&& (lastState == HIGH)&& inByte != 0){
            lastState = LOW;
            previousMillis = currentMillis;
            digitalWrite(stepPin1,LOW);
            }
          else if(inByte == 0){
            break;
            
          }
        }
      }
      inByte = 0;
      Serial.println(count);
  }
  
};
//Setup motor pins (DIR, STEP, EN)
Motors stepMotor1(7,8,9);
Motors stepMotor2(4,5,6);

void setup() {
  Serial.begin(9600);
  Timer1.initialize(1000);
  Timer1.attachInterrupt(BTpull);

}

void BTpull(){
  if(Serial.available() > 0){
    inByte = Serial.read();
    }
}

void loop() {

  if(Serial.available() > 0){
    inByte = Serial.read();
    Serial.println(inByte);
    switch (inByte){
      case 0:
        Serial.println("Stopped");
        break;
      case 1://A
        Serial.println("running programme A...");
        //stepMotor1.Spin(200,20,HIGH);
        stepMotor2.Spin(1000,11,HIGH);//(Speed, Degrees, Direction)
        Serial.println("ending programme A...");
      break;
    case 2://B
        Serial.println("running programme B...");
        stepMotor1.Spin(100,360,HIGH);
        Serial.println("ending programme B...");
      break;
    case 3://C
      Serial.println("running programme C...");
      stepMotor1.Spin(200,45,LOW);
      Serial.println("ending programme C...");
      break;
    case 4://D
      Serial.println("running programme D...");
      stepMotor1.Spin(100,45,HIGH);
      Serial.println("ending programme D...");
      break;
    }
    }
  }
