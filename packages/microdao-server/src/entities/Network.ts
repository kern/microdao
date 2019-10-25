import { registerEnumType } from "type-graphql";

export enum Network {
  MAINNET,
  ROPSTEN,
  KOVAN,
}

registerEnumType(Network, {
  name: "Network"
});
