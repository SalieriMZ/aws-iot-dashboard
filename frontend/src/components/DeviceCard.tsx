import { useState } from "react";
import type { DeviceState } from "../types/telemetry";
import { THRESHOLDS } from "../types/telemetry";
import { MetricRow } from "./MetricRow";
import { TelemetryChart } from "./TelemetryChart";
import { formatTemp, formatHumidity, formatPressure, formatRelativeTime, clamp } from "../utils/format";

interface Props {
  device: DeviceState;
}

const STATUS_LABELS: Record<DeviceState["status"], string> = {
  online: "En línea",
  warning: "Advertencia",
  offline: "Fuera de línea",
};

export function DeviceCard({ device }: Props) {
  const [showPressure, setShowPressure] = useState(false);
  const t = device.latestTelemetry;

  const tempAlert = t ? t.temperature > THRESHOLDS.temperature.warn : false;
  const humidAlert = t ? t.humidity > THRESHOLDS.humidity.warn || t.humidity < THRESHOLDS.humidity.low : false;

  const isAlert = device.status === "warning" || tempAlert || humidAlert;

  return (
    <article className={`device-card device-card--${device.status} ${isAlert ? "device-card--alert-glow" : ""}`}>
      <header className="device-card__header">
        <div className="device-card__title-group">
          <span
            className="device-status-dot"
            aria-label={STATUS_LABELS[device.status]}
            title={STATUS_LABELS[device.status]}
          />
          <div>
            <h2 className="device-card__id">{device.deviceId}</h2>
            <p className="device-card__location">{device.location}</p>
          </div>
        </div>
        <div className="device-card__meta">
          <span className={`device-badge device-badge--${device.status}`}>
            {STATUS_LABELS[device.status]}
          </span>
          <span className="device-seen">
            {formatRelativeTime(device.lastSeen)}
          </span>
        </div>
      </header>

      {t ? (
        <>
          <div className="device-card__metrics">
            <MetricRow
              label="Temperatura"
              value={formatTemp(t.temperature)}
              alert={tempAlert}
              alertMessage={`Por encima del umbral (${THRESHOLDS.temperature.warn}°C)`}
              barPercent={clamp((t.temperature / 50) * 100, 0, 100)}
              barColor={
                t.temperature > THRESHOLDS.temperature.critical
                  ? "oklch(55% 0.22 25)"
                  : t.temperature > THRESHOLDS.temperature.warn
                  ? "oklch(70% 0.18 55)"
                  : "oklch(55% 0.18 150)"
              }
            />
            <MetricRow
              label="Humedad"
              value={formatHumidity(t.humidity)}
              alert={humidAlert}
              alertMessage={
                t.humidity > THRESHOLDS.humidity.warn
                  ? "Humedad muy alta"
                  : "Humedad muy baja"
              }
              barPercent={clamp(t.humidity, 0, 100)}
              barColor={
                humidAlert
                  ? "oklch(60% 0.18 220)"
                  : "oklch(55% 0.14 220)"
              }
            />
            {showPressure && (
              <MetricRow
                label="Presión"
                value={formatPressure(t.pressure)}
                barPercent={clamp(
                  ((t.pressure - 990) / 40) * 100,
                  0,
                  100
                )}
                barColor="oklch(60% 0.12 280)"
              />
            )}
          </div>

          <button
            className="toggle-pressure"
            onClick={() => setShowPressure((p) => !p)}
            aria-expanded={showPressure}
          >
            {showPressure ? "Ocultar presión" : "Ver presión atmosférica"}
          </button>

          <TelemetryChart
            history={device.history}
            activeMetrics={["temperature", "humidity"]}
          />
        </>
      ) : (
        <div className="device-card__no-data">
          <p>Esperando primer dato...</p>
        </div>
      )}

      <footer className="device-card__footer">
        <span>fw {device.firmwareVersion}</span>
        <span>
          {t ? `Último dato: ${new Date(t.timestamp).toLocaleTimeString("es-CL")}` : "Sin datos"}
        </span>
      </footer>
    </article>
  );
}
