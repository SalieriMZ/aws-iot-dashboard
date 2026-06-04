export interface TelemetryPayload {
  deviceId: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  pressure: number;
  status: "online" | "warning" | "offline";
  location: string;
  firmwareVersion: string;
}

export interface DeviceState {
  deviceId: string;
  location: string;
  firmwareVersion: string;
  lastSeen: number;
  status: "online" | "warning" | "offline";
  latestTelemetry: TelemetryPayload | null;
  history: TelemetryPayload[];
}

export interface BrokerConfig {
  mode: "local" | "aws";
  mqtt: {
    port: number;
    host: string;
    protocol: "mqtt" | "mqtts";
    clientId?: string;
    certPath?: string;
    keyPath?: string;
    caPath?: string;
  };
  ws: {
    port: number;
  };
}
