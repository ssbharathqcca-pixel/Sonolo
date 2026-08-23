/**
 * Mock quest catalog powering the Home, Learn, and Session screens.
 * Real content and backend data arrive in later tasks; every screen
 * reads from this single source so the swap is one-file.
 */
import type { LucideIcon } from "lucide-react-native";
import {
  Briefcase,
  Coffee,
  MessagesSquare,
  Sparkles,
  Stethoscope,
} from "lucide-react-native";
import { colors } from "../theme/colors";

export type QuestDifficulty = "Gentle" | "Standard" | "Challenge";

export interface Quest {
  id: string;
  title: string;
  scenario: string;
  minutes: number;
  xp: number;
  difficulty: QuestDifficulty;
  icon: LucideIcon;
}

export const DIFFICULTY_COLORS: Record<
  QuestDifficulty,
  { text: string; background: string }
> = {
  Gentle: { text: colors.success, background: colors.successSoft },
  Standard: { text: colors.auroraTeal, background: colors.auroraTealSoft },
  Challenge: { text: colors.warmCoral, background: colors.warmCoralSoft },
};

export const QUESTS: Quest[] = [
  {
    id: "q-coffee",
    title: "Order at the coffee shop",
    scenario:
      "You're at Tim Hortons during the morning rush. Order your favourite drink and add a snack.",
    minutes: 5,
    xp: 50,
    difficulty: "Gentle",
    icon: Coffee,
  },
  {
    id: "q-smalltalk",
    title: "Elevator small talk",
    scenario:
      "A neighbour joins you in the elevator. Break the ice and keep the conversation going for two floors.",
    minutes: 3,
    xp: 30,
    difficulty: "Standard",
    icon: MessagesSquare,
  },
  {
    id: "q-work",
    title: "Monday stand-up update",
    scenario:
      "Give your team a short update on what you did last week and what's blocked. Keep it under a minute.",
    minutes: 6,
    xp: 60,
    difficulty: "Challenge",
    icon: Briefcase,
  },
  {
    id: "q-health",
    title: "Describe symptoms to a nurse",
    scenario:
      "You're at a walk-in clinic. Describe how you feel and answer the nurse's follow-up questions.",
    minutes: 7,
    xp: 70,
    difficulty: "Challenge",
    icon: Stethoscope,
  },
];

export const FALLBACK_QUEST: Quest = {
  id: "q-free",
  title: "Free practice",
  scenario: "Warm up with an open conversation about your day.",
  minutes: 5,
  xp: 25,
  difficulty: "Gentle",
  icon: Sparkles,
};

export function getQuestById(id: string | undefined): Quest | undefined {
  return QUESTS.find((quest) => quest.id === id);
}
