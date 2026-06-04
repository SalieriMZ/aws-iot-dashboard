import express from "express";
import http from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { deviceStore } from "./deviceStore";
import type { TelemetryPayload } from "./types";

export interface WsServerHandle {
  io: SocketIOServer;
  close: () => Promise<void>;
}

export function createWsServer(port: number): WsServerHandle {
  const app = express();
  app.use(cors({ origin: "*" }));
  app.use(express.json());

  // REST endpoint: current snapshot of all devices
  app.get("/api/devices", (_req, res) => {
    res.json(deviceStore.getAll());
  });

  app.get("/api/devices/:id", (req, res) => {
    const device = deviceStore.get(req.params.id);
    if (!device) {
      res.status(404).json({ error: "Device not found" });
      return;
    }
    res.json(device);
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: Date.now(),
      deviceCount: deviceStore.getAll().length,
    });
  });

  const httpServer = http.createServer(app);

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[WS] Client connected: ${socket.id}`);

    // Send current state immediately on connect
    const devices = deviceStore.getAll();
    socket.emit("devices:snapshot", devices);

    socket.on("disconnect", () => {
      console.log(`[WS] Client disconnected: ${socket.id}`);
    });
  });

  // Mark stale devices every 10 seconds
  const staleInterval = setInterval(() => {
    deviceStore.markStale(15000);
    // Broadcast updated state
    io.emit("devices:snapshot", deviceStore.getAll());
  }, 10000);

  httpServer.listen(port, () => {
    console.log(`[WS] HTTP + Socket.IO server running on port ${port}`);
    console.log(`[WS] REST API at http://localhost:${port}/api/devices`);
  });

  return {
    io,
    close: () =>
      new Promise((resolve) => {
        clearInterval(staleInterval);
        io.close(() => {
          httpServer.close(() => resolve());
        });
      }),
  };
}

export function broadcastTelemetry(
  io: SocketIOServer,
  payload: TelemetryPayload
): void {
  const device = deviceStore.get(payload.deviceId);
  if (device) {
    io.emit("telemetry:update", {
      deviceId: payload.deviceId,
      telemetry: payload,
      device,
    });
  }
}
