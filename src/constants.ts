import type { AccountKeys, Address } from "./common.js";

/**
 * The protocol of the connected network. This determines the way addresses are returned to the provider.
 */
export type Protocol = "aptos" | "sui" | "solana" | "near";

/**
 * State of the provider as viewable by a dapp.
 */
export interface ProviderState {
  /**
   * The currently active account, or null if it doesn't exist.
   */
  readonly currentAccount:
    | ({
        protocol: "aptos";
      } & AccountKeys)
    | null;

  selectedAccount: Address | null;

  selectedNetwork: {
    chainId: string;
    protocol: Protocol;
  } | null;

  accounts: readonly Address[] | null;

  isConnected: boolean;
  isUnlocked: boolean;
}

/**
 * Event emitted when an Omnimask wallet is loaded.
 */
export const OMNI_READY_EVENT = "omni_ready";
