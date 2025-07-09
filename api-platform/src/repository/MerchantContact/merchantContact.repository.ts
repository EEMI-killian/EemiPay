import { Repository } from "typeorm";
import { MerchantContact } from "../../entity/MerchantContact";
import {
  ICreateMerchantContactArgs,
  IMerchantContactRepository,
  IUpdateMerchantContactArgs,
} from "./merchantContact.repository.interface";

export class MerchantContactRepository implements IMerchantContactRepository {
  constructor(private merchantContactRepo: Repository<MerchantContact>) {
    this.merchantContactRepo = merchantContactRepo;
  }

  async add(args: ICreateMerchantContactArgs): Promise<void> {
    const merchantContact = this.merchantContactRepo.create(args);
    await this.merchantContactRepo.save(merchantContact);
  }
  async findByEmail(email: string): Promise<MerchantContact | null> {
    return await this.merchantContactRepo.findOne({ where: { email } });
  }
  async findById(id: number): Promise<MerchantContact | null> {
    return await this.merchantContactRepo.findOne({ where: { id } });
  }
  async findByPhoneNumber(
    phoneNumber: string,
  ): Promise<MerchantContact | null> {
    return await this.merchantContactRepo.findOne({ where: { phoneNumber } });
  }
  async update(args: IUpdateMerchantContactArgs): Promise<void> {
    const { id, ...updateData } = args;
    const merchantContact = await this.findById(id);
    if (merchantContact) {
      Object.assign(merchantContact, updateData);
      await this.merchantContactRepo.save(merchantContact);
    }
  }
  async delete(id: number): Promise<void> {
    const merchantContact = await this.findById(id);
    if (merchantContact) {
      await this.merchantContactRepo.remove(merchantContact);
    }
  }
}
