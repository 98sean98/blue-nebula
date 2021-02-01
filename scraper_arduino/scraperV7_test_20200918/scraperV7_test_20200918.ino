#include <TimerOne.h>
int rev;
uint8_t inByte = 0;
int pulsePerRevolution = 140;
long count;

class Motors{
  int dirPin1;
  int stepPin1;
  int enPin1;
  int dirPin2;
  int stepPin2;
  int enPin2;

  unsigned long previousMillis;
  
  public:
  Motors(int M1dirPin, int M1stepPin, int M1enPin, int M2dirPin, int M2stepPin, int M2enPin){
    dirPin1 = M1dirPin;
    stepPin1 = M1stepPin;
    enPin1 = M1enPin;
    dirPin2 = M2dirPin;
    stepPin2 = M2stepPin;
    enPin2 = M2enPin;
    previousMillis = 0;
    pinMode(stepPin1,OUTPUT); 
    pinMode(dirPin1,OUTPUT);
    pinMode(enPin1,OUTPUT);
    pinMode(stepPin2,OUTPUT); 
    pinMode(dirPin2,OUTPUT);
    pinMode(enPin2,OUTPUT);
  }

  void Spin(int M1pulseInterval,float M1revolution, int M1dir, uint8_t M1enable, int M2pulseInterval,float M2revolution, int M2dir, uint8_t M2enable){
    //----------------------------------
    //Declare M1 varibles:
    digitalWrite(enPin1,M1enable);
    digitalWrite(dirPin1,M1dir);
    unsigned int M1totalPulse = M1revolution*pulsePerRevolution;
    unsigned int M1completedPulse;
    unsigned int M1previousMillis;
    int M1lastState;
    //--
    //M2:
    digitalWrite(enPin2,M2enable);
    digitalWrite(dirPin2,M2dir);
    unsigned int M2totalPulse = M2revolution*pulsePerRevolution;
    unsigned int M2completedPulse;
    unsigned int M2previousMillis;
    int M2lastState;
    //---------------------------------
    //Pulsing:
    while (inByte != 0 && M1completedPulse < M1totalPulse && M2completedPulse < M2totalPulse){
      unsigned long currentMillis = micros();
      if (M1completedPulse < M1totalPulse){
          if((currentMillis - M1previousMillis > M1pulseInterval)&& (M1lastState == LOW&& inByte != 0)){
            M1lastState = HIGH;
            M1previousMillis = currentMillis;
            digitalWrite(stepPin1,HIGH);
            M1completedPulse++;
            }
          else if((currentMillis - M1previousMillis > M1pulseInterval)&& (M1lastState == HIGH)&& inByte != 0){
            M1lastState = LOW;
            M1previousMillis = currentMillis;
            digitalWrite(stepPin1,LOW);
            M1completedPulse++;
            }
          else if(inByte == 0){
            M1completedPulse = M1totalPulse;  
            }
         }
     //--------------------
     //M2:
      if (M2completedPulse < M2totalPulse){
          if((currentMillis - M2previousMillis > M2pulseInterval)&& (M2lastState == LOW&& inByte != 0)){
            M2lastState = HIGH;
            M2previousMillis = currentMillis;
            digitalWrite(stepPin1,HIGH);
            M2completedPulse++;
            }
          else if((currentMillis - M2previousMillis > M2pulseInterval)&& (M2lastState == HIGH)&& inByte != 0){
            M2lastState = LOW;
            M2previousMillis = currentMillis;
            digitalWrite(stepPin1,LOW);
            M2completedPulse++;
            }
          else if(inByte == 0){
            M2completedPulse = M2totalPulse;  
            }
         }
    }
    digitalWrite(enPin1,!M1enable);
    digitalWrite(enPin2,!M2enable);
  }
  
};
//Setup motor pins (DIR1, STEP1, EN1,DIR2, STEP2, EN2)
Motors stepMotor1(7,8,9,4,5,6);

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
        Serial.println("RunA");
        stepMotor1.Spin(100,300,HIGH, HIGH, 1000,360,LOW, HIGH);
        //(M1Speed, M1Degrees, M1Direction, M1Enable(initial), M2Speed, M2Degrees, M2Direction, M2Enable(initial))
        Serial.println("EndA");
      break;
    case 2://B
        Serial.println("RunB");
        stepMotor1.Spin(100,360,HIGH, LOW, 100,360,LOW, HIGH);
        Serial.println("EndB");
      break;
    case 3://C
      Serial.println("RunC");
       stepMotor1.Spin(100,360,HIGH, LOW, 100,360,LOW, HIGH);
      Serial.println("EndC");
      break;
    case 4://D
      Serial.println("RunD");
      stepMotor1.Spin(100,360,HIGH, LOW, 100,360,LOW, HIGH);
      Serial.println("EndD");
      break;
    }
    }
  }
