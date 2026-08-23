/**
 * Connectivity state for offline resilience (SN-017).
 *
 * The Axios layer reports network-level failures and recoveries through
 * `markOffline`/`markOnline` (wired in the root layout via
 * `setConnectivityHandlers`); UI surfaces such as the OfflineBanner
 * subscribe here. Repeated failing requests while already offline are
 * no-ops at the client layer, and the first successful response flips
 * the store back to online.
 */

import { create } from "zustand";

interface NetworkState {
  /** True while API requests are failing at the network level. */
  isOffline: boolean;
  markOffline: () => void;
  markOnline: () => void;
}

export const useNetworkStore = create<NetworkState>()((set) => ({
  isOffline: false,
  markOffline: () => set({ isOffline: true }),
  markOnline: () => set({ isOffline: false }),
}));
