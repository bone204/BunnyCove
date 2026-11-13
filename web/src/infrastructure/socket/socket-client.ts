import { io, Socket } from "socket.io-client";
import { AppUrls } from "../constants/app-urls";
import { HttpClient } from "../http/http-client";

export class SocketClient {
  private static instance: SocketClient | null = null;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketClient {
    if (!this.instance) {
      this.instance = new SocketClient();
    }
    return this.instance;
  }

  connect(customToken?: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = customToken || HttpClient.getAccessToken();

    this.socket = io(AppUrls.socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      auth: token ? { token } : undefined,
      transports: ["websocket", "polling"],
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }

  emit<T = unknown>(
    event: string,
    data?: unknown,
    ack?: (response: T) => void
  ): void {
    if (!this.socket) {
      this.connect();
    }
    if (ack) {
      this.socket?.emit(event, data, ack);
    } else {
      this.socket?.emit(event, data);
    }
  }

  on<T = unknown>(event: string, callback: (data: T) => void): void {
    this.socket?.on(event, callback);
  }

  off<T = unknown>(event: string, callback?: (data: T) => void): void {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }
}

export const socketClient = SocketClient.getInstance();

