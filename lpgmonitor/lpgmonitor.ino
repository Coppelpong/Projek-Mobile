#include <Arduino.h>
#include <ESP8266WiFi.h>         
#include <ESP8266HTTPClient.h>
#include "HX711.h"


const char* ssid = "Mini Wammu";                 
const char* password = "2444666668888888";       


const char* backend_host = "192.168.31.112";     
const char* device_id = "68f7053339145d6ed0695bd0";  


String serverURL = String("http://") + backend_host + ":8000/api/readings/" + device_id;

#define DOUT D5
#define CLK  D6
HX711 scale;

float tareWeight = 3.0;      
float maxCapacity = 5.0;     


#define LED_PIN D2
#define BUZZER_PIN D1
#define LOW_GAS_THRESHOLD 15.0  


void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(BUZZER_PIN, LOW);

  Serial.println("\n[INFO] Menghubungkan ke WiFi...");
  WiFi.begin(ssid, password);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 30) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[OK] WiFi terhubung!");
    Serial.print("[IP] Alamat IP ESP8266: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.println("\n[ERROR] Gagal terhubung ke WiFi!");
  }

  scale.begin(DOUT, CLK);
  scale.set_scale();   
  scale.tare();        
  Serial.println("[INFO] Sensor HX711 siap!");
}


void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float weight = scale.get_units(5);
    if (weight < tareWeight) weight = tareWeight;

    float gasWeight = weight - tareWeight;
    if (gasWeight < 0) gasWeight = 0;

    float percent = (gasWeight / maxCapacity) * 100.0;
    if (percent > 100) percent = 100;


    Serial.println("=======================================");
    Serial.print("[TIME] ");
    Serial.println(millis() / 1000);
    Serial.print("[DATA] Berat gas: ");
    Serial.print(gasWeight, 2);
    Serial.print(" kg (");
    Serial.print(percent, 1);
    Serial.println("%)");

    if (percent <= LOW_GAS_THRESHOLD) {
      digitalWrite(BUZZER_PIN, HIGH);
    } else {
      digitalWrite(BUZZER_PIN, LOW);
    }

    if (pingServer()) {
      sendToServer(gasWeight, percent);
    } else {
      Serial.println("[WARN] Backend tidak merespon, menunggu koneksi...");
      blinkError();
    }

    delay(10000);
  } else {
    reconnectWiFi();
  }
}


bool pingServer() {
  WiFiClient client;
  HTTPClient http;
  http.begin(client, String("http://") + backend_host + ":8000/health"); 
  int httpCode = http.GET();
  http.end();
  return (httpCode == 200);
}


void sendToServer(float gasKg, float percent) {
  WiFiClient client;
  HTTPClient http;

  String jsonData = "{\"weightKg\":" + String(gasKg, 2) + ",\"percent\":" + String(percent, 1) + "}";
  http.begin(client, serverURL);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(jsonData);

  if (httpCode > 0) {
    Serial.print("[OK] Server response code: ");
    Serial.println(httpCode);
    String payload = http.getString();
    Serial.println("[RESP] " + payload);


    digitalWrite(LED_PIN, LOW);
    delay(100);
    digitalWrite(LED_PIN, HIGH);
  } else {
    Serial.print("[ERROR] HTTP gagal: ");
    Serial.println(http.errorToString(httpCode).c_str());
    blinkError();
  }

  http.end();
}


void reconnectWiFi() {
  Serial.println("[INFO] WiFi terputus, mencoba ulang...");
  WiFi.reconnect();
  digitalWrite(LED_PIN, LOW);

  for (int i = 0; i < 3; i++) {
    digitalWrite(BUZZER_PIN, HIGH);
    delay(200);
    digitalWrite(BUZZER_PIN, LOW);
    delay(200);
  }
  delay(3000);
}


void blinkError() {
  for (int i = 0; i < 2; i++) {
    digitalWrite(LED_PIN, LOW);
    delay(150);
    digitalWrite(LED_PIN, HIGH);
    delay(150);
  }
}
