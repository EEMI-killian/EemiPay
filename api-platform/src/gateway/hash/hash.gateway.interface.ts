export interface IHashGateway {
  hash(things: string): Promise<string>;
  compare(args: IComparePasswordArgs): Promise<boolean>;
}

type IComparePasswordArgs = { stringAlreadyHashed: string; input: string };
