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

export interface notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
  title: string;
}

export interface week {
  weekLabel: string;
  count: number;
}

export interface earn {
  weekLabel: string;
  totalEarnings: number;
}

export interface BookingData {
  id: number;
  bookingId: number;
  mentorName: string;
  menteeName: string;
  startTime: string;
  endTime: string;
  amout: string;
  status: string;
  menteeImageLink: string;
  mentorImageLink: string;
  mentorId: string;
  menteeId: string;
  mentorUserId: string;
  menteeUserId: string;
}
