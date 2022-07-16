import type {
  HexEncodedBytes,
  MultiAgentSignature,
  OnChainTransaction,
  PendingTransaction,
  SubmitTransactionRequest,
  TransactionPayload,
  UserCreateSigningMessageRequest,
  UserTransaction,
  UserTransactionRequest,
} from "@aptosis/aptos-api";
import type EventEmitter from "eventemitter3";
import type { JsonRpcRequest } from "json-rpc-engine";

import type { Address } from "./constants.js";
import type { Protocol, ProviderState } from "./index.js";

/**
 * Information about an account (keypair) managed by the wallet.
 */
export interface AccountInfo {
  /**
   * Name of the account.
   */
  name: string;
  /**
   * Normalized address of the account.
   */
  address: string;
  /**
   * Protocol of the account.
   */
  protocol: Protocol;
}

/**
 * Wallet RPC request.
 */
export enum OmniRPC {
  GetProviderState = "omni_getProviderState",
  SendSiteMetadata = "omni_sendSiteMetadata",

  ConnectWallet = "omni_connect",
  DisconnectWallet = "omni_disconnect",
  SignMessage = "omni_signMessage",
  RequestFaucet = "omni_requestFaucet",
  SignAndSendTransaction = "omni_signAndSendTransaction",
  SignAndSendRawTransaction = "omni_signAndSendRawTransaction",
  SimulateTransaction = "omni_simulateTransaction",
}

export type OmniRPCAPI = {
  [OmniRPC.SendSiteMetadata]: {
    input: {
      name: string;
      icon: string | null;
    };
    output: boolean;
  };
  /**
   * Get the state of the provider, returning null if the provider is not connected.
   */
  [OmniRPC.GetProviderState]: {
    input: never;
    output: ProviderState | null;
  };
  [OmniRPC.ConnectWallet]: {
    input: never;
    output: boolean;
  };
  [OmniRPC.DisconnectWallet]: {
    input: never;
    output: boolean;
  };
  [OmniRPC.SignMessage]: {
    input: SignMessageParams;
    output: SignMessageResult;
  };
  [OmniRPC.RequestFaucet]: {
    input: RequestFaucetParams;
    output: RequestFaucetResult;
  };
  [OmniRPC.SignAndSendTransaction]: {
    input: SignAndSendTransactionParams;
    output: SignAndSendTransactionResult;
  };
  [OmniRPC.SignAndSendRawTransaction]: {
    input: SignAndSendRawTransactionParams;
    output: SignAndSendTransactionResult;
  };
  [OmniRPC.SimulateTransaction]: {
    input: SimulateTransactionParams;
    output: SimulateTransactionResult;
  };
};

export type OmniRPCParams<M extends OmniRPC> = Omit<
  JsonRpcRequest<OmniRPCAPI[M]["input"]>,
  "jsonrpc" | "id" | "method"
> & {
  method: M;
};

export type OmniRPCResult<M extends OmniRPC> = OmniRPCAPI[M]["output"];

export type OmniEventType =
  | "connect"
  | "disconnect"
  | "accountsChanged"
  | "networkChanged"
  | "unlockStateChanged";

/**
 * An in-page wallet provider.
 */
export interface OmniProvider {
  /**
   * Event emitter.
   */
  readonly events: EventEmitter<OmniEventType>;

  request: <M extends OmniRPC>(
    req: OmniRPCParams<M>
  ) => Promise<OmniRPCResult<M>>;

  /**
   * Gets the currently selected account exposed to the provider.
   */
  get selectedAccount(): Address | null;
}

export type SignMessageParams = {
  data: string;
};

export type SignMessageResult = {
  signature: string;
};

export interface AccountObject {
  address?: string;
  publicKeyHex?: HexEncodedBytes;
  privateKeyHex: HexEncodedBytes;
}

/**
 * Additional options when sending a transaction.
 */
export interface TXSendOptions {
  /**
   * If true, the transaction will not wait for confirmation exiting the modal.
   *
   * Defaults to false.
   */
  skipConfirmation?: boolean;
  /**
   * If true, transaction errors will be captured in the wallet
   * rather than being propagated to the dapp.
   *
   * Defaults to false.
   */
  showErrorsInWallet?: boolean;
}

export interface SignAndSendTransactionParams extends TXSendOptions {
  payload: TransactionPayload;
  options?: Partial<
    UserTransactionRequest & {
      /**
       * Additional signers.
       */
      secondary_signers?: AccountObject[];
    }
  >;
}

export interface SignAndSendRawTransactionParams extends TXSendOptions {
  /**
   * The {@link UserCreateSigningMessageRequest} being signed.
   */
  request: UserCreateSigningMessageRequest;
  /**
   * The BCS-encoded signing message of the given transaction.
   *
   * This message is validated against the request.
   */
  message: HexEncodedBytes;
  /**
   * Additional signers for a multi-agent signature.
   */
  multi_agent_signature?: Pick<
    MultiAgentSignature,
    "secondary_signer_addresses" | "secondary_signers"
  >;
}

export type SignAndSendTransactionResult = {
  signedTX: SubmitTransactionRequest;
  result: PendingTransaction;
  confirmed?: UserTransaction;
};

/**
 * Parameters for {@link OmniRPC.SimulateTransaction}.
 */
export type SimulateTransactionParams = {
  /**
   * The {@link UserTransactionRequest} being simulated.
   */
  request: UserTransactionRequest;
};

/**
 * Result of {@link OmniRPC.SimulateTransaction}.
 */
export type SimulateTransactionResult = {
  /**
   * The {@link OnChainTransaction}s that would result from the simulation.
   */
  txs: OnChainTransaction[];
};

export type RequestFaucetParams = {
  address: string;
  amount: number;
};

export type RequestFaucetResult = {
  txs: string[];
};

export interface DappRequestContext {
  dappName: string;
  icon: string | null;
  origin: string;
  wallet: AccountInfo | null;
}
