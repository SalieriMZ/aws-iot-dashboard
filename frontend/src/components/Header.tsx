import { ConnectionBadge } from "./ConnectionBadge";
import type { ConnectionStatus } from "../hooks/useSocket";

interface Props {
  connectionStatus: ConnectionStatus;
  lastEventTime: number | null;
  deviceCount: number;
  alertCount: number;
}

export function Header({ connectionStatus, lastEventTime, deviceCount, alertCount }: Props) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <div className="app-header__logo" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="26" height="26" rx="6" stroke="oklch(65% 0.18 220)" strokeWidth="1.5"/>
            <path d="M7 14 L11 10 L15 16 L19 8 L23 12" stroke="oklch(65% 0.18 220)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="23" cy="12" r="2" fill="oklch(65% 0.18 220)"/>
          </svg>
        </div>
        <div>
          <h1 className="app-header__title">IoT Telemetry Dashboard</h1>
          <p className="app-header__subtitle">AWS IoT Core — Monitoreo en tiempo real</p>
        </div>
      </div>

      <div className="app-header__stats">
        {alertCount > 0 && (
          <div className="header-alert-count" role="status" aria-live="polite">
            <span className="header-alert-count__num">{alertCount}</span>
            <span className="header-alert-count__label">
              {alertCount === 1 ? "alerta" : "alertas"}
            </span>
          </div>
        )}
        <div className="header-device-count">
          <span className="header-device-count__num">{deviceCount}</span>
          <span className="header-device-count__label">
            {deviceCount === 1 ? "dispositivo" : "dispositivos"}
          </span>
        </div>
        <ConnectionBadge
          status={connectionStatus}
          lastEventTime={lastEventTime}
        />
      </div>
    </header>
  );
}
