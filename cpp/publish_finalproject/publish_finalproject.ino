#include <AViShaMQTT.h>
#include <DHTesp.h>
const char *ssid = "ppwang";
const char *password = "67676767";
const char *mqtt_server = "ouresomes1.cloud.shiftr.io";
const char *mqtt_user = "ouresomes1";
const char *mqtt_pw = "spckKqjhEpdLCha3";
AViShaMQTT mqtt(ssid, password, mqtt_server, 1883, mqtt_user, mqtt_pw);

const char *GasTopic = "Ur/Gas";
const char *TempTopic = "Ur/Temp";
const char *HumidTopic = "Ur/Humid";
const char *SoilTopic = "Ur/Soil";
const char *LightTopic = "Ur/Light";
const char *LampSenTopic = "Ur/LampSen";

unsigned long timer, counter = 0, intervalKirim = 1000;

int ldr = 34;
int mq2 = 36;
int soil = 35;
DHTesp dhtSensor;

void setup() {
  mqtt.begin();
  Serial.begin(9600);
  Serial.println("Hello, ESP32!");
  dhtSensor.setup(25, DHTesp::DHT22);
}

void loop() {
  mqtt.loop();
  TempAndHumidity data = dhtSensor.getTempAndHumidity ();
  mq2 = analogRead(36);
  ldr = analogRead(34);
  soil = analogRead(35);
  Serial.println("Temp: " + String(data.temperature, 2) + "°C ");
  Serial.println("Humidity: " + String(data.humidity, 1) + "%");
  Serial.println("Gas: " + String(mq2));
  Serial.println("Light: " + String(ldr));
  Serial.println("Soil Moist: " + String(soil));
  Serial.println("-----");
  delay(1000);

  if (ldr > 3000) {
    mqtt.publish(LampSenTopic, "Dark");
  }

  else {
    mqtt.publish(LampSenTopic, "Light");
  }

  if (millis() - timer >= intervalKirim) {
    timer = millis();
    mqtt.publish(GasTopic, String(mq2));
    mqtt.publish(SoilTopic, String(soil));
    mqtt.publish(LightTopic, String(ldr));
    mqtt.publish(TempTopic, String(data.temperature, 2));
    mqtt.publish(HumidTopic, String(data.humidity, 1));
  }
}
