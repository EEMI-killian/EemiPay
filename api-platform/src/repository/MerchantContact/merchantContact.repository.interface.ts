import { MerchantContact } from "../../entity/MerchantContact";

export interface IMerchantContactRepository {
  add(args: ICreateMerchantContactArgs): Promise<void>;
  findById(id: number): Promise<MerchantContact | null>;
  findByEmail(email: string): Promise<MerchantContact | null>;
  delete(id: number): Promise<void>;
  update(args: IUpdateMerchantContactArgs): Promise<void>;
}

export type ICreateMerchantContactArgs = {
  merchantId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

export type IUpdateMerchantContactArgs = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
};
