import type { DeviceState, TelemetryPayload } from "./types";

const MAX_HISTORY = 60; // keep last 60 data points per device

class DeviceStore {
  private devices = new Map<string, DeviceState>();

  update(payload: TelemetryPayload): DeviceState {
    const existing = this.devices.get(payload.deviceId);

    if (existing) {
      const history = [...existing.history, payload].slice(-MAX_HISTORY);
      const updated: DeviceState = {
        ...existing,
        lastSeen: payload.timestamp,
        status: payload.status,
        latestTelemetry: payload,
        history,
      };
      this.devices.set(payload.deviceId, updated);
      return updated;
    }

    const newDevice: DeviceState = {
      deviceId: payload.deviceId,
      location: payload.location,
      firmwareVersion: payload.firmwareVersion,
      lastSeen: payload.timestamp,
      status: payload.status,
      latestTelemetry: payload,
      history: [payload],
    };
    this.devices.set(payload.deviceId, newDevice);
    return newDevice;
  }

  getAll(): DeviceState[] {
    return Array.from(this.devices.values());
  }

  get(deviceId: string): DeviceState | undefined {
    return this.devices.get(deviceId);
  }

  markStale(thresholdMs = 15000): void {
    const now = Date.now();
    this.devices.forEach((device, id) => {
      if (now - device.lastSeen > thresholdMs && device.status !== "offline") {
        this.devices.set(id, { ...device, status: "offline" });
      }
    });
  }
}

export const deviceStore = new DeviceStore();
