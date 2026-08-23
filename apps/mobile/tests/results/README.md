# Mobile verification result artifacts

Point-in-time verification runs for the Expo app (SN-003 onward), saved
for the GLM workflow review trail. Unit-test artifacts will join these
files once the mobile test setup task lands.

## Runs

| Task | Check | File | Result |
|---|---|---|---|
| SN-003 | Strict TypeScript check (`npx tsc --noEmit`) | `2026-08-22_sn003_tsc_typecheck.txt` | exit 0, zero errors |
| SN-003 | Full Metro bundle via `expo export --platform android` (Babel, imports, Reanimated plugin, Expo Router) | `2026-08-22_sn003_metro_bundle.txt` | exit 0, Hermes bundle exported |
| SN-013 | Strict TypeScript check after auth flow (`npx tsc --noEmit`) | `2026-08-22_sn013_tsc_typecheck.txt` | exit 0, zero errors |
| SN-013 | Metro bundle incl. auth screens, store, API client | `2026-08-22_sn013_metro_bundle.txt` | exit 0, Hermes bundle exported |

## Environment

- Node v24.19.0, npm 12.0.2 (Windows / Git Bash)
- Expo SDK 52, React Native 0.76.5, TypeScript 5.x strict mode
- `npm install` completed for 908 packages on 2026-08-22 (SN-003)

## Notes

- The bundle artifact is the full `expo export` console output; the
  build was removed from `dist/` after capture (gitignored anyway).
- No emulator is available in this environment — device-level visual QA
  remains a human review step.
- Re-run: `cd apps/mobile && npx tsc --noEmit` and
  `CI=1 npx expo export --platform android`.
