interface Props {
  label: string;
  value: string;
  alert?: boolean;
  alertMessage?: string;
  unit?: string;
  barPercent?: number;
  barColor?: string;
}

export function MetricRow({
  label,
  value,
  alert = false,
  alertMessage,
  barPercent,
  barColor,
}: Props) {
  return (
    <div className={`metric-row ${alert ? "metric-row--alert" : ""}`}>
      <div className="metric-row__header">
        <span className="metric-row__label">{label}</span>
        <span className={`metric-row__value ${alert ? "metric-row__value--alert" : ""}`}>
          {alert && <span className="alert-icon" aria-label="Alerta">!</span>}
          {value}
        </span>
      </div>
      {barPercent !== undefined && (
        <div className="metric-bar" role="progressbar" aria-valuenow={barPercent}>
          <div
            className="metric-bar__fill"
            style={{
              width: `${barPercent}%`,
              backgroundColor: barColor || "var(--color-accent)",
            }}
          />
        </div>
      )}
      {alert && alertMessage && (
        <p className="metric-alert-msg">{alertMessage}</p>
      )}
    </div>
  );
}
