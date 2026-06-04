import { config } from "./config";
import { startLocalBroker } from "./localBroker";
import { createMqttSubscriber } from "./mqttSubscriber";
import { createWsServer, broadcastTelemetry } from "./wsServer";

async function main() {
  console.log(`\n=== AWS IoT Telemetry Dashboard - Broker ===`);
  console.log(`Mode: ${config.mode.toUpperCase()}`);
  console.log(`MQTT port: ${config.mqtt.port}`);
  console.log(`WebSocket port: ${config.ws.port}`);
  console.log(`============================================\n`);

  let localBrokerHandle: Awaited<ReturnType<typeof startLocalBroker>> | null =
    null;

  if (config.mode === "local") {
    // Start embedded Aedes broker
    localBrokerHandle = await startLocalBroker(config.mqtt.port);
  }

  // Start WebSocket/HTTP server
  const { io, close: closeWs } = createWsServer(config.ws.port);

  // Connect MQTT subscriber (to local Aedes or AWS IoT Core)
  const mqttClient = createMqttSubscriber(config, (telemetry) => {
    broadcastTelemetry(io, telemetry);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`\n[Main] Received ${signal}. Shutting down gracefully...`);
    mqttClient.end(true);
    await closeWs();
    if (localBrokerHandle) {
      await localBrokerHandle.close();
    }
    console.log("[Main] Shutdown complete.");
    process.exit(0);
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  console.error("[Main] Fatal error:", err);
  process.exit(1);
});
