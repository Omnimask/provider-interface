import type EventEmitter from "eventemitter3";

import type { AccountKeys } from "./common.js";
import type { OmniEventType } from "./events.js";
import type { OmniRPC, OmniRPCParams, OmniRPCResult } from "./rpc.js";

/**
 * An in-page wallet provider.
 */
export interface OmniProvider {
  /**
   * Event emitter.
   */
  readonly events: EventEmitter<OmniEventType>;

  /**
   * Makes an RPC request to the wallet.
   */
  request: <M extends OmniRPC>(
    req: OmniRPCParams<M>
  ) => Promise<OmniRPCResult<M>>;

  /**
   * Returns true if the wallet is in the middle of connecting.
   */
  readonly connecting: boolean;

  /**
   * Returns true if the wallet is connected to the dapp.
   */
  readonly connected: boolean;

  /**
   * Keys of the currently selected account, or null if the wallet is not connected
   * to the dapp.
   */
  readonly publicAccount: AccountKeys | null;
}
