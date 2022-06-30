import type {
  HexEncodedBytes,
  MultiAgentSignature,
  PendingTransaction,
  SubmitTransactionRequest,
  TransactionPayload,
  UserCreateSigningMessageRequest,
  UserTransactionRequest,
} from "@movingco/aptos-api";
import type EventEmitter from "eventemitter3";
import type { JsonRpcRequest } from "json-rpc-engine";

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
}

export type OmniRPCAPI = {
  [OmniRPC.SendSiteMetadata]: {
    input: {
      name: string;
      icon: string | null;
    };
    output: boolean;
  };
  [OmniRPC.GetProviderState]: {
    input: never;
    output: ProviderState;
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
export interface OmniProvider extends EventEmitter<OmniEventType> {
  request: <M extends OmniRPC>(
    req: OmniRPCParams<M>
  ) => Promise<OmniRPCResult<M>>;
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

export type SignAndSendTransactionParams = {
  payload: TransactionPayload;
  options?: Partial<
    UserTransactionRequest & {
      /**
       * Additional signers.
       */
      secondary_signers?: AccountObject[];
    }
  >;
};

export type SignAndSendRawTransactionParams = {
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
};

export type SignAndSendTransactionResult = {
  signedTX: SubmitTransactionRequest;
  result: PendingTransaction;
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