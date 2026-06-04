export interface DeviceProfile {
  id: string;
  name: string;
  location: string;
  firmwareVersion: string;
  // Temperature range (Celsius)
  tempBase: number;
  tempAmplitude: number;
  // Humidity range (%)
  humidBase: number;
  humidAmplitude: number;
  // Pressure range (hPa)
  pressureBase: number;
  pressureAmplitude: number;
  // How often it publishes (ms)
  intervalMs: number;
  // Warning threshold: if temp > this, status = warning
  tempWarnThreshold: number;
}

export const DEVICE_PROFILES: DeviceProfile[] = [
  {
    id: "device-001",
    name: "Sensor Santiago Centro",
    location: "Santiago, RM",
    firmwareVersion: "2.4.1",
    tempBase: 22,
    tempAmplitude: 8,
    humidBase: 55,
    humidAmplitude: 20,
    pressureBase: 1013,
    pressureAmplitude: 5,
    intervalMs: 3000,
    tempWarnThreshold: 28,
  },
  {
    id: "device-002",
    name: "Sensor Valparaíso Puerto",
    location: "Valparaíso, V",
    firmwareVersion: "2.4.0",
    tempBase: 18,
    tempAmplitude: 6,
    humidBase: 75,
    humidAmplitude: 15,
    pressureBase: 1015,
    pressureAmplitude: 8,
    intervalMs: 4000,
    tempWarnThreshold: 26,
  },
  {
    id: "device-003",
    name: "Sensor Antofagasta Desierto",
    location: "Antofagasta, II",
    firmwareVersion: "2.3.9",
    tempBase: 28,
    tempAmplitude: 12,
    humidBase: 30,
    humidAmplitude: 10,
    pressureBase: 1010,
    pressureAmplitude: 3,
    intervalMs: 5000,
    tempWarnThreshold: 35,
  },
  {
    id: "device-004",
    name: "Sensor Punta Arenas Sur",
    location: "Punta Arenas, XII",
    firmwareVersion: "2.4.1",
    tempBase: 6,
    tempAmplitude: 5,
    humidBase: 80,
    humidAmplitude: 10,
    pressureBase: 1005,
    pressureAmplitude: 12,
    intervalMs: 3500,
    tempWarnThreshold: 15,
  },
];
