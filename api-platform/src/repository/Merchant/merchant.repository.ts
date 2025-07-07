import { Repository } from "typeorm";
import { Merchant } from "../../entity/Merchant";
import {
  ICreateMerchantArgs,
  IMerchantRepository,
  IUpdateMerchantArgs,
} from "./merchant.repository.interface";

export class MerchantRepository implements IMerchantRepository {
  constructor(private merchantRepo: Repository<Merchant>) {
    this.merchantRepo = merchantRepo;
  }

  async createMerchant(args: ICreateMerchantArgs): Promise<void> {
    const merchant = this.merchantRepo.create(args);
    await this.merchantRepo.save(merchant);
  }

  async findByCompanyName(companyName: string): Promise<Merchant | null> {
    return await this.merchantRepo.findOne({ where: { companyName } });
  }

  async findById(id: number): Promise<Merchant | null> {
    return await this.merchantRepo.findOne({ where: { id } });
  }

  async updateMerchant(args: IUpdateMerchantArgs): Promise<void> {
    const { id, ...updateData } = args;
    const merchant = await this.findById(id);
    if (merchant) {
      Object.assign(merchant, updateData);
      await this.merchantRepo.save(merchant);
    }
  }

  async deleteMerchant(id: number): Promise<void> {
    const merchant = await this.findById(id);
    if (merchant) {
      await this.merchantRepo.remove(merchant);
    }
  }
}
