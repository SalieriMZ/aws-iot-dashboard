import * as mqtt from "mqtt";
import * as path from "path";
import * as fs from "fs";
import * as dotenv from "dotenv";
import { DEVICE_PROFILES } from "./devices";
import { generateTelemetry } from "./generator";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mode = (process.env.IOT_MODE || "local") as "local" | "aws";
const mqttPort = process.env.MQTT_PORT || "1883";
const awsEndpoint = process.env.AWS_IOT_ENDPOINT || "";
const certsDir = process.env.CERTS_DIR || path.resolve(__dirname, "../../certs");

function buildMqttOptions(): { url: string; options: mqtt.IClientOptions } {
  if (mode === "aws") {
    if (!awsEndpoint) throw new Error("AWS_IOT_ENDPOINT not set");
    return {
      url: `mqtts://${awsEndpoint}:8883`,
      options: {
        clientId: `simulator-${Date.now()}`,
        cert: fs.readFileSync(path.join(certsDir, "device-cert.pem")),
        key: fs.readFileSync(path.join(certsDir, "private-key.pem")),
        ca: fs.readFileSync(path.join(certsDir, "AmazonRootCA1.pem")),
        protocol: "mqtts",
        clean: true,
      },
    };
  }

  return {
    url: `mqtt://localhost:${mqttPort}`,
    options: {
      clientId: `simulator-local-${Date.now()}`,
      clean: true,
      reconnectPeriod: 2000,
    },
  };
}

async function main() {
  console.log(`\n=== AWS IoT Device Simulator ===`);
  console.log(`Mode: ${mode.toUpperCase()}`);
  console.log(`Devices: ${DEVICE_PROFILES.length}`);
  console.log(`================================\n`);

  const { url, options } = buildMqttOptions();
  console.log(`[Simulator] Connecting to ${url}`);

  const client = mqtt.connect(url, options);
  const intervals: NodeJS.Timeout[] = [];

  client.on("connect", () => {
    console.log("[Simulator] Connected to MQTT broker\n");

    for (const profile of DEVICE_PROFILES) {
      console.log(
        `[Simulator] Starting device ${profile.id} @ ${profile.intervalMs}ms intervals`
      );

      // Publish immediately on start
      const publish = () => {
        const telemetry = generateTelemetry(profile);
        const topic = `devices/${profile.id}/telemetry`;
        const payload = JSON.stringify(telemetry);

        client.publish(topic, payload, { qos: 1 }, (err) => {
          if (err) {
            console.error(`[${profile.id}] Publish error:`, err.message);
          } else {
            const statusIcon =
              telemetry.status === "warning"
                ? "WARN"
                : "OK";
            console.log(
              `[${profile.id}] ${statusIcon} | ` +
                `Temp: ${telemetry.temperature}°C | ` +
                `Hum: ${telemetry.humidity}% | ` +
                `Pressure: ${telemetry.pressure}hPa`
            );
          }
        });
      };

      publish();
      const interval = setInterval(publish, profile.intervalMs);
      intervals.push(interval);
    }
  });

  client.on("error", (err) => {
    console.error("[Simulator] MQTT error:", err.message);
  });

  client.on("reconnect", () => {
    console.log("[Simulator] Reconnecting...");
  });

  const shutdown = () => {
    console.log("\n[Simulator] Shutting down...");
    intervals.forEach(clearInterval);
    client.end(true, () => {
      console.log("[Simulator] Disconnected.");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("[Simulator] Fatal:", err);
  process.exit(1);
});
