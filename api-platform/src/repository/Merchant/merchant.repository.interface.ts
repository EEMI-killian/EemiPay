import { CurrencyEnum, Merchant } from "../../entity/Merchant";

export interface IMerchantRepository {
  create(args: ICreateMerchantArgs): Promise<void>;
  findById(id: number): Promise<Merchant | null>;
  findByCompanyName(companyName: string): Promise<Merchant | null>;
  getAll(): Promise<Merchant[]>;
  delete(id: number): Promise<void>;
  update(args: IUpdateMerchantArgs): Promise<void>;
}

export type IUpdateMerchantArgs = {
  id: number;
  companyName?: string;
  redirectionUrlConfirm?: string;
  redirectionUrlCancel?: string;
  currency?: CurrencyEnum;
  kbisUrl?: string;
};

export type ICreateMerchantArgs = {
  userId: number;
  companyName: string;
  redirectionUrlConfirm: string;
  redirectionUrlCancel: string;
  currency: CurrencyEnum;
  kbisUrl: string;
};
