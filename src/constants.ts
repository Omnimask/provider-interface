/**
 * The protocol of the connected network. This determines the way addresses are returned to the provider.
 */
export type Protocol = "aptos" | "sui" | "solana" | "near";

/**
 * Account address.
 */
export type Address = string;

/**
 * State of the provider.
 */
export interface ProviderState {
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
