import type { HexEncodedBytes } from "@aptosis/aptos-api";

export type PublicKey = HexEncodedBytes;
export type Address = HexEncodedBytes;
export type AuthKey = HexEncodedBytes;

/**
 * Common keys related to an account.
 */
export interface AccountKeys {
  publicKey: PublicKey;
  address: Address;
  authKey: AuthKey;
}
