import type { ConnectionStatus } from "../hooks/useSocket";

interface Props {
  connectionStatus: ConnectionStatus;
}

export function EmptyState({ connectionStatus }: Props) {
  if (connectionStatus === "disconnected") {
    return (
      <div className="empty-state">
        <div className="empty-state__icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="oklch(45% 0.05 240)" strokeWidth="1.5" strokeDasharray="4 3"/>
            <path d="M16 24 L22 18 L26 24 L30 16" stroke="oklch(45% 0.05 240)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="10" y1="38" x2="38" y2="10" stroke="oklch(55% 0.18 25)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="empty-state__title">Sin conexión al broker</h2>
        <p className="empty-state__body">
          El servidor WebSocket no responde. Asegúrate de que el broker esté corriendo:
        </p>
        <pre className="empty-state__code">cd broker && npm run dev</pre>
      </div>
    );
  }

  if (connectionStatus === "connecting") {
    return (
      <div className="empty-state">
        <div className="empty-state__spinner" aria-hidden="true" />
        <h2 className="empty-state__title">Conectando...</h2>
        <p className="empty-state__body">Estableciendo conexión WebSocket con el broker.</p>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="22" stroke="oklch(50% 0.05 240)" strokeWidth="1.5" strokeDasharray="4 3"/>
          <path d="M16 28 L22 20 L26 26 L30 18 L34 22" stroke="oklch(50% 0.05 240)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="empty-state__title">Esperando dispositivos</h2>
      <p className="empty-state__body">
        Conectado al broker. Inicia el simulador de dispositivos:
      </p>
      <pre className="empty-state__code">cd simulator && npm run dev</pre>
    </div>
  );
}
