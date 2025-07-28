"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"

export default function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    if (!url) return

    console.log("Connecting to socket server:", url)

    const socketIo = io(url, {
      withCredentials: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketIo.on("connect", () => {
      console.log("Socket connected successfully:", socketIo.id)
    })

    socketIo.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
    })

    socketIo.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
    })

    setSocket(socketIo)

    function cleanup() {
      console.log("Cleaning up socket connection")
      socketIo.disconnect()
    }

    return cleanup
  }, [url])

  return socket
}
