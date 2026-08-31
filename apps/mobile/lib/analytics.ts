import * as Sentry from '@sentry/react-native';
import { PostHog } from 'posthog-react-native';
import type { PostHogEventProperties } from '@posthog/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Initialize Sentry
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  debug: __DEV__, // Only logs to console in dev mode
  tracesSampleRate: 1.0,
  environment: __DEV__ ? 'development' : 'production',
});

// 2. Initialize PostHog instance
export const posthog = new PostHog(
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY || '',
  {
    host: process.env.EXPO_PUBLIC_POSTHOG_HOST,
    customStorage: AsyncStorage,
    captureAppLifecycleEvents: true,
  }
);

/** Track a custom analytics event via PostHog (SN-047). */
export function trackEvent(
  event: string,
  properties?: PostHogEventProperties,
): void {
  posthog.capture(event, properties ?? {});
}