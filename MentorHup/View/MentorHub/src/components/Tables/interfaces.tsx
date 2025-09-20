export interface skills {
  id: number;
  name: string;
  show?: boolean;
}

export type message = {
  id: number;
  content: string;
  senderId: string;
  receiverId: string;
  sentAt: string;
  isRead: boolean;
  senderName: string;
  senderAvatar?: string;
};

export type conv = {
  conversationWithAvatar: string;
  conversationWithId: string;
  conversationWithName: string;
  lastMessage: string;
  lastMessageTime: string;
  isRead: boolean;
};
