"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { User, X, Send, Shield } from "lucide-react";
import Button from "@/components/ui/button";
import useSocket from "@/hooks/useSocket";
import { SOCKET_BASE_URL } from "@/config/config";

interface DeliveredKey {
  name: string;
  type: string;
  value:
    | string
    | {
        email: string;
        password: string;
        code?: string;
        loginInstructions?: string;
      };
}

interface Message {
  _id: string;
  text: string;
  senderId: string;
  conversationId: string;
  createdAt: string;
  attachmentUrl?: string;
}

interface AccountChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  userId: string;
  accountKeys?: DeliveredKey[];
  showKeys?: boolean;
  onKeysCopied?: () => void;
  renderKeyValue?: (key: DeliveredKey) => React.ReactNode;
}

export default function AccountChatModal({
  isOpen,
  onClose,
  orderId,
  userId,
}: AccountChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const socket = useSocket(SOCKET_BASE_URL);

  const conversationId = `order_${orderId}`;

  // Initialize socket connection
  useEffect(() => {
    if (!socket || !isOpen) return;

    const onConnect = () => {
      console.log("Connected to socket");
      setIsConnected(true);
      socket.emit("join_conversation", conversationId);
      loadInitialMessages();
    };

    const onDisconnect = () => {
      console.log("Disconnected from socket");
      setIsConnected(false);
    };

    const onMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onConversationError = (error: unknown) => {
      if (error instanceof Error) {
        console.error("Conversation error:", error);
      }
    };

    const onMessageError = (error: unknown) => {
      if (error instanceof Error) {
        console.error("Message error:", error);
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onMessage);
    socket.on("conversation_error", onConversationError);
    socket.on("message_error", onMessageError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onMessage);
      socket.off("conversation_error", onConversationError);
      socket.off("message_error", onMessageError);
    };
  }, [socket, isOpen, conversationId]);

  // Load initial messages
  const loadInitialMessages = async () => {
    try {
      // First create conversation
      await fetch(`${SOCKET_BASE_URL}/api/conversations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          userId,
          adminId: "admin",
        }),
      });

      // Then load messages
      const response = await fetch(
        `${SOCKET_BASE_URL}/api/messages/${conversationId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;

    const messageData = {
      conversationId,
      senderId: userId,
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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gaming-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gaming-black border border-gaming-gray/40 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gaming-gray/20 border-b border-gaming-gray/40 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gaming-electric-blue/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-gaming-electric-blue" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gaming-white">
                  Account Support - Order #{orderId.slice(-8).toUpperCase()}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></div>
                  <span className="text-xs text-gaming-white/60">
                    {isConnected ? "Connected" : "Connecting..."}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gaming-gray/30 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gaming-white/60" />
            </button>
          </div>
        </div>

        <div className="flex h-[70vh]">
          {/* Chat Section - Always full width */}
          <div className="w-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gaming-gray/40 bg-gaming-gray/10">
              <h4 className="text-lg font-semibold text-gaming-white">
                Support Chat
              </h4>
              <p className="text-sm text-gaming-white/60">
                Get help with your account
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.senderId === userId
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.senderId === userId ? "order-2" : "order-1"
                      }`}
                    >
                      <div
                        className={`${
                          message.senderId === userId
                            ? "bg-gaming-electric-blue text-gaming-white"
                            : "bg-gaming-gray/50 text-gaming-white"
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
                    {message.senderId !== userId && (
                      <div className="w-8 h-8 bg-gaming-gaming-blue/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <User className="w-4 h-4 text-gaming-electric-blue" />
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
                  placeholder="Type your message..."
                  disabled={!isConnected}
                  className="flex-1 bg-gaming-gray/50 rounded-full px-4 py-3 text-gaming-white text-sm focus:outline-none focus:ring-2 focus:ring-gaming-electric-blue disabled:opacity-50"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !isConnected}
                  className="bg-gaming-electric-blue hover:bg-gaming-electric-blue/80 rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
