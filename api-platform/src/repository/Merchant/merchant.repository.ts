import { Repository } from "typeorm";
import { Merchant } from "../../entity/Merchant";
import {
  ICreateMerchantArgs,
  IMerchantRepository,
  IUpdateMerchantArgs,
} from "./merchant.repository.interface";

export class MerchantRepository implements IMerchantRepository {
  constructor(private merchantRepository: Repository<Merchant>) {
    this.merchantRepository = merchantRepository;
  }

  async create(args: ICreateMerchantArgs): Promise<void> {
    const merchant = this.merchantRepository.create(args);
    await this.merchantRepository.save(merchant);
  }

  async findByCompanyName(companyName: string): Promise<Merchant | null> {
    return await this.merchantRepository.findOne({ where: { companyName } });
  }

  async findById(id: number): Promise<Merchant | null> {
    return await this.merchantRepository.findOne({ where: { id } });
  }

  async getAll(): Promise<Merchant[]> {
    return await this.merchantRepository.find();
  }

  async update(args: IUpdateMerchantArgs): Promise<void> {
    const { id, ...updateData } = args;
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (merchant) {
      Object.assign(merchant, updateData);
      await this.merchantRepository.save(merchant);
    }
  }

  async delete(id: number): Promise<void> {
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (merchant) {
      await this.merchantRepository.remove(merchant);
    }
  }
}
