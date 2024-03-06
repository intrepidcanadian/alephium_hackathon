/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  Address,
  Contract,
  ContractState,
  TestContractResult,
  HexString,
  ContractFactory,
  EventSubscribeOptions,
  EventSubscription,
  CallContractParams,
  CallContractResult,
  TestContractParams,
  ContractEvent,
  subscribeContractEvent,
  subscribeContractEvents,
  testMethod,
  callMethod,
  multicallMethods,
  fetchContractState,
  ContractInstance,
  getContractEventsCurrentCount,
} from "@alephium/web3";
import { default as TokenSharesContractJson } from "../TokenShares.ral.json";
import { getContractByCodeHash } from "./contracts";

// Custom types for the contract
export namespace TokenSharesTypes {
  export type Fields = {
    tokenSharesBalanceTemplateId: HexString;
    tokencollateral: Address;
    collateralContractId: HexString;
    subjectOwnBalance: bigint;
    supply: bigint;
  };

  export type State = ContractState<Fields>;

  export interface CallMethodTable {
    getSupply: {
      params: Omit<CallContractParams<{}>, "args">;
      result: CallContractResult<bigint>;
    };
    getBalance: {
      params: CallContractParams<{ holder: Address }>;
      result: CallContractResult<bigint>;
    };
  }
  export type CallMethodParams<T extends keyof CallMethodTable> =
    CallMethodTable[T]["params"];
  export type CallMethodResult<T extends keyof CallMethodTable> =
    CallMethodTable[T]["result"];
  export type MultiCallParams = Partial<{
    [Name in keyof CallMethodTable]: CallMethodTable[Name]["params"];
  }>;
  export type MultiCallResults<T extends MultiCallParams> = {
    [MaybeName in keyof T]: MaybeName extends keyof CallMethodTable
      ? CallMethodTable[MaybeName]["result"]
      : undefined;
  };
}

class Factory extends ContractFactory<
  TokenSharesInstance,
  TokenSharesTypes.Fields
> {
  getInitialFieldsWithDefaultValues() {
    return this.contract.getInitialFieldsWithDefaultValues() as TokenSharesTypes.Fields;
  }

  consts = {
    ErrorCodes: {
      CollateralContractAllowedOnly: BigInt(0),
      NotEnoughBalance: BigInt(1),
    },
  };

  at(address: string): TokenSharesInstance {
    return new TokenSharesInstance(address);
  }

  tests = {
    getSupply: async (
      params: Omit<
        TestContractParams<TokenSharesTypes.Fields, never>,
        "testArgs"
      >
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getSupply", params);
    },
    getBalance: async (
      params: TestContractParams<TokenSharesTypes.Fields, { holder: Address }>
    ): Promise<TestContractResult<bigint>> => {
      return testMethod(this, "getBalance", params);
    },
    buy: async (
      params: TestContractParams<
        TokenSharesTypes.Fields,
        { holder: Address; amount: bigint; subjectFee: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "buy", params);
    },
    sell: async (
      params: TestContractParams<
        TokenSharesTypes.Fields,
        { seller: Address; amount: bigint; subjectFee: bigint }
      >
    ): Promise<TestContractResult<null>> => {
      return testMethod(this, "sell", params);
    },
  };
}

// Use this object to test and deploy the contract
export const TokenShares = new Factory(
  Contract.fromJson(
    TokenSharesContractJson,
    "",
    "390262034f6249e2ded2c2615ffe5cd4990183176bc6c40fe6728a6705c79465"
  )
);

// Use this class to interact with the blockchain
export class TokenSharesInstance extends ContractInstance {
  constructor(address: Address) {
    super(address);
  }

  async fetchState(): Promise<TokenSharesTypes.State> {
    return fetchContractState(TokenShares, this);
  }

  methods = {
    getSupply: async (
      params?: TokenSharesTypes.CallMethodParams<"getSupply">
    ): Promise<TokenSharesTypes.CallMethodResult<"getSupply">> => {
      return callMethod(
        TokenShares,
        this,
        "getSupply",
        params === undefined ? {} : params,
        getContractByCodeHash
      );
    },
    getBalance: async (
      params: TokenSharesTypes.CallMethodParams<"getBalance">
    ): Promise<TokenSharesTypes.CallMethodResult<"getBalance">> => {
      return callMethod(
        TokenShares,
        this,
        "getBalance",
        params,
        getContractByCodeHash
      );
    },
  };

  async multicall<Calls extends TokenSharesTypes.MultiCallParams>(
    calls: Calls
  ): Promise<TokenSharesTypes.MultiCallResults<Calls>> {
    return (await multicallMethods(
      TokenShares,
      this,
      calls,
      getContractByCodeHash
    )) as TokenSharesTypes.MultiCallResults<Calls>;
  }
}