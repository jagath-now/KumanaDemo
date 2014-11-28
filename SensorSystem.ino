// Sensor System
// Kumana IoT Demo Project - ISL
// 2014.11.28

#include <DHT.h>

// Sensor input pins
#define ampPin  A0
#define voltagePin A1
#define luxLevelPin1 A2
#define luxLevelPin2 A3
#define DHTPIN 7
#define DHTTYPE DHT21
#define flowSensorPin 2
#define floatSwitchPin 4

// Variables
float amps = 0;
float voltage = 0;
float luxLevel = 0;
float luxLevel2 = 0;
float humidity = 0;
float temperature = 0;
DHT dht(DHTPIN, DHTTYPE);
int dataFrequency = 3000;

volatile int NbTopsFan; //measuring the rising edges of the signal
int flowRate;
int floatSwitchState;

// Configurable Constants
  
  void setup() {
    Serial.begin(9600);
    dht.begin();
    
    pinMode(flowSensorPin, INPUT); 
    pinMode(floatSwitchPin, INPUT); 
    attachInterrupt(0, rpm, RISING); //Initializing the interrupt is attached
  }

  void loop() {
    
  // Lux Level Calculation
    luxLevel = analogRead(luxLevelPin1);
    luxLevel2 = analogRead(luxLevelPin2);
    luxLevel = (1024 - min(luxLevel,luxLevel2))/1024*100;

   // Temperature 'C
    temperature = dht.readTemperature();

     // Humidity %
    humidity = dht.readHumidity();
   
    // Voltage Calculation
    voltage = (518 - analogRead(voltagePin)) * 75 / 1023; // todo
    // voltage = analogRead(voltagePin);
  
    // Ampearage Calculation - Noise ± 0.03
    amps = (518 - analogRead(ampPin)) * 27.03 / 1023; // todo
    //amps = analogRead(ampPin);
        
    // Flow Rate calculation
    //(Pulse frequency x 60) / 5.5Q, = flow rate in L/hour 
    NbTopsFan = 0;   
    sei();      //Enables interrupts
    delay (1000);   
    cli();      //Disable interrupts
    flowRate = (NbTopsFan * 60 / 5.5); 
    
    // Float Switch signal output
    floatSwitchState = digitalRead(floatSwitchPin);
    
    // Serial Print
    Serial.print(luxLevel);
    Serial.print(",");
    if(isnan(temperature)){ // What will happen if actual temprature is zero
      Serial.print("ERR");
    } else {
      Serial.print(temperature);
    }
    Serial.print(",");
        if(humidity==0.00){
      Serial.print("ERR");
    } else {
      Serial.print(humidity);
    }
    Serial.print(",");
    Serial.print(voltage);
    Serial.print(",");
    Serial.print(amps);
    Serial.print (",");
    Serial.print (flowRate, DEC);
    Serial.print (",");
    Serial.println (floatSwitchState, DEC);

    
    if (Serial.read() != -1) {amps = 0; voltage = 0; luxLevel = 0; temperature = 0; humidity = 0; flowRate = 0; floatSwitchState = 0;}
    delay(dataFrequency);
  }


  //Flow sensor: This is the function that the interupt calls 
  void rpm ()     
  { 
    NbTopsFan++;  //This function measures the rising and falling edge of the hall effect sensors signal
  } 
