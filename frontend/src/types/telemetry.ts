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

export interface TelemetryUpdate {
  deviceId: string;
  telemetry: TelemetryPayload;
  device: DeviceState;
}

export const THRESHOLDS = {
  temperature: { warn: 28, critical: 35 },
  humidity: { warn: 85, low: 20 },
  pressure: { low: 1000, high: 1025 },
} as const;
