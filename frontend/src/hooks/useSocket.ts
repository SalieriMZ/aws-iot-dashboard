import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { DeviceState, TelemetryUpdate } from "../types/telemetry";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:4000";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export interface UseSocketReturn {
  devices: Map<string, DeviceState>;
  connectionStatus: ConnectionStatus;
  lastEventTime: number | null;
}

export function useSocket(): UseSocketReturn {
  const [devices, setDevices] = useState<Map<string, DeviceState>>(new Map());
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");
  const [lastEventTime, setLastEventTime] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(WS_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("disconnected");
    });

    // Full snapshot of all devices (sent on connect + periodic staleness check)
    socket.on("devices:snapshot", (snapshot: DeviceState[]) => {
      setDevices((prev) => {
        const next = new Map(prev);
        for (const device of snapshot) {
          next.set(device.deviceId, device);
        }
        return next;
      });
      setLastEventTime(Date.now());
    });

    // Incremental update for a single device
    socket.on("telemetry:update", (update: TelemetryUpdate) => {
      setDevices((prev) => {
        const next = new Map(prev);
        next.set(update.deviceId, update.device);
        return next;
      });
      setLastEventTime(Date.now());
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { devices, connectionStatus, lastEventTime };
}
