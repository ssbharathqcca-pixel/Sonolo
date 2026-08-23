/**
 * Global crash boundary (SN-017).
 *
 * Any uncaught render error below the root layout lands on a branded
 * glass fallback instead of a red box. "Restart App" resets the
 * boundary, remounting the entire navigation tree fresh — equivalent
 * to a cold start without killing the process.
 */

import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  ErrorBoundary as ReactErrorBoundary,
  type FallbackProps,
} from "react-error-boundary";

import { GlassCard } from "./GlassCard";
import { colors } from "../theme/colors";

const globalWithDev = globalThis as { __DEV__?: boolean };

function GlassFallback({ error, resetErrorBoundary }: FallbackProps): JSX.Element {
  return (
    <View style={styles.screen}>
      <GlassCard style={styles.card}>
        <View style={styles.badgeDot} />
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.body}>
          Sonolo hit an unexpected snag. Your progress is safe — restarting
          the app usually clears this right up.
        </Text>
        {globalWithDev.__DEV__ === true && error instanceof Error ? (
          <Text style={styles.detail} numberOfLines={4}>
            {error.message}
          </Text>
        ) : null}
        <Pressable
          style={styles.button}
          accessibilityLabel="Restart App"
          onPress={resetErrorBoundary}
        >
          <Text style={styles.buttonText}>Restart App</Text>
        </Pressable>
      </GlassCard>
    </View>
  );
}

export function AppErrorBoundary({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ReactErrorBoundary FallbackComponent={GlassFallback}>
      {children}
    </ReactErrorBoundary>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.nightSky,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignItems: "center",
    gap: 12,
    paddingVertical: 28,
  },
  badgeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.warmCoral,
    marginBottom: 4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  body: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  detail: {
    color: colors.textTertiary,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    fontFamily: "monospace",
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
