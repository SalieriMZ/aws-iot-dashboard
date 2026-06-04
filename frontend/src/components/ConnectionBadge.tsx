import type { ConnectionStatus } from "../hooks/useSocket";

interface Props {
  status: ConnectionStatus;
  lastEventTime: number | null;
}

export function ConnectionBadge({ status, lastEventTime }: Props) {
  const labels: Record<ConnectionStatus, string> = {
    connected: "Conectado",
    connecting: "Conectando...",
    disconnected: "Desconectado",
  };

  const colors: Record<ConnectionStatus, string> = {
    connected: "var(--color-online)",
    connecting: "var(--color-warning)",
    disconnected: "var(--color-offline)",
  };

  return (
    <div className="connection-badge">
      <span
        className="connection-dot"
        style={{ backgroundColor: colors[status] }}
        aria-hidden="true"
      />
      <span className="connection-label">{labels[status]}</span>
      {status === "connected" && lastEventTime && (
        <span className="connection-sub">
          &middot; WebSocket activo
        </span>
      )}
    </div>
  );
}
