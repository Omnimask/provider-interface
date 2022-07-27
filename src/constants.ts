import type { AccountKeys, Address } from "./common.js";

/**
 * The protocol of the connected network. This determines the way addresses are returned to the provider.
 */
export type Protocol = "aptos" | "sui" | "solana" | "near";

/**
 * An account exposed to the provider.
 */
export type ProviderAccount = AccountKeys & {
  readonly protocol: "aptos";
};

/**
 * State of the provider as viewable by a dapp.
 */
export interface ProviderState {
  /**
   * The currently active account, or null if it doesn't exist.
   */
  readonly currentAccount: ProviderAccount | null;

  /**
   * All accounts exposed to the dapp.
   */
  readonly accounts: readonly ProviderAccount[] | null;

  selectedAccount: Address | null;

  selectedNetwork: {
    chainId: string;
    protocol: Protocol;
  } | null;

  isConnected: boolean;
  isUnlocked: boolean;
}

/**
 * Event emitted when an Omnimask wallet is loaded.
 */
export const OMNI_READY_EVENT = "omni_ready";
