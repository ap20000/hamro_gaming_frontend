"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  User,
  Send,
  MessageSquare,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Button from "@/components/ui/button";
import type { Socket } from "socket.io-client";
import { SOCKET_BASE_URL } from "@/config/config";

interface Message {
  _id: string;
  text: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  attachmentUrl?: string;
}

interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  status: "active" | "resolved" | "pending";
}

interface AdminChatDashboardProps {
  socket: Socket | undefined;
  selectedConversation: string | null;
  setSelectedConversation: (id: string | null) => void;
  connected: boolean;
  newConversations: Conversation[];
}

export default function AdminChatDashboard({
  socket,
  selectedConversation,
  setSelectedConversation,
  connected,
}: AdminChatDashboardProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const adminId = "admin";

  // Initialize socket connection
  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log("Admin connected to socket");
      socket.emit("admin_join");
      loadConversations();
    };

    const onDisconnect = () => {
      console.log("Admin disconnected from socket");
    };

    const onMessage = (message: Message) => {
      console.log("Admin received message:", message);

      // Only add message if it's for the active conversation
      if (selectedConversation === message.conversationId) {
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const exists = prev.find((m) => m._id === message._id);
          if (exists) {
            return prev;
          }
          return [...prev, message];
        });
      }

      // Update conversation list
      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === message.conversationId
            ? {
                ...conv,
                lastMessage: message.text,
                lastMessageTime: message.createdAt,
                unreadCount:
                  message.senderId !== adminId &&
                  selectedConversation !== message.conversationId
                    ? conv.unreadCount + 1
                    : conv.unreadCount,
              }
            : conv
        )
      );
    };

    const onNewConversation = (conversation: Conversation) => {
      console.log("New conversation received:", conversation);
      setConversations((prev) => {
        // Check if conversation already exists
        const exists = prev.find((c) => c._id === conversation._id);
        if (exists) {
          return prev;
        }
        return [conversation, ...prev];
      });
    };

    const onConversationError = (error: unknown) => {
      if (error instanceof Error) {
        console.error("Conversation error:", error);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onMessage);
    socket.on("new_conversation", onNewConversation);
    socket.on("conversation_error", onConversationError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onMessage);
      socket.off("new_conversation", onNewConversation);
      socket.off("conversation_error", onConversationError);
    };
  }, [socket, adminId, selectedConversation]);

  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await fetch(`${SOCKET_BASE_URL}/api/conversations`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `${SOCKET_BASE_URL}/api/messages/${conversationId}`
      );
      if (response.ok) {
        const data = await response.json();
        // Remove any potential duplicates when loading
        const uniqueMessages = data.filter(
          (message: Message, index: number, self: Message[]) =>
            index === self.findIndex((m) => m._id === message._id)
        );
        setMessages(uniqueMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setMessages([]);
    }
  };

  // Select conversation
  const selectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    loadMessages(conversationId);
    setConversations((prev) =>
      prev.map((conv) =>
        conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
    if (socket) {
      socket.emit("join_conversation", conversationId);
    }
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !connected || !selectedConversation)
      return;

    const messageData = {
      conversationId: selectedConversation,
      senderId: adminId,
      text: newMessage,
      attachmentUrl: null,
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <MessageSquare className="w-4 h-4 text-green-400" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gaming-black">
      <div className="flex h-screen">
        {/* Sidebar - Conversations List */}
        <div className="w-1/3 border-r border-gaming-gray/40 bg-gaming-gray/10">
          {/* Header */}
          <div className="p-4 border-b border-gaming-gray/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gaming-white">
                Support Conversations
              </h2>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    connected ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span className="text-xs text-gaming-white/60">
                  {connected ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Conversations List */}
          <div className="overflow-y-auto h-[calc(100vh-120px)]">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gaming-white/60">
                No conversations found
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => selectConversation(conversation._id)}
                  className={`p-4 border-b border-gaming-gray/20 cursor-pointer hover:bg-gaming-gray/20 transition-colors ${
                    selectedConversation === conversation._id
                      ? "bg-gaming-electric-blue/20 border-gaming-electric-blue/30"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(conversation.status)}
                      <span className="font-medium text-gaming-white text-sm">
                        {conversation._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-gaming-electric-blue text-white text-xs px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {conversation.lastMessage && (
                    <div className="text-gaming-white/80 text-sm mb-2 truncate">
                      {conversation.lastMessage}
                    </div>
                  )}
                  {conversation.lastMessageTime && (
                    <div className="text-gaming-white/40 text-xs">
                      {formatDate(conversation.lastMessageTime)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gaming-gray/40 bg-gaming-gray/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gaming-electric-blue/20 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-gaming-electric-blue" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gaming-white">
                        {selectedConversation.slice(-8).toUpperCase()}
                      </h3>
                      <span className="text-sm text-gaming-white/60">
                        Customer Support Chat
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.senderId !== adminId
                          ? "justify-start"
                          : "justify-end"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] ${
                          message.senderId !== adminId ? "order-1" : "order-2"
                        }`}
                      >
                        <div
                          className={`${
                            message.senderId !== adminId
                              ? "bg-gaming-gray/50 text-gaming-white"
                              : "bg-gaming-electric-blue text-white"
                          } rounded-2xl px-4 py-3 relative`}
                        >
                          <div className="text-sm leading-relaxed">
                            {message.text}
                          </div>
                          <div className="text-xs opacity-60 mt-1">
                            {formatTime(message.createdAt)}
                          </div>
                        </div>
                      </div>
                      {message.senderId !== adminId && (
                        <div className="w-8 h-8 bg-gaming-gray/30 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                          <User className="w-4 h-4 text-gaming-white/60" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-gaming-gray/40 p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your response..."
                    disabled={!connected}
                    className="flex-1 bg-gaming-gray/50 rounded-full px-4 py-3 text-gaming-white text-sm focus:outline-none focus:ring-2 focus:ring-gaming-electric-blue disabled:opacity-50"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !connected}
                    className="bg-gaming-electric-blue hover:bg-gaming-electric-blue/80 rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gaming-white/30 mx-auto mb-4" />
                <h3 className="text-xl text-gaming-white/60 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gaming-white/40">
                  Choose a conversation from the sidebar to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
