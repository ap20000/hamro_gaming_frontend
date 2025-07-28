import { SOCKET_BASE_URL } from "@/config/config"
import { io, type Socket } from "socket.io-client"

class SocketManager {
  private socket: Socket | null = null
  private static instance: SocketManager

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager()
    }
    return SocketManager.instance
  }

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_BASE_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"],
      })
    }
    return this.socket
  }

  getSocket(): Socket | null {
    return this.socket
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }
}

export default SocketManager
