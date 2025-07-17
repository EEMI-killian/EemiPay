export interface ICredentialGateway {
  generate(): Promise<Credential>;
  rotate(appId: string): Promise<Credential>;
}

export type Credential = {
  appId: string;
  appSecret: string;
};
