import * as dotenv from "dotenv";
import * as path from "path";
import type { BrokerConfig } from "./types";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const mode = (process.env.IOT_MODE || "local") as "local" | "aws";

export function getConfig(): BrokerConfig {
  if (mode === "aws") {
    const endpoint = process.env.AWS_IOT_ENDPOINT;
    if (!endpoint) {
      throw new Error(
        "AWS mode requires AWS_IOT_ENDPOINT in environment variables"
      );
    }
    const certDir =
      process.env.CERTS_DIR || path.resolve(__dirname, "../../certs");
    return {
      mode: "aws",
      mqtt: {
        port: 8883,
        host: endpoint,
        protocol: "mqtts",
        clientId: `iot-dashboard-${Date.now()}`,
        certPath: path.join(certDir, "device-cert.pem"),
        keyPath: path.join(certDir, "private-key.pem"),
        caPath: path.join(certDir, "AmazonRootCA1.pem"),
      },
      ws: {
        port: parseInt(process.env.WS_PORT || "4000", 10),
      },
    };
  }

  // LOCAL mode: embedded Aedes broker
  return {
    mode: "local",
    mqtt: {
      port: parseInt(process.env.MQTT_PORT || "1883", 10),
      host: "localhost",
      protocol: "mqtt",
      clientId: `iot-dashboard-local-${Date.now()}`,
    },
    ws: {
      port: parseInt(process.env.WS_PORT || "4000", 10),
    },
  };
}

export const config = getConfig();
