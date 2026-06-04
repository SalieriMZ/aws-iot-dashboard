import * as net from "net";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Aedes = require("aedes");

export interface LocalBrokerHandle {
  server: net.Server;
  close: () => Promise<void>;
}

export function startLocalBroker(port: number): Promise<LocalBrokerHandle> {
  return new Promise((resolve, reject) => {
    const aedes = new Aedes();
    const server = net.createServer(aedes.handle);

    aedes.on("client", (client: { id: string }) => {
      console.log(`[Broker] Client connected: ${client.id}`);
    });

    aedes.on("clientDisconnect", (client: { id: string }) => {
      console.log(`[Broker] Client disconnected: ${client.id}`);
    });

    aedes.on(
      "publish",
      (
        packet: { topic: string; payload: Buffer },
        client: { id: string } | null
      ) => {
        if (client && !packet.topic.startsWith("$SYS")) {
          console.log(
            `[Broker] Message on ${packet.topic} from ${client.id} (${packet.payload.length}B)`
          );
        }
      }
    );

    server.listen(port, () => {
      console.log(`[Broker] Local MQTT broker running on port ${port}`);
      resolve({
        server,
        close: () =>
          new Promise<void>((res) => {
            server.close(() => res());
            aedes.close(() => {});
          }),
      });
    });

    server.on("error", reject);
  });
}
