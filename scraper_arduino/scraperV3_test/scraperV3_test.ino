
// defines motor1 pins numbers 
const int dirPin1 = 7;  //green
const int stepPin1 = 8; //yellow
const int enPin1 = 9;   //blue
// defines motor2 pins numbers
const int dirPin2 = 4; //green
const int stepPin2 = 5; //yellow
const int enPin2 = 6; //blue
//test
String s="0";
int rev;
  
void setup() {
  Serial.begin(9600);
  // Sets the two pins as Outputs
  pinMode(stepPin1,OUTPUT); 
  pinMode(dirPin1,OUTPUT);
  pinMode(enPin1,OUTPUT);
  digitalWrite(enPin1,HIGH);

  pinMode(stepPin2,OUTPUT); 
  pinMode(dirPin2,OUTPUT);
  pinMode(enPin2,OUTPUT);
  digitalWrite(enPin2,LOW);

}
void loop() {
  
  digitalWrite(dirPin1,LOW); // Enables the motor1 to move in a particular direction
  digitalWrite(dirPin2,HIGH); // Enables the motor2 to move in a particular direction

  if(Serial.available()){
    Serial.println(s);
    s = Serial.readString();
    Serial.println(s);
    if(s=1){
      //motor_1_action
      digitalWrite(enPin1,LOW);
      Serial.println("motor_1_enabled");
      delay(500);
      Serial.println("motor_1_go");
      for(int rev = 0; rev < 1; rev++) {
        for(long x = 0; x < 50000; x++){
          digitalWrite(stepPin1,HIGH); 
          delayMicroseconds(30); 
          digitalWrite(stepPin1,LOW);
          }
      }
      Serial.println("motor_1_end");
      delay(500);
      digitalWrite(enPin1,HIGH);
      Serial.println("motor_1_disabled");
      delay(500);
      Serial.println(s);
      //motor_2_action
      /*digitalWrite(enPin2,HIGH);
      Serial.println("motor_2_enabled");
      delay(500);
      Serial.println("motor_2_go");
      for(int rev = 0; rev < 50; rev++) {
        for(int x = 0; x < 1600; x++){
          digitalWrite(stepPin2,HIGH); 
          delayMicroseconds(500); 
          digitalWrite(stepPin2,LOW);
          }
      }
      Serial.println("motor_2_end");
      delay(500);
      digitalWrite(enPin2,LOW);
      Serial.println("motor_2_disabled");
      delay(500);*/
      String s="0";
      
    }
    else{
      Serial.println(s);
    }
  }
}
