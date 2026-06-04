export function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 5000) return "ahora";
  if (diff < 60000) return `hace ${Math.floor(diff / 1000)}s`;
  if (diff < 3600000) return `hace ${Math.floor(diff / 60000)}m`;
  return `hace ${Math.floor(diff / 3600000)}h`;
}

export function formatTemp(val: number): string {
  return `${val.toFixed(1)}°C`;
}

export function formatHumidity(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatPressure(val: number): string {
  return `${val.toFixed(0)} hPa`;
}

export function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val));
}
