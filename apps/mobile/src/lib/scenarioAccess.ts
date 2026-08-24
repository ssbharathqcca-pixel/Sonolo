/**
 * Scenario access gating shared by every surface that renders catalog
 * cards (SN-020). The backend computes `is_locked` per caller (SN-026);
 * this helper adds the client-side double check so a stale cached
 * catalog can never deep-link into premium content.
 */
import type { Scenario } from "../api/client";

/** A scenario is tappable only when its premium gate applies to the caller. */
export function isLockedForCaller(
  scenario: Scenario,
  isPremiumUser: boolean,
): boolean {
  return (scenario.is_locked ?? false) && !isPremiumUser;
}
