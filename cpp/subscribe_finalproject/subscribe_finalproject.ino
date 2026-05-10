#include <AViShaMQTT.h>
const char *ssid = "ppwang";
const char *password = "67676767";
const char *mqtt_server = "ouresomes1.cloud.shiftr.io";
const char *mqtt_user = "ouresomes1";
const char *mqtt_pw = "spckKqjhEpdLCha3";
AViShaMQTT mqtt(ssid, password, mqtt_server, 1883, mqtt_user, mqtt_pw);

const char *PumpTopic = "Ur/Pump";
const char *LampTopic = "Ur/Lamp";
const char *LampSenTopic = "Ur/LampSen";
const char *SwitchTopic = "Ur/Switch";

unsigned long timer, counter = 0, intervalKirim = 1000;

int Lamp = 17;
int Pumper = 25;

void setup() {
  mqtt.begin();
  Serial.begin(115200);
  pinMode(Lamp, OUTPUT);
  pinMode(Pumper, OUTPUT);
  mqtt.subscribe(LampSenTopic, 1);
  mqtt.subscribe(SwitchTopic, 1);
}

void loop() {
  mqtt.loop();
  if (millis() - timer >= intervalKirim) {
    timer = millis();
    String pesan = mqtt.getIncomingMessage();
    String topik = mqtt.getIncomingTopic();
      if (pesan == "Dark"){
        if(topik == LampSenTopic){
          digitalWrite(Lamp, LOW);
          mqtt.publish(LampTopic, "ON");
        }
      }

      if (pesan == "Light") {
        if(topik == LampSenTopic){
          digitalWrite(Lamp, HIGH);  
          mqtt.publish(LampTopic, "OFF");
        }
      }

      if (String(topik) == SwitchTopic){
        if (pesan == "0"){
          digitalWrite(Pumper, HIGH);
          mqtt.publish(PumpTopic, "OFF");
        }
        if (pesan == "1") {
          digitalWrite(Pumper, LOW);
          mqtt.publish(PumpTopic, "ON");
        }
      }
  }
  
  mqtt.subscribe(LampSenTopic, 1);
  mqtt.subscribe(SwitchTopic, 1);
}
