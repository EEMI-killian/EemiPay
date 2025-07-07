import { CurrencyEnum, Merchant } from "../../entity/Merchant";

export interface IMerchantRepository {
  createMerchant(args): Promise<void>;
  findById(id: number): Promise<Merchant | null>;
  findByCompanyName(companyName: string): Promise<Merchant | null>;
  deleteMerchant(id: number): Promise<void>;
  updateMerchant(args: IUpdateMerchantArgs): Promise<void>;
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
  companyName: string;
  redirectionUrlConfirm: string;
  redirectionUrlCancel: string;
  currency: CurrencyEnum;
  kbisUrl: string;
};
