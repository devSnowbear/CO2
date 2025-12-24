#include <Wire.h>
#include <SensirionI2cScd30.h>
#include <LiquidCrystal_I2C.h>
#include <RTClib.h>
#include <SD.h>
#include <SPI.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

// WiFi credentials
#define WIFI_SSID "akonwifi"
#define WIFI_PASSWORD "12345678"

// Firebase credentials
#define FIREBASE_HOST "https://fir-4343a-default-rtdb.asia-southeast1.firebasedatabase.app/"
#define FIREBASE_AUTH "lTWmL3Zg2MVILppH7B3E1wqW7edRIdxRTD7sMK0C"

SensirionI2cScd30 scd30;
LiquidCrystal_I2C lcd(0x27, 20, 4);
RTC_DS3231 rtc;

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

const int chipSelect = 5;
const int buzzerPin = 25;
const int ledPin = 26;
const int CO2_THRESHOLD = 5000;

File dataFile;

void setup() {
  Serial.begin(115200);
  Wire.begin();

  pinMode(buzzerPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);
  digitalWrite(ledPin, LOW);

  Serial.println("Initializing system...");
  lcd.begin();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");

  // --- Initialize WiFi ---
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to WiFi");
  lcd.setCursor(0, 1);
  lcd.print("Connecting WiFi...");
  
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  
  Serial.println("\nWiFi connected");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());
  lcd.setCursor(0, 1);
  lcd.print("WiFi Connected    ");

  // --- Initialize Firebase ---
  config.database_url = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Serial.println("Firebase initialized");

  // --- Initialize RTC ---
  if (!rtc.begin()) {
    Serial.println("RTC not found!");
    lcd.setCursor(0, 2);
    lcd.print("RTC Error");
    while (1);
  }
  if (rtc.lostPower()) {
    Serial.println("RTC lost power, resetting time.");
    rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
  }

  // --- Initialize SD Card ---
  if (!SD.begin(chipSelect)) {
    Serial.println("SD card initialization failed!");
    lcd.setCursor(0, 2);
    lcd.print("SD Card Error");
    while (1);
  }

  if (!SD.exists("/data.csv")) {
    Serial.println("Creating data.csv...");
    dataFile = SD.open("/data.csv", FILE_WRITE);
    if (dataFile) {
      dataFile.println("Timestamp,CO2(ppm),Temperature(C),Humidity(%)");
      dataFile.close();
      Serial.println("Header written to data.csv");
    } else {
      Serial.println("Failed to create data.csv!");
      lcd.setCursor(0, 2);
      lcd.print("File Error");
      while (1);
    }
  }

  // --- Initialize SCD30 Sensor ---
  scd30.begin(Wire, 0x61);
  uint16_t error = scd30.startPeriodicMeasurement(0);
  if (error) {
    Serial.print("SCD30 start error: ");
    Serial.println(error);
    lcd.setCursor(0, 1);
    lcd.print("SCD30 Error");
    while (1);
  }

  lcd.clear();
  lcd.print("System Ready!");
  Serial.println("Setup complete.");
  delay(2000);
  lcd.clear();
}

void loop() {
  uint16_t dataReady = 0;
  uint16_t error = scd30.getDataReady(dataReady);

  if (error) {
    Serial.print("DataReady error: ");
    Serial.println(error);
    delay(2000);
    return;
  }

  if (dataReady) {
    float co2, temp, humid;
    error = scd30.readMeasurementData(co2, temp, humid);
    if (error) {
      Serial.print("Read error: ");
      Serial.println(error);
      delay(2000);
      return;
    }

    // Get timestamp from RTC
    DateTime now = rtc.now();
    char timestamp[25];
    snprintf(timestamp, sizeof(timestamp), "%04d-%02d-%02d %02d:%02d:%02d",
             now.year(), now.month(), now.day(),
             now.hour(), now.minute(), now.second());

    // Get Unix timestamp (epoch time in milliseconds)
    unsigned long epochTime = now.unixtime();
    unsigned long epochMillis = epochTime * 1000UL;

    // Serial monitor output
    Serial.print(timestamp);
    Serial.print(", CO2: ");
    Serial.print(co2, 0);
    Serial.print(" ppm, Temp: ");
    Serial.print(temp, 1);
    Serial.print(" C, Hum: ");
    Serial.print(humid, 1);
    Serial.println(" %");

    // --- Check CO2 threshold and trigger buzzer/LED ---
    if (co2 > CO2_THRESHOLD) {
      digitalWrite(buzzerPin, HIGH);
      digitalWrite(ledPin, HIGH);
      Serial.println("WARNING: CO2 level exceeded 5000 ppm!");
    } else {
      digitalWrite(buzzerPin, LOW);
      digitalWrite(ledPin, LOW);
    }

    // LCD output
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("CO2  : ");
    lcd.print(co2, 0);
    lcd.print(" ppm");
    
    if (co2 > CO2_THRESHOLD) {
      lcd.setCursor(17, 0);
      lcd.print("!!!");
    }
    
    lcd.setCursor(0, 1);
    lcd.print("Temp : ");
    lcd.print(temp, 1);
    lcd.print(" C");
    lcd.setCursor(0, 2);
    lcd.print("Hum  : ");
    lcd.print(humid, 1);
    lcd.print(" %");
    lcd.setCursor(0, 3);
    
    if (now.hour() < 10) lcd.print("0");
    lcd.print(now.hour());
    lcd.print(":");
    if (now.minute() < 10) lcd.print("0");
    lcd.print(now.minute());
    lcd.print(":");
    if (now.second() < 10) lcd.print("0");
    lcd.print(now.second());

    // --- Write to CSV ---
    dataFile = SD.open("/data.csv", FILE_APPEND);
    if (dataFile) {
      dataFile.print(timestamp);
      dataFile.print(",");
      dataFile.print(co2, 0);
      dataFile.print(",");
      dataFile.print(temp, 1);
      dataFile.print(",");
      dataFile.println(humid, 1);
      dataFile.close();
      Serial.println("Data logged to data.csv");
    } else {
      Serial.println("Failed to open data.csv for writing!");
    }

    // --- Send to Firebase Realtime Database ---
    if (Firebase.ready()) {
      String path = "/sensorData/" + String(epochMillis);
      
      FirebaseJson json;
      json.set("co2", co2);
      json.set("humidity", humid);
      json.set("temperature", temp);
      json.set("timestamp", timestamp);

      if (Firebase.RTDB.setJSON(&fbdo, path.c_str(), &json)) {
        Serial.println("✓ Data sent to Firebase RTDB");
        // REMOVED: Don't update lastFirestoreWrite here!
        // Let the Firebase Function handle it every 15 minutes
      } else {
        Serial.print("✗ Firebase error: ");
        Serial.println(fbdo.errorReason());
      }
    }   
  }

  delay(15000); // Send data every 15 seconds
}