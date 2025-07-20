import { CurrencyEnum, Merchant } from "../../entity/Merchant";

export interface IMerchantRepository {
  create(args: ICreateMerchantArgs): Promise<void>;
  findById(id: string): Promise<Merchant | null>;
  findByCompanyName(companyName: string): Promise<Merchant | null>;
  getAll(): Promise<Merchant[]>;
  delete(id: string): Promise<void>;
  update(args: IUpdateMerchantArgs): Promise<void>;
}

export type IUpdateMerchantArgs = {
  id: string;
  redirectionUrlConfirm?: string;
  redirectionUrlCancel?: string;
  currency?: CurrencyEnum;
};

export type ICreateMerchantArgs = {
  id: string;
  userId: string;
  companyName: string;
  redirectionUrlConfirm: string;
  redirectionUrlCancel: string;
  currency: CurrencyEnum;
  contactEmail: string;
  contactPhone: string;
  contactFirstName: string;
  contactLastName: string;
  kbisUrl: string;
  iban: string;
};
