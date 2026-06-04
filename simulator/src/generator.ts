import type { DeviceProfile } from "./devices";

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

// Gaussian noise for realistic sensor readings
function gaussianNoise(mean: number, amplitude: number): number {
  const u1 = Math.random();
  const u2 = Math.random();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * (amplitude * 0.3);
}

// Slow sinusoidal drift simulating day/night cycle
function sineDrift(amplitude: number, periodMs: number): number {
  return amplitude * Math.sin((Date.now() / periodMs) * 2 * Math.PI);
}

export function generateTelemetry(profile: DeviceProfile): TelemetryPayload {
  const dayPeriodMs = 30 * 1000; // 30s simulates a "day" for demo purposes

  const temperature = parseFloat(
    (
      gaussianNoise(profile.tempBase, profile.tempAmplitude) +
      sineDrift(profile.tempAmplitude * 0.5, dayPeriodMs)
    ).toFixed(2)
  );

  const humidity = parseFloat(
    Math.min(
      100,
      Math.max(
        0,
        gaussianNoise(profile.humidBase, profile.humidAmplitude) -
          sineDrift(profile.humidAmplitude * 0.3, dayPeriodMs)
      )
    ).toFixed(2)
  );

  const pressure = parseFloat(
    gaussianNoise(profile.pressureBase, profile.pressureAmplitude).toFixed(2)
  );

  const status: "online" | "warning" =
    temperature > profile.tempWarnThreshold ? "warning" : "online";

  return {
    deviceId: profile.id,
    timestamp: Date.now(),
    temperature,
    humidity,
    pressure,
    status,
    location: profile.location,
    firmwareVersion: profile.firmwareVersion,
  };
}
