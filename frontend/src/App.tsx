import { useMemo } from "react";
import { useSocket } from "./hooks/useSocket";
import { DeviceCard } from "./components/DeviceCard";
import { Header } from "./components/Header";
import { EmptyState } from "./components/EmptyState";
import { THRESHOLDS } from "./types/telemetry";
import "./App.css";

function App() {
  const { devices, connectionStatus, lastEventTime } = useSocket();

  const deviceList = useMemo(
    () => Array.from(devices.values()).sort((a, b) => a.deviceId.localeCompare(b.deviceId)),
    [devices]
  );

  const alertCount = useMemo(
    () =>
      deviceList.filter((d) => {
        if (d.status === "warning" || d.status === "offline") return true;
        const t = d.latestTelemetry;
        if (!t) return false;
        return (
          t.temperature > THRESHOLDS.temperature.warn ||
          t.humidity > THRESHOLDS.humidity.warn ||
          t.humidity < THRESHOLDS.humidity.low
        );
      }).length,
    [deviceList]
  );

  return (
    <div className="app">
      <Header
        connectionStatus={connectionStatus}
        lastEventTime={lastEventTime}
        deviceCount={deviceList.length}
        alertCount={alertCount}
      />

      <main className="app__main">
        {deviceList.length === 0 ? (
          <EmptyState connectionStatus={connectionStatus} />
        ) : (
          <>
            {alertCount > 0 && (
              <div className="alert-banner" role="alert" aria-live="polite">
                <span className="alert-banner__icon" aria-hidden="true">!</span>
                <span>
                  {alertCount} {alertCount === 1 ? "dispositivo requiere atención" : "dispositivos requieren atención"}
                </span>
              </div>
            )}
            <div className="device-grid">
              {deviceList.map((device) => (
                <DeviceCard key={device.deviceId} device={device} />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <span>AWS IoT Core — Demo</span>
        <span>Sebastián Álvarez · 2024</span>
        <a
          href="https://github.com/sebalvarez/aws-iot-dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
