import * as mqtt from "mqtt";
import * as fs from "fs";
import type { BrokerConfig, TelemetryPayload } from "./types";
import { deviceStore } from "./deviceStore";

export type TelemetryHandler = (payload: TelemetryPayload) => void;

export function createMqttSubscriber(
  cfg: BrokerConfig,
  onTelemetry: TelemetryHandler
): mqtt.MqttClient {
  const connectUrl =
    cfg.mode === "aws"
      ? `mqtts://${cfg.mqtt.host}:${cfg.mqtt.port}`
      : `mqtt://${cfg.mqtt.host}:${cfg.mqtt.port}`;

  const mqttOptions: mqtt.IClientOptions = {
    clientId: cfg.mqtt.clientId,
    clean: true,
    reconnectPeriod: 3000,
  };

  if (cfg.mode === "aws" && cfg.mqtt.certPath && cfg.mqtt.keyPath && cfg.mqtt.caPath) {
    mqttOptions.cert = fs.readFileSync(cfg.mqtt.certPath);
    mqttOptions.key = fs.readFileSync(cfg.mqtt.keyPath);
    mqttOptions.ca = fs.readFileSync(cfg.mqtt.caPath);
    mqttOptions.protocol = "mqtts";
    console.log(`[MQTT] Connecting to AWS IoT Core at ${cfg.mqtt.host}`);
  } else {
    console.log(
      `[MQTT] Connecting to local broker at ${cfg.mqtt.host}:${cfg.mqtt.port}`
    );
  }

  const client = mqtt.connect(connectUrl, mqttOptions);

  client.on("connect", () => {
    console.log("[MQTT] Connected. Subscribing to devices/+/telemetry");
    client.subscribe("devices/+/telemetry", { qos: 1 }, (err) => {
      if (err) console.error("[MQTT] Subscribe error:", err);
      else console.log("[MQTT] Subscribed to devices/+/telemetry");
    });
  });

  client.on("message", (topic: string, message: Buffer) => {
    try {
      const raw = JSON.parse(message.toString()) as TelemetryPayload;
      // Validate minimum fields
      if (!raw.deviceId || raw.temperature === undefined) {
        console.warn(`[MQTT] Invalid payload on ${topic}`);
        return;
      }
      const updated = deviceStore.update(raw);
      onTelemetry(updated.latestTelemetry!);
    } catch (err) {
      console.error(`[MQTT] Failed to parse message on ${topic}:`, err);
    }
  });

  client.on("error", (err) => {
    console.error("[MQTT] Error:", err.message);
  });

  client.on("reconnect", () => {
    console.log("[MQTT] Reconnecting...");
  });

  return client;
}
