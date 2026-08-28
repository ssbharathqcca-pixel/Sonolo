/**
 * PaywallModal (SN-026, refreshed SN-041): glassmorphic bottom sheet
 * offering the beta premium unlock. The primary button calls the mock
 * upgrade endpoint through the auth store, then refetches server-side
 * entitlements; on success the sheet closes and every gated surface
 * re-renders unlocked from store state.
 */
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CheckCircle2, Crown, X } from "lucide-react-native";

import { useAuthStore } from "../stores/authStore";
import { colors } from "../theme/colors";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

const BENEFITS = [
  "Every premium scenario — banking, taxes, healthcare, and work",
  "Unlimited speaking practice with instant AI feedback",
  "CanadaReady scores that track your real progress",
];

export function PaywallModal({
  visible,
  onClose,
}: PaywallModalProps): JSX.Element {
  const insets = useSafeAreaInsets();
  const upgradeAccount = useAuthStore((state) => state.upgradeAccount);
  const refreshEntitlements = useAuthStore((state) => state.refreshEntitlements);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A fresh sheet every time it opens: no stale errors from last attempt.
  useEffect(() => {
    if (visible) {
      setError(null);
    }
  }, [visible]);

  const handleUnlock = async (): Promise<void> => {
    if (isUpgrading) {
      return;
    }
    setIsUpgrading(true);
    setError(null);
    try {
      await upgradeAccount();
      // Entitlements are the server's word on access; refresh them so
      // every surface gates on fresh state after the mock purchase.
      await refreshEntitlements();
      setIsUpgrading(false);
      onClose();
    } catch (upgradeError) {
      setIsUpgrading(false);
      setError(upgradeError instanceof Error ? upgradeError.message : null);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}
          accessibilityLabel="Sonolo premium upgrade"
        >
          <View style={styles.grabber} />
          <View style={styles.headerRow}>
            <View style={styles.crownWell}>
              <Crown color={colors.warning} size={22} />
            </View>
            <Pressable
              onPress={onClose}
              hitSlop={12}
              accessibilityLabel="Close paywall"
            >
              <X color={colors.textTertiary} size={22} />
            </Pressable>
          </View>

          <Text style={styles.headline}>Unlock Canadian Life Mastery</Text>
          <Text style={styles.subcopy}>
            Go beyond the basics with the scenarios newcomers actually face.
          </Text>

          <View style={styles.benefits}>
            {BENEFITS.map((benefit) => (
              <View key={benefit} style={styles.benefitRow}>
                <CheckCircle2 color={colors.auroraTeal} size={18} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {error !== null ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.unlockButton, isUpgrading && styles.buttonBusy]}
            onPress={() => {
              void handleUnlock();
            }}
            disabled={isUpgrading}
            accessibilityLabel="Unlock for Free (Beta)"
          >
            {isUpgrading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Crown color="#FFFFFF" size={18} />
                <Text style={styles.unlockButtonText}>
                  Unlock for Free (Beta)
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            onPress={onClose}
            hitSlop={8}
            accessibilityLabel="Maybe later"
          >
            <Text style={styles.laterText}>Maybe later</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: colors.nightSkyDeep,
    opacity: 0.96,
  },
  sheet: {
    backgroundColor: colors.glass,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 14,
  },
  grabber: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.glassBorder,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  crownWell: {
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(251, 191, 36, 0.16)",
  },
  headline: {
    color: colors.textPrimary,
    fontSize: 23,
    fontWeight: "700",
    lineHeight: 29,
  },
  subcopy: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: -6,
  },
  benefits: {
    gap: 12,
    marginTop: 2,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  benefitText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    lineHeight: 18,
  },
  unlockButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.auroraTeal,
    borderRadius: 16,
    paddingVertical: 15,
    marginTop: 4,
  },
  buttonBusy: {
    opacity: 0.7,
  },
  unlockButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  laterText: {
    color: colors.textTertiary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 4,
  },
});
