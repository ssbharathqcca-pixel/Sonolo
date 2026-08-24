/**
 * Chat-style transcript list (SN-016).
 *
 * User bubbles right (Warm Coral), assistant bubbles left (Aurora Teal),
 * auto-scrolls to bottom on new turns.
 */

import { useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { colors } from "../theme/colors";

export interface TranscriptTurnView {
  id: number;
  role: "user" | "tutor";
  text: string;
}

interface TranscriptListProps {
  turns: TranscriptTurnView[];
  style?: StyleProp<ViewStyle>;
}

export function TranscriptList({
  turns,
  style,
}: TranscriptListProps): JSX.Element {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns.length]);

  return (
    <ScrollView ref={scrollRef} style={style} showsVerticalScrollIndicator={false}>
      {turns.map((turn) => (
        <View
          key={turn.id}
          style={[
            styles.row,
            turn.role === "user" ? styles.rowRight : styles.rowLeft,
          ]}
        >
          <View
            style={[
              styles.bubble,
              turn.role === "user" ? styles.bubbleUser : styles.bubbleTutor,
            ]}
          >
            <Text
              style={[
                styles.text,
                turn.role === "user" && styles.textUser,
              ]}
            >
              {turn.text}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  rowLeft: {
    justifyContent: "flex-start",
  },
  rowRight: {
    justifyContent: "flex-end",
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleTutor: {
    backgroundColor: colors.glass,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.auroraTealSoft,
  },
  bubbleUser: {
    backgroundColor: colors.warmCoralSoft,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderColor: colors.warmCoralSoft,
  },
  text: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: colors.textPrimary,
  },
});
