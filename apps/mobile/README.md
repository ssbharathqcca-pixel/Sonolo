# Sonolo Mobile App

React Native + Expo (SDK 52) + TypeScript app for voice-first Canadian English speaking practice.

**Status: UI shell with the three core screens.** Expo Router navigation, the Sonolo glassmorphic design system, Home (daily quests + CanadaReady card), Voice Session (mic states, waveform, transcript), and Feedback (skill radar, wins/growth) are built with mock data. Real audio capture, backend integration, and Canadian French arrive in later tasks (see [`../../docs/TASK_BOARD.md`](../../docs/TASK_BOARD.md)).

## Quickstart

```bash
cd apps/mobile
npm install
npx expo start
```

Scan the QR code with Expo Go, or press `i` / `a` for the iOS simulator / Android emulator.

From the repository root, `make mobile` runs the same dev server.

## Scripts

| Command | Purpose |
|---|---|
| `npm run start` | Expo dev server (Metro) |
| `npm run ios` / `npm run android` | Dev server targeting simulator/emulator |
| `npm run typecheck` | `tsc --noEmit` in strict mode |

## Structure

```
app/
├── _layout.tsx            root stack + ThemeProvider + safe area
├── (tabs)/                bottom tab bar: Home, Learn, Progress
│   ├── index.tsx          Home — CanadaReady card, today's quest
│   ├── learn.tsx          Learn — scenario pack catalog
│   └── progress.tsx       Progress — weekly minutes, streak
├── session/[id].tsx       voice session loop (mock state machine)
└── feedback/[id].tsx      post-session report + skill radar
src/
├── theme/colors.ts        design tokens (Aurora Teal, Warm Coral, Night Sky, glass)
├── theme/ThemeProvider.tsx
├── data/quests.ts         mock quest catalog (single source until backend lands)
└── components/            GlassCard, VoiceButton
```

## Conventions

- TypeScript strict mode; every component fully typed.
- No external UI kits — glassmorphism is hand-built with StyleSheet.
- Animations use Reanimated; colors come from `src/theme/colors.ts` only.
- Icons: `lucide-react-native`. SVG: `react-native-svg` (radar chart).
- The brand name is **Sonolo** in all user-facing copy.
