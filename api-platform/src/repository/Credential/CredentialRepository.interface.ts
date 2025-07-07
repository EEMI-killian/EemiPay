export interface ICredentialRepository {
  save(args: ICreateCredentialArgs): Promise<void>;
  update(args: IUpdateCredentialArgs): Promise<void>;
  delete(appId: string): Promise<void>;
  findById(appId: string): Promise<Credential | null>;
  findByMerchantId(merchantId: string): Promise<Credential[] | null>;
}

export type ICreateCredentialArgs = {
  appId: string;
  appSecret: string;
  merchantId: string;
};

export type IUpdateCredentialArgs = {
  appId?: string;
  appSecret?: string;
};

export type Credential = {
  id: string;
  appSecret: string;
  merchantId: string;
  createdAt: Date;
};
