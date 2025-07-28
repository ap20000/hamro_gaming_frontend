"use client";

import { useState, useEffect } from "react";
import type { Socket } from "socket.io-client";
import SocketManager from "@/lib/socket";
import AdminChatDashboard from "@/components/ui/admin/admin_chat_dashboard";
import type { Conversation } from "@/type/chat";

export default function AdminPage() {
  const [socket, setSocket] = useState<Socket>();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [connected, setConnected] = useState(false);
  const [newConversations, setNewConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const socketManager = SocketManager.getInstance();
    const socketInstance = socketManager.connect();

    socketInstance.on("connect", () => {
      console.log("Admin connected to server");
      setConnected(true);
      // Join as admin
      socketInstance.emit("admin_join");
    });

    socketInstance.on("disconnect", () => {
      console.log("Admin disconnected from server");
      setConnected(false);
    });

    socketInstance.on("new_conversation", (conversation: Conversation) => {
      console.log("New conversation:", conversation);
      setNewConversations((prev) => [conversation, ...prev]);
      // Auto-select if no conversation is currently selected
      if (!selectedConversation) {
        setSelectedConversation(conversation._id);
      }
    });

    setSocket(socketInstance);

    return () => {
      socketManager.disconnect();
    };
  }, [selectedConversation]);

  return (
    <AdminChatDashboard
      socket={socket}
      selectedConversation={selectedConversation}
      setSelectedConversation={setSelectedConversation}
      connected={connected}
      newConversations={newConversations}
    />
  );
}
