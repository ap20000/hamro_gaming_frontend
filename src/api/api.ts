import type { Conversation, Message } from "../type/chat"

export const api = {
  // Conversations
  getConversations: async (): Promise<Conversation[]> => {
    const response = await fetch(`/conversations`)
    if (!response.ok) throw new Error("Failed to fetch conversations")
    return response.json()
  },

  createConversation: async (data: {
    conversationId: string
    userId?: string
    adminId?: string
  }): Promise<Conversation> => {
    const response = await fetch(`/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create conversation")
    return response.json()
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await fetch(`/conversations/${id}`)
    if (!response.ok) throw new Error("Failed to fetch conversation")
    return response.json()
  },

  // Messages
  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await fetch(`/messages/${conversationId}`)
    if (!response.ok) throw new Error("Failed to fetch messages")
    return response.json()
  },

  sendMessage: async (data: {
    conversationId: string
    senderId: string
    text: string
    attachmentUrl?: string
  }): Promise<Message> => {
    const response = await fetch(`/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to send message")
    return response.json()
  },
}
