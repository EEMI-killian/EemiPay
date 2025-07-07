import { Repository } from "typeorm";
import {
  ICreateCredentialArgs,
  ICredentialRepository,
  IUpdateCredentialArgs,
} from "./CredentialRepository.interface";
import { Credential } from "../../entity/Credential";

export class CredentialRepository implements ICredentialRepository {
  constructor(private repository: Repository<Credential>) {}

  async save(args: ICreateCredentialArgs): Promise<void> {
    const credential = this.repository.create({
      id: args.appId,
      appSecret: args.appSecret,
      merchantId: args.merchantId,
      createdAt: new Date(),
    });
    await this.repository.save(credential);
  }

  async update(args: IUpdateCredentialArgs): Promise<void> {
    await this.repository.update(
      { id: args.appId },
      {
        appSecret: args.appSecret,
        createdAt: new Date(),
      },
    );
  }

  async delete(appId: string): Promise<void> {
    await this.repository.delete({ id: appId });
  }
  async findById(appId: string): Promise<Credential | null> {
    const credential = await this.repository.findOne({ where: { id: appId } });
    return credential || null;
  }

  async findByMerchantId(merchantId: string): Promise<Credential[] | null> {
    const credentials = await this.repository.find({ where: { merchantId } });
    if (credentials.length === 0) {
      return null;
    }
    return credentials;
  }
}
