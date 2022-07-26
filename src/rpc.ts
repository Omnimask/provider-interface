import type {
  MultiAgentSignature,
  OnChainTransaction,
} from "@aptosis/aptos-api";
import type {
  ByteStringHex,
  PendingTransaction,
  SubmitTransactionRequest,
  TransactionPayload,
  TransactionPayloadType,
  UserCreateSigningMessageRequest,
  UserTransaction,
  UserTransactionRequest,
} from "@aptosis/aptos-typed-api";
import type { JsonRpcRequest } from "json-rpc-engine";

import type { ProviderState } from "./index.js";

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
      /**
       * The name of the site.
       */
      name: string;
      /**
       * An icon associated with the site.
       */
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

export interface SignMessageParams {
  data: string;
}

export interface SignMessageResult {
  signature: string;
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

export interface SignAndSendTransactionParams<
  TPayloadType extends TransactionPayloadType = TransactionPayloadType
> extends TXSendOptions {
  readonly payload: TransactionPayload<TPayloadType>;
  readonly options?: Partial<Omit<UserTransactionRequest, "payload">>;
  /**
   * Additional signers for a multi-agent signature.
   */
  readonly multi_agent_signature?: Pick<
    MultiAgentSignature,
    "secondary_signer_addresses" | "secondary_signers"
  >;
}

export interface SignAndSendRawTransactionParams extends TXSendOptions {
  /**
   * The {@link UserCreateSigningMessageRequest} being signed.
   */
  readonly request: UserCreateSigningMessageRequest;
  /**
   * The BCS-encoded signing message of the given transaction.
   *
   * This message is validated against the request.
   */
  readonly message: ByteStringHex;
  /**
   * Additional signers for a multi-agent signature.
   */
  readonly multi_agent_signature?: Pick<
    MultiAgentSignature,
    "secondary_signer_addresses" | "secondary_signers"
  >;
}

export interface SignAndSendTransactionResult {
  readonly signedTX: SubmitTransactionRequest;
  readonly result: PendingTransaction;
  /**
   * The confirmed {@link UserTransaction}. This is only returned if {@link TXSendOptions#skipConfirmation} is not `false`.
   */
  readonly confirmed?: UserTransaction;
}

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
