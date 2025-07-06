export interface IPasswordGateway {
  hash(password: string): Promise<string>;
  compare(args: IComparePasswordArgs): Promise<boolean>;
}

type IComparePasswordArgs = { OldPassword: string; inputOldPassword: string };
