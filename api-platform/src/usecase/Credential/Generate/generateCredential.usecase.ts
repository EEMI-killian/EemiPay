import z from "zod";
import {
  Credential,
  CredentialGatewayInterface,
} from "../../../gateway/credential/credential.gateway.interface";
import { IGenerateCredentialUsecase } from "./generateCredential.usecase.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ICredentialRepository } from "../../../repository/Credential/CredentialRepository.interface";
import { IHashGateway } from "../../../gateway/hash/hash.gateway.interface";

const schema = z.object({
  merchantId: z.string(),
});

type GenerateCredentialArgs = z.infer<typeof schema>;

export type IGenerateCredentialUsecasePresenter<
  SuccesType,
  FunctionalErrorType,
  NotFound,
  InvalidArgumentsType,
> = {
  success: (credential: Credential) => Promise<SuccesType>;
  error: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFound>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};

export class GenerateCredentialUsecase<
  SuccesType,
  FunctionalErrorType,
  NotFound,
  InvalidArgumentsType,
> implements
    IGenerateCredentialUsecase<
      SuccesType,
      FunctionalErrorType,
      NotFound,
      InvalidArgumentsType
    >
{
  constructor(
    private readonly credentialGateway: CredentialGatewayInterface,
    private readonly presenter: IGenerateCredentialUsecasePresenter<
      SuccesType,
      FunctionalErrorType,
      NotFound,
      InvalidArgumentsType
    >,
    private readonly merchantRepository: IMerchantRepository,
    private readonly credentialRepository: ICredentialRepository,
    private readonly hashGateway: IHashGateway,
  ) {}

  async execute(
    args: GenerateCredentialArgs,
  ): Promise<
    SuccesType | FunctionalErrorType | NotFound | InvalidArgumentsType
  > {
    let validatedData: GenerateCredentialArgs;
    try {
      validatedData = schema.parse(args);
    } catch (error) {
      return this.presenter.invalidArguments(error.message);
    }

    try {
      const merchant = await this.merchantRepository.findById(
        validatedData.merchantId,
      );
      if (!merchant) {
        return this.presenter.notFound();
      }
      const credentials = await this.credentialGateway.generate();
      const hashSecret = await this.hashGateway.hash(credentials.appSecret);
      await this.credentialRepository.save({
        appId: credentials.appId,
        appSecret: hashSecret,
        merchantId: validatedData.merchantId,
      });
      return await this.presenter.success(credentials);
    } catch (error) {
      return await this.presenter.error(error.message);
    }
  }
}
