import { Repository } from "typeorm";
import { Merchant } from "../../entity/Merchant";
import {
  ICreateMerchantArgs,
  IMerchantRepository,
  IUpdateMerchantArgs,
} from "./merchant.repository.interface";
import mongoose from "mongoose";
import { ModelDocument } from "../../mongoSchema";

export class MerchantRepository implements IMerchantRepository {
  constructor(private merchantRepository: Repository<Merchant>) {
    this.merchantRepository = merchantRepository;
  }

  async create(args: ICreateMerchantArgs): Promise<void> {
    const merchant = this.merchantRepository.create(args);
    await this.merchantRepository.save(merchant);

    await mongoose.connect(
      "mongodb://mongo:mongo@mongodb:27017/eemi-pay?authSource=admin",
    );
    const merchantData = {
      merchantId: args.id,
      companyName: args.companyName,
      createdAt: new Date(),
      redirectionUrlConfirm: args.redirectionUrlConfirm,
      redirectionUrlCancel: args.redirectionUrlCancel,
      currency: args.currency,
      contactEmail: args.contactEmail,
      contactPhone: args.contactPhone,
      contactFirstName: args.contactFirstName,
      contactLastName: args.contactLastName,
      kbisUrl: args.kbisUrl,
      iban: args.iban,
    };

    await ModelDocument.findOneAndUpdate(
      { userId: args.userId },
      { $set: { merchant: merchantData } },
      { new: true },
    );
    await mongoose.disconnect();
  }

  async findByCompanyName(companyName: string): Promise<Merchant | null> {
    return await this.merchantRepository.findOne({ where: { companyName } });
  }

  async findById(id: string): Promise<Merchant | null> {
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

  async delete(id: string): Promise<void> {
    const merchant = await this.merchantRepository.findOne({ where: { id } });
    if (merchant) {
      await this.merchantRepository.remove(merchant);
    }
  }
}
