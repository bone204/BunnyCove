/**
 * Centralized API and WebSocket URL Endpoints
 * Synchronized with Backend routes.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const AppUrls = {
  baseUrl: BASE_URL,
  socketUrl: SOCKET_URL,

  // Auth endpoints
  auth: {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    refresh: `${BASE_URL}/auth/refresh`,
    logout: `${BASE_URL}/auth/logout`,
    me: `${BASE_URL}/auth/me`,
    verifyEmail: `${BASE_URL}/auth/verify-email`,
    resendVerification: `${BASE_URL}/auth/resend-verification`,
    forgotPassword: `${BASE_URL}/auth/forgot-password`,
    resetPassword: `${BASE_URL}/auth/reset-password`,
  },

  // Users endpoints
  users: {
    me: `${BASE_URL}/users/me`,
    stats: `${BASE_URL}/users/me/stats`,
    matches: `${BASE_URL}/users/me/matches`,
    profile: (identifier: string) => `${BASE_URL}/users/${encodeURIComponent(identifier)}`,
  },

  // Friends endpoints
  friends: {
    list: `${BASE_URL}/friends`,
    requests: `${BASE_URL}/friends/requests`,
    request: `${BASE_URL}/friends/request`,
    accept: (id: string) => `${BASE_URL}/friends/accept/${id}`,
    reject: (id: string) => `${BASE_URL}/friends/reject/${id}`,
    cancel: (id: string) => `${BASE_URL}/friends/cancel/${id}`,
    unfriend: (id: string) => `${BASE_URL}/friends/${id}`,
    status: (targetUserId: string) => `${BASE_URL}/friends/status/${targetUserId}`,
  },

  // Notifications endpoints
  notifications: {
    list: `${BASE_URL}/notifications`,
    unreadCount: `${BASE_URL}/notifications/unread-count`,
    markAsRead: (id: string) => `${BASE_URL}/notifications/${id}/read`,
    markAllAsRead: `${BASE_URL}/notifications/read-all`,
    delete: (id: string) => `${BASE_URL}/notifications/${id}`,
    fcmToken: `${BASE_URL}/notifications/fcm-token`,
  },

  // Upload endpoints
  upload: {
    avatar: `${BASE_URL}/upload/avatar`,
    chatImage: `${BASE_URL}/upload/chat-image`,
  },

  // Chat REST endpoints
  chat: {
    stickers: `${BASE_URL}/chat/stickers`,
    roomMessages: (roomCode: string) => `${BASE_URL}/chat/rooms/${encodeURIComponent(roomCode)}/messages`,
    matchMessages: (matchId: string) => `${BASE_URL}/chat/matches/${encodeURIComponent(matchId)}/messages`,
    message: (messageId: string) => `${BASE_URL}/chat/messages/${encodeURIComponent(messageId)}`,
  },
} as const;
