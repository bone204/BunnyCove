import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getMessaging, type Message } from 'firebase-admin/messaging';
import * as fs from 'node:fs';
import * as path from 'node:path';

export interface PushNotificationPayload {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  imageUrl?: string;
}

export interface PushNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
  errorCode?: string;
  isMock?: boolean;
}

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private firebaseApp: App | null = null;
  private isConfigured = false;

  onModuleInit() {
    this.initFirebase();
  }

  private initFirebase(): void {
    // 0. Reuse existing default app if already initialized (prevents duplicate app error in HMR/dev)
    if (getApps().length > 0) {
      this.firebaseApp = getApps()[0];
      this.isConfigured = true;
      this.logger.log('☁️ Firebase Admin reused existing default app instance');
      return;
    }

    // 1. Try loading from service account file path if defined
    const rawPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (rawPath) {
      const candidatePaths = [
        path.resolve(rawPath),
        path.resolve(process.cwd(), rawPath),
        path.resolve(process.cwd(), 'server', rawPath),
      ];
      const foundPath = candidatePaths.find((p) => fs.existsSync(p));
      if (foundPath) {
        try {
          const fileContent = fs.readFileSync(foundPath, 'utf-8');
          const serviceAccount = JSON.parse(fileContent);

          this.firebaseApp = initializeApp({
            credential: cert(serviceAccount),
          });
          this.isConfigured = true;
          this.logger.log(`☁️ Firebase Admin initialized from service account file: ${foundPath}`);
          return;
        } catch (err: any) {
          this.logger.error(`Failed to initialize Firebase from file (${foundPath}): ${err.message}`);
        }
      }
    }

    // 2. Try loading from environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
      try {
        // Normalize newline escape characters in private key
        if (privateKey.includes('\\n')) {
          privateKey = privateKey.replace(/\\n/g, '\n');
        }

        this.firebaseApp = initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        this.isConfigured = true;
        this.logger.log(`☁️ Firebase Admin initialized with project ID: ${projectId}`);
        return;
      } catch (err: any) {
        this.logger.error(`Failed to initialize Firebase from environment variables: ${err.message}`);
      }
    }

    // 3. Fallback to Dev/Mock mode if credentials are not provided
    this.logger.warn(
      '⚠️ No Firebase service account found in .env (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY). Running in Dev Push Fallback mode.',
    );
    this.isConfigured = false;
  }

  get configured(): boolean {
    return this.isConfigured;
  }

  async sendPushNotification(payload: PushNotificationPayload): Promise<PushNotificationResult> {
    if (!payload.token || payload.token.trim() === '') {
      return { success: false, error: 'No FCM token provided' };
    }

    // If real Firebase is initialized, send via Firebase Cloud Messaging
    if (this.isConfigured && this.firebaseApp) {
      try {
        const message: Message = {
          token: payload.token,
          notification: {
            title: payload.title,
            body: payload.body,
            imageUrl: payload.imageUrl,
          },
          data: payload.data || {},
          apns: {
            payload: {
              aps: {
                sound: 'default',
                badge: 1,
              },
            },
          },
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'bunny_cove_notifications',
            },
          },
        };

        const messaging = getMessaging(this.firebaseApp);
        const messageId = await messaging.send(message);
        this.logger.log(`☁️ [FCM PUSH SENT] To token: ${payload.token.slice(0, 15)}... | ID: ${messageId}`);
        return { success: true, messageId, isMock: false };
      } catch (err: any) {
        this.logger.error(`Failed to send FCM push notification: ${err.message}`);
        return {
          success: false,
          error: err.message,
          errorCode: err.code || err.errorInfo?.code || 'messaging/unknown-error',
          isMock: false,
        };
      }
    }

    // Development / Test Intercept Mode
    this.logger.log(`
======================================================
☁️ [TEST/DEV FCM PUSH NOTIFICATION INTERCEPTED]
To Token: ${payload.token}
Title   : ${payload.title}
Body    : ${payload.body}
Data    : ${JSON.stringify(payload.data || {})}
======================================================`);

    return {
      success: true,
      messageId: `mock-fcm-${Date.now()}`,
      isMock: true,
    };
  }
}
