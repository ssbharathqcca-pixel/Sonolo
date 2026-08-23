/**
 * Sonolo design system — color tokens.
 *
 * Dark-mode-first palette built on the "Night Sky" background with
 * Aurora Teal as the primary accent and Warm Coral as the secondary
 * accent. Glass surfaces are semi-transparent overlays layered over
 * the background; native backdrop blur is approximated with
 * translucency, hairline borders, and top-edge highlights.
 */
export const colors = {
  /** Primary accent — Aurora Teal. */
  auroraTeal: "#0EA5E9",
  /** Soft Aurora Teal wash for fills and chips. */
  auroraTealSoft: "rgba(14, 165, 233, 0.18)",
  /** Secondary accent — Warm Coral, used for recording energy and streaks. */
  warmCoral: "#F97316",
  /** Soft Warm Coral wash for fills and chips. */
  warmCoralSoft: "rgba(249, 115, 22, 0.18)",
  /** Default screen background — Night Sky. */
  nightSky: "#0F172A",
  /** Deeper background for wells and chart trays. */
  nightSkyDeep: "#020617",
  /** Glassmorphic card surface. */
  glass: "rgba(30, 41, 59, 0.72)",
  /** Hairline border for glass surfaces. */
  glassBorder: "rgba(148, 163, 184, 0.24)",
  /** Top-edge highlight that sells the "glass" look. */
  glassHighlight: "rgba(226, 232, 240, 0.10)",
  /** High-contrast primary text. */
  textPrimary: "#F8FAFC",
  /** Secondary text. */
  textSecondary: "#94A3B8",
  /** Tertiary text and inactive icons. */
  textTertiary: "#64748B",
  /** Semantic: success. */
  success: "#34D399",
  /** Soft success wash for badges. */
  successSoft: "rgba(52, 211, 153, 0.18)",
  /** Semantic: warning. */
  warning: "#FBBF24",
  /** Semantic: error. */
  error: "#F87171",
  /** Glow halos used by the VoiceButton. */
  glowTeal: "rgba(14, 165, 233, 0.45)",
  glowCoral: "rgba(249, 115, 22, 0.45)",
} as const;

export type SonoloColors = typeof colors;
