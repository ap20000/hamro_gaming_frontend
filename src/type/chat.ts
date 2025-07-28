export interface Message {
  _id: string
  conversationId: string
  senderId: string
  text: string
  attachmentUrl?: string
  messageType: "text" | "image" | "file"
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  _id: string
  participants: string[]
  status: "active" | "resolved" | "pending"
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  createdAt: string
  updatedAt: string
}
