import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { TelemetryPayload } from "../types/telemetry";
import { formatTimestamp } from "../utils/format";

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface Props {
  history: TelemetryPayload[];
  activeMetrics?: ("temperature" | "humidity" | "pressure")[];
}

const METRIC_CONFIG = {
  temperature: { color: "oklch(65% 0.18 25)", label: "Temperatura (°C)" },
  humidity: { color: "oklch(55% 0.16 220)", label: "Humedad (%)" },
  pressure: { color: "oklch(60% 0.12 150)", label: "Presión (hPa)" },
};

export function TelemetryChart({
  history,
  activeMetrics = ["temperature", "humidity"],
}: Props) {
  if (history.length < 2) {
    return (
      <div className="chart-empty">
        <p>Esperando datos para graficar...</p>
      </div>
    );
  }

  const data: ChartDataPoint[] = history.slice(-40).map((h) => ({
    time: formatTimestamp(h.timestamp),
    temperature: h.temperature,
    humidity: h.humidity,
    pressure: h.pressure,
  }));

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="oklch(35% 0.01 240)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "oklch(65% 0.02 240)" }}
            interval="preserveStartEnd"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "oklch(65% 0.02 240)" }}
            tickLine={false}
            axisLine={false}
            width={45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(18% 0.015 240)",
              border: "1px solid oklch(30% 0.02 240)",
              borderRadius: "6px",
              fontSize: "12px",
              color: "oklch(90% 0.01 240)",
            }}
            itemStyle={{ color: "oklch(85% 0.01 240)" }}
            labelStyle={{ color: "oklch(60% 0.02 240)", marginBottom: "4px" }}
          />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
          {activeMetrics.map((metric) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              name={METRIC_CONFIG[metric].label}
              stroke={METRIC_CONFIG[metric].color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={300}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
